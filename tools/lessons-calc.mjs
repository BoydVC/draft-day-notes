#!/usr/bin/env node
// Box-side oracle for SPEC 004 (Pick 3, lessons + gardener). Zero deps, no network.
// It recomputes, from the lessons fixture (or a data dir), every number SPEC 004 states:
// the findings, the lesson groups and one-offs, their correction order, the proposals and
// their must-fail-on receipts, the summary line and the `dd lessons` text, so the spec and
// Grok Bot's second read can be checked without cloning the repo.
// It replicates only what SPEC 004's rules need from the stacked tree (dd/p2-timeline @ 60b1625):
// reduce()'s report/createdAt and judge label lookup (src/core/reducer.ts), stageLabel
// (src/core/transitions.ts), isPickId/isCandId (src/core/ids.ts). It is NOT product code.
// Usage:
//   node tools/lessons-calc.mjs <fixture.jsonl> [--since YYYY-MM-DD] [--until YYYY-MM-DD] [--json]
//   node tools/lessons-calc.mjs --data <dataDir> [...]          (reads picks/<id>/events.jsonl)
//   node tools/lessons-calc.mjs <fixture.jsonl> --copies 100     (the T19 load: copy k on day 2026-01-01+k)
//   node tools/lessons-calc.mjs <fixture.jsonl> --split <dir>    (writes <dir>/picks/<id>/events.jsonl, like seed-lessons)
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const args = process.argv.slice(2);
const opt = (name) => (args.includes(name) ? args[args.indexOf(name) + 1] : undefined);
const valued = new Set(["--since", "--until", "--data", "--copies", "--split"]);
const file = args.find((a, i) => !a.startsWith("--") && !valued.has(args[i - 1]));
const asJson = args.includes("--json");

// ---- constants (SPEC 004 CONTEXT; mirrored from the stacked tree) ----
const PICK_ID = /^p-\d{8}-\d{2}$/;
const CAND_IDS = ["c1", "c2", "c3", "c4", "c5"];
const LABELS = ["A", "B", "C", "D", "E"];
const GATES = ["build", "tests", "journey"];
const LEDGERS = ["live-ui-verified", "unit-test-verified", "type-check-only", "verifier-blocked", "verifier-failed"];
export const CORRECTION_ORDER = ["architecture", "check", "skill", "review"];
export const REPEAT_PICKS = 2;
export const LOW_SCORE = 1;
const STAGE = { judging: "Film Room", physical: "Physical" };

// The proposal registry (SPEC 004 "Proposals"): one row per finding kind.
export const PROPOSALS = {
  inconclusive: { level: "architecture", stage: STAGE.physical, where: ".cursor/skills/verify-draft-day/helpers/control.sh",
    check: (s) => `Make control.sh doctor fail before any drive when the verifier would end ${s}, so a physical never spends a run on it.` },
  gate: { level: "check", stage: STAGE.judging, where: "src/report/parse.ts parseCandidateReport",
    check: (s) => `Refuse a candidate_finished report at record time unless it proves the ${s} gate passed, so the Film Room never scores a card that fails it.` },
  judge: { level: "check", stage: STAGE.judging, where: "src/report/parse.ts validateJudgementContext",
    check: () => "Replay these events through validateJudgementContext and keep a test proving it rejects each one." },
  score: { level: "check", stage: STAGE.judging, where: "src/briefs/scout.md",
    check: (s) => `Write criterion ${s} into every scouting report as an ACCEPTANCE line, so the judge's pooled cross-test fails the mistake instead of the rubric scoring it.` },
  not_verified: { level: "skill", stage: STAGE.physical, where: ".cursor/skills/verify-draft-day/features/",
    check: () => "Add the journey the physical failed to the verify skill's feature map, so candidates drive it in their own VERIFY before they report." },
  lesson: { level: "review", stage: null, where: "Boyd",
    check: (s) => `Boyd names the engine check for "${s}"; until then it stays a human review item.` },
};

