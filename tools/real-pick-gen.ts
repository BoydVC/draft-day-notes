// Box-only. Turns a real, hand-driven Draft Day pick into a dd events.jsonl, using the repo's own code
// (read remotely into runs/p5/start, never cloned): commitPick (seq, follow-ups), eventKey, and the
// parse* functions for every report block. Payload shapes copy normalize() in src/cli/dd.ts @c6cfad4,
// except that branches and label maps are the real ones Grok Bot used (dd would have invented both).
// usage: bun tools/real-pick-gen.ts <script.json> <outDir>
import { mkdirSync, readFileSync, writeFileSync, rmSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.env.DD_ROOT ?? new URL("../runs/p5/start/", import.meta.url).pathname;
const core = await import(join(ROOT, "src/core/index.ts"));
const store = await import(join(ROOT, "src/store/eventlog.ts"));

const [scriptPath, outDir] = process.argv.slice(2);
const script = JSON.parse(readFileSync(scriptPath!, "utf8"));
const base = join(scriptPath!, "..");
const read = (p: string) => readFileSync(join(base, p), "utf8");
rmSync(outDir!, { recursive: true, force: true });
mkdirSync(join(outDir!, "picks", script.id), { recursive: true });

const die = (m: string) => { console.error("FAIL " + m); process.exit(1); };

for (const step of script.steps) {
  const now = Date.parse(step.ts);
  if (!Number.isFinite(now)) die(`bad ts ${step.ts}`);
  const ts = new Date(now).toISOString();
  await store.commitPick(outDir!, script.id, (events: any[]) => {
    const pick = events.length ? core.reduce(events, now) : null;
    let payload: Record<string, unknown>;
    const t = step.type;
    if (t === "pick_created") payload = { id: script.id, idea: step.idea, source: step.source, target: step.target, n: step.n, approval: step.approval };
    else if (t === "scouting_report_written") {
      const r = core.parseScoutingReport(JSON.stringify(step.reportFile ? JSON.parse(read(step.reportFile)) : step.report));
      if (!r.ok) die(`report: ${r.error}`); payload = { report: r.value };
    } else if (t === "scouting_approved") payload = { via: step.via ?? "human" };
    else if (t === "candidate_launched") {
      const attempt = events.filter((e) => e.type === t && e.payload.cand === step.cand).length + 1;
      payload = { cand: step.cand, attempt, agentId: step.agentId, branch: step.branch };
    } else if (t === "candidate_finished") {
      const r = core.parseCandidateReport(read(step.file)); if (!r.ok) die(`${step.cand} report: ${r.error}`);
      const attempt = events.filter((e) => e.type === "candidate_launched" && e.payload.cand === step.cand).length || 1;
      payload = { cand: step.cand, attempt, report: r.value };
    } else if (t === "candidate_failed") {
      payload = { cand: step.cand, attempt: events.filter((e) => e.type === t && e.payload.cand === step.cand).length + 1 };
    } else if (t === "judge_launched") {
      const pass = pick!.judgeLaunches + 1;
      payload = { pass, order: step.order, labels: step.labels, reversed: pass >= 2, agentId: step.agentId };
    } else if (t === "judgement_recorded") {
      const r = core.parseJudgement(read(step.file)); if (!r.ok) die(`judgement: ${r.error}`);
      const problem = core.validateJudgementContext(r.value, pick!.labels, pick!.report?.rubric ?? []);
      if (problem) die(`judgement context: ${problem}`);
      payload = { pass: pick!.judgeLaunches, order: r.value.order, cards: r.value.cards, base: r.value.base, runnerUps: r.value.runnerUps,
        trades: r.value.trades, swapConsistent: r.value.swapConsistent, secondRead: step.secondRead ?? r.value.secondRead ?? "agree",
        note: step.note ?? r.value.note ?? "", ...(r.value.judgeModel ? { judgeModel: r.value.judgeModel } : {}) };
    } else if (t === "graft_launched") payload = { agentId: step.agentId };
    else if (t === "graft_recorded") payload = { prNumber: step.prNumber, headSha: step.headSha.toLowerCase(), summary: step.summary };
    else if (t === "physical_launched") payload = { attempt: 1, walkover: false, agentId: step.agentId };
    else if (t === "verdict_recorded") {
      const r = core.parseVerdict(read(step.file)); if (!r.ok) die(`verdict: ${r.error}`);
      payload = { attempt: pick!.verdicts.length + 1, headSha: r.value.headSha, physical: r.value };
    } else if (t === "fix_requested") payload = { loop: pick!.fixLoops + 1, agentId: pick!.graftAgentId ?? "" };
    else if (t === "draft_pr_confirmed") payload = { prNumber: step.prNumber };
    else if (t === "lesson_recorded") payload = { topic: step.topic, text: step.text };
    else { die(`unsupported ${t}`); return []; }
    return [{ ts, type: t, by: script.by, key: core.eventKey(t, payload!), payload: payload! }];
  }, now);
}
const events = await store.readEvents(outDir!, script.id);
const final = core.reduce(events, Date.parse(script.steps.at(-1).ts));
const view = core.timeline(events, Date.parse(script.steps.at(-1).ts));
const room = core.filmRoom(final);
console.log(JSON.stringify({ id: script.id, events: events.length, status: final.status, summary: view.summary,
  stages: view.stages.map((s: any) => `${s.stage} ${s.durationText}`), base: room?.base, swap: room?.swap, closeCall: room?.closeCall,
  runs: view.runs.map((r: any) => `${r.label} ${r.durationText} ${r.outcome}`) }, null, 1));
