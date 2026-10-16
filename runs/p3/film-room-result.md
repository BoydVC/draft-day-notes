# Pick 3 Film Room result (SPEC 004)

## Base
- c1 · angle "kind registry" · branch dd/p3-lessons-a · head a104b28e3cbddff951c60a2682bce43ed380abbe
- Runner-ups: c2 (dd/p3-lessons-b @a6d5b13), c3 (dd/p3-lessons-c @2925579)

## Calculator
- Pass 1 (A=c3 B=c1 C=c2): all three 4.00; judge picked c1.
- Pass 2 reversed (A=c2 B=c1 C=c3): c2 4.00, c1 3.87, c3 3.67; judge picked c2.
- swap: flipped (swapConsistent false). Tie rule between c1 and c2 decided by diff_lines (c1=1635, c2=1771) -> base c1.
- Pass 2's block had one extra "]}" before "base"; Grok Bot removed that bracket only (raw kept as judge-pass2.raw.md). No scores changed.

## Trades (from the last pass; none from the base)
1. From c3 (dd/p3-lessons-c): rank-1 card. src/ui/lessons.js:38-48, src/ui/lessons.js:105, src/ui/lessons.css:50-66. Why: the Sunday pass should see the first fix, its level and its first receipt before the rest of the list. Do NOT also repeat the first receipt link a second time inside Receipts (pass 1 rejected that doubling).
2. From c3 (dd/p3-lessons-c): Clear control on the Window form. src/ui/lessons.js:65-89. Why: Clear returns the hash to #/lessons without hand-editing dates. Keep it a button (an <a href="#/lessons"> would break L18).
Plus one base fix the pass-2 judge raised against c1 itself:
3. Base fix: src/store/eventlog.ts:5 imports type PickLog from ../core/lessons.ts. The touch map allows only loadLogs after loadPicks in that file. Remove that import (move or inline the type) so eventlog.ts's only change is loadLogs.

## Rejected
- c2's extra findings()/groupFindings() public exports (second pipeline on the public surface).
- c3's closed <details> around every Receipts list (evidence hidden until a second click).
- c3's python3 summary check in seed-lessons (others do it in node).

## Judge rationale (labels translated)
- c1: one KIND_RULES table with `satisfies Record<FindingKind, KindRule>`, stage names only via stageLabel, receipts readable without a disclosure, smallest diff. Defect: eventlog.ts import.
- c2: single lessons() path, Record table, receipt table on screen; reject extra exports. Pass 1 also liked its non-OK error region (src/ui/app.js:341-346) and five-column receipts.
- c3: rank-1 card and Clear; reject closed details and doubled first receipt.

## Stack probe
All three on-stack over 60b1625518f61de576205c73318afd54c3384798; dd/p2-timeline unchanged.

## Grok Bot second read
Agree with base c1 by the tie rule. Swap flipped, so the base rests on diff size, not a clear quality margin; logged, not serious.
