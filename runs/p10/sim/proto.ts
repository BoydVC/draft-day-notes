import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
const sim = process.argv[2] ?? "sim";
const dd: any = await import(`${process.cwd()}/src/cli/dd.ts`);
const fd: any = await import(`${process.cwd()}/test/fixtures/fake-driver.ts`);
const core: any = await import(`${process.cwd()}/src/core/index.ts`);
const CANDS = ["c1", "c2", "c3"];
const RESULTS: Record<string, string[]> = { F: ["finish"], EF: ["error", "finish"], EE: ["error", "error"] };
const VSEQ: string[][] = [];
const L = ["NOT_VERIFIED", "INCONCLUSIVE", "VERIFIED"];
(function gen(prefix: string[]) { if (prefix.length && prefix.at(-1) === "VERIFIED") { VSEQ.push(prefix); return; } if (prefix.length === 3) { VSEQ.push(prefix); return; } for (const v of L) gen([...prefix, v]); })([]);
function* space(limit?: { approvals?: string[]; ns?: number[]; vseq?: string[][] }) {
  for (const approval of limit?.approvals ?? ["ask", "auto"]) for (const n of limit?.ns ?? [2, 3]) {
    const cands = CANDS.slice(0, n);
    const resCombos = cands.reduce((acc: string[][], _c) => acc.flatMap((a) => Object.keys(RESULTS).map((k) => [...a, k])), [[]]);
    const scoreCombos = cands.reduce((acc: number[][], _c) => acc.flatMap((a) => [3, 4].map((k) => [...a, k])), [[]]);
    for (const rc of resCombos) for (const sc of scoreCombos) for (const vs of limit?.vseq ?? VSEQ) {
      yield { approval, n, rc, sc, vs };
    }
  }
}
function model(s: any) {
  const fin = s.rc.map((r: string, i: number) => (r === "EE" ? null : CANDS[i])).filter(Boolean);
  const out: any = { launches: s.rc.reduce((a: number, r: string) => a + (r === "F" ? 1 : 2), 0), failedRuns: s.rc.reduce((a: number, r: string) => a + (r === "F" ? 0 : r === "EF" ? 1 : 2), 0) };
  if (fin.length === 0) return { ...out, status: "failed", reason: "no_candidates", judges: 0, graft: false, verdicts: 0 };
  let judges = 0, graft = false;
  if (fin.length >= 2) {
    const sc = fin.map((c: string) => s.sc[CANDS.indexOf(c)]).sort((a: number, b: number) => b - a);
    judges = Math.abs(sc[0] - sc[1]) <= sc[0] * 0.1 + 1e-9 ? 2 : 1; graft = true;
  }
  const v = [0, 1, 2].map((i) => s.vs[i] ?? "VERIFIED");
  const k = v.findIndex((x) => x === "VERIFIED");
  if (k < 0) return { ...out, status: "failed", reason: "not_verified", judges, graft, verdicts: 3 };
  return { ...out, status: "drafted", reason: undefined, judges, graft, verdicts: k + 1 };
}
const OBS = new Map<string, number>();
const STATUS_ROWS = new Set(core.TRANSITIONS.map((r: any) => `${r.from}>${r.event}>${r.to}`));
const NEXT_OBS = new Map<string, number>(); const NEXT_ROWS = new Set(core.NEXT_TABLE.map((r: any) => `${r.status}>${r.action}`));
let total = 0, bad = 0; const t0 = Date.now(); const census: Record<string, number> = {};
const lim = process.argv[3] === "quick" ? { approvals: ["ask"], ns: [3], vseq: [["VERIFIED"], ["NOT_VERIFIED", "NOT_VERIFIED", "VERIFIED"], ["NOT_VERIFIED", "INCONCLUSIVE", "NOT_VERIFIED"]] } : undefined;
for (const s of space(lim)) {
  total++;
  const dir = mkdtempSync(join(tmpdir(), "dd-sweep-"));
  const scen = { name: `${s.approval}-${s.n}-${s.rc.join("")}-${s.sc.join("")}-${s.vs.map((x: string) => x[0]).join("")}`, idea: "Add a status legend to the War Room", approval: s.approval, n: s.n,
    results: Object.fromEntries(s.rc.map((r: string, i: number) => [CANDS[i], RESULTS[r]])), scores: Object.fromEntries(s.sc.map((x: number, i: number) => [CANDS[i], x])), verdicts: s.vs, expect: "drafted" };
  let res: any, err: any, events: any[] = [];
  try { const io0 = await dd.sweepIo(dir); const io = { ...io0, next: async (id: string) => { const a = await io0.next(id); const p = await io0.load(id); const k = `${p.status}>${a.kind}`; NEXT_OBS.set(k, (NEXT_OBS.get(k) ?? 0) + 1); return a; } }; res = await fd.drive(scen, io); events = await dd.sweepEvents(dir, res.pickId); } catch (e) { err = String(e); }
  const m = model(s); const probs: string[] = [];
  if (err) probs.push(`error ${err}`);
  else {
    if (res.status !== m.status) probs.push(`status ${res.status} want ${m.status}`);
    if (m.reason && res.failReason !== m.reason) probs.push(`reason ${res.failReason} want ${m.reason}`);
    const cnt = (t: string) => events.filter((e) => e.type === t).length;
    if (cnt("judge_launched") !== m.judges) probs.push(`judges ${cnt("judge_launched")} want ${m.judges}`);
    if ((cnt("graft_recorded") > 0) !== m.graft) probs.push(`graft ${cnt("graft_recorded")}`);
    if (cnt("candidate_launched") !== m.launches) probs.push(`launches ${cnt("candidate_launched")} want ${m.launches}`);
    if (cnt("candidate_failed") !== m.failedRuns) probs.push(`cfailed ${cnt("candidate_failed")} want ${m.failedRuns}`);
    if (cnt("verdict_recorded") !== m.verdicts) probs.push(`verdicts ${cnt("verdict_recorded")} want ${m.verdicts}`);
    // transition conformance: replay prefixes
    let prev: string | null = null;
    for (let i = 1; i <= events.length; i++) {
      const p = core.reduce(events.slice(0, i), Date.now());
      const st = p?.status; const ev = events[i - 1].type;
      if (prev !== null) { const k = `${prev}>${ev}>${st}`; OBS.set(k, (OBS.get(k) ?? 0) + 1); }
      if (prev && ["drafted", "failed", "cancelled"].includes(prev) && st !== prev) probs.push(`left terminal ${prev}->${st}`);
      prev = st;
    }
    if (res.status === "drafted" && !(events.some((e) => e.type === "draft_pr_confirmed"))) probs.push("drafted without confirm");
  }
  const key = `${m.status}${m.reason ? ":" + m.reason : ""}`; census[key] = (census[key] ?? 0) + 1;
  if (probs.length) { bad++; if (bad <= 15) console.log(scen.name, [...new Set(probs)].slice(0, 6).join(" | ")); }
  rmSync(dir, { recursive: true, force: true });
}
for (const [k, c] of [...OBS].sort()) console.log(STATUS_ROWS.has(k) ? "  table " : "  EXTRA ", k, c);
for (const [k, c] of [...NEXT_OBS].sort()) console.log(NEXT_ROWS.has(k) ? '  next-table' : '  NEXT-EXTRA', k, c);
for (const r of core.NEXT_TABLE) { const k = `${r.status}>${r.action}`; if (!NEXT_OBS.has(k)) console.log('  NEXT-UNSEEN', k, '(', r.guard, ')'); }
for (const r of core.TRANSITIONS) { const k = `${r.from}>${r.event}>${r.to}`; if (!OBS.has(k)) console.log("  UNSEEN", k, "(", r.guard, ")"); }
console.log(`sweep ${total} scenarios, ${bad} with problems, ${Date.now() - t0} ms`, JSON.stringify(census));
