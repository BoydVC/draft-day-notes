Mode S is in place on `dd/p4-phone-c` (`8b52c4cd9ed0595b981de965a36e5ea1fdc5bf8a`). No pull request was opened.

At 600 px and below, the Big Board keeps one table and stacks each pick as a card: idea first, then the chip, then the id link, stage, and runs, labeled from `data-label`. `Add pick` spans the form. Light and dark colors come from the two token blocks. The New pick form keeps `Sending…`, the outcome sentence, and a failed idea across redraws, and one submit stays one `POST /api/intake`.

```dd-report
{"branch":"dd/p4-phone-c","headSha":"8b52c4cd9ed0595b981de965a36e5ea1fdc5bf8a","summary":"Phone War Room: light and dark tokens, a 600px card stack on the Big Board, and a New pick form whose status and idea survive redraws.","commands":[{"cmd":"npm test","exit":0},{"cmd":"npx tsc --noEmit","exit":0},{"cmd":"node --experimental-strip-types src/cli/dd.ts selftest","exit":0}],"tests":{"added":18,"passing":true},"screenshots":["phone-board-390-light.png","phone-board-390-dark.png","phone-board-430-light.png","phone-board-430-dark.png","phone-pick-390-light.png","phone-pick-390-dark.png","phone-pick-430-light.png","phone-pick-430-dark.png","phone-lessons-390-light.png","phone-lessons-390-dark.png","phone-lessons-430-light.png","phone-lessons-430-dark.png","phone-form-sending.png","phone-form-kept.png","phone-desktop-board.png"],"risks":[]}
```

Mode S. START `e242a533d04d68a5a4472bce283eb06866e79d96` (`dd/p3-lessons`). `src/ui/lessons.js` is in the tree.

What works: `npm test` is 142 passing, including W1–W18. `npx tsc --noEmit` exits 0. `dd selftest` prints `DATA_DIR=/tmp/dd-selftest-abVuO9`, `happy p-20261017-01 drafted`, `policy p-20261017-02 failed`, `walkover p-20261017-03 drafted`, `close p-20261017-04 drafted`. `dd doctor` prints `node: pass 22.14.0`, `data: pass`, `config: pass`, `targets: pass 1`, `port: pass 4420`. The five fixture sha256 values match the spec. `test/guards.test.ts`, `src/server/http.ts`, and `package.json` are untouched. Every probe below has `"ok":true` and `"offOrigin":[]`. Cleanup left the screenshots in place.

What does not: nothing in the VERIFY list failed. Above 600 px the Big Board stays the five-column table, which is what the 1280×800 shot shows.

Screenshot paths:

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

Probe JSON lines:

