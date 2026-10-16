Draft PR #7 at `d1bd73c075173336f2d3a15b3a2ee288163b7b32` is **VERIFIED**. The War Room journeys, the safety-fact run, and the touch map all hold. The pull request is still a draft. Nothing was pushed, merged, or marked ready.

CI input: `gh pr checks 7` reported no checks on `dd/p5-replay`. That is not a green signal, and it is not the verdict.

## Gates

`npm test` — 256 pass, 0 fail. `npx tsc --noEmit` exit 0.

`dd selftest` exit 0:

```
DATA_DIR=/tmp/dd-selftest-Xhxj0B
happy p-20261018-01 drafted
policy p-20261018-02 failed
walkover p-20261018-03 drafted
close p-20261018-04 drafted
```

`dd doctor` exit 0:

```
node: pass 22.14.0
data: pass /workspace/data
config: pass
targets: pass 1
port: pass 4420
```

Skill doctor, with the War Room holding the port, printed `port: fail 45920 in use` and then `doctor: pass http://127.0.0.1:45920 pid 5037`. `seed-replay` printed `seeded replay`.

All twelve `sha256sum test/fixtures/replay/*` values match SPEC 006. `cdp-shot.mjs` is `cd415c2852a94409c35077437ede7089c7c9b654359e7173a6cb1d9caf5f42a6` and `probe.js` is `ce6b841dabf400660026f2e4e3817a8b29d98ff09832725f72779ce71cd99514`. The untouched check printed `untouched`. `package.json` has no runtime dependencies.

`git diff c6cfad4 -- src/server/http.ts` is the one static `files` line, appending `"/replay.js", "/replay.css"`.

## Journeys (`features/replay.md`)

All 18 film probes are `"ok":true`, `"offOrigin":[]`, `scrollWidth` equal to the width, `problems` empty, and exactly one chip: `intake` at `?at=1`, `judging` at `?at=11`, `drafted` at `?at=20`.

```
{"name":"replay-94-at1-390-light.png","ok":true,"scrollWidth":390,"chips":[{"status":"intake"}],"offOrigin":[],"problems":[]}
{"name":"replay-94-at1-390-dark.png","ok":true,"scrollWidth":390,"chips":[{"status":"intake"}],"offOrigin":[],"problems":[]}
{"name":"replay-94-at1-430-light.png","ok":true,"scrollWidth":430,"chips":[{"status":"intake"}],"offOrigin":[],"problems":[]}
{"name":"replay-94-at1-430-dark.png","ok":true,"scrollWidth":430,"chips":[{"status":"intake"}],"offOrigin":[],"problems":[]}
{"name":"replay-94-at1-1280-light.png","ok":true,"scrollWidth":1280,"chips":[{"status":"intake"}],"offOrigin":[],"problems":[]}
{"name":"replay-94-at1-1280-dark.png","ok":true,"scrollWidth":1280,"chips":[{"status":"intake"}],"offOrigin":[],"problems":[]}
{"name":"replay-94-at11-390-light.png","ok":true,"scrollWidth":390,"chips":[{"status":"judging"}],"offOrigin":[],"problems":[]}
{"name":"replay-94-at11-390-dark.png","ok":true,"scrollWidth":390,"chips":[{"status":"judging"}],"offOrigin":[],"problems":[]}
{"name":"replay-94-at11-430-light.png","ok":true,"scrollWidth":430,"chips":[{"status":"judging"}],"offOrigin":[],"problems":[]}
{"name":"replay-94-at11-430-dark.png","ok":true,"scrollWidth":430,"chips":[{"status":"judging"}],"offOrigin":[],"problems":[]}
{"name":"replay-94-at11-1280-light.png","ok":true,"scrollWidth":1280,"chips":[{"status":"judging"}],"offOrigin":[],"problems":[]}
{"name":"replay-94-at11-1280-dark.png","ok":true,"scrollWidth":1280,"chips":[{"status":"judging"}],"offOrigin":[],"problems":[]}
{"name":"replay-94-at20-390-light.png","ok":true,"scrollWidth":390,"chips":[{"status":"drafted"}],"offOrigin":[],"problems":[]}
{"name":"replay-94-at20-390-dark.png","ok":true,"scrollWidth":390,"chips":[{"status":"drafted"}],"offOrigin":[],"problems":[]}
{"name":"replay-94-at20-430-light.png","ok":true,"scrollWidth":430,"chips":[{"status":"drafted"}],"offOrigin":[],"problems":[]}
{"name":"replay-94-at20-430-dark.png","ok":true,"scrollWidth":430,"chips":[{"status":"drafted"}],"offOrigin":[],"problems":[]}
{"name":"replay-94-at20-1280-light.png","ok":true,"scrollWidth":1280,"chips":[{"status":"drafted"}],"offOrigin":[],"problems":[]}
{"name":"replay-94-at20-1280-dark.png","ok":true,"scrollWidth":1280,"chips":[{"status":"drafted"}],"offOrigin":[],"problems":[]}
```

