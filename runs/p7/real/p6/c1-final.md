`dd/p6-linter-a` is pushed at `a59ec89518cf710f89620f22ba66a651c90dabaf`. No pull request was opened.

```dd-report
{"branch":"dd/p6-linter-a","headSha":"a59ec89518cf710f89620f22ba66a651c90dabaf","summary":"Rule-ledger scouting linter: one satisfies registry, lintScoutingReport, dd lint-scout, POST /api/lint-scout, and the panel. S1–S15 pass. npm test is 269/271; both failures are R15 wiring in the do-not-touch Replay suites, which still expect the pre-linter stylesheet list.","commands":[{"cmd":"npm test","exit":1},{"cmd":"npx tsc --noEmit","exit":0}],"tests":{"added":15,"passing":false},"screenshots":["docs/screens/p6-linter/linter-fail-390-dark.png","docs/screens/p6-linter/linter-fail-1280-light.png","docs/screens/p6-linter/linter-pass-390-dark.png","docs/screens/p6-linter/linter-pass-1280-light.png","docs/screens/p6-linter/linter-fail-390-light.png","docs/screens/p6-linter/linter-pass-1280-dark.png","docs/screens/p6-linter/linter-paste-390-dark.png","docs/screens/p6-linter/pick-lint-link-390-dark.png"],"risks":["R15 in test/replay.test.ts and test/replay.pooled.test.ts fails because index.html now links linter.css. Those files are do-not-touch, so they were left unchanged."]}
```

START `d1bd73c075173336f2d3a15b3a2ee288163b7b32` (`dd/p5-replay`). HEAD `a59ec89518cf710f89620f22ba66a651c90dabaf` on `dd/p6-linter-a` (`2565267` ledger, `a59ec89` screenshots).

**What works.** `src/core/linter.ts` is one ledger (`gradeability`, `ears`, `angles`) checked with `satisfies`, and `lintScoutingReport` matches the harness on every fixture, including `good-markdown.md`. `dd lint-scout`, `POST /api/lint-scout`, and the panel share that function. The panel uses the binding DOM names. Paste of `good-replay.json` on `p-20261018-61` flips the chip from `fail · 5 hard` to `pass`. All twelve fixture sha256 values match the spec. `tsc` exits 0. `dd selftest` exits 0:

```
DATA_DIR=/tmp/dd-selftest-GEVDXz
happy p-20261018-01 drafted
policy p-20261018-02 failed
walkover p-20261018-03 drafted
close p-20261018-04 drafted
```

`dd doctor` (port free):

```
node: pass 22.14.0
data: pass /workspace/data
config: pass
targets: pass 1
port: pass 4420
```

Skill doctor while the War Room was up: `port: fail 45920 in use`, `doctor: pass http://127.0.0.1:45920 pid 5452`. `control.sh cleanup` then left both screenshot sets in place. `git diff --quiet START` on the do-not-touch set printed `untouched`.

**What does not.** `npm test` is 269 pass, 2 fail, exit 1. Both are `R15 wiring`: `test/replay.pooled.test.ts:583` and `test/replay.test.ts` (the stylesheet `deepEqual`). Actual lists include `linter.css`, which S15 requires. Those tests are do-not-touch, so they were not edited.

**Screenshots.** Committed under `docs/screens/p6-linter/`: `linter-fail-390-dark.png`, `linter-fail-1280-light.png`, `linter-pass-390-dark.png`, `linter-pass-1280-light.png`, `linter-fail-390-light.png`, `linter-pass-1280-dark.png`, `linter-paste-390-dark.png`, `pick-lint-link-390-dark.png`. The same eight, plus the extra S16 shots `linter-fail-1280-dark.png` and `linter-pass-390-light.png`, are under `/opt/cursor/artifacts/war-room/`.

**Probe JSON lines** (re-run after seed; every line `ok: true`, `offOrigin: []`, `problems: []`, `scrollWidth` equal to the width):

