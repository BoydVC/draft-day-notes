// Oracle mutations for SPEC-010 J6 (box only). Usage: node tools/swap-mutations.mjs <repo-mirror> <fixtures/swap>
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
const [root, fx] = process.argv.slice(2);
const H = await import(resolve(fx, "swap-harness.mjs"));
const NOW = Date.parse("2026-10-20T00:00:00.000Z");
const lines = readFileSync(resolve(root, "test/fixtures/ledger/picks.jsonl"), "utf8").split("\n").filter(Boolean).map((l) => JSON.parse(l));
const run = (rows) => H.swapFor(H.swapOracle(H.readLogs(rows.map((r) => JSON.stringify(r)).join("\n") + "\n"), null, NOW));
const base = run(lines);
const isJ = (r, id, pass) => r.pickId === id && r.event.type === "judgement_recorded" && r.event.payload.pass === pass;
const m1 = run(lines.filter((r) => !isJ(r, "p-20261017-93", 2)));
const m2 = run(lines.map((r) => isJ(r, "p-20261017-94", 2) ? { ...r, event: { ...r.event, payload: { ...r.event.payload, judgeModel: "grok-4" } } } : r));
// P6: in pass 2, fail the tests gate of the card that won pass 1 (same candidate, its pass-2 label).
const full = H.swapOracle(H.readLogs(readFileSync(resolve(root, "test/fixtures/ledger/picks.jsonl"), "utf8")), null, NOW);
const p6 = full.rows.find((r) => r.pickId === "p-20261018-96");
const p1win = p6.winners[0];
const order2 = lines.find((r) => isJ(r, "p-20261018-96", 2));
// find label of p1win in pass 2 from the candidates' label map recorded in pass 2 (labels payload or labels event)
console.log("P6 row", JSON.stringify(p6), "pass2 keys", Object.keys(order2.event.payload));
const launch2 = lines.find((r) => r.pickId === "p-20261018-96" && r.event.type === "judge_launched" && r.event.payload.pass === 2);
console.log("launch2", launch2 && JSON.stringify(launch2.event.payload).slice(0, 300));
const lab = launch2?.event.payload.labels;
let label2 = null;
if (lab) for (const [l, c] of Object.entries(lab)) if (c === p1win) label2 = l;
console.log("label2", label2);
const m3 = run(lines.map((r) => isJ(r, "p-20261018-96", 2) ? { ...r, event: { ...r.event, payload: { ...r.event.payload, cards: r.event.payload.cards.map((c) => c.label === label2 ? { ...c, gates: { ...c.gates, tests: "fail" } } : c) } } } : r));
const pick = (s) => ({ judged: s.judged, single: s.single, twoPass: s.twoPass, flipped: s.flipped, rate: s.rate, tieRule: s.tieRule, strict: s.strict, models: s.models.map((m) => `${m[0]} ${m[3]}/${m[2]}`), p6: s.rows.find((r) => r[0] === "p-20261018-96") });
console.log("base", JSON.stringify(pick(base)));
console.log("m1 drop P3 pass2", JSON.stringify(pick(m1)));
console.log("m2 P4 pass2 grok-4", JSON.stringify(pick(m2)));
console.log("m3 P6 pass2 winner gate fail", JSON.stringify(pick(m3)));
