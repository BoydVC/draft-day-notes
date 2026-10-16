# SPEC 003 adversarial self-review (pstack interrogate style), Sat Oct 17, 2026

Scope: SPEC-003-pick-timeline.md, SPEC-003-rubric.json, LAUNCH-003.md, tools/make-copies.sh. Each claim was checked against BoydVC/draft-day at dd/scaffold f51dae8 (read with cursor-github get_file_contents; nothing cloned) or against code run on the box. The pre-review spec is at /tmp/spec003.pre-review.md.

## Act On (fixed)
1. **Pre-existing link tripped the `truth` grep.** `src/ui/app.js` already builds `https://github.com/${pick.target}/pull/${pr}` in the Physical section, so grepping whole files would mark every candidate down. Fix: the rubric now greps only lines the diff adds (`git diff -U0 … | grep '^+'`) and names that link as exempt.
2. **T8 broke once Pick 1 merged.** SPEC 002 F16 adds a `close` selftest scenario, so asserting exactly three selftest lines would fail after either merge order. Fix: T8 finds picks by scenario name and forbids counting lines; `stack` and T20 now say "happy, policy and walkover lines" instead of "three lines".
3. **T8 numbers came from reading code, not running it** (happy 8 / walkover 6 / policy 0, from fake-driver.ts and dd.ts). Fix: T8 says the reducer wins on any mismatch: assert the equality, then report it.
4. **Missing title tokens had no rule.** For example, `candidate_finished` with no prior launch has no closed run. Fix: missing tokens are dropped and titling never throws. The `null`/`undefined` ban now applies only to text the payload did not supply, so a lesson that says "null" is legal.
5. **The judge copy had no selection rule.** SPEC 002 carried it in CONTEXT, but SPEC 003 did not, so the judge had no idea how its scores become a base. Fix: one "Selection" paragraph in the hidden rubric, matching `tools/filmroom-calc.mjs` exactly: band 0.10, close call within 10%, tie order diff_lines > files > risks > cand_id.
6. **Pooled tests leaked into the own-tests gate.** `npm test` runs `test/*.test.ts`, so a copied `test/timeline.pooled.test.ts` would be swept into the candidate's own tests. Fix: the spec and LAUNCH-003 now record gates before the pooled file is copied in.
7. **The live journey asked for an unspecified `report.json`.** `dd record` does not check stage order (`recordObject`/`normalize` in dd.ts). Fix: the live journey drops the scouting step and launches c1 straight on a fresh intake pick. `report.md` is now defined as one `dd-report` block.
8. **The stack probe needs git 2.38+.** `merge-tree --write-tree` does not exist before that. Fix: VERIFY 8 and the judge step both give a scratch-worktree `git merge --no-commit` fallback.
9. **The `stack` score was unfair when Pick 1 strays.** Pick 1 has no touch map of its own. Its "War Room first" candidate could rewrite `pickView()` in app.js and cause a conflict that Pick 2 can't avoid. Fix: such conflicts are noted, not penalized. Only conflicts from a candidate leaving its own lane count.
10. **`MAX_FIX_LOOPS` was ungrounded.** Fix: confirmed exported from `./budget.ts` via `src/core/index.ts`, and the title rule now names the file.
11. **make-copies wrongly flagged `dd/p1-film-room-a` as a SPEC 002 judge leak.** The branch only appears in the dd-report format example. The derived branch check now skips `"branch":"…"` example lines. SPEC 002's copies still match their saved sha256 values.

## Consider (left as is, with reason)
- **Candidates could hardcode the sample.** T5, T6, T7, T9, T10 and T12 use different prefixes of the sample plus crafted picks. The judge adds its own hostile values. The `tests` criterion requires spec literals and a hand-broken pairing check. Remaining risk is small.
- **With N=3, the middle label is the same across reversed passes (B = c3).** That is inherent to pure reversal, matches SPEC 002, and is documented in LAUNCH-003 §2.
- **Pick 1 might read `pick.events` from the API**, which Pick 2 removes (T13). SPEC 002 F13 only adds `filmRoom`, so this is unlikely. The judge's stack probe and Grok Bot's second read would catch it.
- **c3's snapshot-diff titles might miss payload tokens** (`{tests.added} tests`). Payload fields stay available, so this is the angle's challenge, not a spec flaw.
- **The c2 lane strip adds UI.** It is inside the Decision log region, which is in scope. Pick 4 owns layout outside it.
- **T19 cost.** With replay-per-prefix, 300 events means about 45k event applications, comfortably under 1 s.

## Noted
- `npm test` already uses `--experimental-strip-types` and the repo says engines `node >=20`. Cloud VMs run Node 22, while the box has 20.19.2. Box-side tools are plain `.mjs` and need no flag.
- `index.html` loads `/app.js` as a classic script (no `type="module"`), so a `timeline.js` loaded before it can share globals. The touch map's "script before app.js" is grounded.
- The guards ban `fetch(` in every `src` file except ones ending `app.js`. The spec forbids it in timeline.js, even in a comment.
- Big Board's three-row proof breaks once `seed-timeline` adds a fourth pick. VERIFY 6 and the physical prompt both say to drive the Big Board first.

## Dismissed
- **Angle words in the candidate body** ("registry", "spans", "snapshot"). make-copies leak-checks the distinctive phrases and every angle name, criterion name and rubric row taken from the JSON. The generic words "registry"/"span" appear in STANDING ("registries over hand-synced lists") and the types (`StageSpan`) on purpose and reveal nothing.
- **The fixture date (2026-10-10) is in the past.** It is a terminal pick, so `now` does not matter (T7). The timeout case uses an explicit `now`.

## Proof run on the box
- `tools/make-copies.sh` → `ok` for both specs. `sha256sum -c /tmp/spec002-copies.sha` → both OK. Negative tests on a temp copy all failed loudly: an angle name in the body, a rubric weight drift, and a changed fixture.
- `tools/filmroom-calc.mjs` ran unchanged with SPEC-003-rubric.json. Results: close call → needSecondPass; reversed pass → flipped + tieRule diff_lines + unstable warroom; gate fail excluded; cand-id base → exit 2; SPEC-002 criterion id in a SPEC-003 block → exit 2. SPEC-002 still works. Only the header comment changed.
- `tools/timeline-calc.mjs` reproduces every sample number in the spec, plus the T6 and T12 edge cases.
