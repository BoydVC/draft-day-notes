# Film Room result · Pick 6 Scouting Report linter (SPEC 007)

START_REF: dd/p5-replay
START: d1bd73c075173336f2d3a15b3a2ee288163b7b32 (re-checked Sun Oct 18 ~10:55 AM ET, unchanged)

## Base
c1 · branch dd/p6-linter-a · head a59ec89518cf710f89620f22ba66a651c90dabaf (rule ledger: one `satisfies` registry, lintScoutingReport shared by CLI, API and panel; literal tags; replay tests untouched)

## Runner-ups
c3 (dd/p6-linter-c @ ee2919c0dd8ad86e0e95a851241e3dbb6213e007), c2 (dd/p6-linter-b @ 6a27d7a87f40cbbb1e4b2bee7f94c56d19f375bf)

## Trades (pass 2, the last pass)
1. From c2 (dd/p6-linter-b): R15 expected lists. Pointers: test/replay.test.ts:367-371, test/replay.pooled.test.ts:587-588.
   Why: append linter.css and linter.js to the closed Replay wiring lists so npm test is fully green. Sanctioned grafter edit per uploads/RULING-R15.md; change nothing else in those two files.
2. From c2 (dd/p6-linter-b): phone paste bar. Pointers: src/ui/linter.css:213-236.
   Why: up to 800px the paste textarea and Lint button stay fixed to the bottom (with safe-area padding) while the lists scroll.
3. From c3 (dd/p6-linter-c): paste form under the summary. Pointers: src/ui/linter.js:107-125.
   Why: the textarea and Lint button sit with the summary chip so paste is beside the pass/fail result.
   Reconcile 2 and 3 into one model: DOM order puts the paste form right after the summary (trade 3); at <=800px CSS pins that same form to the bottom (trade 2); at 1280 it stays inline under the summary. One form element, not two.
Do NOT take c3's `&#47;` entity-encoded tags. index.html keeps literal `href="/linter.css"` and `src="/linter.js"`.

## Calculator (node tools/filmroom-calc.mjs SPEC-007-rubric.json runs/p6/judge-pass1.md runs/p6/judge-pass2.md --risks c1=1,c2=1,c3=1)
Pass 1: c1 4.00 (15/15), c3 3.73 (14/15), c2 3.60 (15/15)
Pass 2: c1 4.00 (15/15), c3 3.73 (14/15), c2 3.60 (15/15)
base c1 · runnerUps [c3, c2] · closeCall true · swap consistent · tieRule null · unstable [] · judgeDisagrees false

## Judge rationale (pass 2, translated)
- c1: all six criteria fully met. Own npm test red only on the two R15 wiring assertions (known spec conflict, ruling applied); literal tags; replay tests untouched. Fail 390 dark readable at once: fail · 5 hard, R2/R5/R14/R19/R20 MISSING.
- c3: lint/ears/angles/screen/safety match the oracle. Stack 2 because index.html uses &#47; entity tags, so pooled S15 fails (14/15). Keep its paste-form placement.
- c2: same fidelity and the clearest MISSING chips. Stack 1 because it edited the do-not-touch replay tests; those hunks are the R15 trade. Keep its phone paste bar.

## Probes (pass 2)
Journey 390 dark ok true for all. 8 linter runs (fail/pass × 390/1280 × light/dark) + pick 390 dark: ok true, problems [], offOrigin [], small [], scrollWidth == width, every label.
Stack probe: on-stack for c1, c2, c3; FETCH_HEAD d1bd73c; START_REF unchanged.
Pooled cross-test: dd/p6-linter-judge @ 6e4b05e6b8371d0f2ee4785302ade4cd42588b37, test/linter.pooled.test.ts (S1-S15).

## Grok Bot second read
Agree. c1 oracle TOTAL 14/14, fixture sha256 match, 8 screens, literal tags, replay tests identical to START.
