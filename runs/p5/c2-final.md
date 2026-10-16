Replay is on `dd/p5-replay-b` at `0e21bfb02fb3d126a9d4a96ccaf3d4bcdf2db36b`. The film is a scoreboard and a lower third; at 1280 px the runs sit in lanes beside the film, and on a phone the five controls sit in one safe-area bar under the film. This run opened no pull request.

<img alt="Pick 4 at event 11, 390 px dark: clock +2h 53m, judging, Film Room, and the four lanes" src="/opt/cursor/artifacts/war-room/replay-94-at11-390-dark.png" />
<img alt="Same frame at 1280 px light, lanes beside the film" src="/opt/cursor/artifacts/war-room/replay-94-at11-1280-light.png" />
<img alt="Play advanced to Event 6 of 20 with Pause showing" src="/opt/cursor/artifacts/war-room/replay-play-390-dark.png" />
<img alt="Live update kept event 20 and the counter became Event 20 of 21" src="/opt/cursor/artifacts/war-room/replay-live-390-dark.png" />

```dd-report
{"branch":"dd/p5-replay-b","headSha":"0e21bfb02fb3d126a9d4a96ccaf3d4bcdf2db36b","summary":"Replay plays a pick back one event at a time from the timeline the server already serves: a scoreboard and lower third, lanes beside the film from 960px, and a safe-area thumb bar on a phone.","commands":[{"cmd":"npm test","exit":0},{"cmd":"npx tsc --noEmit","exit":0},{"cmd":"node --experimental-strip-types src/cli/dd.ts selftest","exit":0}],"tests":{"added":19,"passing":true},"screenshots":["docs/screens/p5-replay/replay-94-at1-390-light.png","docs/screens/p5-replay/replay-94-at11-390-dark.png","docs/screens/p5-replay/replay-94-at20-390-dark.png","docs/screens/p5-replay/replay-94-at11-430-dark.png","docs/screens/p5-replay/replay-94-at11-1280-light.png","docs/screens/p5-replay/replay-94-at20-1280-dark.png","docs/screens/p5-replay/replay-93-at21-390-dark.png","docs/screens/p5-replay/replay-play-390-dark.png","docs/screens/p5-replay/replay-live-390-dark.png","docs/screens/p5-replay/pick-94-390-dark.png"],"risks":[]}
```

START: `c6cfad415576c2c14653955aff972a6d8c613ab1` (`dd/p4-phone`). HEAD `0e21bfb02fb3d126a9d4a96ccaf3d4bcdf2db36b` is a descendant. `git fetch origin dd/p4-phone` left `FETCH_HEAD` equal to that commit, so START_REF is unchanged.

What works: `npm test` is 238 passing, 0 failing, including R1–R18 and `R safety fact`. `npx tsc --noEmit` exits 0. `dd selftest` prints `happy p-20261017-01 drafted`, `policy p-20261017-02 failed`, `walkover p-20261017-03 drafted`, `close p-20261017-04 drafted`. Doctor on the verify server printed `doctor: pass http://127.0.0.1:45920 pid 5173` (`port: fail 45920 in use` because that server holds the port). `seed-replay` printed `seeded replay`. All 18 film probes are `"ok":true` with `"offOrigin":[]`, `scrollWidth` equal to the width, and one chip (`intake` at 1, `judging` at 11, `drafted` at 20). The pick page is `"ok":true` at 390 and 430 in both schemes. At 1280 light its problem list does not name Replay. The fix-loop frame of `p-20261017-93?at=21` is `"ok":true`. Play from `?at=1&play=1` after 4500 ms shows Event 6 of 20, status `combine`, and Pause. The live shot, run last, shows Event 20 of 21 and the sentence that pull request #6 is confirmed as a draft. The twelve fixtures match the spec sha256 values. `git diff --quiet START` on the do-not-touch paths prints `untouched`. `src/server/http.ts` changes only the static `files` array, adding `"/replay.js"` and `"/replay.css"`.

What does not: the 1280×800 light pick-page probe is `"ok":false` because Big Board, Pass 1, Pass 2, Draft PR #6, and the agent links are under 44×44. Replay is absent from that list. The live shot needed no reseed and no 8000 ms retry.

Screenshot paths:

- `/opt/cursor/artifacts/war-room/` holds the 18 film shots, the five pick-page shots, the fix-loop shot, the play shot, and the live shot.
- Committed copies: `docs/screens/p5-replay/replay-94-at1-390-light.png`, `docs/screens/p5-replay/replay-94-at11-390-dark.png`, `docs/screens/p5-replay/replay-94-at20-390-dark.png`, `docs/screens/p5-replay/replay-94-at11-430-dark.png`, `docs/screens/p5-replay/replay-94-at11-1280-light.png`, `docs/screens/p5-replay/replay-94-at20-1280-dark.png`, `docs/screens/p5-replay/replay-93-at21-390-dark.png`, `docs/screens/p5-replay/replay-play-390-dark.png`, `docs/screens/p5-replay/replay-live-390-dark.png`, `docs/screens/p5-replay/pick-94-390-dark.png`.
- Cleanup removed the verify data directory. Those screenshots are still on disk.

