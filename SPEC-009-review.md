# SPEC 009 adversarial review (Pick 8, Season Ledger)

Reviewed Mon Oct 19, 2026, ~9:45–10:05 AM ET against `SPEC-009-season-ledger.md`, the box oracle `tools/ledger-calc.mjs`, the harness `fixtures/ledger/ledger-harness.mjs`, and the START mirror `runs/p8/start` (`93dca59`, 133 files read remotely with `gh api`, never cloned). Each finding was attacked as a candidate, a judge or a grafter would. Findings marked **fixed** were applied to the spec, fixtures or tools, and the copies were regenerated with `./tools/make-copies.sh` (`ok`: candidate 270, judge 286, full 296).

## Gradeability (every line has a test or a journey)
| Check | Result |
|---|---|
| Q1–Q18 each name a `test/ledger.test.ts` test (or a CLI/API/DOM assertion) | ok |
| Q19 and Q21 name journeys in `features/season-ledger.md` | ok |
| Q20 names full `npm test` plus VERIFY 3, 5 and 9 | ok |
| Baselines measured: START has no fixtures (oracle exits 2, `runs/p8/oracle-start.txt`); fixtures oracle **22/22** (`runs/p8/oracle-fixtures.txt`) | ok |
| The harness is independent of `src/`; its pick facts agree with START's own `reduce()` on all 11 admitted picks (`bun tools/ledger-engine-ref.ts` → 11/11, `runs/p8/engine-crosscheck.txt`) | ok |
| `bun tools/ledger-calc.mjs <dir> --engine` can import a candidate's `src/core/index.ts` `seasonLedger` and compare every row (self-tested on a stub: 14/14, `runs/p8/calc-selftest`) | ok |
| The oracle discriminates: dropping P7's verdict, adding a `src/` file to #2's drift, and un-drafting #6 each move the projection | ok |
| Rubric ids and weights equal `SPEC-009-rubric.json`; weights total 15 over seven criteria; pass 2 is pass 1 reversed | ok |
| The 15 closed-list edits were **run**, not just grepped: START copied to `/tmp/p8sim`, placeholder `ledger.css`/`ledger.js` wired in. Without the edits `bun test` fails exactly 6 tests (B16 ×2, S15 ×2, R15 ×2); with them 318/318 pass. Diff kept at `runs/p8/sanctioned-test-edits.diff` (bun runs the repo's `node:test` files; the box has node 20, not 22) | ok |

## Findings
1. **Real data, real answer (baked in).** The fixtures are the real PR list (`gh api …/pulls`, Mon ~9:47 AM ET), the real P3–P7 pick logs (P7 rebuilt through the repo's own `commitPick`/`parse*` at `93dca59` from the agents' report blocks), the eight real physical verdicts that live outside pick logs (agent ids from the transcripts), and four real GitHub compare results. The oracle's answer for today, `merge-safe through none · re-run #1`, is true: the scaffold PR #1 never had a physical, and #2/#3/#5/#6 moved after their VERIFIED only by `docs/screens/*.png` commits.
2. **The PR #7 re-run verdict was malformed (handled).** Its agent wrote evidence prose into the `ledger` field. `ledger-real.jsonl` records it as `live-ui-verified` (the agent's own words) with a note; the raw value is kept as a hostile line, so `bad ledger` is pinned by Q1.
3. **Closed-list cascade (fixed before launch; P6/P7 lesson, now worse).** Six test files assert whole stylesheet/script lists, including P7's own B16 tests, so adding two files breaks 15 lines. All 15 are pre-declared with exact text and were proven by simulation (above). New rule in CONTEXT/STANDING/rubric: P8's own tests and the pooled file assert **relative order only**, so Pick 9 does not inherit a 20-line cascade. Lesson for later: a registry refactor of these asserts is a separate pick.
4. **Who writes the ledger (decided).** Server and UI are read only; the CLI is the single writer through `src/store/ledger.ts` under `withLock`, append-only, canonical lines, dedupe, all-or-nothing batches. `writer` is a rubric criterion and the safety fact covers `POST`/`PUT`/`DELETE`.
5. **No GitHub calls in code (decided).** `import-prs` reads a saved `pulls.json`. Keeps the A15 network guard intact, needs no token, and makes tests deterministic. Grok Bot does `gh api … > pulls.json` on the box.
6. **What "docs-only" may claim (decided, disclosed).** Only a recorded drift whose `fromSha` is the last VERIFIED SHA and `toSha` is the current head, with every file under `docs/`, earns `docs-only`. No drift recorded → `stale`, never a guess. The tie-break (latest drift by `at`, then line) is pinned by Q5.
7. **Verdict order (decided).** Pick verdicts first (pick-id order), then ledger verdicts by (`at`, line). A ledger re-run is always newer than the pick's own physical in practice; `edges` #3 pins that file order never wins over `at`.
8. **Stack shape (decided).** Parent = lowest-numbered open PR whose `headRef` is this PR's `baseRef`; deepest root, deepest child, ties to the lower number; cycles cannot reach the stack. `edges` exercises a second root, a tie (#9 vs #14) and a #15/#16 cycle.
9. **Selftest and other seeds (fixed).** `control.sh launch` seeds selftest picks (ignored by source). `seed-bigboard`'s league picks claim PRs 3, 5–8, 11, 14, 42 and would change the screen, so `seed-ledger` checks the exact summary and the file bytes and tells the driver to `cleanup` + `launch` first. It runs `dd` from `$ROOT` so the default `targets.json` applies (fixed after review).
10. **Hostile PR titles (baked in).** Titles come from GitHub and can hold markup, `javascript:`, C1 controls and U+2028. View: text only. `dd ledger`: controls → U+FFFD. JSON: U+007F–U+009F and U+2028/2029 escaped (stricter than `lessonsJson`). External links are built only from a validated `BoydVC/<name>` repo and an integer.
11. **Repo guard (baked in).** `bad repo` refuses anything not `BoydVC/<name>`, anything containing `kpd`, and anything outside `targets.json`, so a KPD repo can never enter the ledger even by hand.
12. **Field name `ledger` is overloaded (accepted).** A verdict's `ledger` field is the engine's `Physical.ledger` level (`live-ui-verified` …), not the file. Kept for one name per concept across `reduce()` and the ledger; the spec's entry block shows both.
13. **Angles are distinct (checked).** c1 data-first (kind table + named phases, plain list), c2 phone-first (one answer, next move, rail), c3 proof-first (per-row trail in `<details>`, real table at 1280). All three meet the same binding DOM and `expected.json`. Angle words do not appear in either copy (`make-copies` ok, plus `next move`/`vertical rail`/`details>` hand terms).
14. **`dd/p7-big-board` could move (accepted).** LAUNCH-009 §0 re-checks the head (`93dca59` at write time); VERIFY 8 runs a merge-tree against a moved head.

## Not changed (considered and rejected)
- **Auto-fetching PRs from the server.** Rejected: network code in `src/`, a token on the box, and a second writer.
- **Storing statuses.** Rejected: statuses are folds; the file only holds facts (observations, verdicts, drifts).
- **A `drift` computed from git inside dd.** Rejected: dd has no repo checkout of the target; the orchestrator records compare results.
- **Closing PR #4 from the ledger.** Out of scope (and an outward action). The ledger only shows it off the stack.
