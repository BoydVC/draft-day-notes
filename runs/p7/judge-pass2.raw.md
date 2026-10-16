All three labels pass the hard gates and the same 16 pooled checks. A and C tie on the weighted mean (4.00). A is the advisory base because its diff is smaller (3015 added, 11 removed versus 3080 and 11). B is 3.87.

```dd-judgement
{"passes":[{"order":["A","C","B"],"cards":[{"label":"A","gates":{"build":"pass","tests":"pass","journey":"pass"},"crossTests":{"passed":16,"total":16},"diff":{"files":34,"added":3015,"removed":11},"scores":[{"criterionId":"numbers","score":4,"evidence":"node --test test/bigboard.pooled.test.ts: B1-B9 pass. B2 deepEquals expectedFor for season, league, league-oct17, league-week, hostile. B9 asserts each of drop-verdict, fail-gate, and slow-judge changes the projection."},{"criterionId":"engine","score":4,"evidence":"B10 pass. src/core/bigboard.ts admit() calls reduce() once per counted log and stores timeline().stages. Status, base, trades, verdicts, and fixLoops are read off that Pick. dd.ts:461 and http.ts:275 call lessonWindow. Skip reasons are restated; lessons.ts consider is not exported."},{"criterionId":"screen","score":4,"evidence":"Eight cdp-shot runs, all ok true, offOrigin [], scrollWidth equal to the viewport (390, 430, or 1280). Empty #/stats?until=2026-10-01 reads No picks yet. W8 did not fire at 1280, so every control and link is at least 44x44."},{"criterionId":"glance","score":4,"evidence":"Viewport shot stats-390-dark.png is 1170x2532. Above the fold: summary 13 picks · 9 drafted · verified 9/10 (2 first try) · 10 trades grafted, kind registry 1/1 100% at the top of the angle list, trades mean 1.11, first try 2/10, and simplest thing that passes 2/4 50% (+1 walkover)."},{"criterionId":"safety","score":4,"evidence":"B14 pass: hostile angles, idea, lesson, graft summary, javascript:alert(1), and pickId p-20261018-77\"><img src=x stay text; no img/script/iframe/svg/on*; no poisoned href. rg of src/ui/bigboard.js and bigboard.css: no hits. Probe offOrigin []."},{"criterionId":"stack","score":4,"evidence":"git diff --name-only START...label is 34 touch-map paths. Closed-list diff is the seven sanctioned lines; phone.test.ts is the two W5 lines. http.ts is the import, GET /api/stats, and the files line. package.json and guards.test.ts are quiet. Ancestor holds. START_REF unchanged. Smallest added+removed of the three (3026)."}]},{"label":"C","gates":{"build":"pass","tests":"pass","journey":"pass"},"crossTests":{"passed":16,"total":16},"diff":{"files":34,"added":3080,"removed":11},"scores":[{"criterionId":"numbers","score":4,"evidence":"Same pooled file: B1-B9 pass, including expectedFor on all five rows and the three mutations."},{"criterionId":"engine","score":4,"evidence":"B10 pass. src/core/bigboard.ts:183 reduce() and :222 timeline() supply status, wins, trades, verdicts, and stage spans. lessonWindow at dd.ts and http.ts. No second reducer."},{"criterionId":"screen","score":4,"evidence":"Eight probes ok true, offOrigin [], scrollWidth 390/430/1280 matching the width. Empty state reads No picks yet. No W8 at 1280."},{"criterionId":"glance","score":4,"evidence":"390 dark viewport shows the summary, a Best angle tile (kind registry 1/1 100%), Trades per pick 1.11, First-try verify 20% (2/10), and +1 walkover on simplest thing that passes, separate from the 2/4."},{"criterionId":"safety","score":4,"evidence":"B14 pass on the same hostile-plus-poison paint. rg of src/ui/bigboard.js and bigboard.css: no hits. Probe offOrigin []."},{"criterionId":"stack","score":4,"evidence":"Same 34 touch-map paths and the same seven closed-list lines plus two W5 lines. http.ts matches A. Ancestor holds. START_REF unchanged. added+removed 3091, 65 lines over A, still a clean stack."}]},{"label":"B","gates":{"build":"pass","tests":"pass","journey":"pass"},"crossTests":{"passed":16,"total":16},"diff":{"files":34,"added":3326,"removed":11},"scores":[{"criterionId":"numbers","score":4,"evidence":"Same pooled file: B1-B9 pass, five rows match expectedFor, three mutations move."},{"criterionId":"engine","score":4,"evidence":"B10 pass. src/core/bigboard.ts:213 reduce() and :241 timeline() are the only pick and stage sources. lessonWindow at the CLI and GET /api/stats. clockText in bigboard.js only formats a total; median cells use medianText."},{"criterionId":"screen","score":4,"evidence":"Eight probes ok true, offOrigin [], scrollWidth equal to width, including both 1280 runs. Empty state reads No picks yet. No control under 44x44."},{"criterionId":"glance","score":4,"evidence":"390 dark viewport shows the summary, angle rows with kind registry and frame engine at 100%, a Walkovers column (1, not a win), trades mean 1.11, and first try 2/10."},{"criterionId":"safety","score":4,"evidence":"B14 pass, including the poisoned skipped row and trade row. rg of src/ui/bigboard.js and bigboard.css: no hits. Probe offOrigin []."},{"criterionId":"stack","score":3,"evidence":"Touch map, closed-list lines, phone W5, http.ts, ancestor, and START_REF all match A and C. added+removed is 3337, 311 lines over A (tables, chips, tests, a longer seed case). Clean, not as small."}]}],"base":"A","runnerUps":["C","B"],"trades":[{"from":"C","what":"headline tiles","pointers":["src/ui/bigboard.js:42-65"],"why":"Best angle, trades per pick, and first-try verify sit in three tiles under the summary, which is the five-second read Boyd asked for."},{"from":"C","what":"stats text leads with the three answers","pointers":["src/core/bigboard.ts:282-287"],"why":"dd stats prints best angle, trades per pick, and first try on the lines after the summary."},{"from":"B","what":"pick-status chips","pointers":["src/ui/bigboard.js:134-139"],"why":"Drafted, failed, cancelled, and live are on the page. The summary sentence only carries the drafted count."},{"from":"B","what":"walkovers column","pointers":["src/ui/bigboard.js:34-39","src/ui/bigboard.js:67"],"why":"Walkovers are a column next to wins and entries, so a walkover cannot be read as a win."}],"swapConsistent":null}
```

