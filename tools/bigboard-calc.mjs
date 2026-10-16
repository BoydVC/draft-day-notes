#!/usr/bin/env node
// Box-side oracle for SPEC 008 (Pick 7, Big Board stats). Zero deps, no network, no clone.
//   node tools/bigboard-calc.mjs                -> checks fixtures/bigboard (sha256 + every expected.json row)
//   node tools/bigboard-calc.mjs <dir>          -> same against <dir>/test/fixtures/bigboard (a candidate mirror
//                                                  pulled with gh api); exits 2 when that folder is missing
//   bun  tools/bigboard-calc.mjs <dir> --engine -> also imports <dir>/src/core/index.ts and checks the
//                                                  candidate's own bigBoardStats on every row (needs bun and a
//                                                  full src/core + src/report + src/store mirror)
// Prints one line per check and a final "TOTAL passed/total".
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const SHA = {
  "README.md": "d5593eb14d45bc0f79cc3042fc9b4521f2d07066ee6cf919c7331da74506644a",
  "bigboard-harness.d.mts": "09a5f7738901d2411967b6a5514b4fe397d95cb0f49ef72a00f3e5177e369765",
  "bigboard-harness.mjs": "2c6737a7c6aa6e7d60370f64ff97aa1ead28fe12dd3d88be4dec4a600d6492c9",
  "expected.json": "bb008dc4bbbb9eaf0806ad2bd29c9b6525bbfd7feebf474dd70df5ef99d66773",
  "hostile.jsonl": "ff1d0fd616101e4ca68a67eb446b59678d8bb2f50280140fe7a7a7ccbc155e9f",
  "league.jsonl": "262646746004322c211baf59328fa06be76c617bedd0bb0eb509ee7ade3175d3",
  "season.jsonl": "4ed24013ac7d44cfb6fa1111360a87d57d186d806e7a553b9042c02881389076",
};
const args = process.argv.slice(2);
const engine = args.includes("--engine");
const dirArg = args.find((a) => !a.startsWith("--"));
const fx = dirArg ? join(dirArg, "test/fixtures/bigboard") : join(root, "fixtures/bigboard");
if (!existsSync(fx)) { console.log(`no fixtures at ${fx}`); console.log("TOTAL 0/0"); process.exit(2); }
let pass = 0, total = 0;
const check = (name, ok, detail = "") => { total += 1; if (ok) pass += 1; console.log(`${ok ? "ok  " : "FAIL"} ${name}${detail ? "  " + detail : ""}`); };

for (const [file, sum] of Object.entries(SHA)) {
  const p = join(fx, file);
  const got = existsSync(p) ? createHash("sha256").update(readFileSync(p)).digest("hex") : "missing";
  check(`sha256 ${file}`, got === sum, got === sum ? "" : got);
}
// Always use the box's own harness copy as the oracle (never the candidate's).
const h = await import(join(root, "fixtures/bigboard/bigboard-harness.mjs"));
const expected = JSON.parse(readFileSync(join(root, "fixtures/bigboard/expected.json"), "utf8")).rows;
for (const row of expected) {
  const logs = h.readLogs(readFileSync(join(root, "fixtures/bigboard", row.fixture), "utf8"));
  const got = h.expectedFor(h.bigBoardOracle(logs, row.window, Date.parse(row.now)));
  check(`oracle ${row.name}`, JSON.stringify(got) === JSON.stringify(row.expect), got.summary);
}
// Discrimination: three mutations must each change the projection.
{
  const row = expected.find((r) => r.name === "season");
  const logs = h.readLogs(readFileSync(join(root, "fixtures/bigboard", row.fixture), "utf8"));
  const base = JSON.stringify(h.expectedFor(h.bigBoardOracle(logs, row.window, Date.parse(row.now))));
  const mut = (edit) => { const copy = JSON.parse(JSON.stringify(logs)); edit(copy); return JSON.stringify(h.expectedFor(h.bigBoardOracle(copy, row.window, Date.parse(row.now)))); };
  check("mutation: drop P6 verdict", mut((c) => { const l = c.find((x) => x.pickId === "p-20261018-96"); l.events = l.events.filter((e) => e.type !== "verdict_recorded"); }) !== base);
  check("mutation: P4 pass-2 card A gate fail", mut((c) => { const l = c.find((x) => x.pickId === "p-20261017-94"); const j = l.events.filter((e) => e.type === "judgement_recorded"); for (const e of j) for (const card of e.payload.cards) if ((e.payload.pass === 1 && card.label === "C") || (e.payload.pass === 2 && card.label === "A")) card.gates.tests = "fail"; }) !== base);
  check("mutation: P5 judge 30 min slower", mut((c) => { const l = c.find((x) => x.pickId === "p-20261017-95"); for (const e of l.events) if (e.seq >= 11) e.ts = new Date(Date.parse(e.ts) + 1800000).toISOString(); }) !== base);
}
if (engine && dirArg) {
  try {
    const core = await import(join(dirArg, "src/core/index.ts"));
    if (typeof core.bigBoardStats !== "function") check("engine bigBoardStats export", false, "missing");
    for (const row of expected) {
      const logs = h.readLogs(readFileSync(join(root, "fixtures/bigboard", row.fixture), "utf8"));
      const got = h.expectedFor(core.bigBoardStats(logs, row.window, Date.parse(row.now)));
      check(`engine ${row.name}`, JSON.stringify(got) === JSON.stringify(row.expect), JSON.stringify(got) === JSON.stringify(row.expect) ? got.summary : JSON.stringify(got).slice(0, 300));
    }
  } catch (error) { check("engine import", false, String(error).slice(0, 200)); }
}
console.log(`TOTAL ${pass}/${total}`);
process.exit(pass === total ? 0 : 1);