```
{"url":"http://127.0.0.1:45920/#/picks/p-20261018-61/linter","width":390,"height":844,"scheme":"dark","scrollWidth":390,"targets":4,"small":[],"chips":[{"status":"failed","text":"fail · 5 hard"}],"offOrigin":[],"problems":[],"ok":true}
{"url":"http://127.0.0.1:45920/#/picks/p-20261018-61/linter","width":390,"height":844,"scheme":"light","scrollWidth":390,"targets":4,"small":[],"chips":[{"status":"failed","text":"fail · 5 hard"}],"offOrigin":[],"problems":[],"ok":true}
{"url":"http://127.0.0.1:45920/#/picks/p-20261018-61/linter","width":1280,"height":800,"scheme":"light","scrollWidth":1280,"targets":4,"small":[],"chips":[{"status":"failed","text":"fail · 5 hard"}],"offOrigin":[],"problems":[],"ok":true}
{"url":"http://127.0.0.1:45920/#/picks/p-20261018-61/linter","width":1280,"height":800,"scheme":"dark","scrollWidth":1280,"targets":4,"small":[],"chips":[{"status":"failed","text":"fail · 5 hard"}],"offOrigin":[],"problems":[],"ok":true}
{"url":"http://127.0.0.1:45920/#/picks/p-20261018-62/linter","width":390,"height":844,"scheme":"dark","scrollWidth":390,"targets":4,"small":[],"chips":[{"status":"drafted","text":"pass"}],"offOrigin":[],"problems":[],"ok":true}
{"url":"http://127.0.0.1:45920/#/picks/p-20261018-62/linter","width":390,"height":844,"scheme":"light","scrollWidth":390,"targets":4,"small":[],"chips":[{"status":"drafted","text":"pass"}],"offOrigin":[],"problems":[],"ok":true}
{"url":"http://127.0.0.1:45920/#/picks/p-20261018-62/linter","width":1280,"height":800,"scheme":"light","scrollWidth":1280,"targets":4,"small":[],"chips":[{"status":"drafted","text":"pass"}],"offOrigin":[],"problems":[],"ok":true}
{"url":"http://127.0.0.1:45920/#/picks/p-20261018-62/linter","width":1280,"height":800,"scheme":"dark","scrollWidth":1280,"targets":4,"small":[],"chips":[{"status":"drafted","text":"pass"}],"offOrigin":[],"problems":[],"ok":true}
{"url":"http://127.0.0.1:45920/#/picks/p-20261018-61","width":390,"height":844,"scheme":"dark","scrollWidth":390,"targets":3,"small":[],"chips":[{"status":"awaiting_go","text":"awaiting_go"}],"offOrigin":[],"problems":[],"ok":true}
{"url":"http://127.0.0.1:45920/#/picks/p-20261018-61/linter","width":390,"height":844,"scheme":"dark","scrollWidth":390,"targets":4,"small":[],"chips":[{"status":"drafted","text":"pass"}],"offOrigin":[],"problems":[],"ok":true}
```

The last line is the paste journey: fail panel, `good-replay.json` in the Lint document box, Lint pressed, chip `pass`.

**Safety-fact proof** (S13, hostile markup plus a markdown paste through the panel):

```
{"ok":true,"img":0,"script":0,"iframe":0,"onAttrs":[],"hrefs":["#/","#/picks/p-20261018-63"],"storageHits":0,"cookieHits":0,"offOrigin":[]}
```

Every probe line above has `"offOrigin":[]`.

**Stack probe.** `git merge-base --is-ancestor d1bd73c075173336f2d3a15b3a2ee288163b7b32 HEAD` printed `on-stack`. `git fetch origin dd/p5-replay && git rev-parse FETCH_HEAD` returned `d1bd73c075173336f2d3a15b3a2ee288163b7b32`. START_REF unchanged.

`git diff --name-only START...HEAD`: the skill files (`SKILL.md`, `features/README.md`, `features/linter.md`, `helpers/control.sh`), `docs/DECISIONS.tsv`, `src/cli/dd.ts`, `src/core/index.ts`, `src/core/linter.ts`, `src/core/types.ts` (optional `checks` only), `src/report/parse.ts`, `src/server/http.ts`, `src/ui/app.js`, `src/ui/index.html`, `src/ui/linter.css`, `src/ui/linter.js`, the twelve `test/fixtures/linter/*` files, `test/linter.test.ts`, `test/phone.test.ts`, and the eight `docs/screens/p6-linter/*.png` files. Grafter-only paths were not created.

**Open questions.** Should a later graft update R15 in `test/replay.test.ts` and `test/replay.pooled.test.ts` so the closed stylesheet list includes `linter.css`? This pick cannot edit those files, and S15 requires the tags, so `npm test` stays red on those two assertions.
