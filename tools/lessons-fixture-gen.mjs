#!/usr/bin/env node
// Builds fixtures/lessons-week.jsonl for SPEC 004 (Pick 3, lessons + gardener). Zero deps, no network.
// One line per event: {"pickId":"p-…","event":{seq,ts,type,by,key,payload}}. Each event is shaped the way
// `dd record` at dd/scaffold f51dae8 writes it (normalize() payloads, eventKey() keys), so the split
// logs reduce cleanly. Deterministic: re-running writes byte-identical output.
// Usage: node tools/lessons-fixture-gen.mjs [out]   (default fixtures/lessons-week.jsonl)
import { writeFileSync } from "node:fs";

const out = process.argv[2] ?? new URL("../fixtures/lessons-week.jsonl", import.meta.url).pathname;
const TARGET = "BoydVC/draft-day";

// eventKey() replica, src/core/events.ts @ f51dae8
function eventKey(type, p) {
  switch (type) {
    case "pick_created": return "pick";
    case "scouting_report_written": return "report";
    case "scouting_approved": return "approved";
    case "candidate_launched": return `launch:${p.cand}:${p.attempt ?? 1}`;
    case "candidate_finished": return `finish:${p.cand}:${p.attempt ?? 1}`;
    case "candidate_failed": return `fail:${p.cand}:${p.attempt ?? 1}`;
    case "candidate_dropped": return `drop:${p.cand}`;
    case "judge_launched": return `judge-launch:${p.pass ?? 1}`;
    case "judgement_recorded": return `judgement:${p.pass ?? 1}`;
    case "graft_launched": return "graft-launch";
    case "graft_recorded": return "graft";
    case "physical_launched": return `physical-launch:${p.attempt ?? 1}`;
    case "verdict_recorded": return `verdict:${p.attempt ?? p.headSha ?? 1}`;
    case "fix_requested": return `fix:${p.loop ?? 1}`;
    case "draft_pr_confirmed": return `pr:${p.prNumber ?? ""}`;
    case "pick_failed": return "failed";
    case "pick_cancelled": return "cancelled";
    case "lesson_recorded": return `lesson:${p.topic ?? ""}:${p.text ?? ""}`;
    default: throw new Error(type);
  }
}

const sha = (c) => c.repeat(40);
const agent = (n) => `bc-00000000-0000-4000-8000-${String(n).padStart(12, "0")}`;
const lines = [];

function pick(id, day, spec) {
  let seq = 0;
  let minute = 0;
  const ev = (type, payload, step = 5, by = "dd") => {
    seq += 1;
    minute += step;
    const ts = new Date(Date.UTC(2026, 9, day, 13, 0, 0) + minute * 60000).toISOString();
    lines.push(JSON.stringify({ pickId: id, event: { seq, ts, type, by, key: eventKey(type, payload), payload } }));
  };
  minute = -5;
  ev("pick_created", { id, idea: spec.idea, source: "chat", target: TARGET, n: spec.n, approval: spec.approval });
  ev("scouting_report_written", { report: {
    restatement: spec.restatement,
    acceptance: [{ id: "L1", when: "the pick is open", shall: "show what changed" }],
    rubric: spec.rubric.map(([cid, name, weight]) => ({ id: cid, name, weight, howToGrade: `grade ${cid}` })),
    designSketch: "One panel on the pick page.",
    verifyPlan: ["Open the pick page at 390 px."],
    safetyFact: "Payload text renders as text.",
    angles: ["simplest thing that passes", "extensibility first", "tests first, then code"].slice(0, spec.n),
    forbidden: ["Do not merge."],
  } });
  if (spec.approval === "ask") ev("scouting_approved", { via: "human" });
  for (const step of spec.steps) step(ev);
}

