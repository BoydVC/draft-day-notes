# SPEC 005 adversarial self-review (pstack interrogate style), Sat Oct 17, 2026

Scope: `SPEC-005-phone-war-room.md`, `SPEC-005-rubric.json`, the five `fixtures/phone/*` files, the box oracles (`tools/phone-calc.mjs`, `tools/phone-harness-check.mjs`, `tools/phone-mock.mjs`), the SPEC-005 row in `tools/make-copies.sh`, and `LAUNCH-005.md`.

This was a single-reviewer pass with no subagent fan-out, the same as SPEC 003 and 004. It resumed an interrupted earlier run that had started `fixtures/phone/`, `runs/p4/{base,ref,ref-overlay}` and the two oracles. That work was reused and fixed, not redone; the pre-session fixtures are at `/tmp/phone-fixtures.pre-005/`.

Each claim was checked against `BoydVC/draft-day` or against code run on the box:
- **Remote files:** read with `gh api …/contents?ref=` at `60b1625` (into `runs/p4/base`, `runs/p4/tip`) and at the three Pick 3 candidate heads (into `runs/p4/p3cands/{a,b,c}`). Nothing was cloned.
- **Box code:** the fixtures, the oracles, `tools/mergesim.sh`, and headless Chrome through `cdp-shot.mjs`.