```json
{"url":"http://127.0.0.1:45920/","width":390,"height":844,"innerWidth":390,"screenWidth":390,"scheme":"light","scrollWidth":390,"targets":9,"small":[],"tinyFields":[],"gutters":[],"offOrigin":[],"problems":[],"ok":true,"shot":"/opt/cursor/artifacts/war-room/phone-board-390-light.png"}
{"url":"http://127.0.0.1:45920/#/picks/p-20261017-04","width":390,"height":844,"innerWidth":390,"screenWidth":390,"scheme":"light","scrollWidth":390,"targets":4,"small":[],"tinyFields":[],"gutters":[],"offOrigin":[],"problems":[],"ok":true,"shot":"/opt/cursor/artifacts/war-room/phone-pick-390-light.png"}
{"url":"http://127.0.0.1:45920/","width":390,"height":844,"innerWidth":390,"screenWidth":390,"scheme":"dark","scrollWidth":390,"targets":9,"small":[],"tinyFields":[],"gutters":[],"offOrigin":[],"problems":[],"ok":true,"shot":"/opt/cursor/artifacts/war-room/phone-board-390-dark.png"}
{"url":"http://127.0.0.1:45920/#/picks/p-20261017-04","width":390,"height":844,"innerWidth":390,"screenWidth":390,"scheme":"dark","scrollWidth":390,"targets":4,"small":[],"tinyFields":[],"gutters":[],"offOrigin":[],"problems":[],"ok":true,"shot":"/opt/cursor/artifacts/war-room/phone-pick-390-dark.png"}
{"url":"http://127.0.0.1:45920/","width":430,"height":932,"innerWidth":430,"screenWidth":430,"scheme":"light","scrollWidth":430,"targets":9,"small":[],"tinyFields":[],"gutters":[],"offOrigin":[],"problems":[],"ok":true,"shot":"/opt/cursor/artifacts/war-room/phone-board-430-light.png"}
{"url":"http://127.0.0.1:45920/#/picks/p-20261017-04","width":430,"height":932,"innerWidth":430,"screenWidth":430,"scheme":"light","scrollWidth":430,"targets":4,"small":[],"tinyFields":[],"gutters":[],"offOrigin":[],"problems":[],"ok":true,"shot":"/opt/cursor/artifacts/war-room/phone-pick-430-light.png"}
{"url":"http://127.0.0.1:45920/","width":430,"height":932,"innerWidth":430,"screenWidth":430,"scheme":"dark","scrollWidth":430,"targets":9,"small":[],"tinyFields":[],"gutters":[],"offOrigin":[],"problems":[],"ok":true,"shot":"/opt/cursor/artifacts/war-room/phone-board-430-dark.png"}
{"url":"http://127.0.0.1:45920/#/picks/p-20261017-04","width":430,"height":932,"innerWidth":430,"screenWidth":430,"scheme":"dark","scrollWidth":430,"targets":4,"small":[],"tinyFields":[],"gutters":[],"offOrigin":[],"problems":[],"ok":true,"shot":"/opt/cursor/artifacts/war-room/phone-pick-430-dark.png"}
{"url":"http://127.0.0.1:45920/#/lessons?since=2026-10-11&until=2026-10-16","width":390,"height":844,"scheme":"light","scrollWidth":390,"targets":32,"small":[],"tinyFields":[],"gutters":[],"offOrigin":[],"problems":[],"ok":true,"shot":"/opt/cursor/artifacts/war-room/phone-lessons-390-light.png"}
{"url":"http://127.0.0.1:45920/#/lessons?since=2026-10-11&until=2026-10-16","width":390,"height":844,"scheme":"dark","scrollWidth":390,"targets":32,"small":[],"tinyFields":[],"gutters":[],"offOrigin":[],"problems":[],"ok":true,"shot":"/opt/cursor/artifacts/war-room/phone-lessons-390-dark.png"}
{"url":"http://127.0.0.1:45920/#/lessons?since=2026-10-11&until=2026-10-16","width":430,"height":932,"scheme":"light","scrollWidth":430,"targets":32,"small":[],"tinyFields":[],"gutters":[],"offOrigin":[],"problems":[],"ok":true,"shot":"/opt/cursor/artifacts/war-room/phone-lessons-430-light.png"}
{"url":"http://127.0.0.1:45920/#/lessons?since=2026-10-11&until=2026-10-16","width":430,"height":932,"scheme":"dark","scrollWidth":430,"targets":32,"small":[],"tinyFields":[],"gutters":[],"offOrigin":[],"problems":[],"ok":true,"shot":"/opt/cursor/artifacts/war-room/phone-lessons-430-dark.png"}
{"url":"http://127.0.0.1:45920/","width":390,"height":844,"scheme":"dark","scrollWidth":390,"offOrigin":[],"problems":[],"ok":true,"shot":"/opt/cursor/artifacts/war-room/phone-form-sending.png"}
{"url":"http://127.0.0.1:45920/","width":390,"height":844,"scheme":"dark","scrollWidth":390,"offOrigin":[],"problems":[],"ok":true,"shot":"/opt/cursor/artifacts/war-room/phone-form-kept.png"}
{"url":"http://127.0.0.1:45920/","width":1280,"height":800,"scheme":"light","scrollWidth":1280,"offOrigin":[],"problems":[],"ok":true,"shot":"/opt/cursor/artifacts/war-room/phone-desktop-board.png"}
```

Safety-fact proof output (harness: three submits in one tick, two unfocused redraws, then settle, for ok, policy, 400, 500, non-JSON, rejected fetch, and the hostile error string):

```text
SAFETY [{"outcome":"ok","posts":1,"status":"Queued in the inbox. Nothing launches from this page.","idea":"","enabled":true,"sources":["/api/events"],"bad":[]},{"outcome":"policy","posts":1,"status":"Queued in the inbox. Policy will refuse it (fixture-rule).","idea":"","enabled":true,"sources":["/api/events"],"bad":[]},{"outcome":"error","posts":1,"status":"target is not in targets.json","idea":"Show the run count in the page title","enabled":true,"sources":["/api/events"],"bad":[]},{"outcome":"server","posts":1,"status":"server broke","idea":"Show the run count in the page title","enabled":true,"sources":["/api/events"],"bad":[]},{"outcome":"badjson","posts":1,"status":"Could not reach the War Room. Check the Big Board before trying again.","idea":"Show the run count in the page title","enabled":true,"sources":["/api/events"],"bad":[]},{"outcome":"reject","posts":1,"status":"Could not reach the War Room. Check the Big Board before trying again.","idea":"Show the run count in the page title","enabled":true,"sources":["/api/events"],"bad":[]},{"outcome":"hostile","posts":1,"status":"<img src=x onerror=alert(1)><script>alert(2)</script>","idea":"Show the run count in the page title","enabled":true,"sources":["/api/events"],"bad":[]}]
```

Every probe line above has `"offOrigin":[]`.

Stack-probe output:

```text
on-stack
FETCH_HEAD e242a533d04d68a5a4472bce283eb06866e79d96
START_REF unchanged
```

`git diff --name-only e242a533d04d68a5a4472bce283eb06866e79d96...HEAD` is only the touch-map paths: `src/ui/index.html`, `src/ui/styles.css`, `src/ui/timeline.css`, `src/ui/lessons.css`, `src/ui/app.js`, `test/phone.test.ts`, `test/fixtures/phone/*`, the verify skill's `SKILL.md`, `features/README.md`, `features/new-pick.md`, `features/phone.md`, and `docs/DECISIONS.tsv`.

Open questions: none.