const launch = (cand, attempt, n, id) => (ev) => ev("candidate_launched", { cand, attempt, agentId: agent(n), branch: `dd/${id}/${cand}` }, 1);
const finish = (cand, attempt, ch, added, id) => (ev) => ev("candidate_finished", { cand, attempt, report: {
  branch: `dd/${id}/${cand}`, headSha: sha(ch), summary: `${cand} built it`,
  commands: [{ cmd: "npm test", exit: 0 }, { cmd: "npx tsc --noEmit", exit: 0 }],
  tests: { added, passing: true }, screenshots: [`${cand}-pick.png`], risks: [],
} }, 20);
const failC = (cand, attempt) => (ev) => ev("candidate_failed", { cand, attempt }, 9);
const drop = (cand) => (ev) => ev("candidate_dropped", { cand, reason: "dropped" }, 1);
const judgeL = (pass, order, labels, n) => (ev) => ev("judge_launched", { pass, order, labels, reversed: pass >= 2, agentId: agent(n) }, 2);
const card = (label, gates, scores) => ({
  label, gates: { build: "pass", tests: "pass", journey: "pass", ...gates },
  crossTests: { passed: 10, total: 12 },
  scores: scores.map(([criterionId, score, evidence]) => ({ criterionId, score, evidence })),
});
const judgement = (pass, order, cards, base) => (ev) => ev("judgement_recorded", {
  pass, order, cards, base, runnerUps: order.filter((l) => l !== base), trades: [], swapConsistent: null, secondRead: "agree", note: "",
}, 35);
const graft = (n, pr, ch) => [(ev) => ev("graft_launched", { agentId: agent(n) }, 2), (ev) => ev("graft_recorded", { prNumber: pr, headSha: sha(ch), summary: "Draft PR from the base" }, 50)];
const physical = (n, walkover = false) => (ev) => ev("physical_launched", { attempt: 1, walkover, agentId: agent(n) }, 1);
const verdict = (attempt, pr, ch, verdict, ledger, certainty, evidence, fixLoops) => (ev) => ev("verdict_recorded", {
  attempt, headSha: sha(ch), physical: { prNumber: pr, headSha: sha(ch), verdict, ledger, certainty, evidence, fixLoops },
}, 30);
const fix = (loop, n) => (ev) => ev("fix_requested", { loop, agentId: agent(n) }, 1);
const confirm = (pr) => (ev) => ev("draft_pr_confirmed", { prNumber: pr }, 1);
const lesson = (topic, text) => (ev) => ev("lesson_recorded", { topic, text }, 4, "grok-bot");
const failPick = (reason, detail) => (ev) => ev("pick_failed", { reason, detail }, 2);

