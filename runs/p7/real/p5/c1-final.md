Replay is on `dd/p5-replay-a` at `34759b5ea24705121f1b49e1020c127454f8de93`, pushed to origin. No pull request was opened.

`frameAt(view, index)` is the one frame rule. One module-level playback record holds the pick id, the index, the playing flag, and the timer. `paint()` rewrites the same caption node, the same slider, and the same five buttons. `npm test` is 238 passing, including 19 new tests (R1–R18 and the safety fact). `npx tsc --noEmit` exits 0. The twelve fixtures match the spec sha256 values, `test/guards.test.ts` and the do-not-touch tree are unchanged, and `src/server/http.ts` changes only on the static files line. After 4.5s from `?at=1&play=1` the film is Event 5 of 20, Combine, with Pause. The live shot, run last, shows Event 20 of 21 and “Pull request #6 is confirmed as a draft, and the stage changed from Physical to Draft Pick.”

```dd-report
{"branch":"dd/p5-replay-a","headSha":"34759b5ea24705121f1b49e1020c127454f8de93","summary":"Replay plays a pick's Decision log one event per frame from frameAt, with in-place paint, Play/Pause, and a live update that keeps the open frame.","commands":[{"cmd":"npm test","exit":0}],"tests":{"added":19,"passing":true},"screenshots":["docs/screens/p5-replay/replay-94-at1-390-light.png","docs/screens/p5-replay/replay-94-at11-390-dark.png","docs/screens/p5-replay/replay-94-at20-390-dark.png","docs/screens/p5-replay/replay-94-at11-430-dark.png","docs/screens/p5-replay/replay-94-at11-1280-light.png","docs/screens/p5-replay/replay-94-at20-1280-dark.png","docs/screens/p5-replay/replay-93-at21-390-dark.png","docs/screens/p5-replay/replay-play-390-dark.png","docs/screens/p5-replay/replay-live-390-dark.png","docs/screens/p5-replay/pick-94-390-dark.png"],"risks":[]}
```

START
`c6cfad415576c2c14653955aff972a6d8c613ab1` on `dd/p4-phone`. HEAD `34759b5ea24705121f1b49e1020c127454f8de93` on `dd/p5-replay-a`.

What works
- R1–R18 and the safety fact pass. Full suite: 238 pass, 0 fail. `tsc` exit 0.
- `dd selftest` exit 0: `DATA_DIR=/tmp/dd-selftest-wacba4`, `happy p-20261017-01 drafted`, `policy p-20261017-02 failed`, `walkover p-20261017-03 drafted`, `close p-20261017-04 drafted`.
- `dd doctor` exit 0: `node: pass 22.14.0`, `data: pass /workspace/data`, `config: pass`, `targets: pass 1`, `port: pass 4420`.
- `sha256sum test/fixtures/replay/*` matches every value in the spec header. `git diff --quiet START --` the do-not-touch paths printed `untouched`. The `http.ts` diff is the one static-files line, appending `"/replay.js", "/replay.css"`.
- All 18 Replay probes are `ok: true`, `offOrigin: []`, `scrollWidth` equal to the width, and one chip (`intake` at `at=1`, `judging` at `at=11`, `drafted` at `at=20`). Pick page at 390 and 430, both schemes, is `ok: true`. `?at=21` of `p-20261017-93` is `ok: true` with chip `drafted`.
- Play shot OCR: `+1h 58m`, combine, `Event 5 of 20`, “c2 launched. Agent c2 attempt 1”, control row reads Pause. Live shot OCR: `Event 20 of 21` and the draft-confirmation sentence. `control.sh cleanup` removed the verify server; the screenshots are still on disk.

