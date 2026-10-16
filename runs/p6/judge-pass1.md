Base is **A**. All three gates pass. Pooled rates are 15/15, 15/15, and 14/15, so all three stay contenders. Weighted means are 4.000, 3.600, and 3.733.

```dd-judgement
{"passes":[{"order":["A","B","C"],"cards":[{"label":"A","gates":{"build":"pass","tests":"pass","journey":"pass"},"crossTests":{"passed":15,"total":15},"diff":{"files":37,"added":2566,"removed":3},"scores":[{"criterionId":"lint","score":4,"evidence":"node --test test/linter.pooled.test.ts: S1–S8 pass. src/core/linter.ts:7 COLLISION_JACCARD = 0.45. S8 clears frames howToGrade and sets identical angles; both flip ok false."},{"criterionId":"ears","score":4,"evidence":"S3 and S9 pass. hostile-missing-ears leaves R1 ok and marks R2, R5, R14, R19, R20 MISSING. src/core/linter.ts:9 CHECK_RE matches the harness. Shortening howToGrade adds a soft and does not clear MISSING. parseScoutingReport without checks succeeds; a string map attaches."},{"criterionId":"angles","score":4,"evidence":"S4 pass: pair 0-1 score 0.75 collide true, no other collide. S1 good-replay pairs collide false. S8 identical-angle mutation hard-fails with the harness score."},{"criterionId":"screen","score":4,"evidence":"cdp-shot 8 states plus pick at 390 dark: ok true, scrollWidth 390 or 1280, problems [], offOrigin []. Fail 390 dark shows fail · 5 hard and MISSING on R2, R5, R14, R19, R20. Pass 1280 light shows pass with three columns. src/ui/linter.css:75-76 min 48px. Pick 390 dark shows the Lint link."},{"criterionId":"safety","score":4,"evidence":"S13 pass. git grep innerHTML|outerHTML|insertAdjacentHTML|document.write|eval(|new Function|localStorage|sessionStorage|document.cookie|history.|@import|url(http|//fonts on src/ui/linter.js and linter.css: none. Journey and every screen probe offOrigin []."},{"criterionId":"stack","score":4,"evidence":"git diff --name-only START...sha stays in the touch map. http.ts diff is the files line plus POST /api/lint-scout. types.ts adds optional checks only. phone.test.ts is the two-line W5 hunk. package.json has no dependencies. Replay tests are identical to START. R15 pair left red: known spec conflict. git merge-base --is-ancestor START sha && echo on-stack. git fetch origin dd/p5-replay: START_REF unchanged."}]},{"label":"B","gates":{"build":"pass","tests":"pass","journey":"pass"},"crossTests":{"passed":15,"total":15},"diff":{"files":39,"added":2486,"removed":19},"scores":[{"criterionId":"lint","score":4,"evidence":"Same pooled file: S1–S8 pass. src/core/linter.ts:48 COLLISION_JACCARD = 0.45. S8 mutations flip ok false."},{"criterionId":"ears","score":4,"evidence":"S3 and S9 pass. src/core/linter.ts:50 CHECK_RE matches the harness. Missing ears stay MISSING when a howToGrade is shortened."},{"criterionId":"angles","score":4,"evidence":"S4 pass: 0-1 score 0.75 collide true. S8 identical angles hard-fail. Good-replay pairs do not collide."},{"criterionId":"screen","score":4,"evidence":"cdp-shot 8 states plus pick: ok true, scrollWidth equals width, problems [], offOrigin []. Fail 390 dark shows fail · 5 hard and MISSING R2, R5, R14, R19, R20. Pass 1280 light shows pass in three columns (linter.css:191-200). Pick 390 dark shows Lint."},{"criterionId":"safety","score":4,"evidence":"S13 pass. linter.js:11 appends text nodes. git grep of the banned innerHTML/storage/history/@import tokens on src/ui/linter.js and linter.css: none. offOrigin [] on every probe."},{"criterionId":"stack","score":1,"evidence":"git diff --name-only includes test/replay.test.ts and test/replay.pooled.test.ts. Those files are do-not-touch at candidate time. The hunk is only the R15 deepEqual lists (replay.test.ts:369-372, replay.pooled.test.ts:587-588). Ruling caps stack at 1. Otherwise on-stack, START_REF unchanged, no runtime dependencies."}]},{"label":"C","gates":{"build":"pass","tests":"pass","journey":"pass"},"crossTests":{"passed":14,"total":15},"diff":{"files":37,"added":2473,"removed":15},"scores":[{"criterionId":"lint","score":4,"evidence":"S1–S8 pass. src/core/linter.ts:3 COLLISION_JACCARD = 0.45. S8 mutations flip ok false. S7 matches expected.json."},{"criterionId":"ears","score":4,"evidence":"S3 and S9 pass. src/core/linter.ts:5 CHECK_RE matches the harness. R2, R5, R14, R19, R20 MISSING; a short howToGrade does not clear them."},{"criterionId":"angles","score":4,"evidence":"S4 pass: pair 0-1 score 0.75 collide true. S8 identical-angle mutation hard-fails."},{"criterionId":"screen","score":4,"evidence":"cdp-shot 8 states plus pick: ok true, scrollWidth equals width, problems [], offOrigin []. Fail 390 dark shows fail · 5 hard and MISSING R2, R5, R14, R19, R20. Pass 1280 light shows pass in three columns (linter.css:156-157). Pick 390 dark shows Lint. The browser decoded the tags; the probes still paint the panel."},{"criterionId":"safety","score":4,"evidence":"S13 pass: no img/script/iframe, no on* attributes, hostile strings stay text. git grep of the banned tokens on src/ui/linter.js and linter.css: none. offOrigin []."},{"criterionId":"stack","score":2,"evidence":"name-only is inside the touch map and replay tests are untouched, so the do-not-touch cap does not apply. index.html:14 href=\"&#47;linter.css\" and index.html:26 src=\"&#47;linter.js\". Pooled S15 fails: the literal sheet after replay.css is undefined. Ruling: entity-encoded tags count as S15 not met for stack. http.ts files line is literal. on-stack. START_REF unchanged. No runtime dependencies."}]}]}],"base":"A","runnerUps":["C","B"],"trades":[{"from":"B","what":"R15 expected lists append linter.css and linter.js","pointers":["test/replay.test.ts:369-372","test/replay.pooled.test.ts:587-588"],"why":"The grafter is sanctioned to make npm test fully green with only those two list appends. At candidate time the same edit is why stack is capped."}],"swapConsistent":null}
```

