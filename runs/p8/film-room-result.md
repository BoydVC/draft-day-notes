# Film Room result: Draft Day Pick 8, Season Ledger (SPEC 009)

START_REF dd/p7-big-board, START 93dca59db747e8306ab460e38d7ddf978031987e.
Pooled test: test/ledger.pooled.test.ts on dd/p8-season-ledger-judge @3366d0f20594f3086a9702f5fa61c6e5e96db8d6 (port unchanged).

## Base
**c1 "ledger book": dd/p8-season-ledger-a @34e82bfce5469ec5f5d44d6163fee86ef1c7d1d3.**
Both passes: gates pass, pooled 18/18, weighted 4.00, smallest diff (+3501 -18, 41 files). Runner-ups c2 (4.00 / 4.00), then c3 (4.00 / 3.73).

## Calculator (both passes)
base c1; runnerUps [c2, c3]; closeCall true; swap consistent (swapConsistent true); tieRule null; unstable []; judgeDisagrees false.

## Trades to port by hand (both passes named the same two)
1. **From c2 "merge desk" (dd/p8-season-ledger-b @c0cb80a7529ce0d3d78796f89b20bdac19ea6699): the plain-language merge call.**
   Pointers: src/ui/ledger.js:80-93 (pass 1) / 80-87 (pass 2), src/ui/ledger.css:17-34.
   Lead the page with one heading ("Merge-safe through #N" or "Not merge-safe yet") and the next move as one sentence ("Re-run #1 before you merge."), above c1's summary and rows. At 390x844 dark, the headline, re-run sentence, and #2's docs-only why must all stay above the fold (c2 measured headline y240-319, #2 why y465-638). Use tokens only, in both schemes.
2. **From c3 "audit trail" (dd/p8-season-ledger-c @a6d412680a1ec4e9db65d33488b2a8e6753335ce): the verdict-sequence disclosure.**
   Pointers: src/ui/ledger.js:61-83.
   Each row is a native details element, closed by default with no JS state. Its summary keeps c1's row line (position, #n, status word, why). The body lists that PR's verdict sequence (source, SHA, verdict, certainty, agent) and drift (file count, docs-only) from the same fold. Keep the binding DOM names on the row elements.
   Do **not** port c3's tall stacked-label phone layout: pass 2 put c3's first docs-only row below the fold (y894). Do **not** port c3's table caption. In my second read of c3's 390 dark screenshot, its "Merge order" caption wrapped one or two letters per line.

## Rejected
- c3's stacked-label reflow and table caption (glance 3 in pass 2).
- c2's 32px status chips as the only status signal. Status stays a word, and a chip is decoration only.

## Second read (Grok Bot)
I agree with c1 as base. Two things to keep: c1's Big Board Ledger link measured 81x48 (it passes 44x44), and all of its ledger links are at least 48px.
Note: c2's own npm test failed once when run alongside the others (port 4420 cancellations) and passed alone. Run the suite isolated.

## Constraints (unchanged from SPEC 009)
- Touch map binding; the six closed-list files change only on the fifteen sanctioned lines; tags literal.
- http.ts: static files line, one import, GET /api/ledger only.
- Zero runtime deps, no network code, test/guards.test.ts byte-identical.
