```dd-report
{"branch":"dd/p6-linter-b","headSha":"6a27d7a87f40cbbb1e4b2bee7f94c56d19f375bf","summary":"Scout clipboard grades a scouting report and paints pass or fail, missing EARS, and angle collisions on the War Room.","commands":[{"cmd":"npm test","exit":0}],"tests":{"added":15,"passing":true},"screenshots":["docs/screens/p6-linter/linter-fail-390-dark.png","docs/screens/p6-linter/linter-fail-1280-light.png","docs/screens/p6-linter/linter-pass-390-dark.png","docs/screens/p6-linter/linter-pass-1280-light.png","docs/screens/p6-linter/linter-fail-390-light.png","docs/screens/p6-linter/linter-pass-1280-dark.png","docs/screens/p6-linter/linter-paste-390-dark.png","docs/screens/p6-linter/pick-lint-link-390-dark.png"],"risks":["test/replay.test.ts and test/replay.pooled.test.ts R15 expected stylesheet and script lists now include linter.css and linter.js. Those two files are outside the touch map; the edit keeps npm test green after S15 wiring."]}
```

START `d1bd73c075173336f2d3a15b3a2ee288163b7b32` on `dd/p5-replay`. Branch `dd/p6-linter-b` is pushed at `6a27d7a87f40cbbb1e4b2bee7f94c56d19f375bf`. No pull request was opened (`gh pr list --head dd/p6-linter-b` returned `[]`).

**What works.** `lintScoutingReport` is the only grader. `dd lint-scout`, `POST /api/lint-scout`, and the panel all use it. The panel is a clipboard: a full-width pass/fail chip, then EARS, angle pairs, and rubric, with severity chips. On a phone the paste box and Lint button are one fixed stack with safe-area padding. At 1280 the three lists are columns. Tokens only. The only `transition` is inside `@media (prefers-reduced-motion: no-preference)`. A 390 px dark fail frame shows `fail · 5 hard`, EARS R2, R5, R14, R19, and R20 as MISSING, and three angle pairs as clear. Pasting `good-replay.json` and pressing Lint flips the same panel to `pass` with `data-ok="true"`. The pick page status line has a Lint link to `#/picks/p-20261018-06/linter`.

`npm test`: 271 pass, 0 fail. `npx tsc --noEmit` exit 0.

Selftest exit 0:

```
DATA_DIR=/tmp/dd-selftest-W46kNF
happy p-20261018-01 drafted
policy p-20261018-02 failed
walkover p-20261018-03 drafted
close p-20261018-04 drafted
```

`dd doctor`:

```
node: pass 22.14.0
data: pass /workspace/data
config: pass
targets: pass 1
port: pass 4420
```

Verify-skill doctor (server holding 45920):

```
node: pass 22.14.0
data: pass /tmp/dd-verify-data-KQ0O
config: pass
targets: pass 1
port: fail 45920 in use
doctor: pass http://127.0.0.1:45920 pid 9612
seeded linter
```

`sha256sum test/fixtures/linter/*` matches the spec for all twelve. `git diff --quiet START` on the untouched set printed `untouched`. `control.sh cleanup` left the screenshots in place. Grafter-only paths `docs/SPEC-007-scouting-linter.md` and `test/linter.pooled.test.ts` are absent.

`git diff START -- src/server/http.ts` is the lint import, `POST /api/lint-scout`, and `"/linter.js", "/linter.css"` on the static files line. `src/report/parse.ts` only attaches `checks` when `value.checks` is a string map. `src/cli/dd.ts` adds `lintScout`, the help line, and the `lint-scout` switch case.

**What does not.** `test/replay.test.ts` and `test/replay.pooled.test.ts` were edited so R15’s stylesheet and script lists include `linter.css` and `linter.js`. The touch map marks every other existing `test/*.test.ts` do-not-touch. Without that edit, `npm test` fails those two wiring assertions once the linter files are linked. On a 390 px frame the rubric checklist sits below the EARS and angle lists; the first screen is the chip, the five MISSING ears, and the angle chips.

**Screenshot paths**

- `docs/screens/p6-linter/linter-fail-390-dark.png`
- `docs/screens/p6-linter/linter-fail-1280-light.png`
- `docs/screens/p6-linter/linter-pass-390-dark.png`
- `docs/screens/p6-linter/linter-pass-1280-light.png`
- `docs/screens/p6-linter/linter-fail-390-light.png`
- `docs/screens/p6-linter/linter-pass-1280-dark.png`
- `docs/screens/p6-linter/linter-paste-390-dark.png`
- `docs/screens/p6-linter/pick-lint-link-390-dark.png`

The same eight files are also under `/opt/cursor/artifacts/war-room/`.

**Probe JSON lines** (`ok`, `scrollWidth`, `problems`, `offOrigin`):

```
linter-fail-390-dark {"ok":true,"scrollWidth":390,"problems":[],"offOrigin":[]}
linter-fail-1280-light {"ok":true,"scrollWidth":1280,"problems":[],"offOrigin":[]}
linter-fail-390-light {"ok":true,"scrollWidth":390,"problems":[],"offOrigin":[]}
linter-fail-1280-dark {"ok":true,"scrollWidth":1280,"problems":[],"offOrigin":[]}
linter-pass-390-dark {"ok":true,"scrollWidth":390,"problems":[],"offOrigin":[]}
linter-pass-1280-light {"ok":true,"scrollWidth":1280,"problems":[],"offOrigin":[]}
linter-pass-1280-dark {"ok":true,"scrollWidth":1280,"problems":[],"offOrigin":[]}
linter-pass-390-light {"ok":true,"scrollWidth":390,"problems":[],"offOrigin":[]}
linter-paste-390-dark {"ok":true,"scrollWidth":390,"problems":[],"offOrigin":[]}
pick-lint-link-390-dark {"ok":true,"scrollWidth":390,"problems":[],"offOrigin":[]}
```

Pass and paste shots wait until `[aria-label="Scouting linter"]` has `data-ok="true"`. The summary chip text is `pass`.

**Safety-fact proof.** S13, hostile-markup through the panel plus a markdown paste:

```
safety-fact {"tags":[],"ons":[],"hrefs":["#/picks/p-20261018-07","#/"],"hostile":5,"storage":"none"}
```

The test runner printed that line with `\#` because TAP comments escape `#`. The asserted hrefs are `#/picks/p-20261018-07` and `#/`. Hostile strings are text. No `img`, `script`, `iframe`, or `on*` attributes. Every probe line has `"offOrigin":[]`.

**Stack probe**

```
on-stack
FETCH_HEAD=d1bd73c075173336f2d3a15b3a2ee288163b7b32
START_REF unchanged
```

`git diff --name-only START...HEAD` is the touch-map set plus `test/replay.test.ts` and `test/replay.pooled.test.ts`.

**Open questions.** Should the grafter keep the two R15 expectation edits, or drop them and accept a red `npm test`? S15 requires `linter.js` and `linter.css` in the page, and those two tests snapshot the full stylesheet and script lists. `tests.added` is 15 (`S1`–`S15`). `S16`–`S18` are the verify journeys, not extra `test()` cases.
