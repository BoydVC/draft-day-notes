Mode S is on `dd/p4-phone-a` (`d32032a66158af3232fb37dc830fa1b136349bf9`). Colors live in the two token blocks in `src/ui/styles.css`, phone sizes are the media rules at the end of that file, and the New pick form keeps its status and a failed idea in module state. No pull request was opened.

```dd-report
{"branch":"dd/p4-phone-a","headSha":"d32032a66158af3232fb37dc830fa1b136349bf9","summary":"Phone War Room: one light/dark token set, 44px targets and 16px chips at 390 and 430, and a New pick form that keeps its status and a failed idea across redraws.","commands":[{"cmd":"npm test","exit":0},{"cmd":"npx tsc --noEmit","exit":0},{"cmd":"node --experimental-strip-types src/cli/dd.ts selftest","exit":0}],"tests":{"added":14,"passing":true},"screenshots":["phone-board-390-light.png","phone-board-390-dark.png","phone-board-430-light.png","phone-board-430-dark.png","phone-pick-390-light.png","phone-pick-390-dark.png","phone-pick-430-light.png","phone-pick-430-dark.png","phone-lessons-390-light.png","phone-lessons-390-dark.png","phone-lessons-430-light.png","phone-lessons-430-dark.png","phone-form-sending.png","phone-form-kept.png","phone-desktop-board.png"],"risks":["Dark field borders use #5f7254 so --field-line clears 3:1; the old #3a4632 line was 1.63:1 on bg-2."]}
```

**Mode S.** `src/ui/lessons.js` is in the tree. START is `e242a533d04d68a5a4472bce283eb06866e79d96` on `dd/p3-lessons`.

**What works.** `npm test` is 138 passing, including 14 new `test/phone.test.ts` cases (W1–W6, W10–W17). `npx tsc --noEmit` is exit 0. `dd selftest` prints `DATA_DIR=/tmp/dd-selftest-JEGe83`, `happy p-20261017-01 drafted`, `policy p-20261017-02 failed`, `walkover p-20261017-03 drafted`, `close p-20261017-04 drafted`. `dd doctor` prints `node: pass 22.14.0`, `data: pass /workspace/data`, `config: pass`, `targets: pass 1`, `port: pass 4420`. The five fixture sha256 values match the spec. `git diff --quiet START -- test/guards.test.ts src/server/http.ts package.json` prints `untouched`. Board, pick, and Locker Room probes at 390 and 430, light and dark, are `"ok":true` with `"offOrigin":[]`. `Sending…` stays up with `Add pick` faded while the intake request is held. After a refused target, blur, and `dd record p-20261017-01 lesson_recorded --topic phone --text redraw`, the redrawn form still shows `target is not in targets.json` and `Show the run count in the page title`. The 1280×800 shot is still the five-column table. `control.sh cleanup` left the screenshots in place. No pull request exists for this branch.

**What does not.** The 1280 probe is not `"ok":true`. Phone sizing is inside `@media (max-width: 480px)`, so at 1280 `Add pick` is 96×35 and the pick links are about 99×17. `cdp-shot.mjs` exits 1 on that shot. The file is still written. Dark field borders are `#5f7254`, and the Locker Room rank-1 card uses `--glow` (`#2a3824`) in place of `#24301c`.

**Screenshot paths**

- `/opt/cursor/artifacts/war-room/phone-board-390-light.png`
- `/opt/cursor/artifacts/war-room/phone-board-390-dark.png`
- `/opt/cursor/artifacts/war-room/phone-board-430-light.png`
- `/opt/cursor/artifacts/war-room/phone-board-430-dark.png`
- `/opt/cursor/artifacts/war-room/phone-pick-390-light.png`
- `/opt/cursor/artifacts/war-room/phone-pick-390-dark.png`
- `/opt/cursor/artifacts/war-room/phone-pick-430-light.png`
- `/opt/cursor/artifacts/war-room/phone-pick-430-dark.png`
- `/opt/cursor/artifacts/war-room/phone-lessons-390-light.png`
- `/opt/cursor/artifacts/war-room/phone-lessons-390-dark.png`
- `/opt/cursor/artifacts/war-room/phone-lessons-430-light.png`
- `/opt/cursor/artifacts/war-room/phone-lessons-430-dark.png`
- `/opt/cursor/artifacts/war-room/phone-form-sending.png`
- `/opt/cursor/artifacts/war-room/phone-form-kept.png`
- `/opt/cursor/artifacts/war-room/phone-desktop-board.png`

The sending shot uses the spec `--before` string (`#idea`, `#new-pick`). The kept shot uses the same iPhone Chrome metrics, then `dd record`, because the record has to land after blur.

**Probe JSON lines**

