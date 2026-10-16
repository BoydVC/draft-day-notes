#!/usr/bin/env node
// Box-side oracle for SPEC 003 (Pick 2, pick timeline). Zero deps, no network.
// It recomputes, from one events.jsonl, the numbers SPEC 003 states for the sample pick
// (runs, stage spans, counts, links, summary, the `dd timeline` text) so the spec and
// Grok Bot's second read can be checked without cloning the repo.
// It replicates only the status rules of the scaffold reducer (src/core/reducer.ts @ f51dae8)
// that the timeline needs; it is NOT the product code and never ships.
// Usage: node timeline-calc.mjs <events.jsonl> [--now <iso>] [--json]
import { readFileSync } from "node:fs";

const args = process.argv.slice(2);
const file = args.find((a) => !a.startsWith("--") && args[args.indexOf(a) - 1] !== "--now");
if (!file) { console.error("usage: timeline-calc.mjs <events.jsonl> [--now ISO] [--json]"); process.exit(2); }
const nowArg = args.includes("--now") ? args[args.indexOf("--now") + 1] : null;
const asJson = args.includes("--json");

const GO_TIMEOUT_MS = 48 * 60 * 60 * 1000;
const MAX_FIX_LOOPS = 2;
const TERMINAL = new Set(["drafted", "failed", "cancelled"]);
const STAGE = { intake: "Intake", scouting: "Scouting Report", awaiting_go: "Scouting Report", combine: "Combine", judging: "Film Room", grafting: "Trade", physical: "Physical", drafted: "Draft Pick", failed: "Failed", cancelled: "Cancelled" };
const AGENT_ID = /^bc-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
const SHA = /^[0-9a-f]{40}$/;

const events = readFileSync(file, "utf8").split("\n").filter((l) => l.trim()).map((l) => JSON.parse(l)).sort((a, b) => a.seq - b.seq);

// reducer status replica (reducer.ts: status block + 48h timeout)
function status(prefix, now) {
  const created = prefix.find((e) => e.type === "pick_created");
  const approval = created?.payload.approval === "auto" ? "auto" : "ask";
  let report = null, approved = false, failReason = null, cancelled = false, confirmed = false;
  let physical = false, verdicts = 0, graft = false, judge = 0;
  for (const e of prefix) {
    if (e.type === "scouting_report_written") report = e.ts;
    if (e.type === "scouting_approved") approved = true;
    if (e.type === "pick_failed") failReason = e.payload.reason ?? "failed";
    if (e.type === "pick_cancelled") { cancelled = true; failReason = failReason ?? "cancelled"; }
    if (e.type === "draft_pr_confirmed") confirmed = true;
    if (e.type === "physical_launched") physical = true;
    if (e.type === "verdict_recorded") verdicts++;
    if (e.type === "graft_launched") graft = true;
    if (e.type === "judge_launched") judge++;
  }
  const ready = approved || (approval === "auto" && report);
  let s = "intake";
  if (failReason) s = cancelled && failReason === "cancelled" ? "cancelled" : "failed";
  else if (cancelled) s = "cancelled";
  else if (confirmed) s = "drafted";
  else if (physical || verdicts > 0) s = "physical";
  else if (graft) s = "grafting";
  else if (judge > 0) s = "judging";
  else if (ready) s = "combine";
  else if (report && approval === "ask") s = "awaiting_go";
  let timeoutAt = null;
  if (s === "awaiting_go" && report && now - Date.parse(report) >= GO_TIMEOUT_MS) { s = "cancelled"; timeoutAt = Date.parse(report) + GO_TIMEOUT_MS; }
  return { s, timeoutAt };
}

export function formatDuration(ms) {
  const v = Number.isFinite(ms) && ms > 0 ? Math.floor(ms) : 0;
  if (v < 60_000) return `${Math.floor(v / 1000)}s`;
  if (v < 3_600_000) return `${Math.floor(v / 60_000)}m`;
  if (v < 86_400_000) { const h = Math.floor(v / 3_600_000); return `${h}h ${String(Math.floor((v % 3_600_000) / 60_000)).padStart(2, "0")}m`; }
  return `${Math.floor(v / 86_400_000)}d ${Math.floor((v % 86_400_000) / 3_600_000)}h`;
}

