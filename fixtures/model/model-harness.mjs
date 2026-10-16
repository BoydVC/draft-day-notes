// SPEC 011 (Pick 10, Model check) harness. Plain JavaScript, independent of src/: it never imports the engine.
// It defines the bounded scenario space the sweep must drive, the fake-driver Scenario each point becomes,
// an independent model of what each scenario must end as, the named extra sequences, the binding
// transition table, and the census rules as data. Exports:
//   CANDS, RESULT_KINDS, SCORE_LEVELS, VERDICT_LETTERS, verdictSequences(), scenarioSpace({quick}),
//   scenarioId(point), toScenario(point), predict(point), SEQUENCES, ALIAS_STATUSES, TERMINAL,
//   TRANSITION_ROWS, tripleKey(t), BUDGET
export const CANDS = ["c1", "c2", "c3"];
// F = finishes on the first launch; EF = errors once, finishes on the one relaunch; EE = errors twice (dropped).
export const RESULT_KINDS = { F: ["finish"], EF: ["error", "finish"], EE: ["error", "error"] };
export const SCORE_LEVELS = [3, 4];
export const VERDICT_LETTERS = { V: "VERIFIED", N: "NOT_VERIFIED", I: "INCONCLUSIVE" };
export const TERMINAL = ["drafted", "failed", "cancelled"];
export const ALIAS_STATUSES = ["scouting"];
export const BUDGET = { launchesPerCand: 2, judgePasses: 2, verdicts: 3, fixes: 2 };

// Every verdict sequence of length 1..3 over N, I, V that stops at the first V (15 sequences), in this order:
// depth-first over [N, I, V] (so "NNN" comes before "NNI" ... and "V" is last).
export function verdictSequences() {
  const out = [];
  const walk = (prefix) => {
    if (prefix.length && prefix[prefix.length - 1] === "V") { out.push(prefix); return; }
    if (prefix.length === 3) { out.push(prefix); return; }
    for (const l of ["N", "I", "V"]) walk(prefix + l);
  };
  walk("");
  return out;
}
const QUICK_VERDICTS = ["V", "NNV", "NIN"];

// Points in canonical order: approval (ask, auto) > n (2, 3) > results (F, EF, EE per candidate, c1 slowest-changing)
// > scores (3, 4 per candidate) > verdict sequence. quick = ask only, n 3 only, verdicts V, NNV, NIN (648 points).
export function* scenarioSpace({ quick = false } = {}) {
  const approvals = quick ? ["ask"] : ["ask", "auto"];
  const ns = quick ? [3] : [2, 3];
  const vseqs = quick ? QUICK_VERDICTS : verdictSequences();
  for (const approval of approvals) for (const n of ns) {
    const kinds = Object.keys(RESULT_KINDS);
    const results = product(n, kinds);
    const scores = product(n, SCORE_LEVELS);
    for (const r of results) for (const s of scores) for (const v of vseqs) yield { approval, n, results: r, scores: s, verdicts: v };
  }
}
function product(n, values) {
  let acc = [[]];
  for (let i = 0; i < n; i += 1) acc = acc.flatMap((a) => values.map((v) => [...a, v]));
  return acc;
}

export function scenarioId(p) {
  return `${p.approval}-n${p.n}-${p.results.join(".")}-${p.scores.join("")}-${p.verdicts}`;
}

// The fake-driver Scenario (test/fixtures/fake-driver.ts shape) for one point. No `cards`: every card passes every
// gate, every criterion scores the candidate's level, cross tests 2/2.
export function toScenario(p) {
  const cands = CANDS.slice(0, p.n);
  return {
    name: scenarioId(p),
    idea: "Add a status legend to the War Room",
    approval: p.approval,
    n: p.n,
    results: Object.fromEntries(cands.map((c, i) => [c, [...RESULT_KINDS[p.results[i]]]])),
    scores: Object.fromEntries(cands.map((c, i) => [c, p.scores[i]])),
    verdicts: [...p.verdicts].map((l) => VERDICT_LETTERS[l]),
    expect: "drafted",
  };
}

// Independent model of the pick machine for one point (derived from SPEC 001 + ARCHITECTURE §3.3, not from src/).
//   finished = candidates whose results are F or EF; EE candidates are dropped after their one relaunch.
//   0 finished -> failed (no_candidates), no judge, no graft, no physical.
//   1 finished -> walkover: no judge, no graft, straight to the physical.
//   >=2 finished -> one judge pass, plus a reversed second pass when the top two scores are within 10% of the top;
//                  then one graft, then the physical.
//   physical: verdicts are taken in order (a missing verdict is VERIFIED, as the fake driver does); the first VERIFIED
//   at attempt k (k <= 3) -> drafted after k verdicts and k-1 fix requests; three non-VERIFIED -> failed (not_verified)
//   after 3 verdicts and 2 fix requests.
export function predict(p) {
  const finished = p.results.map((r, i) => (r === "EE" ? null : i)).filter((i) => i !== null);
  const launches = p.results.reduce((a, r) => a + (r === "F" ? 1 : 2), 0);
  const candidateFailures = p.results.reduce((a, r) => a + (r === "F" ? 0 : r === "EF" ? 1 : 2), 0);
  const dropped = p.results.filter((r) => r === "EE").length;
  const base = { launches, candidateFailures, dropped };
  if (finished.length === 0) return { ...base, status: "failed", failReason: "no_candidates", walkover: false, judges: 0, graft: false, verdicts: 0, fixes: 0 };
  let judges = 0;
  if (finished.length >= 2) {
    const top = finished.map((i) => p.scores[i]).sort((a, b) => b - a);
    judges = Math.abs(top[0] - top[1]) <= top[0] * 0.1 + 1e-9 ? 2 : 1;
  }
  const seq = [0, 1, 2].map((i) => p.verdicts[i] ?? "V");
  const k = seq.indexOf("V");
  const common = { ...base, walkover: finished.length === 1, judges, graft: finished.length >= 2 };
  if (k < 0) return { ...common, status: "failed", failReason: "not_verified", verdicts: 3, fixes: 2 };
  return { ...common, status: "drafted", failReason: null, verdicts: k + 1, fixes: k };
}

