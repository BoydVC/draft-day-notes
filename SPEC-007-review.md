# SPEC 007 adversarial review (Pick 6, Scouting Report linter)

Reviewed Sun Oct 18, 2026, ~9:35–9:50 AM ET against `SPEC-007-scouting-linter.md`, the box oracle `tools/linter-check.mjs`, the fixture harness `fixtures/linter/linter-harness.mjs`, and the START mirror `runs/p6/start` (`d1bd73c`, read remotely, never cloned). Each finding was attacked as a candidate, a judge or a grafter would. Findings marked **fixed** were applied to the spec or harness, and the copies were regenerated with `./tools/make-copies.sh` (`ok`: candidate 232, judge 247, full 257).

## Gradeability (every line has a test or a journey)
| Check | Result |
|---|---|
| S1–S15 each name a `test/linter.test.ts` test (or parse/CLI/API/DOM assertion) | ok |
| S16 and S18 name journeys in `features/linter.md` | ok |
| S17 names full `npm test` plus VERIFY 3, 5 and 9 | ok |
| Every baseline was measured: START has no fixtures (oracle exits 2 / 0 found); fixtures oracle **14/14** (`runs/p6/oracle-fixtures.txt`) | ok |
| The oracle discriminates: empty howToGrade, identical angles, and collide 0.75 each fail at least one check | ok |
| Rubric ids and weights equal `SPEC-007-rubric.json`; weights total 15; pass2 is pass1 reversed (A=c1,B=c2,C=c3 → A=c3,B=c2,C=c1) | ok |

## Findings
1. **`ARENA ANGLES` leak false positive (fixed).** The judge leak regex used the bare phrase `ARENA ANGLES`, which case-insensitively matched "arena angles" in the intro. Intro now says "three candidate angles"; judge leak term is `## ARENA ANGLES`.
2. **Scale detector order trap (fixed in harness).** An early `hasScale` required `0` before `4` in the text, so "4 = … 0 = …" soft-warned every good criterion. Now accepts `[0-4] =`, `0-4`, or `Score`.
3. **`git diff` / touch-map pointers (fixed in harness).** Stack criteria that only named `git diff` / `touch map` were hard-failing. Those are valid evidence pointers for the stack criterion.
4. **Optional `checks` must not break old picks (baked in).** `parseScoutingReport` stays success without `checks`; missing bindings are a linter hard fail, not a parse fail. S9 locks this.
5. **W19 lesson from P4/P5 (baked in).** Touch map pre-declares grafter-only paths: `docs/SPEC-007-scouting-linter.md`, `test/linter.pooled.test.ts`, replacement `docs/screens/p6-linter/*.png`. VERIFY 9 accepts them.
6. **W8 at 1280 (baked in).** S16 requires ≥44×44 Linter controls and links at every width, 1280 included. Pre-existing Big Board / pick-page 1280 W8 problems stay out of scope.
7. **Screenshots committed (baked in).** Eight PNGs under `docs/screens/p6-linter/` listed in `dd-report`; artifact-only proof is not enough.
8. **Angles are distinct (checked).** c1 starts from a rule registry and minimal surface; c2 from the War Room checklist look; c3 from EARS×checks and angle-pair matrices. All three must meet the same binding DOM and `expected.json`, so pooled tests stay comparable. Angle words do not appear in candidate or judge copies (`make-copies` ok).
9. **Hostile markup is structurally `pass` (accepted, disclosed).** `hostile-markup.json` proves the UI/safety path, not the lint rule. S13 and the safety rubric force text-only rendering.
10. **Jaccard threshold 0.45 (accepted).** Collide fixture measures 0.75; good-replay pairs measure 0. Named constant `COLLISION_JACCARD` must stay 0.45 unless a DECISIONS row says otherwise (angles rubric).
11. **`dd/p5-replay` could move (accepted).** LAUNCH-007 §0 re-checks the head (`d1bd73c` at write time). VERIFY 8 runs a merge-tree against a moved head.
12. **No box reference product build (accepted).** Unlike Pick 5, this pack proves the lint rule with the harness/oracle alone (14/14). A full War Room ref panel is left to candidates; the START baseline is "no linter exists" (0 fixtures).

## Not changed (considered and rejected)
- **Requiring `checks` at parse time.** Rejected: would invalidate every existing pick report in the stack.
- **Auto-blocking Combine on `ok: false`.** Rejected: SCOPE says report only; a later pick may gate.
- **Serving lint from a new event type.** Rejected: pure function over the current report is enough.