## Rationale

Weighted mean uses weights 3, 3, 3, 2, 2, 2. A and C are 4.00. B is 58/15 = 3.87. Pooled pass rate is 16/16 for every label, so all three stay in contention. The advisory base is A. C has the same mean. A’s non-binary diff is 3026 lines against C’s 3091 and B’s 3337. `swapConsistent` is null: this is one pass, scored from scratch.

`numbers` and `engine` are 4 because the pooled file compares `bigBoardStats` to `expectedFor` and to `bigBoardOracle`, then checks the three mutations and pick-by-pick `reduce` / `timeline` agreement. Each core file folds the `Pick` from `reduce()` and the closed spans from `timeline().stages`. `lessonWindow` validates `dd stats` and `GET /api/stats`. The four skip reasons are restated in `bigboard.ts` because `consider` is not exported.

`screen` is 4 because every probe was clean, including both 1280 widths, and the empty hash reads `No picks yet`. `glance` is 4 from the 390×844 dark viewport shots (1170×2532 pixels, so this is the first screen, not a full-page capture). `safety` is 4 from B14 plus a source grep and empty `offOrigin` lists.

`stack` stays at 4 for A and C. The name-only diff is the same 34 paths, all on the touch map. The four closed-list files change only on the seven sanctioned lines, and `test/phone.test.ts` only on the two W5 lines. `package.json` and `test/guards.test.ts` are unchanged. B is a 3 for the extra 311 lines.

## Hard gates

Recorded before the pooled file was copied. `npx tsc --noEmit` exit 0. `npm test` exit 0, 302 passed, 0 failed. Journey: verify launch, `seed-bigboard` printed `seeded bigboard`, and `#/stats` at 390×844 dark printed `"ok":true` with `scrollWidth` 390. Screenshot saved.

## Pooled

`test/bigboard.pooled.test.ts` from the judge commit, byte-identical in each worktree (sha256 `f5287ed32ae39c83b47c557d8dc6bde852e77bde0b8b4c7c96e136695c018219`). B1 through B16 passed. 16/16 for A, B, and C.

## Probe lines

Each line is `ok`, `scrollWidth`, `problems`, `offOrigin`.

Label A

- stats-390-dark: true, 390, [], []
- stats-430-dark: true, 430, [], []
- stats-390-light: true, 390, [], []
- stats-1280-light: true, 1280, [], []
- stats-1280-dark: true, 1280, [], []
- stats-window-390-dark (`#/stats?since=2026-10-17`): true, 390, [], []
- stats-empty-390-dark (`#/stats?until=2026-10-01`): true, 390, [], []
- board-stats-link-390-dark (`#/`): true, 390, [], []

Label B: the same eight results (true, width, [], []).

Label C: the same eight results (true, width, [], []).

The 390 dark and 1280 light shots were read. Window shots show a summary that starts `6 picks`. Empty shots read `No picks yet` and note 4 selftest picks not counted. The Big Board shots show a `Stats` link to `#/stats`.

## Stack probe

```
git merge-base --is-ancestor dc38660f2f3fdaadcfd2e879693e24cb21a05eba <label> && echo on-stack
A on-stack
B on-stack
C on-stack

git fetch origin dd/p6-linter && git rev-parse FETCH_HEAD
dc38660f2f3fdaadcfd2e879693e24cb21a05eba
START_REF unchanged
```