// Named extra sequences the sweep also drives (binding; see SPEC 011 "Sequences").
export const SEQUENCES = [
  { name: "policy", steps: ["drive POLICY"] },
  { name: "policy-lesson", steps: ["drive POLICY", "record lesson_recorded {topic:\"sweep\",text:\"policy lesson\"}"] },
  { name: "cancel-go", steps: ["intake ask n3", "record scouting_report_written {report: scoutingReport(3)}", "record pick_cancelled {detail:\"no\"}"] },
  { name: "cancel-go-lesson", steps: ["intake ask n3", "record scouting_report_written", "record pick_cancelled", "record lesson_recorded {topic:\"sweep\",text:\"cancel lesson\"}"] },
  { name: "timeout", steps: ["intake ask n3", "record scouting_report_written", "(census timeout check)"] },
  { name: "cancel-combine", steps: ["intake auto n3", "record scouting_report_written", "record pick_cancelled {detail:\"no\"}"] },
  { name: "reframe", steps: ["drive HAPPY with results all [finish] and pass-1 cards c1,c2,c3 gates {build:pass,tests:fail,journey:pass}"] },
  { name: "happy-lesson", steps: ["drive HAPPY", "record lesson_recorded {topic:\"sweep\",text:\"happy lesson\"}"] },
  { name: "lesson-combine", steps: ["drive HAPPY; right after the first candidate_finished, record lesson_recorded {topic:\"sweep\",text:\"candidate lesson\"} (what the real Pick 6 log does)"] },
  { name: "lesson-physical", steps: ["drive HAPPY; right after each verdict_recorded whose verdict is not VERIFIED, record lesson_recorded {topic:\"sweep\",text:\"verifier lesson\"} (what the real Picks 3, 4 and 7 logs do)"] },
  { name: "close", steps: ["drive CLOSE"] },
  { name: "walkover", steps: ["drive WALK"] },
];

// The binding transition relation (33 rows: 31 observed + 2 rows from the alias status `scouting`).
// [from, event, guard, to]. "timeout" is the one non-event: status changes because time passed.
export const TRANSITION_ROWS = [
  ["intake", "pick_created", "accepted", "intake"],
  ["intake", "pick_failed", "policy refusal", "failed"],
  ["intake", "scouting_report_written", "approval=ask", "awaiting_go"],
  ["intake", "scouting_report_written", "approval=auto", "combine"],
  ["scouting", "scouting_report_written", "approval=ask (alias of intake)", "awaiting_go"],
  ["scouting", "scouting_report_written", "approval=auto (alias of intake)", "combine"],
  ["awaiting_go", "scouting_approved", "go", "combine"],
  ["awaiting_go", "pick_cancelled", "no", "cancelled"],
  ["awaiting_go", "timeout", "48h without a go", "cancelled"],
  ["combine", "scouting_approved", "auto approval recorded", "combine"],
  ["combine", "candidate_launched", "slot", "combine"],
  ["combine", "candidate_finished", "report in", "combine"],
  ["combine", "candidate_failed", "first error, one relaunch", "combine"],
  ["combine", "candidate_dropped", "second error: a gap", "combine"],
  ["combine", "lesson_recorded", "lesson mid-combine", "combine"],
  ["combine", "judge_launched", ">=2 finished: film room running", "judging"],
  ["combine", "physical_launched", "walkover: exactly 1 finished", "physical"],
  ["combine", "pick_failed", "0 finished", "failed"],
  ["combine", "pick_cancelled", "cancelled mid-combine", "cancelled"],
  ["judging", "judge_launched", "second pass: top two within 10%", "judging"],
  ["judging", "judgement_recorded", "scorecard in", "judging"],
  ["judging", "graft_launched", "base chosen: trade running", "grafting"],
  ["judging", "pick_failed", "none pass hard gates: reframe", "failed"],
  ["grafting", "graft_recorded", "draft PR opened", "grafting"],
  ["grafting", "physical_launched", "verifier running", "physical"],
  ["physical", "verdict_recorded", "verdict in", "physical"],
  ["physical", "fix_requested", "fix in flight", "physical"],
  ["physical", "lesson_recorded", "lesson mid-physical", "physical"],
  ["physical", "draft_pr_confirmed", "VERIFIED", "drafted"],
  ["physical", "pick_failed", "fix loops exhausted", "failed"],
  ["drafted", "lesson_recorded", "terminal", "drafted"],
  ["failed", "lesson_recorded", "terminal", "failed"],
  ["cancelled", "lesson_recorded", "terminal", "cancelled"],
];
export function tripleKey(t) {
  return Array.isArray(t) ? `${t[0]}>${t[1]}>${t[t.length - 1]}` : `${t.from}>${t.event}>${t.to}`;
}