What does not
The pick page at 1280×800 light is `ok: false` with the eleven pre-existing W8 sizes (Big Board, Pass 1, Pass 2, Draft PR #6, Agent c1, Agent c2, Agent c3, Agent Film Room pass 1, Agent Film Room pass 2, Agent Trade, Agent Physical). The problem list does not name Replay. Every in-scope Replay check passes.

Screenshot paths
Committed:
- `docs/screens/p5-replay/replay-94-at1-390-light.png`
- `docs/screens/p5-replay/replay-94-at11-390-dark.png`
- `docs/screens/p5-replay/replay-94-at20-390-dark.png`
- `docs/screens/p5-replay/replay-94-at11-430-dark.png`
- `docs/screens/p5-replay/replay-94-at11-1280-light.png`
- `docs/screens/p5-replay/replay-94-at20-1280-dark.png`
- `docs/screens/p5-replay/replay-93-at21-390-dark.png`
- `docs/screens/p5-replay/replay-play-390-dark.png`
- `docs/screens/p5-replay/replay-live-390-dark.png`
- `docs/screens/p5-replay/pick-94-390-dark.png`

Same bytes also under `/opt/cursor/artifacts/war-room/` (plus the other probe shots).

Probe JSON lines
```
{"shot":"replay-94-at1-390-light.png","ok":true,"scrollWidth":390,"chips":["intake"],"problems":[],"offOrigin":[]}
{"shot":"replay-94-at1-390-dark.png","ok":true,"scrollWidth":390,"chips":["intake"],"problems":[],"offOrigin":[]}
{"shot":"replay-94-at1-430-light.png","ok":true,"scrollWidth":430,"chips":["intake"],"problems":[],"offOrigin":[]}
{"shot":"replay-94-at1-430-dark.png","ok":true,"scrollWidth":430,"chips":["intake"],"problems":[],"offOrigin":[]}
{"shot":"replay-94-at1-1280-light.png","ok":true,"scrollWidth":1280,"chips":["intake"],"problems":[],"offOrigin":[]}
{"shot":"replay-94-at1-1280-dark.png","ok":true,"scrollWidth":1280,"chips":["intake"],"problems":[],"offOrigin":[]}
{"shot":"replay-94-at11-390-light.png","ok":true,"scrollWidth":390,"chips":["judging"],"problems":[],"offOrigin":[]}
{"shot":"replay-94-at11-390-dark.png","ok":true,"scrollWidth":390,"chips":["judging"],"problems":[],"offOrigin":[]}
{"shot":"replay-94-at11-430-light.png","ok":true,"scrollWidth":430,"chips":["judging"],"problems":[],"offOrigin":[]}
{"shot":"replay-94-at11-430-dark.png","ok":true,"scrollWidth":430,"chips":["judging"],"problems":[],"offOrigin":[]}
{"shot":"replay-94-at11-1280-light.png","ok":true,"scrollWidth":1280,"chips":["judging"],"problems":[],"offOrigin":[]}
{"shot":"replay-94-at11-1280-dark.png","ok":true,"scrollWidth":1280,"chips":["judging"],"problems":[],"offOrigin":[]}
{"shot":"replay-94-at20-390-light.png","ok":true,"scrollWidth":390,"chips":["drafted"],"problems":[],"offOrigin":[]}
{"shot":"replay-94-at20-390-dark.png","ok":true,"scrollWidth":390,"chips":["drafted"],"problems":[],"offOrigin":[]}
{"shot":"replay-94-at20-430-light.png","ok":true,"scrollWidth":430,"chips":["drafted"],"problems":[],"offOrigin":[]}
{"shot":"replay-94-at20-430-dark.png","ok":true,"scrollWidth":430,"chips":["drafted"],"problems":[],"offOrigin":[]}
{"shot":"replay-94-at20-1280-light.png","ok":true,"scrollWidth":1280,"chips":["drafted"],"problems":[],"offOrigin":[]}
{"shot":"replay-94-at20-1280-dark.png","ok":true,"scrollWidth":1280,"chips":["drafted"],"problems":[],"offOrigin":[]}
{"shot":"pick-94-390-light.png","ok":true,"scrollWidth":390,"chips":["drafted",null,null,"finished","finished","finished"],"problems":[],"offOrigin":[]}
{"shot":"pick-94-390-dark.png","ok":true,"scrollWidth":390,"chips":["drafted",null,null,"finished","finished","finished"],"problems":[],"offOrigin":[]}
{"shot":"pick-94-430-light.png","ok":true,"scrollWidth":430,"chips":["drafted",null,null,"finished","finished","finished"],"problems":[],"offOrigin":[]}
{"shot":"pick-94-430-dark.png","ok":true,"scrollWidth":430,"chips":["drafted",null,null,"finished","finished","finished"],"problems":[],"offOrigin":[]}
{"shot":"pick-94-1280-light.png","ok":false,"scrollWidth":1280,"chips":["drafted",null,null,"finished","finished","finished"],"problems":["W8 a \"Big Board\" is 74x22 (< 44x44)","W8 button \"Pass 1\" is 76x33 (< 44x44)","W8 button \"Pass 2\" is 76x33 (< 44x44)","W8 a \"Draft PR #6\" is 77x17 (< 44x44)","W8 a \"Agent c1 attempt 1\" is 122x17 (< 44x44)","W8 a \"Agent c2 attempt 1\" is 122x17 (< 44x44)","W8 a \"Agent c3 attempt 1\" is 122x17 (< 44x44)","W8 a \"Agent Film Room pass 1\" is 160x17 (< 44x44)","W8 a \"Agent Film Room pass 2\" is 160x17 (< 44x44)","W8 a \"Agent Trade\" is 80x17 (< 44x44)","W8 a \"Agent Physical\" is 97x17 (< 44x44)"],"offOrigin":[]}
{"shot":"replay-93-at21-390-dark.png","ok":true,"scrollWidth":390,"chips":["drafted"],"problems":[],"offOrigin":[]}
{"shot":"replay-play-390-dark.png","ok":true,"scrollWidth":390,"chips":["combine"],"problems":[],"offOrigin":[]}
{"shot":"replay-live-390-dark.png","ok":true,"scrollWidth":390,"chips":["drafted"],"problems":[],"offOrigin":[]}
```

Safety-fact proof
```
safety-fact {"pass":true,"fixtures":6,"fetches":30,"offenders":[],"badNodes":0,"hrefViolations":0,"timersAfterLeave":0,"eventSources":1}
```
Every VERIFY 6 probe line has `"offOrigin":[]`.

Stack probe
```
on-stack
FETCH_HEAD c6cfad415576c2c14653955aff972a6d8c613ab1
START_REF unchanged
```
`git diff --name-only START...HEAD`:
```
.cursor/skills/verify-draft-day/SKILL.md
.cursor/skills/verify-draft-day/features/README.md
.cursor/skills/verify-draft-day/features/replay.md
.cursor/skills/verify-draft-day/helpers/control.sh
docs/DECISIONS.tsv
docs/screens/p5-replay/pick-94-390-dark.png
docs/screens/p5-replay/replay-93-at21-390-dark.png
docs/screens/p5-replay/replay-94-at1-390-light.png
docs/screens/p5-replay/replay-94-at11-1280-light.png
docs/screens/p5-replay/replay-94-at11-390-dark.png
docs/screens/p5-replay/replay-94-at11-430-dark.png
docs/screens/p5-replay/replay-94-at20-1280-dark.png
docs/screens/p5-replay/replay-94-at20-390-dark.png
docs/screens/p5-replay/replay-live-390-dark.png
docs/screens/p5-replay/replay-play-390-dark.png
src/server/http.ts
src/ui/app.js
src/ui/index.html
src/ui/replay.css
src/ui/replay.js
test/fixtures/replay/README.md
test/fixtures/replay/p-20261010-07.pick.json
test/fixtures/replay/p-20261017-93.events.jsonl
test/fixtures/replay/p-20261017-93.pick.json
test/fixtures/replay/p-20261017-94.events.jsonl
test/fixtures/replay/p-20261017-94.pick.json
test/fixtures/replay/p-20261017-98.events.jsonl
test/fixtures/replay/p-20261017-98.pick.json
test/fixtures/replay/p-20261017-99.events.jsonl
test/fixtures/replay/p-20261017-99.pick.json
test/fixtures/replay/replay-harness.d.mts
test/fixtures/replay/replay-harness.mjs
test/phone.test.ts
test/replay.test.ts
```

Open questions
None.
