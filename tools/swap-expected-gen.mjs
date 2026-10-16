// Writes fixtures/swap/expected.json from the harness (never by hand). Repo paths resolve to the box copies.
import { readFileSync, writeFileSync } from "node:fs";
import { readLogs, swapOracle, swapFor } from "../fixtures/swap/swap-harness.mjs";
const mirror = process.argv[2] ?? "runs/p9/start";
const resolve = (f) => (f.startsWith("test/fixtures/swap/") ? `fixtures/swap/${f.slice(19)}` : `${mirror}/${f}`);
const NOW = "2026-10-20T00:00:00.000Z";
const rows = [
  { name: "season", fixtures: ["test/fixtures/ledger/picks.jsonl"], window: null, note: "real Picks 3-7 (P3 and P7 flipped)" },
  { name: "league", fixtures: ["test/fixtures/bigboard/league.jsonl"], window: null, note: "Pick 7's league: 13 picks, 8 judged, 2 single-pass" },
  { name: "league-oct17", fixtures: ["test/fixtures/bigboard/league.jsonl"], window: { since: "2026-10-17", until: null }, note: "window since Oct 17" },
  { name: "models", fixtures: ["test/fixtures/swap/models.jsonl"], window: null, note: "judge models: same, cross-family, spelled two ways, missing, pass 2 all gates failed, single, selftest" },
  { name: "season-models", fixtures: ["test/fixtures/ledger/picks.jsonl", "test/fixtures/swap/models.jsonl"], window: null, note: "real season plus the model picks" },
  { name: "hostile", fixtures: ["test/fixtures/swap/hostile.jsonl"], window: null, note: "markup, controls, 200-char, non-string and blank judgeModel; bad id; id mismatch" },
  { name: "season-models-hostile", fixtures: ["test/fixtures/ledger/picks.jsonl", "test/fixtures/swap/models.jsonl", "test/fixtures/swap/hostile.jsonl"], window: null, note: "what seed-swap hostile serves" },
  { name: "season-models-oct18", fixtures: ["test/fixtures/ledger/picks.jsonl", "test/fixtures/swap/models.jsonl"], window: { since: "2026-10-18", until: null }, note: "seed-swap with Since 2026-10-18" },
  { name: "empty", fixtures: [], window: null, note: "no logs" },
];
for (const row of rows) {
  const text = row.fixtures.map((f) => readFileSync(resolve(f), "utf8")).join("");
  row.now = NOW;
  row.expect = swapFor(swapOracle(readLogs(text), row.window, Date.parse(NOW)));
}
const out = { spec: "SPEC-010-swap-bias.md", projection: "swapFor(bigBoardStats(logs, window, now).swap)", rows };
writeFileSync("fixtures/swap/expected.json", JSON.stringify(out, null, 1) + "\n");
for (const r of rows) console.log(r.name, r.expect.judged, r.expect.twoPass, r.expect.flipped, r.expect.rate);