const created = events.find((e) => e.type === "pick_created");
const target = created.payload.target;
const t = (e) => { const v = Date.parse(e.ts); return Number.isFinite(v) ? v : null; };
const start = t(events[0]);
const now = nowArg ? Date.parse(nowArg) : Date.now();

// entries: status after each event, from the reducer replica
let prevTs = start;
const entries = events.map((e, i) => {
  const ts = t(e) ?? prevTs;
  const st = status(events.slice(0, i + 1), ts).s;
  const entry = { seq: e.seq, ts: e.ts, type: e.type, status: st, stage: STAGE[st], sinceStartMs: Math.max(0, ts - start), sincePrevMs: Math.max(0, ts - prevTs), links: [] };
  prevTs = Math.max(prevTs, ts);
  return entry;
});
const final = status(events, now);
const firstTerminal = entries.find((e) => TERMINAL.has(e.status));
const endedAtMs = firstTerminal ? t(events.find((e) => e.seq === firstTerminal.seq)) : final.timeoutAt;
const live = !TERMINAL.has(final.s);

// runs (SPEC 003 pairing table)
const runs = [];
const open = (r) => runs.push(r);
const label = { candidate: (r) => `${r.cand} attempt ${r.attempt}`, judge: (r) => `Film Room pass ${r.attempt}`, graft: () => "Trade", physical: () => "Physical", fix: (r) => `Fix loop ${r.attempt}` };
const outcomeOf = { candidate_finished: "finished", candidate_failed: "errored", judgement_recorded: "scored", graft_recorded: "pr_opened" };
const verdictOutcome = { VERIFIED: "verified", NOT_VERIFIED: "not_verified", INCONCLUSIVE: "inconclusive" };
for (const e of events) {
  const p = e.payload ?? {};
  const mk = (role, attempt, extra = {}) => ({ id: role === "candidate" ? `${p.cand}#${attempt}` : `${role}#${attempt}`, role, attempt, agentId: typeof p.agentId === "string" ? p.agentId : undefined, startSeq: e.seq, endSeq: null, startMs: t(e), endMs: null, outcome: "running", ...extra });
  const close = (pred, outcome) => { const r = runs.find((x) => x.endSeq === null && pred(x)); if (r) { r.endSeq = e.seq; r.endMs = t(e); r.outcome = outcome; } return r; };
  if (e.type === "candidate_launched") open(mk("candidate", p.attempt ?? runs.filter((r) => r.cand === p.cand).length + 1, { cand: p.cand }));
  if (e.type === "judge_launched") open(mk("judge", p.pass ?? runs.filter((r) => r.role === "judge").length + 1));
  if (e.type === "graft_launched") open(mk("graft", 1));
  if (e.type === "physical_launched") open(mk("physical", 1));
  if (e.type === "fix_requested") open(mk("fix", p.loop ?? runs.filter((r) => r.role === "fix").length + 1));
  if (e.type === "candidate_finished" || e.type === "candidate_failed") close((r) => r.role === "candidate" && r.cand === p.cand, outcomeOf[e.type]);
  if (e.type === "judgement_recorded") close((r) => r.role === "judge" && (p.pass === undefined || r.attempt === p.pass), "scored");
  if (e.type === "graft_recorded") close((r) => r.role === "graft", "pr_opened");
  if (e.type === "verdict_recorded") close((r) => r.role === "physical" || r.role === "fix", verdictOutcome[p.physical?.verdict] ?? "inconclusive");
}
for (const r of runs) {
  r.label = label[r.role](r);
  r.agentUrl = r.agentId && AGENT_ID.test(r.agentId) ? `https://cursor.com/agents/${r.agentId}` : null;
  if (r.endSeq === null && !live) { r.outcome = "abandoned"; r.endMs = endedAtMs; }
  r.durationMs = Math.max(0, (r.endMs ?? now) - r.startMs);
  r.durationText = formatDuration(r.durationMs);
}

