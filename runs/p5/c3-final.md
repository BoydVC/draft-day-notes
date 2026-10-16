Replay is on `dd/p5-replay-c` at `c9acc4de7e58ada6124daad79476802544c67bc2`. No pull request was opened.

```dd-report
{"branch":"dd/p5-replay-c","headSha":"c9acc4de7e58ada6124daad79476802544c67bc2","summary":"Replay plays a pick one event per frame and cuts the film into stage chapters outside the controls.","commands":[{"cmd":"npm test","exit":0},{"cmd":"./node_modules/.bin/tsc --noEmit","exit":0}],"tests":{"added":18,"passing":true},"screenshots":["docs/screens/p5-replay/replay-94-at1-390-light.png","docs/screens/p5-replay/replay-94-at11-390-dark.png","docs/screens/p5-replay/replay-94-at20-390-dark.png","docs/screens/p5-replay/replay-94-at11-430-dark.png","docs/screens/p5-replay/replay-94-at11-1280-light.png","docs/screens/p5-replay/replay-94-at20-1280-dark.png","docs/screens/p5-replay/replay-93-at21-390-dark.png","docs/screens/p5-replay/replay-play-390-dark.png","docs/screens/p5-replay/replay-live-390-dark.png","docs/screens/p5-replay/pick-94-390-dark.png"],"risks":[]}
```

START: `c6cfad415576c2c14653955aff972a6d8c613ab1` (`dd/p4-phone`).

What works: `#/picks/<id>/replay` plays the existing timeline one event per second. Chapters sit outside the Replay controls group, one button per stage reached, each jumping to that stage's first event, with the current chapter marked. Pick 4's last frame names `Physical · NOT_VERIFIED`. Pick 3 at `?at=21` names `Physical · NOT_VERIFIED · Fix loop`. Play from event 1 reached Event 5 of 20 with Pause showing. The live shot, run last, stayed on the pull-request confirmation and read Event 20 of 21. `npm test` is 237 pass, 0 fail. `tsc --noEmit` exits 0. Selftest prints `DATA_DIR=/tmp/dd-selftest-2PXcu8`, `happy p-20261017-01 drafted`, `policy p-20261017-02 failed`, `walkover p-20261017-03 drafted`, `close p-20261017-04 drafted`. CLI doctor: `node: pass 22.14.0`, `data: pass /workspace/data`, `config: pass`, `targets: pass 1`, `port: pass 4420`. All twelve fixture sha256 values match the spec. Untouched paths diff quiet. `src/server/http.ts` changes only the static files line, appending `"/replay.js", "/replay.css"`.

What does not: the pick page at 1280×800 light still fails the phone probe on eleven pre-existing tap targets. None of those problem strings name Replay. Phone widths of that page probe `ok: true`.

Screenshot paths (also under `/opt/cursor/artifacts/war-room/` with the same names; cleanup left them in place):

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

Probe lines (ok, scrollWidth, chips status, problems, offOrigin):

- replay-94-at1-390-light: true, 390, ["intake"], [], []
- replay-94-at1-390-dark: true, 390, ["intake"], [], []
- replay-94-at1-430-light: true, 430, ["intake"], [], []
- replay-94-at1-430-dark: true, 430, ["intake"], [], []
- replay-94-at1-1280-light: true, 1280, ["intake"], [], []
- replay-94-at1-1280-dark: true, 1280, ["intake"], [], []
- replay-94-at11-390-light: true, 390, ["judging"], [], []
- replay-94-at11-390-dark: true, 390, ["judging"], [], []
- replay-94-at11-430-light: true, 430, ["judging"], [], []
- replay-94-at11-430-dark: true, 430, ["judging"], [], []
- replay-94-at11-1280-light: true, 1280, ["judging"], [], []
- replay-94-at11-1280-dark: true, 1280, ["judging"], [], []
- replay-94-at20-390-light: true, 390, ["drafted"], [], []
- replay-94-at20-390-dark: true, 390, ["drafted"], [], []
- replay-94-at20-430-light: true, 430, ["drafted"], [], []
- replay-94-at20-430-dark: true, 430, ["drafted"], [], []
- replay-94-at20-1280-light: true, 1280, ["drafted"], [], []
- replay-94-at20-1280-dark: true, 1280, ["drafted"], [], []
- pick-94-390-light: true, 390, ["drafted", null, null, "finished", "finished", "finished"], [], []
- pick-94-390-dark: true, 390, ["drafted", null, null, "finished", "finished", "finished"], [], []
- pick-94-430-light: true, 430, ["drafted", null, null, "finished", "finished", "finished"], [], []
- pick-94-430-dark: true, 430, ["drafted", null, null, "finished", "finished", "finished"], [], []
- pick-94-1280-light: false, 1280, ["drafted", null, null, "finished", "finished", "finished"], ["W8 a \"Big Board\" is 74x22 (< 44x44)", "W8 button \"Pass 1\" is 76x33 (< 44x44)", "W8 button \"Pass 2\" is 76x33 (< 44x44)", "W8 a \"Draft PR #6\" is 77x17 (< 44x44)", "W8 a \"Agent c1 attempt 1\" is 122x17 (< 44x44)", "W8 a \"Agent c2 attempt 1\" is 122x17 (< 44x44)", "W8 a \"Agent c3 attempt 1\" is 122x17 (< 44x44)", "W8 a \"Agent Film Room pass 1\" is 160x17 (< 44x44)", "W8 a \"Agent Film Room pass 2\" is 160x17 (< 44x44)", "W8 a \"Agent Trade\" is 80x17 (< 44x44)", "W8 a \"Agent Physical\" is 97x17 (< 44x44)"], []
- replay-93-at21-390-dark: true, 390, ["drafted"], [], []
- replay-play-390-dark: true, 390, ["combine"], [], []
- replay-live-390-dark: true, 390, ["drafted"], [], []

Safety-fact proof output:

```
SAFETY {"pass":true,"fixtures":["p-20261017-94","p-20261017-93","p-20261017-98","p-20261017-99","p-20261010-07","p-20261017-94 live"],"timers":0,"storage":"threw-if-touched"}
```

Every VERIFY 6 `offOrigin` above is `[]`.

Stack-probe output:

```
on-stack
FETCH_HEAD=c6cfad415576c2c14653955aff972a6d8c613ab1
START_REF unchanged
```

`git diff --name-only c6cfad415576c2c14653955aff972a6d8c613ab1...HEAD` stays inside the touch map: replay.js, replay.css, replay.test.ts, the twelve fixtures, features/replay.md, the ten screenshots, index.html, http.ts, app.js, phone.test.ts, SKILL.md, features/README.md, control.sh, and DECISIONS.tsv.

Open questions: none. Chapter buttons are rebuilt on each paint; the spec only requires the caption, the slider, and the five control buttons to stay the same nodes.
