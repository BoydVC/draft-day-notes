# Film Room result · Pick 5 Replay (SPEC 006)

START_REF: dd/p4-phone
START: c6cfad415576c2c14653955aff972a6d8c613ab1 (re-checked Sat Oct 17 ~8:30 PM ET, unchanged)

## Base
c1 · branch dd/p5-replay-a · head 34759b5ea24705121f1b49e1020c127454f8de93 (frame engine; smallest diff +1502 -3, 34 files)

## Runner-ups
c2 (dd/p5-replay-b @ 0e21bfb02fb3d126a9d4a96ccaf3d4bcdf2db36b), c3 (dd/p5-replay-c @ c9acc4de7e58ada6124daad79476802544c67bc2)

## Trades (from pass 2, the last pass; max 2 per runner-up, none from base)
1. From c2 (dd/p5-replay-b): 390 film order and fixed control bar.
   Pointers: src/ui/replay.css:1-14, src/ui/replay.css:302-318
   Why: on a 390 frame the runs sit under the scoreboard and the five controls stay pinned, so the clock, the caption, the field and Play are all on screen. Port only the layout rules; do not take c2's extra CSS bulk.
2. From c3 (dd/p5-replay-c): arm() does not replace a pending step.
   Pointers: src/ui/replay.js:15-24
   Why: arm looks up globalThis.setTimeout and returns when a timer is already pending, so a live update cannot restart the second. c1's arm() still clears and reassigns the timer.

## Calculator (node tools/filmroom-calc.mjs SPEC-006-rubric.json runs/p5/judge-pass1.md runs/p5/judge-pass2.md --risks c1=0,c2=0,c3=0)
Pass 1: c1 4.00, c2 4.00, c3 3.80 (all gates pass, cross 18/18)
Pass 2: c1 4.00, c2 3.87, c3 3.80 (all gates pass, cross 18/18)
base c1 · runnerUps [c2, c3] · closeCall true · swap consistent · tieRule null · unstable [] · judgeDisagrees false

## Judge rationale (pass 2, translated to cand ids)
- c1 (base): keep the frame function, the single playback record, and the phone frame that already shows +2h 53m, judging, the Film Room sentence and the four runs. Take c3's arm() guard.
- c2: keep the phone grid and fixed control bar. Reject the extra indent on the status-line opener in src/ui/app.js and the extra CSS bulk (replay.css 359 lines vs c1's 220).
- c3: keep the timer lookup and early return in arm(). Reject the Chapters row: on 390 dark at event 11 it fills the viewport after the caption and the runs never appear.

## Probes (pass 2)
All 18 replay probes per label (at 1/11/20 × 390/430/1280 × light/dark): ok true, scrollWidth == width, one chip of the frame status (intake/judging/drafted), problems [], offOrigin []. Pick page 390 dark: ok true.
Gates: tsc exit 0 for each; npm test c1 238/238, c2 238/238, c3 237/237; seed-replay printed "seeded replay"; at=11 390 dark ok true scrollWidth 390 chips [judging].
Stack probe: merge-base --is-ancestor c6cfad4 → on-stack for c1, c2, c3. FETCH_HEAD c6cfad4, START_REF unchanged.
Pooled cross-test: branch dd/p5-replay-judge @ 5dbbda33ecbf5aaa0157883db10d3884fcaf8b56, test/replay.pooled.test.ts.

## Grok Bot second read
Agree. Oracle on c1 spot-check folder: TOTAL 192/192. c1's 390 dark at=11 screenshot shows clock, JUDGING chip, caption, controls and the runs list. The c1/c2 tie is broken by diff size in pass 1 and by c2's extra churn in pass 2; c3 loses on the phone layout.