// P1: single judge pass; c1 fails the journey gate; low tests (c1, c3) and warroom (c3) scores; the physical finds a UI bug; the grafter's PR was not a draft.
{
  const id = "p-20261011-01";
  pick(id, 11, { idea: "Add a status legend to the Big Board", n: 3, approval: "ask", restatement: "You want a legend that explains every status chip.",
    rubric: [["tests", "Tests prove behavior", 2], ["warroom", "Board legibility", 3], ["stack", "Small diff", 1]],
    steps: [
      launch("c1", 1, 101, id), launch("c2", 1, 201, id), launch("c3", 1, 301, id),
      finish("c1", 1, "1", 4, id), finish("c2", 1, "2", 6, id), finish("c3", 1, "3", 0, id),
      judgeL(1, ["A", "B", "C"], { A: "c1", B: "c2", C: "c3" }, 401),
      judgement(1, ["A", "B", "C"], [
        card("A", { journey: "fail" }, [["tests", 1, "test/legend.test.ts asserts a private helper, not the board"], ["warroom", 3, "legend reads well at 1280 px"], ["stack", 3, "4 files"]]),
        card("B", {}, [["tests", 3, "legend rows asserted through GET /api/board"], ["warroom", 4, "legend fits at 390 px"], ["stack", 3, "5 files"]]),
        card("C", {}, [["tests", 0, "no new tests; npm test only runs the SPEC 001 suites"], ["warroom", 1, "legend chips overlap the status column at 390 px"], ["stack", 2, "9 files"]]),
      ], "B"),
      ...graft(501, 3, "4"), physical(601),
      verdict(1, 3, "4", "NOT_VERIFIED", "live-ui-verified", 4, ["Legend hid the failed chip on the 390 px board", "big-board.png"], 0),
      fix(1, 501),
      verdict(2, 3, "5", "VERIFIED", "live-ui-verified", 4, ["Legend and failed chip both visible at 390 px"], 1),
      confirm(3),
      lesson("draft", "Grafter opened PR #3 ready for review; Grok Bot flipped it back to draft."),
    ] });
}
// P2: two judge passes (pass 2 reversed); c2 and c3 fail the journey gate in pass 1, c2 again in pass 2; c1 scores low on tests in both passes; the verifier is blocked once.
{
  const id = "p-20261012-01";
  pick(id, 12, { idea: "Show run counts on each candidate card", n: 3, approval: "auto", restatement: "You want each candidate card to say how many runs it cost.",
    rubric: [["tests", "Tests prove behavior", 2], ["warroom", "Card legibility", 3], ["truth", "One count", 3]],
    steps: [
      launch("c1", 1, 102, id), launch("c2", 1, 202, id), launch("c3", 1, 302, id),
      finish("c1", 1, "6", 3, id), finish("c2", 1, "7", 5, id), finish("c3", 1, "8", 7, id),
      judgeL(1, ["A", "B", "C"], { A: "c2", B: "c3", C: "c1" }, 402),
      judgement(1, ["A", "B", "C"], [
        card("A", { journey: "fail" }, [["tests", 2, "counts asserted in one case"], ["warroom", 3, "count chip reads well"], ["truth", 3, "reads pick.runs"]]),
        card("B", { journey: "fail" }, [["tests", 3, "table of cases"], ["warroom", 3, "fine"], ["truth", 2, "second counter in app.js"]]),
        card("C", {}, [["tests", 1, "tests snapshot the HTML string"], ["warroom", 3, "fine"], ["truth", 4, "reads pick.runs"]]),
      ], "C"),
      judgeL(2, ["A", "B", "C"], { A: "c1", B: "c3", C: "c2" }, 403),
      judgement(2, ["A", "B", "C"], [
        card("A", {}, [["tests", 1, "same snapshot-only tests in the reversed pass"], ["warroom", 3, "fine"], ["truth", 4, "reads pick.runs"]]),
        card("B", {}, [["tests", 3, "table of cases"], ["warroom", 3, "fine"], ["truth", 2, "second counter in app.js"]]),
        card("C", { journey: "fail" }, [["tests", 2, "one case"], ["warroom", 3, "fine"], ["truth", 3, "reads pick.runs"]]),
      ], "A"),
      ...graft(502, 5, "9"), physical(602),
      verdict(1, 5, "9", "INCONCLUSIVE", "verifier-blocked", 1, ["control.sh launch: port 45920 already in use"], 0),
      fix(1, 502),
      verdict(2, 5, "a", "VERIFIED", "live-ui-verified", 4, ["Run counts visible on all three cards"], 1),
      confirm(5),
      lesson("Draft", "Physical agent opened a second, non-draft PR #6; closed it and kept #5."),
    ] });
}
// P3: walkover (c2 and c3 error twice and drop); the verifier is blocked again and the pick fails.
{
  const id = "p-20261013-01";
  pick(id, 13, { idea: "Show the pick timeline on the pick page", n: 3, approval: "auto", restatement: "You want the pick page to read like a game log.",
    rubric: [["facts", "Timeline facts", 3], ["warroom", "Log legibility", 3]],
    steps: [
      launch("c1", 1, 103, id), launch("c2", 1, 203, id), launch("c3", 1, 303, id),
      failC("c2", 1), failC("c3", 1),
      launch("c2", 2, 204, id), launch("c3", 2, 304, id),
      failC("c2", 2), failC("c3", 2), drop("c2"), drop("c3"),
      finish("c1", 1, "b", 8, id),
      physical(603, true),
      verdict(1, 8, "b", "INCONCLUSIVE", "verifier-blocked", 1, ["Chrome did not start in the verifier VM; no screenshot taken"], 0),
      failPick("verifier_blocked", "Chrome did not start twice"),
      lesson("Film Room", "Walkover skipped the judge, so nobody ran the pooled tests."),
    ] });
}
// P4: the judge was launched before the candidates finished, so its label map is empty (cards stay unresolved); two cards fail the tests gate; the physical finds a UI bug and its evidence carries markup.
{
  const id = "p-20261014-01";
  pick(id, 14, { idea: "Explain the Film Room base in one sentence", n: 3, approval: "ask", restatement: "You want one sentence that says why the base won.",
    rubric: [["selection", "Selection correctness", 3], ["warroom", "Scorecard legibility", 3], ["tests", "Tests prove behavior", 2]],
    steps: [
      judgeL(1, [], {}, 404),
      launch("c1", 1, 105, id), launch("c2", 1, 205, id), launch("c3", 1, 305, id),
      finish("c1", 1, "c", 5, id), finish("c2", 1, "d", 4, id), finish("c3", 1, "e", 6, id),
      judgement(1, ["A", "B", "C"], [
        card("A", { tests: "fail" }, [["selection", 3, "base sentence matches the calculator"], ["warroom", 1, "reason sentence cut off at 390 px"], ["tests", 2, "two cases"]]),
        card("B", { tests: "fail" }, [["selection", 2, "tie rule named wrong"], ["warroom", 3, "fine"], ["tests", 2, "two cases"]]),
        card("C", {}, [["selection", 4, "all pooled cases pass"], ["warroom", 3, "fine"], ["tests", 3, "table of cases"]]),
      ], "C"),
      ...graft(504, 11, "f"), physical(604),
      verdict(1, 11, "f", "NOT_VERIFIED", "live-ui-verified", 4, ["<img src=x onerror=alert(1)> rendered as text, but the swap chip overflowed at 390 px"], 0),
      fix(1, 504),
      verdict(2, 11, "0", "VERIFIED", "live-ui-verified", 4, ["Swap chip wraps at 390 px"], 1),
      confirm(11),
      lesson("film room", "Judge was launched before the candidates finished, so its label map was empty."),
    ] });
}
// P5: two candidates; a markup criterion id scores 0; the verifier crashes once; two one-off lessons (one is markup).
{
  const id = "p-20261015-01";
  pick(id, 15, { idea: "Group repeated judge findings", n: 2, approval: "ask", restatement: "You want the engine to notice repeated mistakes.",
    rubric: [["facts", "Gardener facts", 3], ["warroom", "Panel legibility", 2]],
    steps: [
      launch("c1", 1, 106, id), launch("c2", 1, 206, id),
      finish("c1", 1, "1", 3, id), finish("c2", 1, "2", 4, id),
      judgeL(1, ["A", "B"], { A: "c2", B: "c1" }, 405),
      judgement(1, ["A", "B"], [
        card("A", {}, [["facts", 3, "groups match"], ["<script>alert(1)</script>", 0, "<b>bold</b> evidence"]]),
        card("B", {}, [["facts", 2, "one group missing"], ["warroom", 3, "fine"]]),
      ], "A"),
      ...graft(505, 14, "3"), physical(605),
      verdict(1, 14, "3", "INCONCLUSIVE", "verifier-failed", 2, ["verifier crashed after 40 minutes"], 0),
      fix(1, 505),
      verdict(2, 14, "4", "VERIFIED", "live-ui-verified", 4, ["Gardener panel read at 390 px"], 1),
      confirm(14),
      lesson("xss", "<img src=x onerror=alert(1)>"),
      lesson("combine", "c2 needed npm ci before npm test."),
    ] });
}

writeFileSync(out, lines.join("\n") + "\n");
console.log(`${out}: ${lines.length} events`);
