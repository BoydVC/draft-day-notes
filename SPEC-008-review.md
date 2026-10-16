# SPEC 008 adversarial review (Pick 7, Big Board stats)

Reviewed Sun Oct 18, 2026, ~1:30–2:00 PM ET against `SPEC-008-big-board.md`, the box oracle `tools/bigboard-calc.mjs`, the harness `fixtures/bigboard/bigboard-harness.mjs`, and the START mirror `runs/p7/start` (`dc38660`, read remotely with `gh api`, never cloned). Each finding was attacked as a candidate, a judge or a grafter would. Findings marked **fixed** were applied to the spec, fixtures or tools, and the copies were regenerated with `./tools/make-copies.sh` (`ok`: candidate 227, judge 242, full 252).

## Gradeability (every line has a test or a journey)
| Check | Result |
|---|---|
| B1–B16 each name a `test/bigboard.test.ts` test (or a CLI/API/DOM assertion) | ok |
| B17 and B19 name journeys in `features/big-board-stats.md` | ok |
| B18 names full `npm test` plus VERIFY 3, 5 and 9 | ok |
| Baselines measured: START has no fixtures (oracle exits 2, `runs/p7/oracle-start.txt`); fixtures oracle **15/15** (`runs/p7/oracle-fixtures.txt`) | ok |
| The harness is independent of `src/` and agrees with the engine's own `reduce()` + `timeline()` on all five rows (`bun tools/bigboard-engine-ref.ts` → 5/5, `runs/p7/engine-crosscheck.txt`) | ok |
| The oracle discriminates: dropping Pick 6's verdict, failing a Pick 4 gate, and slowing Pick 5's judge by 30 min each change the projection | ok |
| Rubric ids and weights equal `SPEC-008-rubric.json`; weights total 15; pass 2 is pass 1 reversed (A=c2,B=c3,C=c1 → A=c1,B=c3,C=c2) | ok |

## Findings
1. **Real season, not toy data (baked in).** Picks 5 and 6 had no `dd` log because they were driven by hand. They were rebuilt with `tools/real-pick-gen.ts` (now `DD_ROOT`-aware) through the repo's own `commitPick` and `parse*` at `dc38660`, from the agents' own dd-report / dd-judgement / dd-verdict blocks (physical verdicts pulled from the transcript dumps of `bc-255d016c` and `bc-dc1b7aca`). Times come from LOG.tsv, not transcript tool stamps (no per-line times in dumps); same-second rows are spaced 1–10 s apart in log order. Disclosed in the fixture README.
2. **Closed-list wiring tests (fixed before launch; Pick 6 R15 lesson).** Adding `bigboard.css`/`bigboard.js` breaks exactly seven lines at START: `test/replay.test.ts:369,371`, `test/replay.pooled.test.ts:587-588`, `test/linter.test.ts:416-417`, `test/linter.pooled.test.ts:618` (verified by grep on the mirror). They are pre-declared sanctioned candidate edits with exact replacement text, so no ruling is needed mid-run and no candidate is penalized for doing the right thing. Entity-encoded tags are named as wrong.
3. **Selftest picks would poison the journey (fixed).** `control.sh launch` seeds four `selftest` picks dated the run day, which would move every number on screen. Stats exclude `pick_created.source == "selftest"` and show the count (`excluded.selftest`). `seed-bigboard` checks the exact league summary with `excluded.selftest` 4.
4. **Seeds that append (fixed).** `seed-lessons` appends to `events.jsonl`, and `seed-timeline` writes `p-20261010-07`, which is also in the league. `seed-bigboard` replaces each league pick's file instead of appending, and tells the driver to `cleanup` + `launch` when other seeds (`seed-replay`'s `p-…-99`, `seed-linter`'s picks) have added extra picks.
5. **Engine base vs judge base (decided).** A "win" is `reduce().judgement.base` (the Film Room's computed base, which is what got grafted), not the judge's advisory `base`. The harness re-implements the Film Room selection only to stay independent; the cross-check proves it agrees on every fixture pick.
6. **Walkovers are not wins (decided, disclosed).** A walkover has no Film Room, so it is counted as `walkovers`, never as an entry. `simplest thing that passes` shows 2/4 (+1 walkover).
7. **"First try" is the first recorded verdict (decided, disclosed).** Pick 4's NOT_VERIFIED was a touch-map re-check, not a fix loop, but the engine recorded it as a verdict, so it is not a first-try pass. B5 says so. This is the honest reading of the log.
8. **A drafted pick with no judgement (kept).** `p-20261014-01` (lessons week) has a graft but no valid Film Room; it is a trade row with `base: null` and 0 trades. B4 locks this edge.
9. **Live picks and the clock (fixed).** Only terminal picks contribute stage time, so expected values do not move with `now` (the live copy `p-20261017-97` contributes none). `now` is fixed in `expected.json` anyway.
10. **Median and rounding (baked in).** Even counts take the floor of the mean of the two middle values; rates round to 3 places, the trade mean to 2. Both are named helpers; the rubric caps a different rule at 1.
11. **dom-harness cannot serve `/api/stats` (fixed).** Pick 4's harness answers 404 for unknown APIs and is do-not-touch. B13 paints `draftDayBigBoard` in a `vm` sandbox (the lessons-test pattern) and asks the routed view to show a readable error with a `Big Board` link on 404, which is also correct product behavior.
12. **W8 at 1280 (baked in).** The new `Stats` link and every stats control must be ≥44×44 at every width; the 11 pre-existing 1280 problems stay out of scope but must not grow.
13. **Binding DOM allows tables (fixed).** The first draft bound `ul`/`li`, which would have forced the table angle to break the contract. Containers are now bound by `aria-label` and rows by `data-*` attributes, so lists and tables both satisfy the pooled test.
14. **Hostile angle names (accepted).** `javascript:alert(2)` becomes the angle name `javascript`, and markup survives into keys and `data-angle` values. That is fine because everything is set as text or via `setAttribute`; B14 and the safety fact prove it. `href`s are only `#/`, `#/stats…` or a valid pick id.
15. **Angles are distinct (checked).** c1 starts from the metric registry with a plain panel; c2 from the phone read with headline tiles; c3 from accessible tables that reflow on a phone. All three must meet the same binding DOM and `expected.json`, so pooled tests stay comparable. Angle words do not appear in candidate or judge copies (`make-copies` ok, including `stadium`/`ballpark`).
16. **`dd/p6-linter` could move (accepted).** LAUNCH-008 §0 re-checks the head (`dc38660` at write time). VERIFY 8 runs a merge-tree against a moved head.

## Not changed (considered and rejected)
- **A `source` filter parameter.** Rejected: one fixed exclusion (`selftest`) is enough and keeps one way to count.
- **Caching stats on disk or a `stats_recorded` event.** Rejected: stats are folds over events; nothing new is written.
- **Exporting the gardener's `consider` from `lessons.ts`.** Rejected: lessons.ts is do-not-touch; the four skip reasons are restated in `bigboard.ts` and pinned by B8.
- **SVG or canvas charts.** Rejected: hostile text and off-origin risk with no gain; bars, if any, are CSS or `<meter>`.
