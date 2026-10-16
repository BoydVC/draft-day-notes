#!/usr/bin/env node
// Box-side oracle for SPEC 009 (Pick 8, Season Ledger). Zero deps, no network, never clones.
//   node tools/ledger-calc.mjs              -> checks fixtures/ledger (11 sha256, import, 6 rows, 3 mutations, JSON escape) = 22
//   node tools/ledger-calc.mjs <dir>        -> checks a mirror's committed test/fixtures/ledger (exit 2 when absent)
//   bun  tools/ledger-calc.mjs <dir> --engine  also imports <dir>/src/core/index.ts and compares readLedger +
//                                              prEntriesFromPulls + seasonLedger + ledgerJson with every expected row
import { readFileSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const SHAS = {
  "README.md": "8aab56e4d0fab508aed4e704a42e4bcbee61bc79a9210cc884a94d8886e9d62d",
  "expected.json": "e4273ec8825ff6fefa241e9a7d267ad5ff32596bc25ac513862ce9cecfaf2005",
  "hostile-picks.jsonl": "246d68508b85e83090712a8d7c2c7cd2915fafd7b1d24ff97874d240c1ecb3ba",
  "hostile.jsonl": "748659ff5e0ba8b2df1e39d860acaffeaf7cb347dc77d0fcfc9c20ab5b44b6c9",
  "ledger-edges.jsonl": "876becd0b04b73f4c5f961c5de1b9b84fc2d9f77d3ab7445047bb8a023722816",
  "ledger-harness.d.mts": "38c71332e8386f0ed4eb49bd8f80037a78b8864b74a8ee3ccff5481af246443a",
  "ledger-harness.mjs": "ad779ee91227d5479be428cec44e2c0d460eba021944de433046caf8fe95366b",
  "ledger-real.jsonl": "64f56556d3f6498937abf20a0dc6538b5ee73166f7e678d2385309a42a52e2f6",
  "ledger-tuesday.jsonl": "4e195cdf05b77dee926cc40a44adc2b36b8109e2f2970ef38387a540bea65c17",
  "picks.jsonl": "f272034b6d68ed5ce2ee36281824901e17e8d3e7b162a18289062cfef580f3a9",
  "pulls.json": "5cea0bcd308b8e0e708cf739f04d47a0530154c98c713c82c52d3569b501fa04",
};
const args = process.argv.slice(2);
const engineMode = args.includes("--engine");
const target = args.find((a) => !a.startsWith("--"));
const here = new URL("../", import.meta.url).pathname;
const dir = target ? join(resolve(target), "test/fixtures/ledger") : join(here, "fixtures/ledger");
if (!existsSync(dir)) { console.log(`no fixtures at ${dir}`); console.log("TOTAL 0/0"); process.exit(2); }

let pass = 0, total = 0;
const check = (name, ok, detail = "") => { total += 1; if (ok) pass += 1; console.log(`${ok ? "ok  " : "FAIL"} ${name}${ok || !detail ? "" : `  ${detail}`}`); };
const read = (f) => readFileSync(join(dir, f), "utf8");

for (const [f, want] of Object.entries(SHAS)) {
  const got = existsSync(join(dir, f)) ? createHash("sha256").update(readFileSync(join(dir, f))).digest("hex") : "missing";
  check(`sha256 ${f}`, got === want, got);
}
const H = await import(pathToFileURL(join(here, "fixtures/ledger/ledger-harness.mjs")).href);
const expected = JSON.parse(read("expected.json"));
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const logsFor = (row, mutate) => H.readLogs(mutate ? mutate(row.logs.map(read).join("")) : row.logs.map(read).join(""));
const ledgerText = (row) => (row.ledger ? read(row.ledger) : "");

// import
const imp = expected.import;
const got = H.prEntriesFromPulls(JSON.parse(read(imp.pulls)), imp.at, imp.allowlist);
const want = read(imp.equalsLines.file).split("\n").slice(imp.equalsLines.from - 1, imp.equalsLines.to);
check("import pulls.json == ledger-real.jsonl lines 1-9", got.ok && same(got.entries.map(H.ledgerLine), want));

// rows
for (const row of expected.rows) {
  const ledger = H.ledgerOracle(logsFor(row), H.readLedger(ledgerText(row), row.allowlist), row.repo);
  check(`row ${row.case}`, same(H.expectedFor(ledger), row.expected), ledger.summary);
}

// mutations: each must move the real projection
const real = expected.rows.find((r) => r.case === "real");
const base = JSON.stringify(real.expected);
const mutated = (logsMut, ledgerMut) => {
  const ledger = H.ledgerOracle(logsFor(real, logsMut), H.readLedger(ledgerMut ? ledgerMut(ledgerText(real)) : ledgerText(real), real.allowlist), real.repo);
  return H.expectedFor(ledger);
};
const m1 = mutated((t) => t.split("\n").filter((l) => !(l.includes('"p-20261018-97"') && l.includes('"verdict_recorded"'))).join("\n"));
check("mutation drop Pick 7 verdict -> #9 unverified", JSON.stringify(m1) !== base && m1.rerun.includes(9), m1.summary);
const m2 = mutated(null, (t) => t.split("\n").map((l) => (l.includes('"kind":"drift"') && l.includes('"number":2,') ? l.replace('"files":["', '"files":["src/core/reducer.ts","') : l)).join("\n"));
check("mutation code file in #2 drift -> #2 stale", JSON.stringify(m2) !== base && m2.rows.find((r) => r[0] === 2)[3] === "stale", m2.summary);
const m3 = mutated(null, (t) => t.split("\n").map((l) => (l.includes('"kind":"pr"') && l.includes('"number":6,') ? l.replace('"draft":true', '"draft":false') : l)).join("\n"));
check("mutation #6 not draft -> NOT DRAFT #6", JSON.stringify(m3) !== base && m3.notDraft.includes(6) && m3.summary.endsWith("NOT DRAFT #6"), m3.summary);

// JSON escape on hostile
const hostileRow = expected.rows.find((r) => r.case === "hostile");
const hostileLedger = H.ledgerOracle(logsFor(hostileRow), H.readLedger(ledgerText(hostileRow), hostileRow.allowlist), hostileRow.repo);
const json = H.ledgerJson(hostileLedger);
check("ledgerJson hostile: no raw U+007F-U+009F/U+2028/U+2029, parses back equal", !/[\u007f-\u009f\u2028\u2029]/.test(json) && same(JSON.parse(json), hostileLedger));

if (engineMode) {
  const root = resolve(target ?? here);
  let core;
  try { core = await import(pathToFileURL(join(root, "src/core/index.ts")).href); }
  catch (error) { console.log(`engine n/a: ${error.message.split("\n")[0]}`); core = null; }
  if (core) {
    let ok = 0, n = 0;
    const eq = (name, cond, detail) => { n += 1; if (cond) ok += 1; console.log(`${cond ? "ok  " : "FAIL"} engine ${name}${cond ? "" : `  ${detail ?? ""}`}`); };
    const gi = core.prEntriesFromPulls?.(JSON.parse(read(imp.pulls)), imp.at, imp.allowlist);
    eq("import", gi?.ok && same(gi.entries.map(core.ledgerLine ?? H.ledgerLine), want), JSON.stringify(gi)?.slice(0, 200));
    for (const row of expected.rows) {
      let res;
      try {
        const book = core.readLedger(ledgerText(row), row.allowlist);
        res = core.seasonLedger(logsFor(row), book, row.repo, Date.parse(row.now));
      } catch (error) { eq(`row ${row.case}`, false, error.message); continue; }
      eq(`row ${row.case}`, same(H.expectedFor(res), row.expected), res?.summary);
      if (core.ledgerText) eq(`text ${row.case}`, core.ledgerText(res) === H.ledgerText(res), core.ledgerText(res).split("\n")[0]);
      if (row.case === "hostile" && core.ledgerJson) {
        const j = core.ledgerJson(res);
        eq("ledgerJson hostile escape", !/[\u007f-\u009f\u2028\u2029]/.test(j) && same(JSON.parse(j), JSON.parse(H.ledgerJson(res))));
      }
    }
    console.log(`engine rows ${ok}/${n}`);
  }
}
console.log(`TOTAL ${pass}/${total}`);
process.exit(pass === total ? 0 : 1);
