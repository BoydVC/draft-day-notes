import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
const dd: any = await import(`${process.cwd()}/src/cli/dd.ts`);
const fd: any = await import(`${process.cwd()}/test/fixtures/fake-driver.ts`);
const core: any = await import(`${process.cwd()}/src/core/index.ts`);
const OBS = new Map<string, string[]>();
function census(name: string, events: any[], laterNow?: number) {
  let prev: string | null = null;
  for (let i = 1; i <= events.length; i++) {
    const st = core.reduce(events.slice(0, i), Date.parse(events[i - 1].ts) + 1000)?.status;
    const from = prev ?? "intake";
    const k = `${from}>${events[i - 1].type}>${st}`;
    if (!OBS.has(k)) OBS.set(k, []); OBS.get(k)!.push(name);
    prev = st;
  }
  if (laterNow) { const st = core.reduce(events, laterNow)?.status; const k = `${prev}>timeout>${st}`; if (!OBS.has(k)) OBS.set(k, []); OBS.get(k)!.push(name); }
}
async function withDir(fn: (io: any, dir: string) => Promise<void>) { const dir = mkdtempSync(join(tmpdir(), "dd-x-")); try { await fn(await dd.sweepIo(dir), dir); } finally { rmSync(dir, { recursive: true, force: true }); } }
// policy
await withDir(async (io, dir) => { const r = await fd.drive(fd.POLICY, io); census("policy", await dd.sweepEvents(dir, r.pickId)); await io.record(r.pickId, "lesson_recorded", { topic: "t", text: "lesson after failed" }); census("policy+lesson", await dd.sweepEvents(dir, r.pickId)); await io.record(r.pickId, "pick_failed", { reason: "again" }).catch((e: any) => console.log("pick_failed again:", String(e))); census("policy+failed-again", await dd.sweepEvents(dir, r.pickId)); });
// cancel at awaiting_go
await withDir(async (io, dir) => { const c = await io.intake({ idea: "Add a status legend to the War Room", approval: "ask", n: 3 }); await io.record(c.pickId, "scouting_report_written", { report: fd.scoutingReport(3) }); await io.record(c.pickId, "pick_cancelled", { detail: "no" }); census("cancel", await dd.sweepEvents(dir, c.pickId)); await io.record(c.pickId, "lesson_recorded", { topic: "t", text: "lesson after cancel" }); await io.record(c.pickId, "pick_cancelled", { detail: "again" }).catch((e: any) => console.log("cancel again:", String(e))); census("cancel+lesson", await dd.sweepEvents(dir, c.pickId)); console.log("next after cancel:", (await io.next(c.pickId)).kind); });
// timeout
await withDir(async (io, dir) => { const c = await io.intake({ idea: "Add a status legend to the War Room", approval: "ask", n: 3 }); await io.record(c.pickId, "scouting_report_written", { report: fd.scoutingReport(3) }); const ev = await dd.sweepEvents(dir, c.pickId); census("timeout", ev, Date.parse(ev.at(-1).ts) + 48 * 3600e3); });
// cancel at combine? (allowed?)
await withDir(async (io, dir) => { const c = await io.intake({ idea: "Add a status legend to the War Room", approval: "auto", n: 3 }); await io.record(c.pickId, "scouting_report_written", { report: fd.scoutingReport(3) }); await io.record(c.pickId, "pick_cancelled", { detail: "no" }).catch((e: any) => console.log("cancel in combine:", String(e))); census("cancel-combine", await dd.sweepEvents(dir, c.pickId)); });
// reframe: every card fails gates
const FAIL = { build: "pass", tests: "fail", journey: "pass" };
await withDir(async (io, dir) => { const s = { ...fd.HAPPY, name: "reframe", results: { c1: ["finish"], c2: ["finish"], c3: ["finish"] }, cards: [{ c1: { gates: FAIL }, c2: { gates: FAIL }, c3: { gates: FAIL } }] }; const r = await fd.drive(s, io); console.log("reframe ->", r.status, r.failReason, r.action); census("reframe", await dd.sweepEvents(dir, r.pickId)); });
// drafted + lesson
await withDir(async (io, dir) => { const r = await fd.drive(fd.HAPPY, io); await io.record(r.pickId, "lesson_recorded", { topic: "t", text: "lesson after drafted" }); census("happy+lesson", await dd.sweepEvents(dir, r.pickId)); });
// close (two-pass flip) and walkover
for (const s of [fd.CLOSE, fd.WALK]) await withDir(async (io, dir) => { const r = await fd.drive(s, io); census(s.name, await dd.sweepEvents(dir, r.pickId)); });
const TABLE = new Set(core.TRANSITIONS.map((r: any) => `${r.from}>${r.event}>${r.to}`));
for (const [k, v] of [...OBS].sort()) console.log(TABLE.has(k) ? "  table" : "  EXTRA", k, [...new Set(v)].join(","));