```json
{"url":"http://127.0.0.1:45920/","width":390,"height":844,"innerWidth":390,"screenWidth":390,"scheme":"light","scrollWidth":390,"targets":9,"small":[],"tinyFields":[],"gutters":[],"offOrigin":[],"problems":[],"ok":true,"shot":"/opt/cursor/artifacts/war-room/phone-board-390-light.png"}
{"url":"http://127.0.0.1:45920/","width":390,"height":844,"innerWidth":390,"screenWidth":390,"scheme":"dark","scrollWidth":390,"targets":9,"small":[],"tinyFields":[],"gutters":[],"offOrigin":[],"problems":[],"ok":true,"shot":"/opt/cursor/artifacts/war-room/phone-board-390-dark.png"}
{"url":"http://127.0.0.1:45920/","width":430,"height":932,"innerWidth":430,"screenWidth":430,"scheme":"light","scrollWidth":430,"targets":9,"small":[],"tinyFields":[],"gutters":[],"offOrigin":[],"problems":[],"ok":true,"shot":"/opt/cursor/artifacts/war-room/phone-board-430-light.png"}
{"url":"http://127.0.0.1:45920/","width":430,"height":932,"innerWidth":430,"screenWidth":430,"scheme":"dark","scrollWidth":430,"targets":9,"small":[],"tinyFields":[],"gutters":[],"offOrigin":[],"problems":[],"ok":true,"shot":"/opt/cursor/artifacts/war-room/phone-board-430-dark.png"}
{"url":"http://127.0.0.1:45920/#/picks/p-20261017-04","width":390,"height":844,"innerWidth":390,"screenWidth":390,"scheme":"light","scrollWidth":390,"targets":4,"small":[],"tinyFields":[],"gutters":[],"offOrigin":[],"problems":[],"ok":true,"shot":"/opt/cursor/artifacts/war-room/phone-pick-390-light.png"}
{"url":"http://127.0.0.1:45920/#/picks/p-20261017-04","width":390,"height":844,"innerWidth":390,"screenWidth":390,"scheme":"dark","scrollWidth":390,"targets":4,"small":[],"tinyFields":[],"gutters":[],"offOrigin":[],"problems":[],"ok":true,"shot":"/opt/cursor/artifacts/war-room/phone-pick-390-dark.png"}
{"url":"http://127.0.0.1:45920/#/picks/p-20261017-04","width":430,"height":932,"innerWidth":430,"screenWidth":430,"scheme":"light","scrollWidth":430,"targets":4,"small":[],"tinyFields":[],"gutters":[],"offOrigin":[],"problems":[],"ok":true,"shot":"/opt/cursor/artifacts/war-room/phone-pick-430-light.png"}
{"url":"http://127.0.0.1:45920/#/picks/p-20261017-04","width":430,"height":932,"innerWidth":430,"screenWidth":430,"scheme":"dark","scrollWidth":430,"targets":4,"small":[],"tinyFields":[],"gutters":[],"offOrigin":[],"problems":[],"ok":true,"shot":"/opt/cursor/artifacts/war-room/phone-pick-430-dark.png"}
{"url":"http://127.0.0.1:45920/#/lessons?since=2026-10-11&until=2026-10-16","width":390,"height":844,"innerWidth":390,"screenWidth":390,"scheme":"light","scrollWidth":390,"targets":32,"small":[],"tinyFields":[],"gutters":[],"offOrigin":[],"problems":[],"ok":true,"shot":"/opt/cursor/artifacts/war-room/phone-lessons-390-light.png"}
{"url":"http://127.0.0.1:45920/#/lessons?since=2026-10-11&until=2026-10-16","width":390,"height":844,"innerWidth":390,"screenWidth":390,"scheme":"dark","scrollWidth":390,"targets":32,"small":[],"tinyFields":[],"gutters":[],"offOrigin":[],"problems":[],"ok":true,"shot":"/opt/cursor/artifacts/war-room/phone-lessons-390-dark.png"}
{"url":"http://127.0.0.1:45920/#/lessons?since=2026-10-11&until=2026-10-16","width":430,"height":932,"innerWidth":430,"screenWidth":430,"scheme":"light","scrollWidth":430,"targets":32,"small":[],"tinyFields":[],"gutters":[],"offOrigin":[],"problems":[],"ok":true,"shot":"/opt/cursor/artifacts/war-room/phone-lessons-430-light.png"}
{"url":"http://127.0.0.1:45920/#/lessons?since=2026-10-11&until=2026-10-16","width":430,"height":932,"innerWidth":430,"screenWidth":430,"scheme":"dark","scrollWidth":430,"targets":32,"small":[],"tinyFields":[],"gutters":[],"offOrigin":[],"problems":[],"ok":true,"shot":"/opt/cursor/artifacts/war-room/phone-lessons-430-dark.png"}
{"url":"http://127.0.0.1:45920/","width":390,"height":844,"innerWidth":390,"screenWidth":390,"scheme":"dark","scrollWidth":390,"targets":14,"small":[],"tinyFields":[],"gutters":[],"offOrigin":[],"problems":[],"ok":true,"shot":"/opt/cursor/artifacts/war-room/phone-form-sending.png"}
{"url":"http://127.0.0.1:45920/","width":1280,"height":800,"innerWidth":1280,"screenWidth":1280,"scheme":"dark","scrollWidth":1280,"targets":14,"small":[{"tag":"a","name":"Locker Room","w":98,"h":22},{"tag":"button","name":"Add pick","w":96,"h":35},{"tag":"a","name":"p-20261011-01","w":98,"h":17},{"tag":"a","name":"p-20261012-01","w":99,"h":17},{"tag":"a","name":"p-20261013-01","w":99,"h":17},{"tag":"a","name":"p-20261014-01","w":99,"h":17},{"tag":"a","name":"p-20261015-01","w":99,"h":17},{"tag":"a","name":"p-20261017-01","w":99,"h":17},{"tag":"a","name":"p-20261017-02","w":99,"h":17},{"tag":"a","name":"p-20261017-03","w":99,"h":17},{"tag":"a","name":"p-20261017-04","w":99,"h":17}],"tinyFields":[],"gutters":[],"offOrigin":[],"problems":["W8 a \"Locker Room\" is 98x22 (< 44x44)","W8 button \"Add pick\" is 96x35 (< 44x44)","W8 a \"p-20261011-01\" is 98x17 (< 44x44)","W8 a \"p-20261012-01\" is 99x17 (< 44x44)","W8 a \"p-20261013-01\" is 99x17 (< 44x44)","W8 a \"p-20261014-01\" is 99x17 (< 44x44)","W8 a \"p-20261015-01\" is 99x17 (< 44x44)","W8 a \"p-20261017-01\" is 99x17 (< 44x44)","W8 a \"p-20261017-02\" is 99x17 (< 44x44)","W8 a \"p-20261017-03\" is 99x17 (< 44x44)","W8 a \"p-20261017-04\" is 99x17 (< 44x44)"],"ok":false,"shot":"/opt/cursor/artifacts/war-room/phone-desktop-board.png"}
```

