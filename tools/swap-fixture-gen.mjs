// Builds fixtures/swap/models.jsonl and hostile.jsonl from the REAL Pick 3-7 logs in the repo
// (test/fixtures/ledger/picks.jsonl at START, read remotely into runs/p9/start, never cloned).
// Every synthetic pick is a real log with a new id plus one named change. Deterministic; no clock, no network.
import { readFileSync, writeFileSync } from "node:fs";
const SRC = process.argv[2] ?? "runs/p9/start/test/fixtures/ledger/picks.jsonl";
const OUT = process.argv[3] ?? "fixtures/swap";
const real = new Map();
for (const line of readFileSync(SRC, "utf8").split("\n")) {
  if (!line.trim()) continue;
  const row = JSON.parse(line);
  if (!real.has(row.pickId)) real.set(row.pickId, []);
  real.get(row.pickId).push(row.event);
}
const P3 = "p-20261017-93", P4 = "p-20261017-94", P5 = "p-20261017-95", P6 = "p-20261018-96", P7 = "p-20261018-97";
function swapId(value, from, id) {
  if (typeof value === "string") return value.split(from).join(id);
  if (Array.isArray(value)) return value.map((v) => swapId(v, from, id));
  if (value && typeof value === "object") return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, swapId(v, from, id)]));
  return value;
}
function clone(from, id) {
  return swapId(structuredClone(real.get(from)), from, id);
}
function setModels(events, m1, m2) {
  for (const e of events) {
    if (e.type !== "judgement_recorded") continue;
    const pass = e.payload.pass;
    const m = pass === 1 ? m1 : m2;
    if (m === undefined) delete e.payload.judgeModel; else e.payload.judgeModel = m;
  }
  return events;
}
function dropPass2(events) {
  return events.filter((e) => !((e.type === "judge_launched" || e.type === "judgement_recorded") && e.payload.pass === 2));
}
function failPass2(events) {
  for (const e of events) if (e.type === "judgement_recorded" && e.payload.pass === 2) for (const c of e.payload.cards) c.gates = { build: "pass", tests: "fail", journey: "pass" };
  return events;
}
function source(events, src) { events.find((e) => e.type === "pick_created").payload.source = src; return events; }
const OPUS = "claude-opus-4.5", GROK = "grok-4";
const models = [
  ["p-20261020-01", setModels(clone(P3, "p-20261020-01"), OPUS, OPUS), "P3 copy, same judge both passes (flips)"],
  ["p-20261020-02", setModels(clone(P4, "p-20261020-02"), GROK, GROK), "P4 copy, grok both passes (consistent)"],
  ["p-20261020-03", setModels(clone(P5, "p-20261020-03"), OPUS, GROK), "P5 copy, cross-family pair (consistent)"],
  ["p-20261020-04", setModels(clone(P6, "p-20261020-04"), "  Grok-4 ", "grok-4"), "P6 copy, same model spelled two ways (consistent)"],
  ["p-20261020-05", setModels(clone(P7, "p-20261020-05"), GROK, OPUS), "P7 copy, cross-family pair (flips)"],
  ["p-20261020-06", setModels(dropPass2(clone(P5, "p-20261020-06")), GROK, undefined), "P5 copy, pass 2 removed (single)"],
  ["p-20261020-07", setModels(failPass2(clone(P4, "p-20261020-07")), OPUS, OPUS), "P4 copy, every pass-2 card fails tests (flipped, no tie rule)"],
  ["p-20261020-08", setModels(source(clone(P3, "p-20261020-08"), "selftest"), OPUS, OPUS), "P3 copy, source selftest (excluded)"],
  ["p-20261020-09", setModels(clone(P7, "p-20261020-09"), GROK, undefined), "P7 copy, pass 2 has no judgeModel (flips)"],
];
const hostileMid = setModels(clone(P4, "p-20261020-22"), "grok\u2028-4\u0085\u0007", "x".repeat(200));
const bad = clone(P6, "p-20261020-25");
bad.find((e) => e.type === "pick_created").payload.id = "p-20261020-99";
const hostile = [
  ["p-20261020-21", setModels(clone(P3, "p-20261020-21"), "<img src=x onerror=alert(1)>", "javascript:alert(1)"), "P3 copy, markup and javascript: model names"],
  ["p-20261020-22", hostileMid, "P4 copy, U+2028 + U+0085 + BEL model, 200-char model"],
  ["p-20261020-23", setModels(clone(P5, "p-20261020-23"), 42, { name: "x" }), "P5 copy, non-string judgeModel values"],
  ["p-2026-bad\"><img src=x>", clone(P6, "p-2026-bad\"><img src=x>"), "bad pick id"],
  ["p-20261020-25", bad, "id mismatch"],
  ["p-20261020-26", setModels(clone(P7, "p-20261020-26"), "   ", "\t"), "P7 copy, blank judgeModel strings"],
];
function write(name, rows) {
  const lines = [];
  for (const [pickId, events] of rows) for (const event of events) lines.push(JSON.stringify({ pickId, event }));
  writeFileSync(`${OUT}/${name}`, lines.join("\n") + "\n");
  console.log(name, rows.length, "picks", lines.length, "events");
}
write("models.jsonl", models);
write("hostile.jsonl", hostile);
writeFileSync(`${OUT}/provenance.json`, JSON.stringify({ models: models.map(([id, , why]) => [id, why]), hostile: hostile.map(([id, , why]) => [id, why]) }, null, 1));
