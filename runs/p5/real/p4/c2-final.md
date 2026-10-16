Mode S is in the tree (`src/ui/lessons.js` exists). The phone layer is on `dd/p4-phone-b` at `3075b514f9769351f0d9ddad59600b85c524e802`. No pull request was opened.

```dd-report
{"branch":"dd/p4-phone-b","headSha":"3075b514f9769351f0d9ddad59600b85c524e802","summary":"Phone War Room: one intake record (idle, sending, done, failed) painted onto the New pick form, and one light/dark token set so 390 and 430 stay in view in both schemes.","commands":[{"cmd":"npm test","exit":0},{"cmd":"npx tsc --noEmit","exit":0},{"cmd":"node --experimental-strip-types src/cli/dd.ts selftest","exit":0}],"tests":{"added":21,"passing":true},"screenshots":["phone-board-390-light.png","phone-board-390-dark.png","phone-board-430-light.png","phone-board-430-dark.png","phone-pick-390-light.png","phone-pick-390-dark.png","phone-pick-430-light.png","phone-pick-430-dark.png","phone-lessons-390-light.png","phone-lessons-390-dark.png","phone-lessons-430-light.png","phone-lessons-430-dark.png","phone-form-sending.png","phone-form-kept.png","phone-desktop-board.png"],"risks":[]}
```

**Mode S.** START_REF `dd/p3-lessons`. START `e242a533d04d68a5a4472bce283eb06866e79d96`.

**What works.** The New pick form is one module record with phase `idle`, `sending`, `done`, or `failed`, the kept idea, and the last sentence. `intakeOutcome` maps an answer or a thrown error through one outcome table. `paintIntake` writes that record onto the form on screen, including a form a live update just rebuilt. One submit sends one `POST /api/intake`. Success, policy, a JSON error, a rejected fetch, and a non-JSON body each end in the spec sentence, with the idea cleared or kept, and `Add pick` enabled again. Colors live in the light `:root` block and the dark block. At 390 and 430 the Big Board, the close pick (`p-20261017-04`), and the Locker Room stay within the viewport in light and dark. Tap targets are at least 44×44, chips are 16 px and 38.4 px tall, and `offOrigin` is empty. At 1280 the Big Board is still the five-column table. `npm test` is 145 passing. `npx tsc --noEmit` exits 0. `dd selftest` prints `happy p-20261017-01 drafted`, `policy p-20261017-02 failed`, `walkover p-20261017-03 drafted`, `close p-20261017-04 drafted`. `dd doctor` prints `node: pass 22.14.0`, `data: pass /workspace/data`, `config: pass`, `targets: pass 1`, `port: pass 4420`. The verify doctor also passed on the disposable server (`port: fail 45920 in use` while that server held the port).

**What does not.** The verify steps above passed. The Locker Room week list is taller than the phone viewport, so the screenshot shows the top of the page and the rest scrolls vertically.

**Screenshots.** `/opt/cursor/artifacts/war-room/phone-board-390-light.png`, `phone-board-390-dark.png`, `phone-board-430-light.png`, `phone-board-430-dark.png`, `phone-pick-390-light.png`, `phone-pick-390-dark.png`, `phone-pick-430-light.png`, `phone-pick-430-dark.png`, `phone-lessons-390-light.png`, `phone-lessons-390-dark.png`, `phone-lessons-430-light.png`, `phone-lessons-430-dark.png`, `phone-form-sending.png`, `phone-form-kept.png`, `phone-desktop-board.png`. They were still there after `control.sh cleanup`. The sending and kept shots use `#idea` and `#new-pick`.

**Probe JSON lines.**