// ---- input ----
function fromFixture(path) {
  const by = new Map();
  for (const line of readFileSync(path, "utf8").split("\n")) {
    if (!line.trim()) continue;
    const { pickId, event } = JSON.parse(line);
    if (!by.has(pickId)) by.set(pickId, []);
    by.get(pickId).push(event);
  }
  return [...by.entries()].map(([pickId, events]) => ({ pickId, events }));
}
function fromData(dir) {
  const logs = [], skipped = [];
  let names = [];
  try { names = readdirSync(join(dir, "picks")); } catch { names = []; }
  for (const name of names.filter((n) => PICK_ID.test(n)).sort()) {
    try {
      const text = readFileSync(join(dir, "picks", name, "events.jsonl"), "utf8");
      logs.push({ pickId: name, events: text.split("\n").filter((l) => l.trim()).map((l) => JSON.parse(l)) });
    } catch { logs.push({ pickId: name, events: null }); }
  }
  return { logs, skipped };
}

// ---- window ----
export function lessonWindow(since, until) {
  const day = (v, name) => {
    if (v === undefined || v === null || v === "") return { ok: true, value: null };
    if (typeof v !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(v)) return { ok: false, error: `${name} must be YYYY-MM-DD` };
    const t = Date.parse(`${v}T00:00:00.000Z`);
    if (!Number.isFinite(t) || new Date(t).toISOString().slice(0, 10) !== v) return { ok: false, error: `${name} must be YYYY-MM-DD` };
    return { ok: true, value: v };
  };
  const s = day(since, "since"); if (!s.ok) return s;
  const u = day(until, "until"); if (!u.ok) return u;
  if (s.value && u.value && s.value >= u.value) return { ok: false, error: "since must be before until" };
  return { ok: true, value: { since: s.value, until: u.value } };
}

// ---- core ----
const str = (v) => (typeof v === "string" ? v : "");
const normTopic = (t) => (str(t).toLowerCase().replace(/[\s_-]+/g, " ").trim() || "general").slice(0, 60);