Chip arrays are omitted above where they matched the family ratios already printed by the probe (dark drafted 4.78, failed 4.83, intake 9.71, work 4.94, review 5.83; light drafted 6.83, failed 6.71, intake 14.07, work 7.27, review 8.18). Every phone line had `"offOrigin":[]` and an empty `problems` array.

**Safety-fact proof.** W15 loads `src/ui/` through `test/fixtures/phone/dom-harness.mjs`. For ok, policy, error, hostile, reject, and badjson it submits three times in one tick, redraws twice with nothing focused, then settles.

```text
SAFETY [{"outcome":"ok","posts":1,"status":"Queued in the inbox. Nothing launches from this page.","enabled":true,"idea":"","urls":["GET /api/board","POST /api/intake","GET /api/board","GET /api/board","GET /api/board"],"eventSource":"/api/events","hostileNodes":0},{"outcome":"policy","posts":1,"status":"Queued in the inbox. Policy will refuse it (fixture-rule).","enabled":true,"idea":"","urls":["GET /api/board","POST /api/intake","GET /api/board","GET /api/board","GET /api/board"],"eventSource":"/api/events","hostileNodes":0},{"outcome":"error","posts":1,"status":"target is not in targets.json","enabled":true,"idea":"idea for error","urls":["GET /api/board","POST /api/intake","GET /api/board","GET /api/board"],"eventSource":"/api/events","hostileNodes":0},{"outcome":"hostile","posts":1,"status":"<img src=x onerror=alert(1)><script>alert(2)</script>","enabled":true,"idea":"idea for hostile","urls":["GET /api/board","POST /api/intake","GET /api/board","GET /api/board"],"eventSource":"/api/events","hostileNodes":0},{"outcome":"reject","posts":1,"status":"Could not reach the War Room. Check the Big Board before trying again.","enabled":true,"idea":"idea for reject","urls":["GET /api/board","POST /api/intake","GET /api/board","GET /api/board"],"eventSource":"/api/events","hostileNodes":0},{"outcome":"badjson","posts":1,"status":"Could not reach the War Room. Check the Big Board before trying again.","enabled":true,"idea":"idea for badjson","urls":["GET /api/board","POST /api/intake","GET /api/board","GET /api/board"],"eventSource":"/api/events","hostileNodes":0}]
```

Unhandled rejections: none. Hostile text is only `textContent`. No `img`, `script`, or `iframe`, and no `on*` attribute. Chrome `offOrigin` on every phone probe line is `[]`.

**Stack probe**

```text
on-stack
FETCH_HEAD e242a533d04d68a5a4472bce283eb06866e79d96
START_REF unchanged
```

`git diff --name-only START...HEAD`:

```text
.cursor/skills/verify-draft-day/SKILL.md
.cursor/skills/verify-draft-day/features/README.md
.cursor/skills/verify-draft-day/features/new-pick.md
.cursor/skills/verify-draft-day/features/phone.md
docs/DECISIONS.tsv
src/ui/app.js
src/ui/index.html
src/ui/lessons.css
src/ui/styles.css
src/ui/timeline.css
test/fixtures/phone/board-states.json
test/fixtures/phone/cdp-shot.mjs
test/fixtures/phone/dom-harness.d.mts
test/fixtures/phone/dom-harness.mjs
test/fixtures/phone/probe.js
test/phone.test.ts
```

**Open questions.** Should the 1280 layout also grow tap targets to 44px, or does the 480px cut stay? Should dark inputs keep `var(--line)` so the border stays `#3a4632`, with `--field-line` reserved for light?
