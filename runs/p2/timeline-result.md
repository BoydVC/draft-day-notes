# Draft Day Pick 2 Timeline Film Room result (SPEC 003): PROVISIONAL, box read only

Status: written Sat Oct 17 2026 ~10:46 AM ET by a Grok Bot executor from REMOTE diffs (gh api compare + contents vs dd/scaffold f51dae8; no clone, no code run).
No cloud judge ran, so: gates = as reported by each candidate (all pass, 37 tests each); no pooled cross-tests (branch `dd/p2-timeline-judge` does not exist); `facts` capped at 3 for everyone; risk counts set to 0 (dd-report blocks not on the box). Calculator says closeCall=true / needSecondPass=true.

## Base
- **c3 · Snapshot story**: branch `dd/p2-timeline-c`, head `60ec8816356aab2cdcce758f5b869467b071cecb`
- Runner-ups: c1 (`dd/p2-timeline-a` @ `66231601abab2a1b3ba2ccb430a8949b6ae67210`), c2 (`dd/p2-timeline-b` @ `d4af42ba3cee0a54cc9a7969616d05f58c250531`)
- All three start from dd/scaffold f51dae8 (ahead 2, behind 0).

## Calculator (node tools/filmroom-calc.mjs SPEC-003-rubric.json runs/p2/judge-pass1.md --risks c1=0,c2=0,c3=0)
| cand | label (pass 1) | weighted | rank | diff |
|---|---|---|---|---|
| c3 | B | 3.13 | 1 | +1683 −40, 16 files |
| c1 | A | 2.93 | 2 | +1530 −40, 16 files |
| c2 | C | 2.87 | 3 | +1810 −40, 16 files |
closeCall: true (c3 vs c1 within 10%, 6.4%), swap: single, needSecondPass: true. The reversed pass 2 (A=c2, B=c3, C=c1) did not run.
Tie-rule robustness: unlike Pick 1, a pass-2 flip to **c1 would change the base** (tie rule = fewer diff lines: c1 1570 < c3 1723). A flip to c2 would not (c3 1723 < c2 1850).

## Scores (0-4; weights facts 3, truth 3, warroom 3, safety 2, tests 2, stack 2; total 15)
| criterion | c1 registry fold | c2 spans first | c3 snapshot story |
|---|---|---|---|
| facts ×3 | 3 | 3 | 3 (unknown verdict → `finished`, :180-185) |
| truth ×3 | 3 (UI hard-codes terminal stage names, timeline.js:15) | 3 (hand-kept OPENERS :100-106; timeout endedAt from first report ts, not reduce().reportAt, :602-610) | 3 (runs open on reduce().runs rise; no compile-time exhaustiveness, :484-485) |
| warroom ×3 | 2 (minimal lists, nothing highlights slowest run) | 3 (run-bar strip; but role=list div with h3 children) | 3 (sentences, pills, scoped headers; duplicate global `el`) |
| safety ×2 | 3 | 3 | 3 |
| tests ×2 | 3 | 3 | 4 (T8 covers every T5/T6 case + selftest, as specced) |
| stack ×2 | 4 (smallest, placement chosen to dodge Pick 1 hunks) | 2 (largest) | 3 |
Evidence per cell (file:line on each candidate branch) is in runs/p2/judge-pass1.md. Screenshots and hostile journeys were not opened/re-run by me.

## Trades (max 2 per runner-up, none from the base)
1. **from c1**: unknown/missing physical verdict closes the run as `inconclusive`, not `finished`. Port the fallback from dd/p2-timeline-a `src/core/timeline.ts:189-195` into c3's `verdictOutcome` (c3 `src/core/timeline.ts:180-185`). Why: outcomes stay inside the pairing table's set for physical/fix.
2. **from c1**: "judge named" fallback for a `judgement_recorded` with no `pass`: resolve the label through the closed judge run's pass (dd/p2-timeline-a `src/core/timeline.ts:179-187`, used at `:420-425`). In c3, `namedJudge` (c3 `src/core/timeline.ts:333-343`, called at `:430` and `:650`) gives up when `pass` is absent; pass it the closed run (c3 already knows `closed`) so T5(c)-style judgements still name the cand. Add one assertion to the existing T10 or T5 test.
3. **from c2**: exhaustive title switch. Replace c3's plain `default:` (c3 `src/core/timeline.ts:484-485`) with a `never`-typed default as in dd/p2-timeline-b `src/core/timeline.ts:546-549`, keeping c3's runtime `isEventType` guard (`:371`) for strings outside EVENT_TYPES. Why: adding a member to EVENT_TYPES must fail `npx tsc --noEmit` (rubric `truth`).
4. **from c2**: stop redeclaring a global `el` in `src/ui/timeline.js` (c3 `:1-12`). Take app.js's `el` as a parameter like dd/p2-timeline-b (`src/ui/timeline.js:55`, call site `src/ui/app.js:166` `renderDecisionLog(pick, el)`), i.e. `globalThis.draftDayTimeline(pick.timeline, el)` in the one allowed `const log = …` statement. Why: two global `function el` declarations silently shadow each other.
Rejected: c2's run-bar strip and extra StageSpan fields (a feature, +~250 lines, not a trade); c1's whole RULES registry (architecture swap); c2's role=list/h3 event structure; c2's first-report timeout derivation.

## Per-candidate rationale
- **c1 registry fold**: tightest diff, compile-checked rule table, careful stack placement; UI is bare and re-hard-codes terminal stage names.
- **c2 spans first**: one `measure()` helper and core-computed run bars make the slowest run obvious; largest diff, a hand-kept opener list and a second timeout derivation.
- **c3 snapshot story**: run openings and title facts come from replayed reducer snapshots (cannot drift from `reduce().runs`), best-specified T8, readable phone layout. Base.

## Stack
- `dd/p1-film-room` exists (draft PR #2, base dd/scaffold, head ecec54cd at read time; the Pick 1 grafter may still push).
- Files shared with Pick 1 for every candidate: features/README.md, docs/DECISIONS.tsv, src/cli/dd.ts, src/core/index.ts, src/server/http.ts, src/ui/app.js. Candidates report the only textual conflict is docs/DECISIONS.tsv (keep both appended blocks). Not re-probed here (needs a clone).

## Grok Bot second read
This document IS the box read; no independent judge exists to agree or disagree with. Because this is a close call and a pass-2 flip to c1 would change the base, a cloud judge pass (LAUNCH-003 §2, writes dd/p2-timeline-judge) before the graft is the strict-process option.
