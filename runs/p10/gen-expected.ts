// Box generator for fixtures/model/expected.json: drives the START engine (scratch copy with an exported selftest io)
// over the harness's space + sequences, applies the binding census rules, and checks predict() and the invariants.
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
const H: any = await import("/workspace/tokenmax/poteto-pipeline/fixtures/model/model-harness.mjs");
const dd: any = await import(`${process.cwd()}/src/cli/dd.ts`);
const fd: any = await import(`${process.cwd()}/test/fixtures/fake-driver.ts`);
const core: any = await import(`${process.cwd()}/src/core/index.ts`);
const GO = core.GO_TIMEOUT_MS ?? 48 * 3600e3;
function census(events: any[]): string[] {
  const out: string[] = []; let prev = "intake";
  for (let i = 1; i <= events.length; i++) { const st = core.reduce(events.slice(0, i), Date.parse(events[i - 1].ts))?.status; out.push(`${prev}>${events[i - 1].type}>${st}`); prev = st; }
  const last = Date.parse(events[events.length - 1].ts);
  const a = core.reduce(events, last)?.status, b = core.reduce(events, last + GO)?.status;
  if (a !== b) out.push(`${a}>timeout>${b}`);
  return out;
}
function statusesOf(events: any[]) { return events.map((_, i) => core.reduce(events.slice(0, i + 1), Date.parse(events[i].ts))?.status); }
const NEXT = new Map<string, number>();
async function withIo(fn: (io: any, dir: string) => Promise<string>) {
  const dir = mkdtempSync(join(tmpdir(), "dd-gen-"));
  try { const io0 = await dd.sweepIo(dir); const io = { ...io0, next: async (id: string) => { const a = await io0.next(id); const p = await io0.load(id); const k = `${p.status}>${a.kind}`; NEXT.set(k, (NEXT.get(k) ?? 0) + 1); return a; } }; const id = await fn(io, dir); return { events: await dd.sweepEvents(dir, id), io, id }; }
  finally { /* removed by caller after use */ (globalThis as any).__dirs = [...((globalThis as any).__dirs ?? []), dir]; }
}
const ROWS = new Set(H.TRANSITION_ROWS.map((r: any) => H.tripleKey(r)));
function invariants(events: any[], res: any): string[] {
  const v: string[] = []; const st = statusesOf(events);
  const term = st.findIndex((s) => H.TERMINAL.includes(s)); if (term >= 0 && st.slice(term).some((s) => s !== st[term])) v.push("V3 left terminal");
  const cnt = (t: string, f?: (e: any) => boolean) => events.filter((e) => e.type === t && (!f || f(e))).length;
  if (res.status === "drafted") { const vs = events.filter((e) => e.type === "verdict_recorded"); if (!cnt("draft_pr_confirmed") || (vs.at(-1)?.payload?.physical?.verdict) !== "VERIFIED") v.push("V4 drafted without confirm+VERIFIED"); }
  for (const c of H.CANDS) if (cnt("candidate_launched", (e) => e.payload?.cand === c) > H.BUDGET.launchesPerCand) v.push(`V5 ${c} launches`);
  if (cnt("judge_launched") > H.BUDGET.judgePasses) v.push("V5 judges"); if (cnt("verdict_recorded") > H.BUDGET.verdicts) v.push("V5 verdicts"); if (cnt("fix_requested") > H.BUDGET.fixes) v.push("V5 fixes");
  return v;
}

