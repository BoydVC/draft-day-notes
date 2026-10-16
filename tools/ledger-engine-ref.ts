// Box-only (bun). Cross-checks the ledger harness's pick facts against the engine's own reduce() at START
// (runs/p8/start = BoydVC/draft-day @93dca59, read remotely, never cloned). For every admitted pick in the
// fixtures: the PR it claims (graft.prNumber) and its verdict list (prNumber, headSha, verdict, ledger, certainty)
// must be identical. usage: bun tools/ledger-engine-ref.ts
import { readFileSync } from "node:fs";
const ROOT = process.env.DD_ROOT ?? new URL("../runs/p8/start/", import.meta.url).pathname;
const core = await import(ROOT + "src/core/index.ts");
const H = await import(new URL("../fixtures/ledger/ledger-harness.mjs", import.meta.url).pathname);
const dir = new URL("../fixtures/ledger/", import.meta.url).pathname;
let ok = 0, total = 0;
for (const files of [["picks.jsonl"], ["picks.jsonl", "hostile-picks.jsonl"]]) {
  const logs = H.readLogs(files.map((f) => readFileSync(dir + f, "utf8")).join(""));
  const facts = H.pickFacts(logs, "BoydVC/draft-day");
  for (const pick of facts.picks) {
    total += 1;
    const log = logs.find((l: any) => l.pickId === pick.pickId);
    const p = core.reduce(log.events, Date.parse("2026-10-19T14:00:00Z"));
    const claim = p.graft?.recorded && Number.isInteger(p.graft.prNumber) && p.graft.prNumber > 0 ? p.graft.prNumber : null;
    const good = (v: any) => v && Number.isInteger(v.prNumber) && v.prNumber > 0 && /^[0-9a-f]{40}$/.test(v.headSha ?? "");
    const engine = p.verdicts.filter(good).map((v: any) => [v.prNumber, v.headSha, v.verdict, v.ledger, v.certainty].join(" "));
    const harness = pick.verdicts.map((v: any) => [v.number, v.headSha, v.verdict, v.ledger, v.certainty].join(" "));
    const same = claim === pick.claim && JSON.stringify(engine) === JSON.stringify(harness);
    if (same) ok += 1;
    console.log(`${same ? "ok  " : "FAIL"} ${files.join("+")} ${pick.pickId} claim ${pick.claim} verdicts ${harness.length}${same ? "" : `\n  engine claim ${claim} ${JSON.stringify(engine)}\n  harness ${JSON.stringify(harness)}`}`);
  }
}
console.log(`engine vs harness ${ok}/${total}`);
process.exit(ok === total ? 0 : 1);
