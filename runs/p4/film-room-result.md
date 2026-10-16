# Draft Day Pick 4 · Film Room result (SPEC 005, Phone War Room)

- Mode: S. START_REF `dd/p3-lessons`, START `e242a533d04d68a5a4472bce283eb06866e79d96` (unchanged during judging).
- **Base: c1 "token ledger", branch `dd/p4-phone-a`, head `d32032a66158af3232fb37dc830fa1b136349bf9`.**
- Runner-ups: c2 (`dd/p4-phone-b` @ `3075b514f9769351f0d9ddad59600b85c524e802`), c3 (`dd/p4-phone-c` @ `8b52c4cd9ed0595b981de965a36e5ea1fdc5bf8a`).
- Pooled cross-test: branch `dd/p4-phone-judge` @ `92ae88e32309eef9f4e0be29c80e55d527e2dbbd`, `test/phone.pooled.test.ts`, 81/81 for all three.

## Calculator (tools/filmroom-calc.mjs, both passes, risks c1=1 c2=0 c3=0)
- Pass 1 (A=c3 B=c2 C=c1): c1 4.00, c2 3.87, c3 3.87.
- Pass 2 (A=c1 B=c2 C=c3): c1 4.00, c2 3.73, c3 3.60.
- closeCall true, swap **consistent**, tieRule none, unstable none, base c1.

## Trades (from the last pass, pass 2; at most 2 per runner-up, none from base)
1. **From c2 (`dd/p4-phone-b`): one intake outcome table.** Pointers: `src/ui/app.js:39-61`. Why: the five sentences, the phase, and whether the idea is kept live in one registry, so the sentences stay aligned. Port it into c1's existing form module state; keep c1's architecture.
2. **From c3 (`dd/p4-phone-c`): phone cell captions.** Pointers: `src/ui/app.js:162-168` (boardTable sets `data-label` per cell), `src/ui/styles.css:362-370`. Why: hiding thead on a phone leaves Stage, Status and Runs unnamed; data-label names them with no viewport read. Do NOT take c3's phone `order` that moves the idea above the pick id (pass 2 rejected it), and do not take c3's W7 test that freezes that order.

## Rejected
- c2 and c3: `#form-status` has no overflow-wrap, so a 2,000-character error makes the page scroll sideways (scrollWidth 18337 at 390). c1's `overflow-wrap: anywhere` (`src/ui/styles.css:365-368`) stays.
- c2: `a`/`button` `min-height: 44px` in the base rules (fattens every desktop link); field border uses `var(--line)` instead of `--field-line`; no `.dd-event` exception.
- c3: phone `order` putting the idea above the pick id; its W7 test asserting that private order.
- Note: c1 keeps the original desktop sizes at 1280 (Add pick 96x35, pick links ~99x17). Both judges scored thumb 4 for c1 because W8 targets apply at phone widths; desktop stays the original five-column table. Not a trade.

## Judge rationale, translated to cand ids
- **c1 keep:** phone-only tap targets, pinned dark tokens (styles.css:30-56), overflow-wrap on #form-status, smallest clean diff (+1545/-58). Reject: stacked phone rows without column names (fixed by trade 2).
- **c2 keep:** the single outcome table. Reject: unwrapped status line, desktop-wide 44px min-heights.
- **c3 keep:** data-label captions. Reject: unwrapped status line, phone order, order-freezing W7 test.

## Probes and stack
- All three: 12/12 phone probes (board, close pick p-20261017-04, windowed lessons; 390 and 430; light and dark) ok true, scrollWidth = viewport, problems [], offOrigin [].
- 1280 board: c2 and c3 ok true; c1 ok false with W8-only desktop size problems (original sizes, see above).
- Long-error wrap probe at 390 dark: c1 ok true scrollWidth 390; c2 and c3 ok false scrollWidth 18337.
- Stack: all three `on-stack`; FETCH_HEAD of dd/p3-lessons = START, "START_REF unchanged". Each touches the same 16 touch-map paths; guards.test.ts, http.ts, package.json untouched.

## Grok Bot second read
- Agree. Box oracles on c1's files: phone-calc pass 0 (plain and `--css lessons.css`), harness 53/53, fixture sha256 5/5. Same for c2 and c3. No touch-map flags.