Probe fields (`ok`, `scrollWidth`, chip status, `problems`, `offOrigin`):

```text
at=1  390 light  ok true  scrollWidth 390  chips [intake]   problems []  offOrigin []
at=1  390 dark   ok true  scrollWidth 390  chips [intake]   problems []  offOrigin []
at=1  430 light  ok true  scrollWidth 430  chips [intake]   problems []  offOrigin []
at=1  430 dark   ok true  scrollWidth 430  chips [intake]   problems []  offOrigin []
at=1  1280 light ok true  scrollWidth 1280 chips [intake]   problems []  offOrigin []
at=1  1280 dark  ok true  scrollWidth 1280 chips [intake]   problems []  offOrigin []
at=11 390 light  ok true  scrollWidth 390  chips [judging]  problems []  offOrigin []
at=11 390 dark   ok true  scrollWidth 390  chips [judging]  problems []  offOrigin []
at=11 430 light  ok true  scrollWidth 430  chips [judging]  problems []  offOrigin []
at=11 430 dark   ok true  scrollWidth 430  chips [judging]  problems []  offOrigin []
at=11 1280 light ok true  scrollWidth 1280 chips [judging]  problems []  offOrigin []
at=11 1280 dark  ok true  scrollWidth 1280 chips [judging]  problems []  offOrigin []
at=20 390 light  ok true  scrollWidth 390  chips [drafted]  problems []  offOrigin []
at=20 390 dark   ok true  scrollWidth 390  chips [drafted]  problems []  offOrigin []
at=20 430 light  ok true  scrollWidth 430  chips [drafted]  problems []  offOrigin []
at=20 430 dark   ok true  scrollWidth 430  chips [drafted]  problems []  offOrigin []
at=20 1280 light ok true  scrollWidth 1280 chips [drafted]  problems []  offOrigin []
at=20 1280 dark  ok true  scrollWidth 1280 chips [drafted]  problems []  offOrigin []
pick 390 light   ok true  scrollWidth 390  problems []  offOrigin []
pick 390 dark    ok true  scrollWidth 390  problems []  offOrigin []
pick 430 light   ok true  scrollWidth 430  problems []  offOrigin []
pick 430 dark    ok true  scrollWidth 430  problems []  offOrigin []
pick 1280 light  ok false scrollWidth 1280 offOrigin [] problems ["W8 a \"Big Board\" is 74x22 (< 44x44)","W8 button \"Pass 1\" is 76x33 (< 44x44)","W8 button \"Pass 2\" is 76x33 (< 44x44)","W8 a \"Draft PR #6\" is 77x17 (< 44x44)","W8 a \"Agent c1 attempt 1\" is 122x17 (< 44x44)","W8 a \"Agent c2 attempt 1\" is 122x17 (< 44x44)","W8 a \"Agent c3 attempt 1\" is 122x17 (< 44x44)","W8 a \"Agent Film Room pass 1\" is 160x17 (< 44x44)","W8 a \"Agent Film Room pass 2\" is 160x17 (< 44x44)","W8 a \"Agent Trade\" is 80x17 (< 44x44)","W8 a \"Agent Physical\" is 97x17 (< 44x44)"]
fix 93 at=21 390 dark ok true scrollWidth 390 chips [drafted] problems [] offOrigin []
play 390 dark    ok true  scrollWidth 390  chips [combine]  problems []  offOrigin []
live 390 dark    ok true  scrollWidth 390  chips [drafted]  problems []  offOrigin []
```

Safety-fact proof:

```text
# SAFETY {"safety":"pass","fixtures":6,"pending":[0,0,0,0,0,0],"sources":[1,1,1,1,1,1]}
```

Every VERIFY 6 probe line has `"offOrigin":[]`.

Stack probe:

```text
on-stack
FETCH_HEAD=c6cfad415576c2c14653955aff972a6d8c613ab1
START_REF unchanged
```

`git diff --name-only c6cfad415576c2c14653955aff972a6d8c613ab1...HEAD` is the touch map: `replay.js`, `replay.css`, `test/replay.test.ts`, the twelve `test/fixtures/replay/` files, `features/replay.md`, the ten `docs/screens/p5-replay/` pngs, `index.html`, `src/server/http.ts`, `app.js`, the two-line W5 hunk in `test/phone.test.ts`, `SKILL.md`, `features/README.md`, `helpers/control.sh`, and `docs/DECISIONS.tsv`.

Open questions: none.