export function gardener(logs, window = { since: null, until: null }, preSkipped = []) {
  const skipped = [...preSkipped];
  const findings = [];
  const rubricNames = new Map(); // `${pickId}|${id}` -> name
  let picks = 0;
  const sorted = [...logs].sort((a, b) => (a.pickId < b.pickId ? -1 : a.pickId > b.pickId ? 1 : 0));
  for (const log of sorted) {
    if (typeof log.pickId !== "string" || !PICK_ID.test(log.pickId)) { skipped.push({ pickId: String(log.pickId), reason: "bad pick id" }); continue; }
    if (!Array.isArray(log.events)) { skipped.push({ pickId: log.pickId, reason: "unreadable" }); continue; }
    const events = [...log.events].sort((a, b) => a.seq - b.seq);
    const created = events.find((e) => e.type === "pick_created");
    if (!created) { skipped.push({ pickId: log.pickId, reason: "no pick_created" }); continue; }
    if (created.payload?.id !== log.pickId) { skipped.push({ pickId: log.pickId, reason: "id mismatch" }); continue; }
    if (window.since || window.until) {
      const t = Date.parse(created.ts);
      if (!Number.isFinite(t)) continue;
      if (window.since && t < Date.parse(`${window.since}T00:00:00.000Z`)) continue;
      if (window.until && t >= Date.parse(`${window.until}T00:00:00.000Z`)) continue;
    }
    picks += 1;
    // reduce(): last scouting_report_written wins (payload.report ?? payload)
    let rubric = [];
    for (const e of events) if (e.type === "scouting_report_written") rubric = (e.payload.report ?? e.payload).rubric ?? [];
    const rubricIds = new Set();
    for (const c of Array.isArray(rubric) ? rubric : []) {
      if (c && typeof c.id === "string") { rubricIds.add(c.id); rubricNames.set(`${log.pickId}|${c.id}`, str(c.name)); }
    }
    const launches = [];
    let judgements = 0;
    const push = (e, kind, subject, extra) => findings.push({
      key: `${kind}:${subject}`, kind, subject, pickId: log.pickId, seq: e.seq, ts: e.ts,
      cand: null, label: null, pass: null, detail: "", ...extra,
    });
    for (const e of events) {
      const p = e.payload ?? {};
      if (e.type === "judge_launched") {
        const labels = {};
        if (p.labels && typeof p.labels === "object") for (const [l, c] of Object.entries(p.labels)) if (LABELS.includes(l) && CAND_IDS.includes(String(c))) labels[l] = String(c);
        launches.push({ pass: typeof p.pass === "number" && Number.isFinite(p.pass) ? p.pass : launches.length + 1, labels });
      } else if (e.type === "judgement_recorded") {
        const pass = typeof p.pass === "number" && Number.isFinite(p.pass) ? p.pass : judgements + 1;
        const launch = launches.find((l) => l.pass === pass) ?? launches[judgements];
        judgements += 1;
        const labels = launch?.labels ?? {};
        for (const card of Array.isArray(p.cards) ? p.cards : []) {
          if (!card || typeof card !== "object") continue;
          const label = LABELS.includes(card.label) ? card.label : null;
          const cand = label && labels[label] ? labels[label] : null;
          const base = { cand, label, pass };
          if (!cand) push(e, "judge", "unresolved-label", { ...base, detail: `label ${String(card.label)}` });
          for (const g of GATES) if (card.gates && card.gates[g] === "fail") push(e, "gate", g, base);
          for (const s of Array.isArray(card.scores) ? card.scores : []) {
            if (!s || typeof s !== "object") continue;
            if (typeof s.criterionId !== "string" || !rubricIds.has(s.criterionId)) { push(e, "judge", "bad-criterion", { ...base, detail: String(s.criterionId) }); continue; }
            if (typeof s.score === "number" && s.score <= LOW_SCORE) push(e, "score", s.criterionId, { ...base, detail: str(s.evidence) });
          }
        }
      } else if (e.type === "verdict_recorded") {
        const ph = p.physical && typeof p.physical === "object" ? p.physical : {};
        const kind = ph.verdict === "NOT_VERIFIED" ? "not_verified" : ph.verdict === "INCONCLUSIVE" ? "inconclusive" : null;
        if (!kind) continue;
        const ledger = LEDGERS.includes(ph.ledger) ? ph.ledger : "unknown";
        const evidence = Array.isArray(ph.evidence) ? ph.evidence.filter((x) => typeof x === "string") : [];
        push(e, kind, ledger, { detail: evidence.join(" · ") });
      } else if (e.type === "lesson_recorded") {
        push(e, "lesson", normTopic(p.topic), { detail: str(p.text) });
      }
    }
  }
  const order = (f) => [f.pickId, String(f.seq).padStart(9, "0"), String(f.pass ?? 0).padStart(4, "0"), f.label ?? "~"].join("|");
  findings.sort((a, b) => (order(a) < order(b) ? -1 : order(a) > order(b) ? 1 : 0));
  const groups = new Map();
  for (const f of findings) {
    if (!groups.has(f.key)) groups.set(f.key, []);
    groups.get(f.key).push(f);
  }
  const all = [...groups.entries()].map(([key, fs]) => {
    const kind = fs[0].kind, subject = fs[0].subject, reg = PROPOSALS[kind];
    const pickIds = [...new Set(fs.map((f) => f.pickId))];
    const times = fs.map((f) => f.ts).sort((a, b) => Date.parse(a) - Date.parse(b));
    const names = kind === "score" ? [...new Set(fs.map((f) => rubricNames.get(`${f.pickId}|${f.subject}`) || ""))].filter(Boolean) : [];
    const receipts = [];
    for (const f of fs) if (!receipts.some((r) => r.pickId === f.pickId && r.seq === f.seq)) receipts.push({ pickId: f.pickId, seq: f.seq });
    const repeat = pickIds.length >= REPEAT_PICKS;
    return {
      rank: null, key, kind, subject, level: reg.level, stage: reg.stage, names, picks: pickIds, pickCount: pickIds.length, count: fs.length,
      firstAt: times[0], lastAt: times[times.length - 1], findings: fs,
      proposal: repeat ? { level: reg.level, where: reg.where, check: reg.check(subject), mustFailOn: receipts } : null,
    };
  });
  const cmpKey = (a, b) => (a.key < b.key ? -1 : a.key > b.key ? 1 : 0);
  const lessons = all.filter((g) => g.proposal).sort((a, b) =>
    CORRECTION_ORDER.indexOf(a.level) - CORRECTION_ORDER.indexOf(b.level) || b.pickCount - a.pickCount || b.count - a.count || cmpKey(a, b));
  lessons.forEach((g, i) => { g.rank = i + 1; });
  const oneOffs = all.filter((g) => !g.proposal).sort((a, b) => b.count - a.count || cmpKey(a, b));
  const plural = (n, w) => `${n} ${w}${n === 1 ? "" : "s"}`;
  const summary = `${plural(lessons.length, "lesson")} from ${plural(picks, "pick")} · ${plural(findings.length, "finding")} · ${plural(oneOffs.length, "one-off")}`;
  skipped.sort((a, b) => (a.pickId < b.pickId ? -1 : a.pickId > b.pickId ? 1 : 0));
  return { window, picks, findings: findings.length, lessons, oneOffs, skipped, summary };
}

