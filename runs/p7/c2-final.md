Big Board stats is on `dd/p7-big-board-b` at `1ec8ca2562ac97731c69db563a816ef959341eea`, pushed and even with `origin/dd/p7-big-board-b`. No pull request was opened. The remote printed `https://github.com/BoydVC/draft-day/pull/new/dd/p7-big-board-b` and that URL was not used.

The view is a phone scoreboard. The summary is the headline, then three tiles (best angle and its record, trades per pick, first-try verify), then the full sections. Bars are `meter` elements. Colors come from the existing tokens in both schemes. Width transitions live only inside `@media (prefers-reduced-motion: no-preference)`.

### VERIFY

1. `npm test` exit 0. 302 passing, including `B1 season` through `B16 wiring` in `test/bigboard.test.ts`.
2. `./node_modules/.bin/tsc --noEmit` exit 0.
3. `dd selftest` exit 0. `DATA_DIR=/tmp/dd-selftest-lquVNB`. Lines: `happy p-20261018-01 drafted`, `policy p-20261018-02 failed`, `walkover p-20261018-03 drafted`, `close p-20261018-04 drafted`.
4. `dd doctor` (repo data dir): node pass 22.14.0, data pass `/workspace/data`, config pass, targets pass 1, port pass 4420, exit 0. On the verify server, port fail 45920 in use, then `doctor: pass http://127.0.0.1:45920 pid 5464`.
5. Fixture hashes match the spec, and the do-not-touch set printed `untouched`.

```
09a5f7738901d2411967b6a5514b4fe397d95cb0f49ef72a00f3e5177e369765  test/fixtures/bigboard/bigboard-harness.d.mts
2c6737a7c6aa6e7d60370f64ff97aa1ead28fe12dd3d88be4dec4a600d6492c9  test/fixtures/bigboard/bigboard-harness.mjs
bb008dc4bbbb9eaf0806ad2bd29c9b6525bbfd7feebf474dd70df5ef99d66773  test/fixtures/bigboard/expected.json
ff1d0fd616101e4ca68a67eb446b59678d8bb2f50280140fe7a7a7ccbc155e9f  test/fixtures/bigboard/hostile.jsonl
262646746004322c211baf59328fa06be76c617bedd0bb0eb509ee7ade3175d3  test/fixtures/bigboard/league.jsonl
d5593eb14d45bc0f79cc3042fc9b4521f2d07066ee6cf919c7331da74506644a  test/fixtures/bigboard/README.md
4ed24013ac7d44cfb6fa1111360a87d57d186d806e7a553b9042c02881389076  test/fixtures/bigboard/season.jsonl
```

`src/server/http.ts` is the `bigBoardStats` import, `GET /api/stats` (window via `lessonWindow`, 400 `{error}`, 200 JSON), and the static files line with `"/bigboard.js", "/bigboard.css"`.

`src/cli/dd.ts` is the `bigBoardStats` / `bigBoardText` import, `stats()`, the `dd stats` help line, and the `case "stats"` switch arm.

Closed-list diffs are the seven sanctioned lines: `bigboard.css` and `bigboard.js` appended in `test/replay.test.ts`, `test/replay.pooled.test.ts`, and `test/linter.test.ts`, and `scripts.slice(scriptAt, scriptAt + 4)` of `["replay.js", "linter.js", "bigboard.js", "app.js"]` in `test/linter.pooled.test.ts`.

6. `control.sh launch`, `doctor`, and `seed-bigboard` printed `seeded bigboard` (summary `13 picks · 9 drafted · verified 9/10 (2 first try) · 10 trades grafted`, `excluded.selftest` 4). Apply / `#/stats?since=2026-10-17` narrows that to `6 picks · 4 drafted · verified 4/4 (2 first try) · 9 trades grafted` (mean 2.25, first try 2/4). `#/stats?until=2026-10-01` is `No picks yet`. `control.sh cleanup` stopped pid 5464. The eight screenshots remain under `docs/screens/p7-big-board/` and `/opt/cursor/artifacts/war-room/`.
9. `git diff --name-only START...HEAD`:

```
.cursor/skills/verify-draft-day/SKILL.md
.cursor/skills/verify-draft-day/features/README.md
.cursor/skills/verify-draft-day/features/big-board-stats.md
.cursor/skills/verify-draft-day/helpers/control.sh
docs/DECISIONS.tsv
docs/screens/p7-big-board/board-stats-link-390-dark.png
docs/screens/p7-big-board/stats-1280-dark.png
docs/screens/p7-big-board/stats-1280-light.png
docs/screens/p7-big-board/stats-390-dark.png
docs/screens/p7-big-board/stats-390-light.png
docs/screens/p7-big-board/stats-430-dark.png
docs/screens/p7-big-board/stats-empty-390-dark.png
docs/screens/p7-big-board/stats-window-390-dark.png
src/cli/dd.ts
src/core/bigboard.ts
src/core/index.ts
src/server/http.ts
src/ui/app.js
src/ui/bigboard.css
src/ui/bigboard.js
src/ui/index.html
test/bigboard.test.ts
test/fixtures/bigboard/README.md
test/fixtures/bigboard/bigboard-harness.d.mts
test/fixtures/bigboard/bigboard-harness.mjs
test/fixtures/bigboard/expected.json
test/fixtures/bigboard/hostile.jsonl
test/fixtures/bigboard/league.jsonl
test/fixtures/bigboard/season.jsonl
test/linter.pooled.test.ts
test/linter.test.ts
test/phone.test.ts
test/replay.pooled.test.ts
test/replay.test.ts
```

`docs/SPEC-008-big-board.md` and `test/bigboard.pooled.test.ts` were not created.

```dd-report
{"branch":"dd/p7-big-board-b","headSha":"1ec8ca2562ac97731c69db563a816ef959341eea","summary":"Big Board stats is a phone scoreboard: headline, then best angle, trades per pick, and first-try verify, fed by one fold over reduce() and timeline().","commands":[{"cmd":"npm test","exit":0}],"tests":{"added":16,"passing":true},"screenshots":["docs/screens/p7-big-board/stats-390-dark.png","docs/screens/p7-big-board/stats-390-light.png","docs/screens/p7-big-board/stats-430-dark.png","docs/screens/p7-big-board/stats-1280-light.png","docs/screens/p7-big-board/stats-1280-dark.png","docs/screens/p7-big-board/stats-window-390-dark.png","docs/screens/p7-big-board/stats-empty-390-dark.png","docs/screens/p7-big-board/board-stats-link-390-dark.png"],"risks":[]}
```

**START** `dc38660f2f3fdaadcfd2e879693e24cb21a05eba` (`dd/p6-linter`).

**What works.** `bigBoardStats` matches `expected.json` (season, league, league-oct17, league-week, hostile), the three mutations, and pick-by-pick `reduce()` / `timeline()` agreement. `dd stats` and `GET /api/stats` share that fold. The scoreboard paints the binding DOM, the Stats link, the window form, and the empty state. All eight probes printed `ok: true`, `problems: []`, `offOrigin: []`, with `scrollWidth` equal to the viewport. Hostile markup stays text. `test/guards.test.ts` is byte-identical.

**What does not.** Nothing in this pick's scope. Pre-existing 1280 Big Board and pick-page tap targets were left as they were.

**Screenshot paths**

- `docs/screens/p7-big-board/stats-390-dark.png`
- `docs/screens/p7-big-board/stats-390-light.png`
- `docs/screens/p7-big-board/stats-430-dark.png`
- `docs/screens/p7-big-board/stats-1280-light.png`
- `docs/screens/p7-big-board/stats-1280-dark.png`
- `docs/screens/p7-big-board/stats-window-390-dark.png`
- `docs/screens/p7-big-board/stats-empty-390-dark.png`
- `docs/screens/p7-big-board/board-stats-link-390-dark.png`

Same eight names under `/opt/cursor/artifacts/war-room/`.

**Probe JSON lines** (`ok`, `scrollWidth`, `problems`, `offOrigin`)

- `#/stats` 390 dark: `true`, `390`, `[]`, `[]`
- `#/stats` 390 light: `true`, `390`, `[]`, `[]`
- `#/stats` 430 dark: `true`, `430`, `[]`, `[]`
- `#/stats` 1280 light: `true`, `1280`, `[]`, `[]`
- `#/stats` 1280 dark: `true`, `1280`, `[]`, `[]`
- `#/stats?since=2026-10-17` 390 dark: `true`, `390`, `[]`, `[]`
- `#/stats?until=2026-10-01` 390 dark: `true`, `390`, `[]`, `[]`
- `#/` 390 dark: `true`, `390`, `[]`, `[]` (Stats link present)

**Safety-fact proof.** B14 painted hostile stats plus a skipped row and a trade row whose pick id is `p-20261018-77"><img src=x>`:

```json
{"ok":true,"img":0,"script":0,"iframe":0,"svg":0,"onAttrs":[],"hrefs":["#/picks/p-20261018-73"],"storageHits":0,"hostileIdLinked":false}
```

Every VERIFY 6 probe had `offOrigin: []`.

**Stack probe.** `git merge-base --is-ancestor START HEAD` printed `on-stack`. `git rev-parse FETCH_HEAD` after `git fetch origin dd/p6-linter` is `dc38660f2f3fdaadcfd2e879693e24cb21a05eba`. `START_REF unchanged`.

**Open questions.** None.
