# SPEC 004 adversarial self-review (pstack interrogate style), Sat Oct 17, 2026

Scope: SPEC-004-lessons.md, SPEC-004-rubric.json, tools/lessons-calc.mjs, the SPEC-004 row in tools/make-copies.sh, and LAUNCH-004.md. This was a single-reviewer pass with no subagent fan-out, the same as SPEC 003. Each claim was checked against BoydVC/draft-day at dd/p2-timeline `60b1625` (files read one at a time with cursor-github get_file_contents into runs/p3/tip/; nothing cloned) or against code run on the box. The pre-review spec is at /tmp/spec004.pre-review.md.

## Act On (fixed)
1. **A live update would wipe the Window form.** `render({ soft: true })` runs on every SSE `update`. Except for the Big Board typing branch, it calls `app.replaceChildren()` before any branch, so dates Boyd was typing would vanish whenever a run moved. Fix: the touch map now places the `lessons` branch directly before `app.replaceChildren();`. That branch fetches, replaces and returns, so the page no longer flashes blank. L17 adds "an update while focus is inside the `Window` form leaves the page as it is". A new CONTEXT row records why.
2. **The vm harness contract was unstated.** L18 runs `lessons.js` in `node:vm`, but the spec never said what `el` returns or whether `lessons.js` may attach the `Show` handler. Fix: the CONTEXT row now pins it. `el(tag, attrs, children)` takes string children as text. `lessons.js` returns one node, may call `addEventListener` on nodes it built, and may touch `location.hash` only inside the submit handler. The harness's nodes have a no-op `addEventListener` and never fire it.
3. **c3's angle contradicted the `truth` grep.** The first draft gave c3 a "This week" button that computes the current week, which needs `Date` in UI code, and the rubric marks down `Date` in added `src/ui/*.js` lines. Fix: c3 gets a `Clear` link with no date math.
4. **c2's angle changed the CLI help.** An extra `dd lessons --findings` flag would change the help line that L11 pins and widen the CLI surface. Fix: c2 exports an extra `findings(logs, window)` from core. Types may grow, so this stays inside the rules.
5. **An angle phrase leaked through the judge example.** The `dd-judgement` example's trade said `"what":"receipts table"`, which is c2's angle phrase, and that example is in the candidate copy too. Fix: it now says `"window form"`. `receipts table` is also in the SPEC-004 candidate leak regex.
6. **L4 (c)/(d) and L19 had no derived numbers.** Fix: the oracle ran both crafted L4 cases. With `pass` removed, the five judge-kind findings are unchanged. With judge_launched removed, the result is `0 lessons from 1 pick · 13 findings · 5 one-offs` and `judge:unresolved-label` 6. L19 now spells out the copy rule exactly (k = 0..99, j = 1..5, `pick_created.payload.id` rewritten, nothing else changed), matching `lessons-calc.mjs --copies`.
7. **A bare `--since` was silently ignored.** dd's flag parser stores a valueless `--since` as `true`, and `flag()` returns `undefined` for it. Fix: L11 says to pass the raw flag to `lessonWindow`, which rejects non-strings (`[true, null]` → `since must be YYYY-MM-DD`, checked on the box).
8. **The id-mismatch proof could corrupt the verify data dir.** `loadPicks()` trusts `pick_created.payload.id`, so a mismatched log dropped into `$DATA` would put a duplicate row on the Big Board. Fix: VERIFY 7 runs in a scratch data dir, and a CONTEXT row explains why. The loadPicks flaw stays out of scope (see Open risks in LAUNCH-004).
9. **K5 did not match the reducer.** The first draft omitted how a `judge_launched` without `pass` gets one. Fix: K5 now states the reducer's exact rule from `reduce()` at `60b1625` (`num(payload.pass, judgeLaunches.length + 1)`, then `find(pass) ?? judgeLaunches[rawPasses.length]`). L4 (a) proves equality on every sample pick that has a judgement.
10. **The oracle crashed on `events: null`** because it sorted before checking. Fixed. The data-dir reader now passes unreadable logs as `events: null`, so a single rule in `gardener` (K1) produces every skip, which matches the spec's `loadLogs` contract. The re-run gave L9 with all four reasons sorted by pickId, plus the sample numbers unchanged.
11. **The registry row did not land.** make-copies' rows use literal `\t`, not tab characters, so the first insert silently missed. Fix: re-inserted. `make-copies.sh` now prints three `ok:` lines, and SPEC 002/003 copies match their pre-edit md5s.