// links (SPEC 003 link table)
const gh = (kind, n) => `https://github.com/${target}/${kind}/${n}`;
for (const entry of entries) {
  const e = events.find((x) => x.seq === entry.seq); const p = e.payload ?? {};
  const run = runs.find((r) => r.startSeq === e.seq);
  if (run?.agentUrl) entry.links.push({ kind: "agent", label: `Agent ${run.label}`, href: run.agentUrl });
  const sha = e.type === "candidate_finished" ? p.report?.headSha : e.type === "graft_recorded" ? p.headSha : e.type === "verdict_recorded" ? p.physical?.headSha : null;
  const pr = e.type === "graft_recorded" || e.type === "draft_pr_confirmed" ? p.prNumber : e.type === "verdict_recorded" ? p.physical?.prNumber : null;
  if (Number.isInteger(pr) && pr > 0) entry.links.push({ kind: "pr", label: `PR #${pr}`, href: gh("pull", pr) });
  if (typeof sha === "string" && SHA.test(sha)) entry.links.push({ kind: "commit", label: sha.slice(0, 7), href: gh("commit", sha) });
}

// stage spans: consecutive entries with the same stage; terminal spans have no `to` and 0 ms
const spans = [];
for (const entry of entries) {
  const last = spans[spans.length - 1];
  if (last && last.stage === entry.stage) { last.lastSeq = entry.seq; continue; }
  if (last) last.to = entry.ts;
  spans.push({ stage: entry.stage, from: entry.ts, to: null, firstSeq: entry.seq, lastSeq: entry.seq });
}
if (STAGE[final.s] !== spans[spans.length - 1].stage) { const iso = new Date(endedAtMs).toISOString(); spans[spans.length - 1].to = iso; spans.push({ stage: STAGE[final.s], from: iso, to: null, firstSeq: null, lastSeq: null }); }
for (const s of spans) {
  const terminal = ["Draft Pick", "Failed", "Cancelled"].includes(s.stage);
  s.durationMs = terminal ? 0 : Math.max(0, (s.to ? Date.parse(s.to) : now) - Date.parse(s.from));
  s.durationText = formatDuration(s.durationMs);
}

const count = (role) => runs.filter((r) => r.role === role).length;
const counts = { total: runs.length, candidate: count("candidate"), judge: count("judge"), graft: count("graft"), physical: count("physical"), fix: count("fix"), relaunches: runs.filter((r) => r.role === "candidate" && r.attempt >= 2).length };
const elapsedMs = Math.max(0, (live ? now : endedAtMs) - start);
const summary = `${final.s} · ${formatDuration(elapsedMs)} · ${counts.total} run${counts.total === 1 ? "" : "s"}`;
const linkKinds = entries.flatMap((e) => e.links).reduce((m, l) => ({ ...m, [l.kind]: (m[l.kind] ?? 0) + 1 }), {});

if (asJson) { console.log(JSON.stringify({ status: final.s, live, summary, elapsedMs, counts, runs, stages: spans, links: linkKinds }, null, 2)); process.exit(0); }
console.log(`${created.payload.id}  ${final.s}  ${formatDuration(elapsedMs)}  ${counts.total} runs`);
for (const e of entries) console.log(`+${formatDuration(e.sinceStartMs)}  ${e.stage}  ${e.type}  status=${e.status}${e.links.length ? "  links=" + e.links.map((l) => l.kind).join(",") : ""}`);
console.log(`runs ${counts.total}: candidate ${counts.candidate} (${counts.relaunches} relaunch${counts.relaunches === 1 ? "" : "es"}), judge ${counts.judge}, graft ${counts.graft}, physical ${counts.physical}, fix ${counts.fix}`);
console.log("\nRuns:");
for (const r of runs) console.log(`  ${r.id.padEnd(10)} ${r.label.padEnd(18)} ${r.outcome.padEnd(13)} ${r.durationText.padEnd(7)} ${r.agentUrl ? "link" : "-"}`);
console.log("\nStages:");
for (const s of spans) console.log(`  ${s.stage.padEnd(16)} ${s.durationText.padEnd(7)} ${s.from}${s.to ? " -> " + s.to : ""}  seq ${s.firstSeq ?? "-"}..${s.lastSeq ?? "-"}`);
console.log(`\nsummary: ${summary}\nlinks: ${JSON.stringify(linkKinds)}  total ${Object.values(linkKinds).reduce((a, b) => a + b, 0)}`);
