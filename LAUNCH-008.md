# Ready-to-run launch: Pick 7, Big Board stats (SPEC 008), 3-candidate arena

Mirrors `LAUNCH-007.md`. Written Sun Oct 18, 2026, about 2:00 PM ET. Like Picks 1–6, Pick 7 is driven **by hand**. The `dd` CLI is not on the box (no clones, ever), so Grok Bot plays the driver:
- It does the selection math with `node tools/filmroom-calc.mjs SPEC-008-rubric.json …`.
- It checks the stats numbers with one box-side oracle, `tools/bigboard-calc.mjs` (**node**: `node tools/bigboard-calc.mjs` checks `fixtures/bigboard`; `node tools/bigboard-calc.mjs <dir>` checks a mirror's committed `test/fixtures/bigboard/`; `bun tools/bigboard-calc.mjs <dir> --engine` also imports the mirror's `src/core/index.ts` `bigBoardStats` and compares every `expected.json` row).
- The fixtures were built from the real season (`tools/bigboard-fixture-gen.mjs`, real P5/P6 logs rebuilt by `tools/real-pick-gen.ts` with `DD_ROOT`) and cross-checked against START's own engine with `bun tools/bigboard-engine-ref.ts` (5/5).

It reads branch files with `gh api repos/BoydVC/draft-day/contents/<path>?ref=<sha> -H 'Accept: application/vnd.github.raw'` (read only) and never clones. Model: **omit on every launch** (Boyd has not named one). Budget: 3 candidates, 1–2 judge passes, 1 graft and 1 physical = 6–7 runs, plus at most 1 relaunch per candidate and 2 fix replies.

**LAUNCHED Sun Oct 18 ~2:05 PM ET: c1 bc-8fe21faf-d9ce-54a2-b9a1-bdfb523e7ae6 (dd/p7-big-board-a), c2 bc-8ebba3b0-b759-5df0-b822-bc6a11d7ace8 (dd/p7-big-board-b), c3 bc-4539e06b-a6c4-5a0f-a161-a009d086ee84 (dd/p7-big-board-c), all watched. Next: "On each candidate finish (revival)".**