const clean = (s) => String(s).replace(/[\u0000-\u001f\u007f-\u009f]/g, "?");
export function text(r) {
  const out = [clean(r.summary)];
  for (const g of r.lessons) {
    out.push(`${g.rank}. ${g.level}  ${clean(g.key)}  ${g.pickCount} picks  ${g.count} findings`);
    out.push(`   ${clean(g.proposal.check)}`);
    out.push(`   where ${g.proposal.where}`);
    out.push(`   must fail on ${g.proposal.mustFailOn.map((m) => `${m.pickId}#${m.seq}`).join(", ")}`);
  }
  if (r.oneOffs.length) out.push("one-offs");
  for (const g of r.oneOffs) out.push(`- ${clean(g.key)}  ${g.picks[0]}  ${g.count} finding${g.count === 1 ? "" : "s"}`);
  for (const s of r.skipped) out.push(`skipped ${clean(s.pickId)}: ${s.reason}`);
  return out.join("\n");
}

// ---- main ----
const isMain = import.meta.url === new URL(`file://${process.argv[1]}`).href;
if (isMain) {
  const win = lessonWindow(opt("--since"), opt("--until"));
  if (!win.ok) { console.error(`error: ${win.error}`); process.exit(2); }
  let logs, pre = [];
  if (opt("--data")) ({ logs, skipped: pre } = fromData(opt("--data")));
  else if (file) logs = fromFixture(file);
  else { console.error("usage: lessons-calc.mjs <fixture.jsonl>|--data <dir> [--since D] [--until D] [--copies N] [--split DIR] [--json]"); process.exit(2); }
  if (opt("--split")) {
    for (const l of logs) {
      const d = join(opt("--split"), "picks", l.pickId);
      mkdirSync(d, { recursive: true });
      writeFileSync(join(d, "events.jsonl"), l.events.map((e) => JSON.stringify(e)).join("\n") + "\n");
    }
    console.log(`split ${logs.length} picks into ${opt("--split")}/picks/`);
    process.exit(0);
  }
  if (opt("--copies")) {
    const n = Number(opt("--copies")), out = [];
    for (let k = 0; k < n; k += 1) {
      const day = new Date(Date.UTC(2026, 0, 1) + k * 86400000).toISOString().slice(0, 10).replace(/-/g, "");
      logs.forEach((l, j) => {
        const id = `p-${day}-${String(j + 1).padStart(2, "0")}`;
        out.push({ pickId: id, events: l.events.map((e) => (e.type === "pick_created" ? { ...e, payload: { ...e.payload, id } } : e)) });
      });
    }
    logs = out;
  }
  const t0 = performance.now();
  const r = gardener(logs, win.value, pre);
  const ms = performance.now() - t0;
  if (asJson) console.log(JSON.stringify(r, null, 2));
  else { console.log(text(r)); if (opt("--copies")) console.error(`oracle ms ${ms.toFixed(1)}`); }
}
