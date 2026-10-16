Big Board stats is on `dd/p7-big-board-c` at `ac11933f42d0fd52c3abf32edcfe63c28809ba55`. The branch is pushed. No pull request was opened.

`bigBoardStats` folds the pick logs into a box score: angles, slots, trades, verify, and stage medians. `#/stats` paints that result as real tables. At 600 px and below the same rows stack with `data-label` captions. `dd stats` and `GET /api/stats` use the same function. The Big Board has a `Stats` link.

<img alt="Stats at 390 dark, stacked box score" src="/opt/cursor/artifacts/war-room/stats-390-dark.png" />
<img alt="Stats at 1280, slots beside trades and verify beside stages" src="/opt/cursor/artifacts/war-room/stats-1280-columns.png" />
<img alt="Since 2026-10-17 applied, summary starts 6 picks" src="/opt/cursor/artifacts/war-room/stats-window-390-dark.png" />
<img alt="Big Board with the Stats link" src="/opt/cursor/artifacts/war-room/board-stats-link-390-dark.png" />

```dd-report
{"branch":"dd/p7-big-board-c","headSha":"ac11933f42d0fd52c3abf32edcfe63c28809ba55","summary":"Big Board stats is a box score over the pick logs: angles, slots, trades, verify, and stage medians, shared by dd stats, GET /api/stats, and #/stats.","commands":[{"cmd":"npm test","exit":0},{"cmd":"npx tsc --noEmit","exit":0}],"tests":{"added":16,"passing":true},"screenshots":["docs/screens/p7-big-board/stats-390-dark.png","docs/screens/p7-big-board/stats-390-light.png","docs/screens/p7-big-board/stats-430-dark.png","docs/screens/p7-big-board/stats-1280-light.png","docs/screens/p7-big-board/stats-1280-dark.png","docs/screens/p7-big-board/stats-window-390-dark.png","docs/screens/p7-big-board/stats-empty-390-dark.png","docs/screens/p7-big-board/board-stats-link-390-dark.png"],"risks":[]}
```

START: `dc38660f2f3fdaadcfd2e879693e24cb21a05eba` (`dd/p6-linter`). HEAD `ac11933f42d0fd52c3abf32edcfe63c28809ba55` is on that stack.

What works: `npm test` 302 pass, 0 fail. `npx tsc --noEmit` exit 0. `dd selftest` printed `DATA_DIR=/tmp/dd-selftest-p1JyYJ`, `happy p-20261018-01 drafted`, `policy p-20261018-02 failed`, `walkover p-20261018-03 drafted`, `close p-20261018-04 drafted`. `dd doctor` printed `node: pass 22.14.0`, `data: pass /workspace/data`, `config: pass`, `targets: pass 1`, `port: pass 4420`. Fixture sha256s match the spec. The do-not-touch paths are clean. `seed-bigboard` returned `13 picks · 9 drafted · verified 9/10 (2 first try) · 10 trades grafted` with `excluded.selftest` 4. Apply Since `2026-10-17` moved the hash to `#/stats?since=2026-10-17` and the summary starts `6 picks`. `#/stats?until=2026-10-01` shows `No picks yet`. At 1280 the sheets grid is two columns (slots beside trades, verify beside stages). At 390 the same `tr` rows stack and `data-label` captions show. Cleanup left the screenshots in place. No pull request exists for this branch.

What does not: nothing in the VERIFY list failed.

Screenshot paths:
- `docs/screens/p7-big-board/stats-390-dark.png`
- `docs/screens/p7-big-board/stats-390-light.png`
- `docs/screens/p7-big-board/stats-430-dark.png`
- `docs/screens/p7-big-board/stats-1280-light.png`
- `docs/screens/p7-big-board/stats-1280-dark.png`
- `docs/screens/p7-big-board/stats-window-390-dark.png`
- `docs/screens/p7-big-board/stats-empty-390-dark.png`
- `docs/screens/p7-big-board/board-stats-link-390-dark.png`

Probe JSON lines (`ok`, `scrollWidth`, `problems`, `offOrigin`):

`{"name":"stats-390-dark","ok":true,"scrollWidth":390,"problems":[],"offOrigin":[]}`
`{"name":"stats-390-light","ok":true,"scrollWidth":390,"problems":[],"offOrigin":[]}`
`{"name":"stats-430-dark","ok":true,"scrollWidth":430,"problems":[],"offOrigin":[]}`
`{"name":"stats-1280-light","ok":true,"scrollWidth":1280,"problems":[],"offOrigin":[]}`
`{"name":"stats-1280-dark","ok":true,"scrollWidth":1280,"problems":[],"offOrigin":[]}`
`{"name":"stats-since-390-dark","url":"#/stats?since=2026-10-17","ok":true,"scrollWidth":390,"problems":[],"offOrigin":[]}`
`{"name":"stats-empty-390-dark","url":"#/stats?until=2026-10-01","ok":true,"scrollWidth":390,"problems":[],"offOrigin":[]}`
`{"name":"stats-window-390-dark","url":"#/stats?since=2026-10-17","ok":true,"scrollWidth":390,"problems":[],"offOrigin":[]}`
`{"name":"board-stats-link-390-dark","ok":true,"scrollWidth":390,"problems":[],"offOrigin":[]}`

Safety-fact proof (B14 `console.log`, TAP displays `#` as `\#`):

`{"ok":true,"img":0,"script":0,"iframe":0,"svg":0,"onAttrs":[],"hrefs":["#/picks/p-20261018-73","#/picks/p-20261018-75"],"storageHits":0,"cookieHits":0,"offOrigin":[]}`

Every probe line above has `"offOrigin":[]`.

Stack probe:

```
git merge-base --is-ancestor dc38660f2f3fdaadcfd2e879693e24cb21a05eba HEAD && echo on-stack
on-stack
git fetch origin dd/p6-linter && git rev-parse FETCH_HEAD
dc38660f2f3fdaadcfd2e879693e24cb21a05eba
START_REF unchanged
```

`git diff --name-only dc38660f2f3fdaadcfd2e879693e24cb21a05eba...HEAD` stays inside the touch map: the verify skill, `docs/DECISIONS.tsv`, the eight screenshots, `src/cli/dd.ts`, `src/core/bigboard.ts`, `src/core/index.ts`, `src/server/http.ts`, `src/ui/app.js`, `src/ui/bigboard.css`, `src/ui/bigboard.js`, `src/ui/index.html`, `test/bigboard.test.ts`, the seven fixtures, and the closed-list plus W5 lines in `test/linter.pooled.test.ts`, `test/linter.test.ts`, `test/phone.test.ts`, `test/replay.pooled.test.ts`, `test/replay.test.ts`.

Open questions: none.
