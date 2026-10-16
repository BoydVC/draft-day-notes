// Box check of a candidate mirror: its own bigBoardStats().swap vs the uploaded harness on every expected.json row,
// plus full-shape equality, text block placement, judgeModelName parity and the J6 mutations. Usage: bun tools/swap-calc.ts <mirror>
import { readFileSync, existsSync } from "node:fs";
const dir = process.argv[2];
const core: any = await import(`${process.cwd()}/${dir}/src/core/index.ts`);
const H: any = await import(`${process.cwd()}/fixtures/swap/swap-harness.mjs`);
const exp = JSON.parse(readFileSync("fixtures/swap/expected.json", "utf8"));
const res = (f: string) => `${dir}/${f}`;
let ok = 0, total = 0; const bad: string[] = [];
const check = (name: string, cond: boolean, detail = "") => { total++; if (cond) ok++; else bad.push(`${name} ${detail}`.slice(0, 600)); };
for (const row of exp.rows) {
  const logs = H.readLogs(row.fixtures.map((f: string) => readFileSync(res(f), "utf8")).join(""));
  const now = Date.parse(row.now ?? exp.now ?? "2026-10-20T00:00:00.000Z");
  const stats = core.bigBoardStats(logs, row.window, now);
  check(`row ${row.name} swapFor`, JSON.stringify(H.swapFor(stats.swap ?? { labels: [], models: [], rows: [] })) === JSON.stringify(row.expect), JSON.stringify(stats.swap)?.slice(0, 300));
  check(`row ${row.name} full shape`, JSON.stringify(stats.swap) === JSON.stringify(H.swapOracle(logs, row.window, now)));
  const text = core.bigBoardText(stats);
  const block = H.swapText(H.swapOracle(logs, row.window, now));
  const i = text.indexOf(block), v = text.indexOf("Verify pass rate"), s = text.indexOf("Time per stage");
  check(`row ${row.name} text block`, i >= 0 && (v < 0 || v < i) && (s < 0 || i < s), `i=${i} v=${v} s=${s}`);
}
const names = [undefined, 42, {}, "   ", "\t", "  Grok-4 ", "grok\u2028-4\u0085\u0007", "a\n\n b", "x".repeat(200), "<img src=x onerror=alert(1)>"];
check("judgeModelName parity", typeof core.judgeModelName === "function" && names.every((n) => core.judgeModelName(n) === H.judgeModelName(n)));
check("DEFAULT_MODEL/MODEL_NAME_MAX", core.DEFAULT_MODEL === "account default" && core.MODEL_NAME_MAX === 48);
const sc = core.statContainers?.() ?? [];
const iv = sc.findIndex((r: any) => r.id === "verify"), is = sc.findIndex((r: any) => r.id === "swap");
check("statContainers swap after verify", is === iv + 1 && sc[is]?.aria === "Swap bias" && sc[is]?.row === "data-model", JSON.stringify(sc[is]));
console.log(bad.join("\n"));
console.log(`swap-calc ${ok}/${total}${existsSync(`${dir}/test/fixtures/swap/expected.json`) ? "" : " (no committed fixtures)"}`);