function nextWrap(io0: any, NEXT: Set<string>) { return { ...io0, next: async (id: string) => { const a = await io0.next(id); const p = await io0.load(id); NEXT.add(`${p.status}>${a.kind}`); return a; } }; }
async function fresh(fn: (io: any) => Promise<string>, NEXT: Set<string>) {
  const dir = mkdtempSync(join(tmpdir(), "dd-gen-"));
  try { const io = nextWrap(await dd.sweepIo(dir), NEXT); const id = await fn(io); return await dd.sweepEvents(dir, id); }
  finally { rmSync(dir, { recursive: true, force: true }); }
}
const FAIL = { build: "pass", tests: "fail", journey: "pass" };
const lesson = (text: string) => ({ topic: "sweep", text });
const intake = (io: any, approval: string) => io.intake({ idea: "Add a status legend to the War Room", approval, n: 3 });
const seqs: Record<string, (io: any) => Promise<string>> = {
  "policy": async (io) => (await fd.drive(fd.POLICY, io)).pickId,
  "policy-lesson": async (io) => { const r = await fd.drive(fd.POLICY, io); await io.record(r.pickId, "lesson_recorded", lesson("policy lesson")); return r.pickId; },
  "cancel-go": async (io) => { const c = await intake(io, "ask"); await io.record(c.pickId, "scouting_report_written", { report: fd.scoutingReport(3) }); await io.record(c.pickId, "pick_cancelled", { detail: "no" }); return c.pickId; },
  "cancel-go-lesson": async (io) => { const c = await intake(io, "ask"); await io.record(c.pickId, "scouting_report_written", { report: fd.scoutingReport(3) }); await io.record(c.pickId, "pick_cancelled", { detail: "no" }); await io.record(c.pickId, "lesson_recorded", lesson("cancel lesson")); return c.pickId; },
  "timeout": async (io) => { const c = await intake(io, "ask"); await io.record(c.pickId, "scouting_report_written", { report: fd.scoutingReport(3) }); return c.pickId; },
  "cancel-combine": async (io) => { const c = await intake(io, "auto"); await io.record(c.pickId, "scouting_report_written", { report: fd.scoutingReport(3) }); await io.record(c.pickId, "pick_cancelled", { detail: "no" }); return c.pickId; },
  "reframe": async (io) => (await fd.drive({ ...fd.HAPPY, name: "reframe", results: { c1: ["finish"], c2: ["finish"], c3: ["finish"] }, cards: [{ c1: { gates: FAIL }, c2: { gates: FAIL }, c3: { gates: FAIL } }] }, io)).pickId,
  "happy-lesson": async (io) => { const r = await fd.drive(fd.HAPPY, io); await io.record(r.pickId, "lesson_recorded", lesson("happy lesson")); return r.pickId; },
  "lesson-physical": async (io) => { const w = { ...io, record: async (id: string, type: string, payload: any) => { await io.record(id, type, payload); if (type === "verdict_recorded" && payload?.physical?.verdict !== "VERIFIED") await io.record(id, "lesson_recorded", lesson("verifier lesson")); } }; return (await fd.drive(fd.HAPPY, w)).pickId; },
  "close": async (io) => (await fd.drive(fd.CLOSE, io)).pickId,
  "walkover": async (io) => (await fd.drive(fd.WALK, io)).pickId,
};
const tableKeys = core.TRANSITIONS_NEW ?? H.TRANSITION_ROWS.map((r: any) => ({ from: r[0], event: r[1], guard: r[2], to: r[3] }));
const nonAlias = tableKeys.filter((r: any) => !H.ALIAS_STATUSES.includes(r.from)).map((r: any) => `${r.from}>${r.event}>${r.to}`);
const inTable = new Set(tableKeys.map((r: any) => `${r.from}>${r.event}>${r.to}`));
const expected: any = {};
let problems = 0;
for (const quick of [true, false]) {
  const mode = quick ? "quick" : "full"; const NEXT = new Set<string>();
  const outc: Record<string, number> = {}; const tri: Record<string, number> = {}; const seen = new Set<string>(); let n = 0;
  for (const p of H.scenarioSpace({ quick })) {
    n++; let res: any;
    const events = await fresh(async (io) => { res = await fd.drive(H.toScenario(p), io); return res.pickId; }, NEXT);
    const pr = H.predict(p); const cnt = (t: string) => events.filter((e: any) => e.type === t).length;
    const got: any = { status: res.status, failReason: res.failReason ?? null, launches: cnt("candidate_launched"), candidateFailures: cnt("candidate_failed"), dropped: cnt("candidate_dropped"), walkover: cnt("physical_launched") > 0 && cnt("judge_launched") === 0, judges: cnt("judge_launched"), graft: cnt("graft_recorded") > 0, verdicts: cnt("verdict_recorded"), fixes: cnt("fix_requested") };
    for (const k of Object.keys(pr)) if (JSON.stringify(got[k]) !== JSON.stringify(pr[k])) { problems++; console.log("MISMATCH", H.scenarioId(p), k); }
    for (const x of invariants(events, res)) { problems++; console.log("INV", H.scenarioId(p), x); }
    for (const t of census(events)) { tri[t] = (tri[t] ?? 0) + 1; seen.add(t); }
    const ok = `${res.status}${res.failReason ? ":" + res.failReason : ""}`; outc[ok] = (outc[ok] ?? 0) + 1;
  }
  const sequences: any[] = [];
  for (const s of H.SEQUENCES) {
    const events = await fresh((io) => seqs[s.name](io), NEXT);
    const t = census(events); t.forEach((x) => seen.add(x));
    const last = Date.parse(events.at(-1).ts); const a = core.reduce(events, last), b = core.reduce(events, last + GO);
    sequences.push({ name: s.name, events: events.map((e: any) => e.type), status: a.status, failReason: a.failReason ?? null, statusAfter48h: b.status, triples: t });
  }
  const observed = [...seen].sort();
  expected[mode] = { mode, scenarios: n, outcomes: Object.fromEntries(Object.entries(outc).sort()), triples: Object.fromEntries(Object.entries(tri).sort()), sequences, observed,
    extra: observed.filter((k) => !inTable.has(k)), unseen: nonAlias.filter((k: string) => !seen.has(k)).sort(), next: [...NEXT].sort(), problems: [] };
  console.log(mode, n, JSON.stringify(expected[mode].outcomes), "observed", observed.length, "extra", expected[mode].extra.length, "unseen", expected[mode].unseen, "next", expected[mode].next.length,
    "nextOk", expected[mode].next.every((k: string) => core.NEXT_TABLE.some((r: any) => `${r.status}>${r.action}` === k)));
}
console.log("problems", problems);
writeFileSync(process.argv[2], JSON.stringify(expected, null, 1) + "\n");
