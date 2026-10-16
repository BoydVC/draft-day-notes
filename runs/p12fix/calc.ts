import { readFileSync } from "node:fs";
const core: any = await import(`${process.cwd()}/runs/p9/start/src/core/index.ts`);
const H: any = await import(`${process.cwd()}/runs/p9/start/test/fixtures/ledger/ledger-harness.mjs`);
const logs = H.readLogs(readFileSync("runs/p9/start/test/fixtures/ledger/picks.jsonl", "utf8"));
for (const f of ["runs/p12fix/ledger-polish.orig.jsonl", "runs/p12fix/ledger-polish.jsonl"]) {
  const text = readFileSync("runs/p9/start/test/fixtures/ledger/ledger-real.jsonl", "utf8") + readFileSync(f, "utf8");
  const book = core.readLedger(text, ["BoydVC/draft-day"]);
  const L = core.seasonLedger(logs, book, "BoydVC/draft-day", Date.parse("2026-10-20T14:00:00Z"));
  console.log(f, "|", L.summary, "| skipped", JSON.stringify(L.skipped.lines), "| #10", JSON.stringify(L.rows.find((r: any) => r.number === 10)?.why));
}
