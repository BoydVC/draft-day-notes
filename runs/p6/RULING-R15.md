# Ruling · P6 R15 stylesheet conflict (Sun Oct 18, 2026 ~10:20 AM ET)

SPEC 007 S15 requires index.html to link `linter.css` (and load `linter.js`), but the do-not-touch Replay suites
(test/replay.test.ts and test/replay.pooled.test.ts, "R15 wiring") assert the closed pre-linter stylesheet/script list.
Every compliant candidate therefore fails exactly those two assertions. This is a spec-pack bug (orchestrator), not a candidate fault.

Ruling:
- Candidates: the `tests` hard gate passes when `npm test` fails ONLY on the two R15 wiring assertions in those two files
  and the failure diff is exactly the added linter.css / linter.js entries. Any other failure fails the gate. Not editing those files is correct (no stack penalty).
- Judge: apply the gate above; record the R15 pair as "known spec conflict" in evidence.
- Grafter: sanctioned to update R15's expected lists in test/replay.test.ts and test/replay.pooled.test.ts to append linter.css / linter.js
  (grafter-only row), and nothing else in those files; npm test must then be fully green.
- Physical: those two edits are sanctioned touch-map paths.

## How the three candidates handled it (judge: apply, do not re-litigate)
- One label left the two R15 assertions red and wrote an open question. That is the correct behavior under the ruling: tests gate passes, no stack penalty.
- One label edited R15 in test/replay.test.ts and test/replay.pooled.test.ts to append the linter entries. Gate passes (npm test green), but those are do-not-touch files at candidate time, so the rubric's stack cap applies (stack ≤ 1). Its R15 edit is a valid trade source for the grafter.
- One label wrote the tags as `href="&#47;linter.css"` / `src="&#47;linter.js"` so the closed-list assertions don't see them. This evades the check rather than resolving it: S15's literal tags are not met, and its own linter test injects linter.js because the DOM harness doesn't load the entity-form tag. Treat as a workaround: S15 counts as not met for scoring (tests and stack criteria), not as a gate failure. The grafter must use literal tags.