Pick page at 390 and 430, light and dark: each `"ok":true`, `"offOrigin":[]`. At 1280×800 light, `"ok":false` with the eleven pre-existing W8 sizes (Big Board, Pass 1, Pass 2, Draft PR #6, and seven agent links). None of those problem names is `Replay`.

`?at=21` of `p-20261017-93` at 390 dark: `"ok":true`, one `drafted` chip, `"offOrigin":[]`.

Play from `?at=1&play=1` advanced in Chrome with `Pause` showing and `"ok":true`. The live `dd record` of `lesson_recorded` landed during the open frame: the shot shows **Event 20 of 21** and the sentence "Pull request #6 is confirmed as a draft…". The API then had 21 entries. No reseed retry was needed.

All 26 shots are under `/opt/cursor/artifacts/war-room/`. The ten committed files under `docs/screens/p5-replay/` are pixel-identical to the new captures of the same names, including play and live. Cleanup left those screenshots in place.

## Safety fact

Ran against `replay-harness.mjs` for the five fixtures, a 12-event live prefix of Pick 4, and a hostile copy of `p-20261017-99` (markup in the idea, a title, a link label, and a run label; `javascript:alert(1)` on `cand`, run `id`, and `agentId`; a 2,000-character title). Each case opened Replay, pressed Play, ticked five steps, emitted two live updates, scrubbed, pressed every button, then left for `#/`.

```
safety-fact {"pass":true,"cases":[{"label":"p-20261017-94","pickGets":{"afterOpen":1,"afterPlay":1,"afterLive":3,"afterControls":3},"eventSources":["/api/events"],"offenders":[],"badNodes":0,"badHrefs":[],"jsInHref":false,"markupShown":false,"longShown":false,"storageHits":{"localStorage":0,"sessionStorage":0,"cookie":0,"history":0},"timersAfterLeave":0,"timersAfterTick":0,"fetchesAfterLeave":0},{"label":"p-20261017-93","pickGets":{"afterOpen":1,"afterPlay":1,"afterLive":3,"afterControls":3},"eventSources":["/api/events"],"offenders":[],"badNodes":0,"badHrefs":[],"jsInHref":false,"markupShown":false,"longShown":false,"storageHits":{"localStorage":0,"sessionStorage":0,"cookie":0,"history":0},"timersAfterLeave":0,"timersAfterTick":0,"fetchesAfterLeave":0},{"label":"p-20261017-98","pickGets":{"afterOpen":1,"afterPlay":1,"afterLive":3,"afterControls":3},"eventSources":["/api/events"],"offenders":[],"badNodes":0,"badHrefs":[],"jsInHref":false,"markupShown":false,"longShown":false,"storageHits":{"localStorage":0,"sessionStorage":0,"cookie":0,"history":0},"timersAfterLeave":0,"timersAfterTick":0,"fetchesAfterLeave":0},{"label":"p-20261017-99","pickGets":{"afterOpen":1,"afterPlay":1,"afterLive":3,"afterControls":3},"eventSources":["/api/events"],"offenders":[],"badNodes":0,"badHrefs":[],"jsInHref":false,"markupShown":false,"longShown":false,"storageHits":{"localStorage":0,"sessionStorage":0,"cookie":0,"history":0},"timersAfterLeave":0,"timersAfterTick":0,"fetchesAfterLeave":0},{"label":"p-20261010-07","pickGets":{"afterOpen":1,"afterPlay":1,"afterLive":3,"afterControls":3},"eventSources":["/api/events"],"offenders":[],"badNodes":0,"badHrefs":[],"jsInHref":false,"markupShown":false,"longShown":false,"storageHits":{"localStorage":0,"sessionStorage":0,"cookie":0,"history":0},"timersAfterLeave":0,"timersAfterTick":0,"fetchesAfterLeave":0},{"label":"live-prefix-94","pickGets":{"afterOpen":1,"afterPlay":1,"afterLive":3,"afterControls":3},"eventSources":["/api/events"],"offenders":[],"badNodes":0,"badHrefs":[],"jsInHref":false,"markupShown":false,"longShown":false,"storageHits":{"localStorage":0,"sessionStorage":0,"cookie":0,"history":0},"timersAfterLeave":0,"timersAfterTick":0,"fetchesAfterLeave":0},{"label":"hostile-99","pickGets":{"afterOpen":1,"afterPlay":1,"afterLive":3,"afterControls":3},"eventSources":["/api/events"],"offenders":[],"badNodes":0,"badHrefs":[],"jsInHref":false,"markupShown":true,"longShown":true,"storageHits":{"localStorage":0,"sessionStorage":0,"cookie":0,"history":0},"timersAfterLeave":0,"timersAfterTick":0,"fetchesAfterLeave":0}]}
```

One pick GET per open, none for Play, ticks, scrub, or buttons, one more per live update. One `EventSource` on `/api/events`. No `img`/`script`/`iframe`, no `on*` attribute, no `javascript:` href. The hostile markup and the 2,000-character title stayed text. Zero timers and zero further fetches after leaving. Every browser probe's `offOrigin` is `[]`.

## Stack

`git merge-base --is-ancestor c6cfad415576c2c14653955aff972a6d8c613ab1 HEAD` printed `on-stack`. `origin/dd/p4-phone` is still that START commit: `START_REF unchanged`.

`git diff --name-only c6cfad4...HEAD` stays inside the touch map, including the grafter-only row (`docs/SPEC-006-replay.md`, `test/replay.pooled.test.ts`, and the ten `docs/screens/p5-replay/*.png`). Shared hunks are the allowed ones: `index.html` link and script, the `http.ts` files line, the `app.js` route, stop, replay branch, and Replay link, the two W5 lines, the Drive bullet and `seed-replay` helper text, the README bullet after Phone, the `seed-replay` case, and appended `DECISIONS.tsv` rows.

```dd-verdict
{"prNumber":7,"headSha":"d1bd73c075173336f2d3a15b3a2ee288163b7b32","verdict":"VERIFIED","ledger":"live-ui-verified","certainty":5,"evidence":["npm test 256 pass, 0 fail; npx tsc --noEmit exit 0","selftest exit 0: happy p-20261018-01 drafted, policy p-20261018-02 failed, walkover p-20261018-03 drafted, close p-20261018-04 drafted","doctor: node pass 22.14.0, data pass, config pass, targets pass 1, port pass 4420; skill doctor pass with port 45920 in use","sha256sum test/fixtures/replay/* matches SPEC 006; cdp-shot.mjs and probe.js match; untouched check printed untouched; http.ts diff is the one files line","18 replay probes ok true, offOrigin [], scrollWidth equals width, one chip intake/judging/drafted; pick page 390 and 430 ok true; 1280 light problems do not name Replay","Play from ?at=1&play=1 shows Pause past event 1; live dd record shows Event 20 of 21 and the draft-confirmation sentence; ten shots pixel-identical to docs/screens/p5-replay/","safety-fact pass true: 7 cases, pickGets 1/1/3/3, one EventSource /api/events, offenders [], badNodes 0, badHrefs [], storageHits all 0, timersAfterLeave 0; hostile markup and 2000-char title stayed text","git merge-base --is-ancestor START HEAD and START_REF unchanged; git diff --name-only START...HEAD is inside the touch map including the grafter-only row","CI input: gh pr checks 7 reported no checks"],"fixLoops":0}
```