## Act On (fixed)
1. **The harness could not see Pick 3.** `dom-harness.mjs` loaded only `timeline.js` and `app.js`, so in Mode S the page ran without `lessons.js`, and `#/lessons` would have thrown on `draftDayLessons`. Fix: it now loads every `<script src="/x.js">` from `src/ui/index.html` in document order, and throws if `app.js` is missing. Proved: in `runs/p4/modeS/{a,b,c}`, `draftDayLessons` is a function and `#/lessons` fetches `/api/lessons`.
2. **Collections text sat in a fixture.** The harness's `SAMPLE_BOARD` had an idea reading "Plan a collections campaign", and its policy mode answered `policy: "collections"`. Both broke the "nothing debt-collection related in fixtures" rule. Fix: the idea is now `Refused by the policy screen (fixture text)` (matching `board-states.json`), the policy value is `fixture-rule`, and the oracle's expected sentence follows. A grep for kpd/collection over `fixtures/phone` and `tools/phone-*` is empty.
3. **`cdp-shot.mjs` sometimes exited 2 after a passing probe.** It removed Chrome's profile while Chrome was still writing to it. The `rm` threw, so the catch block turned success into a driver error, and 44 `/tmp/dd-phone-*` profiles were left behind. Fix: one `cleanup()` kills Chrome, waits for exit (3 s cap), and retries removal with errors swallowed. A re-run of 16 probes leaves no profile behind and gives no spurious exit 2.
4. **The spec had no line for "same DOM at every width".** The card-stack angle could have built a second phone-only board in JavaScript, which would mean two renderers and viewport reads. Fix: W11 adds an exact board shape (one table, `tbody#board-body`, five headers, 10 rows × 5 cells for `board-states.json`, `data-pick-id` in API order) and a grep that bans viewport reads in `src/ui/*.js`. Every root passes it at baseline, so it only guards against regressions.
5. **There was no same-origin proof.** "Nothing loaded from another origin" was prose only. Fix: `probe.js` now reports `offOrigin` from the Resource Timing list as a W17 problem, and the oracle checks every `fetch` URL and the single `EventSource`. Both run at baseline with `offOrigin: []` and W17 2/2.
6. **Hostile server text was untested.** `error` strings come from the server and go into the status line. Fix: the harness takes `errorText`, and W15 now asserts that `<img src=x onerror=alert(1)><script>alert(2)</script>` shows literally, with no `img`/`script`/`iframe` node and no `on*` attribute (via the harness's attribute log). That makes W15 19 checks and the total 53.
7. **The "Sending…" screenshot was not reproducible.** A real server answers too fast to catch. Fix: VERIFY 6 gives an exact `--before` expression that wraps `window.fetch` so only `/api/intake` never resolves, submits, and blurs. Run on the box against the reference build: `ok: true`, `offOrigin: []`, screenshot `runs/p4/screens/ref-form-sending-390-dark.png`.
8. **The "kept on failure" journey would pass vacuously on desktop Chrome.** After a click, focus stays on `Add pick`, so `render()`'s typing branch rebuilds only the board and the status survives for the wrong reason. Fix: the journey now says to blur focus (as iOS does) before the `dd record` that triggers the redraw.
9. **The contrast table tripped the rubric-table check.** `| \`field-line\` | … | 3 |` matched make-copies' rubric-row pattern. Fix: minimums are written `4.5:1` / `3:1`.
10. **make-copies could carry only one fixture.** SPEC 005 uploads five. Fix: the fixture column takes space-separated paths, each sha256 must be in the spec, and all five are registered. SPEC 002-004 copies match their pre-edit md5s.
11. **The idea length was off by one.** The spec said 140 characters; the fixture's long idea has 141 (measured). Fixed in both places.
12. **Mode S needed a Locker Room allowance.** Measured on the real Pick 3 candidates:
    - `lessons.css` has one color literal on `-a` (`#24364a`) and on `-c` (`#24301c`), so W5 finds 81 problems at those tips with `--css lessons.css`.
    - The reference `styles.css` alone does not clear `-c`'s Locker Room: W8 14 remains (`Receipts` summaries 20 px tall, `Clear` 38 px wide).
    - Fix: the touch map allows `lessons.css` in Mode S only, for literal-to-token swaps plus one size-only 480 px block. W18 pins the per-candidate baselines.

## Consider (left as is, with reason)
- **One spec for two starting refs, rather than two specs.** The modes differ in one touch-map row, W5's file list and W18. Candidates detect the mode from their tree (`src/ui/lessons.js`), and the prompt states it. A mismatch is a launch error (LAUNCH-005 step 1.2), so a wrong tree can't build silently.
- **Mode F leaves the Locker Room unthemed and under-sized until a follow-up.** Keeping the fallback file-disjoint from the Pick 3 lane was a hard requirement, so the gap is recorded under LAUNCH-005 Open risks, with measured numbers, rather than closed here.
- **Pass 2 maps A→c1, B→c2, C→c3.** Pass 1 (c3, c2, c1) is the only pure reversal not used by Picks 1-3 that keeps a fresh middle label. Every unused permutation pairs with this identity map. The judge never sees branch names, so the alignment carries no information. Accepted and written into LAUNCH-005.
- **Light values are free.** Only contrast is pinned (T3), so candidates can differ on palette. The judge's `scheme` criterion grades discipline, not taste.
- **The design sketch shows the board as blocks on a phone.** That leans toward one angle. All three angles still need some reflow to meet W7, and the sketch names no technique.
- **Chrome emulation stands in for an iPhone.** There is no WebKit in the pipeline. LAUNCH-005 says to ask Boyd for one real-phone look at reveal time, and nothing claims real-device proof.
- **The probe's 44 px rule exempts only `.dd-event` inline links.** Pick 3's receipt links count as tap targets. That is deliberate: they are stand-alone links in a list. Measured at baseline: 18 such links on `-a` and `-c`, all fixable with CSS.

## Noted
- **Baselines** at `60b1625`, identical at every Pick 3 candidate tip:
  - token check: 80 problems (W1 4, W2 52, W5 13, W6 10, W10 1);
  - harness: 36/53 (W11 7/7, W12 5/7, W13 5/5, W14 2/7, W15 15/19, W16 0/6, W17 2/2);
  - Big Board probe: `scrollWidth` 451 at 390 and 430, W7 1, W8 1 (`Add pick` 95×35), W9 20;
  - pick-page probe: W8 1 (`Big Board` 74×22), W9 11;
  - Pick 3 tips add W8 `Locker Room` 98×22.
- **Reference build** (`runs/p4/ref`, a box-only proof of satisfiability; never attached, never pushed): 0 problems, 53/53, every probe `ok` (16 runs). In Mode S over each Pick 3 candidate, the Big Board is ok, and `#/lessons` is ok on `-a` and `-b` but not on `-c` (Act On 12).
- **Pinned dark contrast ratios** (from `phone-calc.mjs`) are listed in the spec's contrast table. The tightest are `chip-done` 4.78 and `chip-stop` 4.83.
- **Tests that read `src/ui`:** `timeline*.test.ts` T18 bans `innerHTML` and the like in every `src/ui` file. `guards.test.ts` restricts only test imports of `src/` paths, so `./fixtures/phone/dom-harness.mjs` is allowed.
- **Typecheck:** strict `tsc --noEmit` passes for a sample test importing the harness through `dom-harness.d.mts` (`/tmp/tscheck`, typescript 5.8.3, @types/node 22).
- **Intake answers** (`http.ts`): 200 `{ok, inboxOffset, policy}`, 400/500 `{error}`. The policy names in `policy.ts` are all exclusion rules, so no real one is used in fixtures.
- **Calculator:** `tools/filmroom-calc.mjs` runs unchanged on `SPEC-005-rubric.json` with two scratch passes (`/tmp/p4/s1.md`, `s2.md`): six criteria, weights 15, labels C→c1, B→c2, A→c3, closeCall true, swap consistent, base c1.

## Dismissed
- **The words "phone", "chip" and "token" in the candidate body.** They are product vocabulary. make-copies checks the criterion and angle names from the JSON, plus distinctive phrases (`token ledger`, `intake state machine`, `card-stack`, `one paint function`, `pixel-close`, `thumb-reach`, `dd/p4-phone-[abc]`).
- **A manual theme toggle.** PLAN says "dark mode"; following the OS is the native iPhone behavior, needs no stored state, and keeps the safety fact simple.

## Proof run on the box
- **Three-way merge.** `tools/mergesim.sh runs/p4/base runs/p4/ref-overlay runs/p4/p3cands/{a,b,c}`: each candidate conflicts only in `docs/DECISIONS.tsv`, in both orders. Shared files are `SKILL.md`, `features/README.md`, `DECISIONS.tsv`, `app.js` and `index.html`. Output: `runs/p4/mergesim/real-p3.txt`.
- **Token check:** `node tools/phone-calc.mjs` gives base 80, ref 0, and P3 tips 80 (81/80/81 with `--css lessons.css`). In Mode S, merged roots give a 1 / b 0 / c 1. Outputs: `runs/p4/phone-calc-*.txt`.
- **Harness:** `node tools/phone-harness-check.mjs` gives base and every P3 tip 36/53, and ref and every Mode S merged root 53/53. Outputs: `runs/p4/harness-*.txt`.
- **Probe matrix** (`runs/p4/probe-matrix.txt`, 56 Chrome runs): base, ref, three P3 tips and three Mode S roots, at 390×844 and 430×932, light and dark. Screenshots: `runs/p4/screens/`.
- **make-copies:** prints `ok` for SPEC 002-005. Negative tests each exit 1: an angle phrase in the body, weight drift in the JSON, and a changed fixture byte.