**READY PATH (Sun Oct 18, ~2:00 PM ET): `START_REF = dd/p6-linter`, `START = dc38660f2f3fdaadcfd2e879693e24cb21a05eba` (draft PR #8, physical VERIFIED Sun ~11:17 AM ET). Oracle on fixtures 15/15 (`runs/p7/oracle-fixtures.txt`); the START mirror has no bigboard fixtures (exit 2, `runs/p7/oracle-start.txt`). The prompts below have START filled in.** One mode only: Pick 7 always sits on Pick 6.

**PR base for the graft: `dd/p6-linter`** (the Pick 6 PR branch). Pick 7 pushes only `dd/p7-big-board*` branches. Never pause, relaunch or reply to a Pick 1–6 agent (or the ledger re-run agents) from this file.

**Lessons built in:**
- **R15 (Pick 6).** The seven closed-list wiring lines (`test/replay.test.ts:369,371`, `test/replay.pooled.test.ts:587-588`, `test/linter.test.ts:416-417`, `test/linter.pooled.test.ts:618`) are pre-declared sanctioned candidate edits with exact text, and the tags must stay literal. No mid-run ruling is expected.
- **W19.** Grafter-only paths are pre-declared: `docs/SPEC-008-big-board.md`, `test/bigboard.pooled.test.ts` (from `dd/p7-big-board-judge`), replacement `docs/screens/p7-big-board/*.png`.
- **W8 at 1280.** B17 requires ≥44×44 stats controls and links at every width.
- **Screenshots** are committed (8 PNGs under `docs/screens/p7-big-board/`) and read with `gh api`; artifact paths are not relied on.
- **Selftest exclusion.** `control.sh launch` seeds 4 selftest picks; stats exclude them and `seed-bigboard` checks `excluded.selftest` 4.

## 0. Preconditions (read-only checks, at launch time)
1. **Base unchanged.** cursor-github `get_branch` BoydVC/draft-day `dd/p6-linter` → head `dc38660f2f3fdaadcfd2e879693e24cb21a05eba` (verified Sun Oct 18, ~2:00 PM ET, also with `gh api …/branches/dd/p6-linter`). `list_pull_requests` → #8 open, `draft: true`, head `dd/p6-linter`, base `dd/p5-replay` (verified ~2:00 PM ET; all eight stack PRs #1–#8 open drafts, none merged).
   - **If the head moved:** `compare_commits` base=`dc38660…` head=`dd/p6-linter`. If it touches `src/ui/*`, `src/server/http.ts`, `src/core/*`, `src/cli/dd.ts`, the four closed-list test files, the verify skill, or `test/fixtures/*`, **stop**: refresh `runs/p7/start/`, re-check the closed-list line numbers, re-run `bun tools/bigboard-engine-ref.ts`, rerun `./tools/make-copies.sh`. Otherwise put the new head in the prompts as `START` and log it.
2. **No run in progress:** no `dd/p7-big-board*` branch (Sun ~2:00 PM ET: none).
3. **Stack intact:** #8 → draft, base `dd/p5-replay`; #7 → draft, base `dd/p4-phone`. (Note: lower stack heads at ~2:00 PM ET were p5 `d1bd73c`, p4 `154cb71`, p3 `1f8610b`, p2 `8230d9b`, p1 `84ed446`; the parent's ledger re-runs own those branches.)
4. **Copies clean:** `./tools/make-copies.sh` prints `ok:` for SPEC-002…SPEC-007 and `SPEC-008-big-board` (candidate 227 lines, judge 242, full 252), then `ok`.
5. **Oracle agrees:** `node tools/bigboard-calc.mjs` → `TOTAL 15/15`; `node tools/bigboard-calc.mjs runs/p7/start` → exit 2. `bun tools/bigboard-engine-ref.ts` → `engine vs harness 5/5`.
6. **Usage:** on-demand stays disabled. Cursor Models pool resets about **Mon Oct 19, 8 PM ET**.

## 1. Combine: three candidate launches (send all three in one turn)
Common parameters for c1, c2 and c3:
- action: `launch`; repo: `https://github.com/BoydVC/draft-day`; starting_ref: `dd/p6-linter`; model: omit
- files (8, in this order):
  - `file:///workspace/tokenmax/poteto-pipeline/SPEC-008-big-board.candidate.md`
  - `file:///workspace/tokenmax/poteto-pipeline/fixtures/bigboard/season.jsonl`
  - `file:///workspace/tokenmax/poteto-pipeline/fixtures/bigboard/league.jsonl`
  - `file:///workspace/tokenmax/poteto-pipeline/fixtures/bigboard/hostile.jsonl`
  - `file:///workspace/tokenmax/poteto-pipeline/fixtures/bigboard/expected.json`
  - `file:///workspace/tokenmax/poteto-pipeline/fixtures/bigboard/bigboard-harness.mjs`
  - `file:///workspace/tokenmax/poteto-pipeline/fixtures/bigboard/bigboard-harness.d.mts`
  - `file:///workspace/tokenmax/poteto-pipeline/fixtures/bigboard/README.md`
  - **Never** attach to a candidate: `SPEC-008-big-board.md`, `.judge.md`, `SPEC-008-rubric.json`, `SPEC-008-review.md`, `tools/*`, `runs/*` or this file.

| Cand | title | branch | ANGLE line (in prompt) |
|---|---|---|---|
| c1 | `Draft Day P7 Big Board · c1 stat ledger` | `dd/p7-big-board-a` | Stat ledger: start from the numbers. src/core/bigboard.ts is one registry of metric rows (which logs count, angles, slots, trades, verify, stages, summary), each a pure fold over reduce() / timeline() output, typed with satisfies so a new metric fails tsc until it has its text line and its DOM container. Thin dd stats and GET /api/stats, and a plain panel that paints the JSON with the binding DOM names. Table-driven tests run every expected.json row through expectedFor. A reviewer should be able to tick the registry against the spec's stats-rule table row by row, with the fewest lines outside bigboard.ts. |
| c2 | `Draft Day P7 Big Board · c2 scoreboard` | `dd/p7-big-board-b` | Scoreboard: start from Boyd at the ballpark with his phone. The view reads like a stadium scoreboard: the summary as a big headline, then three leader tiles above the fold at 390 (best angle by rate with its record, trades per pick, first-try verify), then the full sections. Bars are meter elements or CSS widths, never SVG or canvas. Tokens only, both schemes, transitions only inside @media (prefers-reduced-motion: no-preference), safe-area aware. Paused on the 390 dark screenshot, a stranger can say which angle wins most, the trades per pick and the first-try verify rate within five seconds; the 1280 light screenshot works as a desk view. |
| c3 | `Draft Day P7 Big Board · c3 box score` | `dd/p7-big-board-c` | Box score: start from the tables. Each section is a real accessible table at 1280 (caption, th scope), read like a baseball box score: angles x W, entries, walkovers, rate; slots; trades by pick; stage medians with totals. At 600 px and below the same DOM reflows to labeled stacked rows (CSS only, captions from data-label, Pick 4's card-stack pattern). VoiceOver order: summary, window, angles, slots, trades, verify, stages, skipped. No sideways scroll at 390, no cell or link under 44x44 at 1280, binding DOM intact on tr rows. |

Prompt (identical except `{{BRANCH}}` and `{{ANGLE}}`; START is filled in):
```
Build SPEC 008 (uploads/SPEC-008-big-board.candidate.md) in this repo. The seven fixtures it names are in uploads/; commit each byte-identical under test/fixtures/bigboard/ and do not edit them. Pick 4's test/fixtures/phone/* (cdp-shot.mjs, probe.js, dom-harness.mjs) are already in the repo; use them unchanged.
Your starting ref is dd/p6-linter at commit dc38660f2f3fdaadcfd2e879693e24cb21a05eba (already checked out). Wherever the spec says START or START_REF, use exactly these. It is the top of a draft stack (dd/scaffold, dd/p1-film-room, dd/p2-timeline, dd/p3-lessons, dd/p4-phone, dd/p5-replay, dd/p6-linter); push your work to a new branch named {{BRANCH}}. Read docs/ARCHITECTURE.md, docs/SPEC-001.md through docs/SPEC-007-scouting-linter.md and AGENTS.md first; SPEC 008 wins where they differ. The spec's touch map is binding. Do not edit a do-not-touch file, and do not create the grafter-only paths (docs/SPEC-008-big-board.md, test/bigboard.pooled.test.ts).
The touch map pre-declares exactly seven closed-list lines you must change because you add bigboard.css and bigboard.js (test/replay.test.ts, test/replay.pooled.test.ts, test/linter.test.ts, test/linter.pooled.test.ts). Make exactly that text change and nothing else in those four files. Keep the link and script tags literal in index.html; never entity-encode or reorder tags to dodge a test.

Your angle (other agents are building the same spec from different angles; stay true to yours):
{{ANGLE}}

Rules:
- Draft PR only, and for this run open NO pull request at all: push your branch and stop. If your environment opens one automatically, it must be a DRAFT with base dd/p6-linter, and you say so in your report.
- Never mark any PR ready for review, never merge, never enable auto-merge, never deploy or publish anything.
- Do not push to main, dd/scaffold, any dd/p1-* through dd/p6-* branch, and do not force-push.
- Touch only this repository (BoydVC/draft-day). Nothing related to KPD/kpdlawgroup or debt collection.
- Zero runtime dependencies and no network code; test/guards.test.ts stays byte-identical; src/server/http.ts changes only on the static files line plus GET /api/stats; no web fonts, other-origin assets, SVG/canvas built from log text, localStorage, sessionStorage, cookies or history writes.
Run every VERIFY step in the spec, including updating and executing the verify-draft-day skill (seed-bigboard, the stats probes at every listed width and scheme, the window and empty states, the Big Board Stats link). Save screenshots under /opt/cursor/artifacts/war-room/ AND commit the eight the spec names under docs/screens/p7-big-board/.
End your final message with exactly one dd-report block for {{BRANCH}} as described in the spec (the eight committed screenshot repo paths in "screenshots"), then START, what works, what does not, the screenshot paths, the probe JSON lines, the safety-fact proof output, the stack-probe output, and open questions.
```

After the launches, one LOG.tsv row per candidate: `./log.sh combine "p7 launched c1 stat ledger" "START dc38660; branch dd/p7-big-board-a" "<agent id>" "running"`.

### On each candidate finish (revival)
Do these in order, for the candidate that finished. Do not message Boyd.
1. `CloudAgent dump` (agent id) → `tail -n 1` the transcript; save the final report to `runs/p7/c<N>-final.md`. If the run errored or was cancelled, go to step 6.
2. Extract the `dd-report` block. `get_branch` `dd/p7-big-board-<a|b|c>` → exists and head equals `headSha`. Missing report or branch = **error** (step 6).
3. `list_pull_requests` head=`BoydVC:dd/p7-big-board-<x>`. Candidates must open none. If one exists and is not a draft, `set_pull_request_draft` draft=true at once and log a lesson; if it exists as a draft, leave it and note it for the graft (close nothing, merge nothing).
4. Touch-map check: `compare_commits` base=`dc38660f2f3fdaadcfd2e879693e24cb21a05eba` head=`<headSha>`. Note any do-not-touch edit (including any non-sanctioned line in the four closed-list files) for the judge's second read (stack penalty, not error).
   - Box spot-check (no clone):
     ```
     H=<headSha>; N=<1|2|3>; D=runs/p7/c$N; rm -rf $D && mkdir -p $D/test/fixtures/bigboard $D/screens $D/src/ui $D/src/core $D/src/server $D/src/cli
     for f in src/ui/app.js src/ui/index.html src/ui/bigboard.js src/ui/bigboard.css src/server/http.ts src/cli/dd.ts; do
       gh api "repos/BoydVC/draft-day/contents/$f?ref=$H" -H 'Accept: application/vnd.github.raw' > "$D/$f" 2>/dev/null || true
     done
     for f in $(gh api "repos/BoydVC/draft-day/contents/src/core?ref=$H" --jq '.[].name'); do
       gh api "repos/BoydVC/draft-day/contents/src/core/$f?ref=$H" -H 'Accept: application/vnd.github.raw' > "$D/src/core/$f"
     done
     for f in $(gh api "repos/BoydVC/draft-day/contents/test/fixtures/bigboard?ref=$H" --jq '.[].name'); do
       gh api "repos/BoydVC/draft-day/contents/test/fixtures/bigboard/$f?ref=$H" -H 'Accept: application/vnd.github.raw' > "$D/test/fixtures/bigboard/$f"
     done
     for f in $(gh api "repos/BoydVC/draft-day/contents/docs/screens/p7-big-board?ref=$H" --jq '.[].name' 2>/dev/null); do
       gh api "repos/BoydVC/draft-day/contents/docs/screens/p7-big-board/$f?ref=$H" -H 'Accept: application/vnd.github.raw' > "$D/screens/$f"
     done
     node tools/bigboard-calc.mjs "$D" | tail -1
     bun tools/bigboard-calc.mjs "$D" --engine | tail -1   # needs src/core/*.ts; src/store, src/report imports may need pulling too if it fails to load (then note "engine n/a", not an error)
     (cd "$D/test/fixtures/bigboard" && sha256sum *)
     ls "$D/screens" | wc -l
     ```
     Expect `TOTAL 15/15`, the engine rows 5/5 if it loads, seven sha256 values equal to the spec's (and to `fixtures/bigboard/`), and 8 screenshots. Look at `stats-390-dark.png` yourself with Read.
5. Record for the judge's second read: tests count from the report, oracle total, engine result, screenshot count, touch-map notes.
6. Error once → one relaunch with the same parameters and prompt (log it). Error twice → drop it.
7. Log `./log.sh combine "p7 finished cN" "head <sha7>, tests <n>, oracle 15/15, engine 5/5, 8 screens" "<bc-…>" "finished"`.
8. If another candidate is still running, stop here and wait for its revival. When all three are settled: ≥2 finished → step 2 (judge pass 1); exactly 1 → walkover (skip 2–3; the physical opens a DRAFT PR from that branch into `dd/p6-linter`); 0 → pick fails (`no_candidates`), log it.

## 2. Film Room judge, pass 1
Fixed label maps (also in `SPEC-008-rubric.json`):
- Pass 1: **A = c2 (b), B = c3 (c), C = c1 (a)**
- Pass 2 (reversed): **A = c1 (a), B = c3 (c), C = c2 (b)**

Parameters: action `launch`, repo as above, starting_ref `dd/p6-linter`, title `Draft Day P7 Big Board judge · pass 1`, files = `SPEC-008-big-board.judge.md` + the seven fixtures, model omit.

Prompt (fill `{{SHA_A}}` etc. from the pass-1 map):
```
You are the Film Room judge for SPEC 008 (uploads/SPEC-008-big-board.judge.md), pass 1. You score; you do not build the feature. The seven fixtures are in uploads/ (sha256 in the spec). START_REF is dd/p6-linter and START is dc38660f2f3fdaadcfd2e879693e24cb21a05eba.

Candidates, anonymized. Refer to them ONLY by label, never by branch name, commit message or author:
- Label A: commit {{SHA_A}}
- Label B: commit {{SHA_B}}
- Label C: commit {{SHA_C}}
Fetch each by SHA and give each its own worktree. Do not look up which branch a SHA belongs to.

Do this, in order:
1. Write ONE black-box test file, test/bigboard.pooled.test.ts, from ACCEPTANCE lines B1-B16, using only the uploaded fixtures (committed under test/fixtures/bigboard/ byte-identical), bigboard-harness.mjs, Pick 4's dom-harness.mjs, src/ui/ read as text, and src/core/index.ts + src/cli/dd.ts + src/server/http.ts as entry points. Derive expected values from expected.json and the harness, not from any candidate's output. Commit it on a new branch dd/p7-big-board-judge started from dd/p6-linter and push that branch. That is the only thing you may push.
2. For each label, record hard gates: build = npx tsc --noEmit exit 0; tests = its own npm test exit 0 (pooled file not in the worktree); journey = verify-draft-day launches, control.sh seed-bigboard prints "seeded bigboard", and cdp-shot.mjs on #/stats at 390x844 dark prints "ok":true with scrollWidth <= 390, screenshot saved.
3. Only after gates are recorded, copy the same pooled file into each worktree and run it. Record passed/total (same total for every label).
4. For screen: the 8 cdp-shot runs the rubric names. Paste ok, scrollWidth, problems, offOrigin; look at #/stats 390 dark and 1280 light yourself.
5. Measure diff vs dc38660f2f3fdaadcfd2e879693e24cb21a05eba; check the touch map, including that the four closed-list files change only on the seven sanctioned lines (that edit is correct, not a penalty).
6. Stack probe: merge-base --is-ancestor START <sha>; fetch dd/p6-linter; merge-tree if its head moved.
7. Score every rubric criterion 0-4 with evidence. Do not reward length.
8. At most 2 trades per non-base label.

Rules: open NO pull request (draft only if forced, base dd/p6-linter). Never mark ready, never merge, never auto-merge, never deploy. Do not push to main, scaffold, p1–p6, or candidate branches. Touch only this repository. Nothing KPD/collections. Zero runtime deps.
End with exactly one dd-judgement block (one pass, labels only) plus rationale, probe lines, and stack-probe output.
```

### On judge finish
1. Dump; save `runs/p7/judge-pass1.md`.
2. `node tools/filmroom-calc.mjs SPEC-008-rubric.json runs/p7/judge-pass1.md --risks c1=<n>,c2=<n>,c3=<n>` (risks = open questions/touch-map notes per candidate).
3. Grok Bot second read: compare_commits, `node tools/bigboard-calc.mjs runs/p7/c<N>` → `TOTAL 15/15`, look at screenshots, log agree/disagree.
4. `needSecondPass: true` → step 2b; else step 3.

## 2b. Film Room judge, pass 2 (only on close call)
Same as pass 1, title `Draft Day P7 Big Board judge · pass 2 (reversed)`, labels from the pass-2 map (A=c1, B=c3, C=c2). Step 1 becomes: use `dd/p7-big-board-judge`'s pooled test unchanged; push nothing. First line: score from scratch; do not read any earlier judgement.

Then `node tools/filmroom-calc.mjs SPEC-008-rubric.json runs/p7/judge-pass1.md runs/p7/judge-pass2.md --risks …`. Write `runs/p7/film-room-result.md` for the grafter (START, base, runner-ups, trades, calculator output, swap, second read). **Do not skip pass 2 on a close call.**

## 3. Trade (graft) → the one draft PR
`{{PR_BASE}}` = `dd/p6-linter`. Check with `get_branch` right before launch.
- action: `launch`; repo as above; starting_ref `{{BASE_BRANCH}}` (the winning candidate branch); title `Draft Day P7 Big Board · trade + draft PR`
- files: full `SPEC-008-big-board.md` + seven fixtures + `runs/p7/film-room-result.md`; model omit

Prompt:
```
You are the grafter for Draft Day Pick 7 (SPEC 008, uploads/SPEC-008-big-board.md). Your starting branch {{BASE_BRANCH}} won the Film Room; uploads/film-room-result.md has the scorecard and the trade list. START_REF is dd/p6-linter and START is dc38660f2f3fdaadcfd2e879693e24cb21a05eba. The seven fixtures must stay byte-identical under test/fixtures/bigboard/.
1. Create branch dd/p7-big-board from {{BASE_BRANCH}}.
2. Port each listed trade by hand; stay inside the touch map; keep one mental model.
3. Add test/bigboard.pooled.test.ts from dd/p7-big-board-judge unchanged.
4. Commit uploads/SPEC-008-big-board.md as docs/SPEC-008-big-board.md. Add DECISIONS.tsv rows. Grafter-only paths only as the touch map allows. The four closed-list test files change only on the seven sanctioned lines; tags stay literal.
5. Run every VERIFY step; re-shoot all eight screenshots under docs/screens/p7-big-board/.
6. Open ONE DRAFT PR from dd/p7-big-board into {{PR_BASE}} titled "Draft Day Pick 7: Big Board stats (SPEC 008)". Body starts with "Draft only. Do not merge, enable auto-merge, or mark ready for review." Include START, synthesis, VERIFY, Screenshots (blob URLs), and a stack note: stacked on #8 ← #7 ← #6 ← #5 ← #3 ← #2 ← #1.
Rules: draft only; never ready/merge/auto-merge/deploy; no push to main/scaffold/p1–p6/candidates; BoydVC/draft-day only; nothing KPD/collections; zero runtime deps.
End with one dd-report for dd/p7-big-board plus "PR: #<number>".
```
Confirm `draft: true` and base `dd/p6-linter`. Log PR number and head SHA.

## 4. Physical (verify the draft PR)
- action: `launch`; starting_ref `dd/p7-big-board`; title `Draft Day P7 Big Board · physical`
- files: full SPEC-008 + seven fixtures; model omit

Prompt:
```
You are the verifier for draft PR #{{PR}} (branch dd/p7-big-board, head {{HEAD_SHA}}) built from SPEC 008 with START dc38660f2f3fdaadcfd2e879693e24cb21a05eba. CI green is an input, not a verdict.
Run npm test, tsc, selftest, doctor, sha256sum fixtures. Drive features/big-board-stats.md (seed-bigboard, stats-phone, stats-desktop, stats-window, stats-empty, stats-link). Prove the safety fact (certainty 4 or 5). Check the touch map including the grafter-only row and the seven sanctioned closed-list lines.
Do not change product code. Draft only; never ready/merge/deploy; push nothing.
End with exactly one dd-verdict block {prNumber, headSha, verdict, ledger, certainty, evidence, fixLoops}.
```
- **VERIFIED** → confirm draft; copy the 8 `docs/screens/p7-big-board/*.png` via `gh api` (raw) into `runs/p7/screens-final/`; **no message to Boyd** (quiet rule).
- **NOT_VERIFIED / INCONCLUSIVE** → reply queue to the graft agent (max 2 loops). W19-only miss → reply queue to the physical to re-check VERIFY 9 only (Pick 4 precedent).

## 5. Logging
Prefix decisions with `p7`. Phases: speccing, combine, judging, grafting, physical.

### LOG.tsv row templates
```
./log.sh combine "p7 launched c1 stat ledger" "START dc38660; branch dd/p7-big-board-a" "<bc-…>" "running"
./log.sh combine "p7 launched c2 scoreboard" "START dc38660; branch dd/p7-big-board-b" "<bc-…>" "running"
./log.sh combine "p7 launched c3 box score" "START dc38660; branch dd/p7-big-board-c" "<bc-…>" "running"
./log.sh combine "p7 finished cN" "head <sha>, tests <n>, oracle 15/15, engine 5/5, 8 screens" "<bc-…>" "finished"
./log.sh judging "p7 judge pass 1 launched" "A=c2 B=c3 C=c1" "<bc-…>" "running"
./log.sh judging "p7 judge pass 1 done" "base …; closeCall …" "<bc-…>" "ok"
./log.sh judging "p7 second read" "agree|disagree: <note>" "-" "agree|disagree"
./log.sh judging "p7 judge pass 2 launched" "A=c1 B=c3 C=c2" "<bc-…>" "running"
./log.sh grafting "p7 graft launched" "base cN dd/p7-big-board-x @<sha> -> dd/p7-big-board, draft PR into dd/p6-linter" "<bc-…>" "running"
./log.sh physical "p7 physical launched" "PR #<n> @<sha>" "<bc-…>" "running"
./log.sh physical "p7 physical VERIFIED" "PR #<n> @<sha> certainty 5 fixLoops 0, still draft" "<bc-…>" "VERIFIED"
```

## Open risks (read before launch)
- **dd/p6-linter could move** (ledger re-runs are active on the stack). Step 0.1 and VERIFY 8 catch it.
- **Chrome is not Safari.** No real-device proof claimed.
- **Pre-existing 1280 W8 board/pick-page problems** stay out of scope (must not grow).
- **Seeds stack up** in one DATA dir; `seed-bigboard` checks the exact summary and says to `cleanup` + `launch` when other seeds added picks.
- **P5/P6 timestamps** come from LOG.tsv, not per-message stamps (disclosed in the fixture README); stage medians are exact for the fixtures as written.
- **Cloud VM Chrome / WebSocket** may yield an INCONCLUSIVE journey (environment); one relaunch.