## Consider (left as is, with reason)
- **The review level takes no machine check.** Free-text lessons rank last and their proposal is "Boyd names the check". This is deliberate, following pstack `correct` (a class is only fixable once named) and Boyd's ARCHITECTURE line "architecture > checks > skills > human review". Auto-classifying text would need an LLM, which is out of scope.
- **Repeat counts distinct picks, not findings.** `p-20261014-01` has three unresolved-label findings but stays a one-off. That is the point of R2 (one bad launch is one incident), and L5 pins it both ways.
- **Candidates could hardcode the sample.** L4-L7, L9, L10 and L14 use crafted picks. The judge writes its own pooled file and adds hostile values. The `tests` criterion requires a hand-broken rule to fail a candidate test.
- **Candidate-lifecycle events make no findings** (candidate_failed, candidate_dropped, pick_failed). PLAN says the gardener reads judge and verifier findings. Errors and drops are already on the Decision log (Pick 2), and adding them would double-count c-relaunches. A later pick can add a row.
- **The selftest data shows up in the unwindowed Locker Room.** The happy pick's NOT_VERIFIED and the close pick's gate fail are real findings. The journeys use the date window for exact numbers, and the live and hostile journeys use the unwindowed view only for relative checks.
- **The middle label is fixed across the reversed passes (B = c1).** This is inherent to pure reversal with N=3, as in Picks 1 and 2, and differs from both earlier maps.

## Noted
- `stageLabel(status)` returns `Film Room` for `judging` and `Physical` for `physical` (`transitions.ts`). `isPickId`, `reduce` and `stageLabel` are exported from `src/core/index.ts` at `60b1625`.
- `readEvents` returns `[]` for a missing file (→ `no pick_created`) and throws on a bad line (→ `unreadable` via `loadLogs`).
- `dd record lesson_recorded` defaults `topic` to `general` and requires `text` (dd.ts:234-237), so the live and hostile journeys need `--text`.
- The guards ban `\bfetch\s*\(` everywhere in src except `app.js`, and allow test imports only of the three entry points. The vm harness reads `lessons.js` with `readFile`, which is not an import.
- The scaffold has typescript ^5.8.3, so `satisfies` (c1) is available.
- `tools/filmroom-calc.mjs` ran unchanged against SPEC-004-rubric.json on two scratch passes (/tmp/p3/s1.md, s2.md): six criteria, weights 15, base c1, closeCall true, swap consistent.

## Dismissed
- **"Locker Room" and "lesson" words in the candidate body.** Those are product names that every candidate needs. make-copies checks every criterion name and every angle name taken from the JSON, plus the distinctive phrases (`kind registry`, `flat findings first`, `weekly to-do`, `explicit stages`, `receipts table`, `prominent first item`, `KindRule`, `satisfies`).
- **The fixture dates are in the past.** The gardener reads no clock (K4), and windows are explicit.

## Proof run on the box
- `node tools/lessons-calc.mjs fixtures/lessons-week.jsonl` → the 36 lines in the spec, byte-equal to `--data` on the split dir. With a bad line appended to one log: `7 lessons from 4 picks · 23 findings · 2 one-offs` + `skipped p-20261015-01: unreadable`.
- Windows: `--since 2026-10-12 --until 2026-10-14` → `1 lesson from 2 picks · 9 findings · 4 one-offs`. `2026-10-11..2026-10-16` equals no window. The error strings are as in K3.
- Crafted cases L5, L6, L7, L9, L10 (deep-equal under shuffle) and L14 were run with /tmp/p3/crafted.mjs, and L4 (c)/(d) with /tmp/p3/l4.mjs.
- `--copies 100` → `13 lessons from 500 picks · 2700 findings · 0 one-offs` in about 23 ms in the oracle.
- `tools/make-copies.sh` → `ok` for SPEC 002, 003 and 004. `md5sum -c` on the SPEC 002/003 copies → OK.
