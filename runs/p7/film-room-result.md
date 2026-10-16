# Film Room result · Pick 7 Big Board stats (SPEC 008)

START_REF: dd/p6-linter
START: dc38660f2f3fdaadcfd2e879693e24cb21a05eba (re-checked Sun Oct 18 ~3:15 PM ET, unchanged)

## Base
c1 · branch dd/p7-big-board-a · head 4183e30bc295122eaed279e743cad183405a6501 (metric ledger: one row registry in src/core/bigboard.ts tying each metric to its text line and DOM container; admit() folds reduce() + timeline().stages; smallest diff)

## Runner-ups
c2 (dd/p7-big-board-b @ 1ec8ca2562ac97731c69db563a816ef959341eea, scoreboard tiles), c3 (dd/p7-big-board-c @ ac11933f42d0fd52c3abf32edcfe63c28809ba55, box-score tables)

## Trades (max 2 per runner-up)
1. From c2: headline tiles. Pointers: src/ui/bigboard.js:42-65 (and their CSS in src/ui/bigboard.css).
   Why: Best angle, Trades per pick and First-try verify as three tiles directly under the summary and ABOVE the Since/Until form, so the five-second read survives at 390x844 (glance was the unstable criterion across passes). Render the tiles from the base's ledger rows; do not add a second data path.
2. From c2: stats text leads with the three answers. Pointers: src/core/bigboard.ts:282-287.
   Why: dd stats prints best angle, trades per pick and first try on the lines right after the summary.
3. From c3: Walkovers column / explicit walkover. Pointers: src/ui/bigboard.js:34-39, src/ui/bigboard.js:67.
   Why: a walkover must never read as a win; show it as "(+N walkover)" or a separate Walkovers cell next to wins and entries. Flagged in both passes.
4. From c3: stats fetch error section. Pointers: src/ui/app.js:527-553.
   Why: a thrown fetch or unreadable body still paints "Could not load Big Board stats" plus a Big Board link; the base only handles a non-OK response (app.js:526-541).
Rejected: c3's status chips (pass 2) — they push the tiles down at 390 and the summary already carries drafted; c1's own walkover suffix is kept only if trade 3 is ported in the same place (one walkover display, not two).

## Calculator (node tools/filmroom-calc.mjs SPEC-008-rubric.json runs/p7/judge-pass1.md runs/p7/judge-pass2.md --risks c1=0,c2=0,c3=0)
Pass 1 (A=c2 B=c3 C=c1): c2 3.87, c1 3.73, c3 3.73 (all 16/16 pooled)
Pass 2 (A=c1 B=c3 C=c2): c1 4.00, c2 4.00, c3 3.87 (all 16/16 pooled)
base c1 · runnerUps [c2, c3] · closeCall true · swap flipped (swapConsistent false) · tieRule c1 over c2 on diff_lines (c1=3026, c2=3091) · unstable [glance] · judgeDisagrees false
Note: pass-2 dd-judgement block was missing one "}]" before "base" (transcription bracket typo); repaired mechanically, raw kept at runs/p7/judge-pass2.raw.md. No values changed.

## Judge rationale (translated)
Every criterion except glance was 4 for all three in both passes (stack 3 for c3 in pass 2: +311 lines). Glance flipped: pass 1 saw c1's key numbers partly under the date form; pass 2 saw them above the fold. c2's tiles are the most robust glance design, hence trade 1 into the smaller, ledger-based base.

## Grok Bot second read
Agree with the tie-rule outcome plus trade 1. All three: oracle TOTAL 15/15, engine 20/20, fixture sha ok, 8 screens, no PRs, only sanctioned closed-list (7 lines) + phone W5 (2 lines) edits. Looked at stats-390-dark for each.