```json
{"url":"http://127.0.0.1:45920/","width":390,"height":844,"innerWidth":390,"screenWidth":390,"scheme":"light","scrollWidth":390,"targets":9,"small":[],"tinyFields":[],"gutters":[],"offOrigin":[],"problems":[],"ok":true,"shot":"/opt/cursor/artifacts/war-room/phone-board-390-light.png"}
{"url":"http://127.0.0.1:45920/#/picks/p-20261017-04","width":390,"height":844,"innerWidth":390,"screenWidth":390,"scheme":"light","scrollWidth":390,"targets":4,"small":[],"tinyFields":[],"gutters":[],"offOrigin":[],"problems":[],"ok":true,"shot":"/opt/cursor/artifacts/war-room/phone-pick-390-light.png"}
{"url":"http://127.0.0.1:45920/","width":390,"height":844,"innerWidth":390,"screenWidth":390,"scheme":"dark","scrollWidth":390,"targets":9,"small":[],"tinyFields":[],"gutters":[],"offOrigin":[],"problems":[],"ok":true,"shot":"/opt/cursor/artifacts/war-room/phone-board-390-dark.png"}
{"url":"http://127.0.0.1:45920/#/picks/p-20261017-04","width":390,"height":844,"innerWidth":390,"screenWidth":390,"scheme":"dark","scrollWidth":390,"targets":4,"small":[],"tinyFields":[],"gutters":[],"offOrigin":[],"problems":[],"ok":true,"shot":"/opt/cursor/artifacts/war-room/phone-pick-390-dark.png"}
{"url":"http://127.0.0.1:45920/","width":430,"height":932,"innerWidth":430,"screenWidth":430,"scheme":"light","scrollWidth":430,"targets":9,"small":[],"tinyFields":[],"gutters":[],"offOrigin":[],"problems":[],"ok":true,"shot":"/opt/cursor/artifacts/war-room/phone-board-430-light.png"}
{"url":"http://127.0.0.1:45920/#/picks/p-20261017-04","width":430,"height":932,"innerWidth":430,"screenWidth":430,"scheme":"light","scrollWidth":430,"targets":4,"small":[],"tinyFields":[],"gutters":[],"offOrigin":[],"problems":[],"ok":true,"shot":"/opt/cursor/artifacts/war-room/phone-pick-430-light.png"}
{"url":"http://127.0.0.1:45920/","width":430,"height":932,"innerWidth":430,"screenWidth":430,"scheme":"dark","scrollWidth":430,"targets":9,"small":[],"tinyFields":[],"gutters":[],"offOrigin":[],"problems":[],"ok":true,"shot":"/opt/cursor/artifacts/war-room/phone-board-430-dark.png"}
{"url":"http://127.0.0.1:45920/#/picks/p-20261017-04","width":430,"height":932,"innerWidth":430,"screenWidth":430,"scheme":"dark","scrollWidth":430,"targets":4,"small":[],"tinyFields":[],"gutters":[],"offOrigin":[],"problems":[],"ok":true,"shot":"/opt/cursor/artifacts/war-room/phone-pick-430-dark.png"}
{"url":"http://127.0.0.1:45920/#/lessons?since=2026-10-11&until=2026-10-16","width":390,"height":844,"innerWidth":390,"screenWidth":390,"scheme":"light","scrollWidth":390,"targets":32,"small":[],"tinyFields":[],"gutters":[],"offOrigin":[],"problems":[],"ok":true,"shot":"/opt/cursor/artifacts/war-room/phone-lessons-390-light.png"}
{"url":"http://127.0.0.1:45920/#/lessons?since=2026-10-11&until=2026-10-16","width":390,"height":844,"innerWidth":390,"screenWidth":390,"scheme":"dark","scrollWidth":390,"targets":32,"small":[],"tinyFields":[],"gutters":[],"offOrigin":[],"problems":[],"ok":true,"shot":"/opt/cursor/artifacts/war-room/phone-lessons-390-dark.png"}
{"url":"http://127.0.0.1:45920/#/lessons?since=2026-10-11&until=2026-10-16","width":430,"height":932,"innerWidth":430,"screenWidth":430,"scheme":"light","scrollWidth":430,"targets":32,"small":[],"tinyFields":[],"gutters":[],"offOrigin":[],"problems":[],"ok":true,"shot":"/opt/cursor/artifacts/war-room/phone-lessons-430-light.png"}
{"url":"http://127.0.0.1:45920/#/lessons?since=2026-10-11&until=2026-10-16","width":430,"height":932,"innerWidth":430,"screenWidth":430,"scheme":"dark","scrollWidth":430,"targets":32,"small":[],"tinyFields":[],"gutters":[],"offOrigin":[],"problems":[],"ok":true,"shot":"/opt/cursor/artifacts/war-room/phone-lessons-430-dark.png"}
{"url":"http://127.0.0.1:45920/","width":390,"height":844,"innerWidth":390,"screenWidth":390,"scheme":"dark","scrollWidth":390,"targets":9,"small":[],"tinyFields":[],"gutters":[],"offOrigin":[],"problems":[],"ok":true,"shot":"/opt/cursor/artifacts/war-room/phone-form-sending.png"}
{"url":"http://127.0.0.1:45920/","width":390,"height":844,"innerWidth":390,"screenWidth":390,"scheme":"dark","scrollWidth":390,"targets":9,"small":[],"tinyFields":[],"gutters":[],"offOrigin":[],"problems":[],"ok":true,"shot":"/opt/cursor/artifacts/war-room/phone-form-kept.png"}
{"url":"http://127.0.0.1:45920/","width":1280,"height":800,"innerWidth":1280,"screenWidth":1280,"scheme":"light","scrollWidth":1280,"targets":9,"small":[],"tinyFields":[],"gutters":[],"offOrigin":[],"problems":[],"ok":true,"shot":"/opt/cursor/artifacts/war-room/phone-desktop-board.png"}
```

