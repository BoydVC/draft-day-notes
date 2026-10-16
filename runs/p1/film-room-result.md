# Draft Day Pick 1 Film Room result (SPEC 002) — PROVISIONAL, box read only

Status: written Sat Oct 17 2026 ~10:23 AM ET by a Grok Bot executor from REMOTE diffs (gh api compare vs dd/scaffold f51dae8; no clone, no code run).
No cloud judge pass ran (the executor has no CloudAgent tool), so: gates = as reported by each candidate (all pass), no pooled cross-tests (branch dd/p1-film-room-judge does not exist), and the calculator reports closeCall=true / needSecondPass=true.

## Base
- **c3 · War Room first** — branch `dd/p1-film-room-c`, head `efa65eba3cf207d7e67f2ced1697a913991109a0`
- Runner-ups: c2 (`dd/p1-film-room-b` @ 1443c73a708918e67060acca0ecc6b5a7161f060), c1 (`dd/p1-film-room-a` @ dcf8d7c9d6cd21dfe2647f1426e90ff69b97a86e)

## Calculator (tools/filmroom-calc.mjs SPEC-002-rubric.json runs/p1/judge-pass1.md --risks c1=0,c2=0,c3=0)
| cand | label (pass 1) | weighted | rank | diff |
|---|---|---|---|---|
| c3 | B | 3.07 | 1 | +1650 −227, 23 files |
| c2 | A | 2.93 | 2 | +1660 −238, 23 files |
| c1 | C | 2.57 | 3 | +1480 −190, 22 files |
closeCall: true (c3 vs c2 within 10%), swap: single, needSecondPass: true. Risk counts unknown (dd-report blocks not read); set to 0.
Tie-rule robustness: if a pass 2 flipped to c2, tie rule picks c3 anyway (1877 vs 1898 diff lines). Only a pass-2 win by c1 would change the base (c1 has the smallest diff).

## Scores (0-4; weights selection 3, boundaries 3, validation 2, warroom 3, tests 2, blast 1)
| criterion | c1 minimal reducer | c2 rubric engine | c3 War Room first |
|---|---|---|---|
| selection ×3 | 3 | 3 | 3 |
| boundaries ×3 | 2 (F2 label/rubric checks live in src/cli/dd.ts) | 4 (one filmroom.ts, ranker+tie registries, all F2 in parseJudgement ctx) | 3 (one filmroom.ts; hand-coded tie branches; separate validateJudgementContext) |
| validation ×2 | 3 | 3 | 3 |
| warroom ×3 | 2 (table scrolls sideways at 390 px) | 2 (table in scroll container) | 3 (column cards, 1-col stack ≤480 px, aria-label per column, base banner) |
| tests ×2 | 3 (36) | 3 (36, table-driven F2) | 4 (39, F9 one test per tie key) |
| blast ×1 | 3 (smallest; drops selftest DATA_DIR line) | 2 | 2 |
Selection capped at 3 for all: pooled cross-tests were not run. Evidence per cell is in runs/p1/judge-pass1.md.

## Trades (max 2 per runner-up, none from the base)
1. **from c2** — table-driven tie-rule keys: port `TIE_KEYS` + `compareTie` + `separate` (dd/p1-film-room-b `src/core/filmroom.ts:59-119`) to replace c3's hand-coded `tieCall` (c3 `src/core/filmroom.ts:67-101`), keeping c3's `TieCall.detail` text output. Why: the spec's tie rule as one ordered list; removes four near-duplicate branches.
2. **from c2** — table-driven F2 bad-judgement cases (dd/p1-film-room-b `test/film-room.test.ts:265-274`), merged into c3's F2 test without dropping any of c3's cases. Why: one row per F2 clause, auditable against the spec.
3. **from c1** — extra close-scenario selftest assertions (`deciding === "diff_lines"`, pass 2 `reversed === true`, `closeCall === true`) from dd/p1-film-room-a `src/cli/dd.ts:577-590`, added to c3's close block. Why: proves more of F16 at no cost.
Rejected: c2's whole registry ranker (architecture swap, not a trade); c1's CLI-side validation (wrong layer); c1's removal of the selftest DATA_DIR line (unrelated churn).

## Per-candidate rationale
- **c1 minimal reducer**: keep the tight score.ts math and the stronger selftest checks; reject the CLI-resident F2 checks and the sideways-scrolling phone table.
- **c2 rubric engine**: keep the tie-key registry and table-driven F2 tests; cleanest boundaries; reject nothing structural, but its phone view still scrolls and its diff is the largest.
- **c3 War Room first**: best phone Scorecard (no sideways scroll), most tests incl. one per tie key, launchGraft startingRef from the base's reported branch, reducer keeps secondRead null when absent. Base.

## Grok Bot second read
This document IS the box read; there is no independent judge to agree/disagree with yet. Recommend a cloud judge pass (LAUNCH-002 §2, pass-1 map) before or alongside the graft if strict process is wanted.
