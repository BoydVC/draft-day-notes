Big Board stats is on `dd/p7-big-board-a` at `4183e30bc295122eaed279e743cad183405a6501`. The branch is pushed. No pull request was opened.

```dd-report
{"branch":"dd/p7-big-board-a","headSha":"4183e30bc295122eaed279e743cad183405a6501","summary":"Big Board stats is one metric ledger in src/core/bigboard.ts. Each row folds reduce() and timeline() output, and satisfies ties the metric to its text line and DOM container. dd stats and GET /api/stats return that JSON. The stats view paints it, with a Stats link on the Big Board.","commands":[{"cmd":"npm test","exit":0},{"cmd":"./node_modules/.bin/tsc --noEmit","exit":0},{"cmd":"node --experimental-strip-types src/cli/dd.ts selftest","exit":0},{"cmd":"node --experimental-strip-types src/cli/dd.ts doctor","exit":0}],"tests":{"added":16,"passing":true},"screenshots":["docs/screens/p7-big-board/stats-390-dark.png","docs/screens/p7-big-board/stats-390-light.png","docs/screens/p7-big-board/stats-430-dark.png","docs/screens/p7-big-board/stats-1280-light.png","docs/screens/p7-big-board/stats-1280-dark.png","docs/screens/p7-big-board/stats-window-390-dark.png","docs/screens/p7-big-board/stats-empty-390-dark.png","docs/screens/p7-big-board/board-stats-link-390-dark.png"],"risks":[]}
```

START: `dd/p6-linter` at `dc38660f2f3fdaadcfd2e879693e24cb21a05eba`.

What works: `npm test` is 302 pass, 0 fail. B1–B16 are named in `test/bigboard.test.ts`. `./node_modules/.bin/tsc --noEmit` exits 0. `dd selftest` prints `DATA_DIR=/tmp/dd-selftest-TgjO2Y`, `happy p-20261018-01 drafted`, `policy p-20261018-02 failed`, `walkover p-20261018-03 drafted`, `close p-20261018-04 drafted`. Standalone `dd doctor` prints `node: pass 22.14.0`, `data: pass /workspace/data`, `config: pass`, `targets: pass 1`, `port: pass 4420`. The seven fixture sha256 values match the spec. `git diff --quiet START` on the do-not-touch set prints `untouched`. The verify skill launched, doctored (`doctor: pass http://127.0.0.1:45920 pid 8042`; the skill's own port line is `port: fail 45920 in use` because that server holds the port), and `seed-bigboard` printed `seeded bigboard`. Every probe returned `"ok":true`. Applying Since `2026-10-17` moved the page to `#/stats?since=2026-10-17` and the summary started `6 picks`. `#/stats?until=2026-10-01` shows `No picks yet`. Cleanup left the screenshots in place.

What does not: nothing in this pick's checks failed. No pull request exists for this branch.

Screenshot paths:

- `docs/screens/p7-big-board/stats-390-dark.png`
- `docs/screens/p7-big-board/stats-390-light.png`
- `docs/screens/p7-big-board/stats-430-dark.png`
- `docs/screens/p7-big-board/stats-1280-light.png`
- `docs/screens/p7-big-board/stats-1280-dark.png`
- `docs/screens/p7-big-board/stats-window-390-dark.png`
- `docs/screens/p7-big-board/stats-empty-390-dark.png`
- `docs/screens/p7-big-board/board-stats-link-390-dark.png`

The same eight files are under `/opt/cursor/artifacts/war-room/`.

Probe JSON lines (`ok`, `scrollWidth`, `problems`, `offOrigin`):

- `#/stats` 390×844 dark: `true`, `390`, `[]`, `[]`
- `#/stats` 390×844 light: `true`, `390`, `[]`, `[]`
- `#/stats` 430×932 dark: `true`, `430`, `[]`, `[]`
- `#/stats` 1280×800 light: `true`, `1280`, `[]`, `[]`
- `#/stats` 1280×800 dark: `true`, `1280`, `[]`, `[]`
- `#/stats` then Apply Since 2026-10-17, 390×844 dark (landed on `#/stats?since=2026-10-17`): `true`, `390`, `[]`, `[]`
- `#/stats?until=2026-10-01` 390×844 dark: `true`, `390`, `[]`, `[]`
- `#/` 390×844 dark: `true`, `390`, `[]`, `[]`

Safety-fact proof (hostile stats plus a skipped row and a trade row whose pick id is `p-20261018-77"><img src=x>`, painted through `draftDayBigBoard`, then Apply with Since `2026-10-17`):

```json
{"fact":"pass","tags":[],"onAttrs":[],"hrefs":["#/picks/p-20261018-73"],"badHrefs":[],"storageAccesses":[],"fetches":[],"offOrigin":[],"hashAfterApply":"#/stats?since=2026-10-17","poisonedText":true,"markupStaysText":true}
```

Every VERIFY 6 probe line has `"offOrigin":[]`.

Stack probe:

```
on-stack
FETCH_HEAD=dc38660f2f3fdaadcfd2e879693e24cb21a05eba
START_REF unchanged
```

`git diff --name-only START...HEAD` is only touch-map paths: the new ledger, UI, tests, seven fixtures, skill files, five decision rows, the sanctioned wiring edits, and the eight screenshots.

`http.ts` is the static files line plus `GET /api/stats`. `dd.ts` is the `stats` help line, the switch case, and `stats()` next to `lessons()`. The four closed-list files change only the seven sanctioned lines (sheets/scripts in the three R15/S15 tests, and the slice of 4 in `test/linter.pooled.test.ts`). `test/phone.test.ts` adds the two W5 lines.

Open questions: none.