**A.** Build `npx tsc --noEmit` exit 0. Own `npm test` exit 1 with pass 269, fail 2, and the only failures are `not ok 133` and `not ok 151`, both `R15 wiring`. The assertion diff is the closed stylesheet list plus `linter.css`. `index.html:14` and `index.html:26` are the literal tags, and `git diff` of the two replay test files against START is empty. That is the known spec conflict, so the tests gate passes and stack stays 4. Journey shot `p6-judge-A.png` is ok with scrollWidth 390.

**B.** Build exit 0. Own `npm test` exit 0, 271 pass. Journey shot `p6-judge-B.png` is ok with scrollWidth 390. Lint, ears, angles, screen, and safety match A. Stack is 1 because the two do-not-touch replay files were edited. The edit is the grafter trade above and nothing else in those files.

**C.** Build exit 0. Own `npm test` exit 0, 271 pass, because the R15 regex does not see the entity-encoded tags. That is a gate pass, not a stack pass. Pooled S15 is the one failure (14/15). The live panel still renders, so screen and safety stay 4. Stack is 2: the files array is literal, the tags are not.

Probe lines, all `problems: []` and `offOrigin: []`:

| Label | State | Size | Scheme | ok | scrollWidth |
|---|---|---|---|---|---|
| A | journey fail | 390 | dark | true | 390 |
| A | fail | 390 | dark | true | 390 |
| A | fail | 390 | light | true | 390 |
| A | fail | 1280 | dark | true | 1280 |
| A | fail | 1280 | light | true | 1280 |
| A | pass | 390 | dark | true | 390 |
| A | pass | 390 | light | true | 390 |
| A | pass | 1280 | dark | true | 1280 |
| A | pass | 1280 | light | true | 1280 |
| A | pick | 390 | dark | true | 390 |
| B | journey fail | 390 | dark | true | 390 |
| B | fail | 390 | dark | true | 390 |
| B | fail | 390 | light | true | 390 |
| B | fail | 1280 | dark | true | 1280 |
| B | fail | 1280 | light | true | 1280 |
| B | pass | 390 | dark | true | 390 |
| B | pass | 390 | light | true | 390 |
| B | pass | 1280 | dark | true | 1280 |
| B | pass | 1280 | light | true | 1280 |
| B | pick | 390 | dark | true | 390 |
| C | journey fail | 390 | dark | true | 390 |
| C | fail | 390 | dark | true | 390 |
| C | fail | 390 | light | true | 390 |
| C | fail | 1280 | dark | true | 1280 |
| C | fail | 1280 | light | true | 1280 |
| C | pass | 390 | dark | true | 390 |
| C | pass | 390 | light | true | 390 |
| C | pass | 1280 | dark | true | 1280 |
| C | pass | 1280 | light | true | 1280 |
| C | pick | 390 | dark | true | 390 |

`control.sh seed-linter` printed `seeded linter` for A, B, and C (exit 0).

Stack probe, each label:

```
on-stack
START_REF unchanged
```

`git fetch origin dd/p5-replay` left `FETCH_HEAD` equal to START `d1bd73c075173336f2d3a15b3a2ee288163b7b32`, so no merge-tree was run.