**Safety-fact proof.** `test/phone.test.ts` "W15 safety fact each intake outcome" loads `src/ui/` through `test/fixtures/phone/dom-harness.mjs`. For ok, policy, a hostile 400, a rejected fetch, and a non-JSON body it submits three times in one tick, blurs, redraws twice, then settles:

```text
safety {"outcome":"ok","posts":1,"status":"Queued in the inbox. Nothing launches from this page.","enabled":true,"idea":"","kept":true,"markup":[],"fetches":true,"eventSource":["/api/events"]}
safety {"outcome":"policy","posts":1,"status":"Queued in the inbox. Policy will refuse it (fixture-rule).","enabled":true,"idea":"","kept":true,"markup":[],"fetches":true,"eventSource":["/api/events"]}
safety {"outcome":"error","posts":1,"status":"<img src=x onerror=alert(1)><script>alert(2)</script>","enabled":true,"idea":"Show the run count in the page title","kept":true,"markup":[],"fetches":true,"eventSource":["/api/events"]}
safety {"outcome":"reject","posts":1,"status":"Could not reach the War Room. Check the Big Board before trying again.","enabled":true,"idea":"Show the run count in the page title","kept":true,"markup":[],"fetches":true,"eventSource":["/api/events"]}
safety {"outcome":"badjson","posts":1,"status":"Could not reach the War Room. Check the Big Board before trying again.","enabled":true,"idea":"Show the run count in the page title","kept":true,"markup":[],"fetches":true,"eventSource":["/api/events"]}
```

Every probe line above has `"offOrigin":[]`.

**Stack probe.** `git merge-base --is-ancestor START HEAD` printed `on-stack`. `git fetch origin dd/p3-lessons` then `git rev-parse FETCH_HEAD` is `e242a533d04d68a5a4472bce283eb06866e79d96`. START_REF unchanged.

`sha256sum test/fixtures/phone/*` matches the spec (board-states `69bd992f…`, cdp-shot `cd415c28…`, dom-harness.d.mts `1a9b11ef…`, dom-harness.mjs `a696695e…`, probe `ce6b841d…`). `git diff --quiet START -- test/guards.test.ts src/server/http.ts package.json` printed `untouched`.

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

**Open questions.** None. Dark `--field-line` is `#8d9478` so it clears 3:1, and input borders stay `var(--line)` so the dark edge stays today's color. That choice is in `docs/DECISIONS.tsv`.
