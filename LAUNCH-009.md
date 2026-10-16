# Ready-to-run launch: Pick 8, Season Ledger (SPEC 009), 3-candidate arena

Mirrors `LAUNCH-008.md`. Written Mon Oct 19, 2026, about 10:05 AM ET. Like Picks 1–7, Pick 8 is driven **by hand**. The `dd` CLI is not on the box (no clones, ever), so Grok Bot plays the driver:
- Selection math: `node tools/filmroom-calc.mjs SPEC-009-rubric.json …`.
- Ledger numbers: `tools/ledger-calc.mjs` (**node**: `node tools/ledger-calc.mjs` checks `fixtures/ledger` → 22/22; `node tools/ledger-calc.mjs <dir>` checks a mirror's committed `test/fixtures/ledger/`; `bun tools/ledger-calc.mjs <dir> --engine` also imports the mirror's `src/core/index.ts` and compares `seasonLedger`, `readLedger`, `prEntriesFromPulls`, `ledgerLine`, `ledgerText`, `ledgerJson` on every row).
- Fixtures built from real artifacts by `tools/ledger-fixture-gen.mjs`; pick facts cross-checked against START's own `reduce()` with `bun tools/ledger-engine-ref.ts` (11/11).
- Closed-list edits simulated with bun on a scratch copy of START (`runs/p8/sanctioned-test-edits.diff`; 6 fail without, 318/318 with).

It reads branch files with `gh api repos/BoydVC/draft-day/contents/<path>?ref=<sha> -H 'Accept: application/vnd.github.raw'` (read only) and never clones. Model: **omit on every launch** (Boyd has not named one). Budget: 3 candidates, 1–2 judge passes, 1 graft and 1 physical = 6–7 runs, plus at most 1 relaunch per candidate and 2 fix replies.

**STATUS: see the `p8` rows at the bottom of `LOG.tsv` and the STATUS block below (kept current).**

**READY PATH (Mon Oct 19, ~10:05 AM ET): `START_REF = dd/p7-big-board`, `START = 93dca59db747e8306ab460e38d7ddf978031987e` (draft PR #9, physical VERIFIED Sun ~3:37 PM ET). Oracle on fixtures 22/22 (`runs/p8/oracle-fixtures.txt`); START mirror has no ledger fixtures (exit 2, `runs/p8/oracle-start.txt`).** One mode only: Pick 8 always sits on Pick 7.

**PR base for the graft: `dd/p7-big-board`.** Pick 8 pushes only `dd/p8-season-ledger*` branches. Never pause, relaunch or reply to a Pick 1–7 agent from this file.

**Lessons built in:**
- **Closed lists (P6 R15, P7 B16).** 15 lines in six test files are pre-declared with exact text and were proven by simulation. P8's own tests assert relative order only.
- **W19.** Grafter-only paths pre-declared: `docs/SPEC-009-season-ledger.md`, `test/ledger.pooled.test.ts` (from `dd/p8-season-ledger-judge`), replacement `docs/screens/p8-season-ledger/*.png`.
- **W8 at 1280.** Q19 requires ≥44×44 ledger links at every width.
- **Screenshots committed** (8 PNGs) and read with `gh api`.
- **P7 judge JSON had a missing bracket.** Save raw judge output as `runs/p8/judge-passN.raw.md` before repairing anything.

## 0. Preconditions (read-only checks, at launch time)
1. **Base unchanged.** `gh api repos/BoydVC/draft-day/branches/dd/p7-big-board --jq .commit.sha` → `93dca59db747e8306ab460e38d7ddf978031987e`. #9 open, draft, base `dd/p6-linter`. If it moved and touches `src/ui/*`, `src/server/http.ts`, `src/core/*`, `src/cli/dd.ts`, `src/store/*`, the six closed-list test files, the verify skill or `test/fixtures/*`: **stop**, refresh `runs/p8/start/`, re-check the 15 lines, re-run the simulation and the engine cross-check, re-run `make-copies`.
2. **No run in progress:** no `dd/p8-season-ledger*` branch.
3. **Stack intact:** PRs #1–#9 open drafts.
4. **Copies clean:** `./tools/make-copies.sh` → `ok:` for SPEC-002…SPEC-009 (SPEC-009: candidate 270, judge 286, full 296), then `ok`.
5. **Oracle agrees:** `node tools/ledger-calc.mjs` → `TOTAL 22/22`; `node tools/ledger-calc.mjs runs/p8/start` → exit 2; `bun tools/ledger-engine-ref.ts` → `engine vs harness 11/11`.
6. **Usage:** on-demand stays disabled. Cursor Models pool resets about **Mon Oct 19, 8 PM ET**.

## 1. Combine: three candidate launches (send all three in one turn)
Common parameters: action `launch`; repo `https://github.com/BoydVC/draft-day`; starting_ref `dd/p7-big-board`; model omit.
files (12, in this order):
- `file:///workspace/tokenmax/poteto-pipeline/SPEC-009-season-ledger.candidate.md`
- `file:///workspace/tokenmax/poteto-pipeline/fixtures/ledger/{picks.jsonl, pulls.json, ledger-real.jsonl, ledger-tuesday.jsonl, ledger-edges.jsonl, hostile.jsonl, hostile-picks.jsonl, expected.json, ledger-harness.mjs, ledger-harness.d.mts, README.md}` (11 files, each listed separately)
- **Never** attach to a candidate: `SPEC-009-season-ledger.md`, `.judge.md`, `SPEC-009-rubric.json`, `SPEC-009-review.md`, `tools/*`, `runs/*` or this file.

| Cand | title | branch | ANGLE line (in prompt) |
|---|---|---|---|
| c1 | `Draft Day P8 Season Ledger · c1 ledger book` | `dd/p8-season-ledger-a` | Ledger book: start from the data. src/core/ledger.ts holds one table of entry kinds (fields in canonical order, each field's check and reason string, one row per kind) that parseLedgerEntry walks, and the fold is a short pipeline of named pure phases (admit picks, observe PRs, order verdicts, classify, stack, summarize), each over the previous phase's output. src/store/ledger.ts is a thin locked appender. The view is a plain ordered list painted from SeasonLedger with the binding DOM names. Table-driven tests run every expected.json row and every hostile reason. A reviewer should be able to tick the kind table against the entry checks and the phases against the ledger-rule table row by row, with the fewest lines outside ledger.ts. |
| c2 | `Draft Day P8 Season Ledger · c2 merge desk` | `dd/p8-season-ledger-b` | Merge desk: start from Boyd deciding what to merge on his phone. The view leads with one big answer ("Merge-safe through #N" or "Not merge-safe yet") and the next move (the re-run list as one sentence), then the stack as a vertical rail in merge order: one card per PR with a status chip (word plus token color), #n link, short head SHA, verified SHA when different, and the why line; off-stack and off-the-board below. Above the fold at 390 dark: the answer, the next move and the first three rail cards. Tokens only, both schemes, motion only inside prefers-reduced-motion: no-preference, safe-area aware. Paused on the 390 dark screenshot, a stranger can say how far Boyd can merge and what to re-run within five seconds; the tuesday screenshot reads as all clear. |
| c3 | `Draft Day P8 Season Ledger · c3 audit trail` | `dd/p8-season-ledger-c` | Audit trail: start from proof, every status shows where it came from. Each row is a details element (closed by default, no JS state) whose summary is the row line (position, #n, status, why) and whose body lists that PR's verdict sequence (source pick/ledger, SHA, verdict, certainty, agent) and its drift (files count, docs-only), added as extra LedgerRow fields from the same fold. At 1280 the merge order is a real table (caption, th scope); at 600 px and below the same DOM reflows to labeled stacked rows (CSS only). Boyd or a reviewer can answer "why is #5 docs-only?" without leaving the page; no sideways scroll at 390; binding DOM intact on the row elements. |

Prompt (identical except `{{BRANCH}}` and `{{ANGLE}}`; START is filled in):
```
Build SPEC 009 (uploads/SPEC-009-season-ledger.candidate.md) in this repo. The eleven fixtures it names are in uploads/; commit each byte-identical under test/fixtures/ledger/ and do not edit them. Pick 4's test/fixtures/phone/* (cdp-shot.mjs, probe.js, dom-harness.mjs) are already in the repo; use them unchanged.
Your starting ref is dd/p7-big-board at commit 93dca59db747e8306ab460e38d7ddf978031987e (already checked out). Wherever the spec says START or START_REF, use exactly these. It is the top of a draft stack (dd/scaffold, dd/p1-film-room, dd/p2-timeline, dd/p3-lessons, dd/p4-phone, dd/p5-replay, dd/p6-linter, dd/p7-big-board); push your work to a new branch named {{BRANCH}}. Read docs/ARCHITECTURE.md, docs/SPEC-001.md through docs/SPEC-008-big-board.md and AGENTS.md first; SPEC 009 wins where they differ. The spec's touch map is binding. Do not edit a do-not-touch file, and do not create the grafter-only paths (docs/SPEC-009-season-ledger.md, test/ledger.pooled.test.ts).
The touch map pre-declares exactly fifteen closed-list lines you must change because you add ledger.css and ledger.js (test/replay.test.ts, test/replay.pooled.test.ts, test/linter.test.ts, test/linter.pooled.test.ts, test/bigboard.test.ts, test/bigboard.pooled.test.ts). Make exactly that text change and nothing else in those six files. Keep the link and script tags literal in index.html; never entity-encode or reorder tags to dodge a test. Your own new tests assert relative order only, never a whole list.
The ledger file is written only by the dd CLI through src/store/ledger.ts under withLock; no HTTP route writes it. Never call GitHub or any network from code or tests: pulls.json is a file.

Your angle (other agents are building the same spec from different angles; stay true to yours):
{{ANGLE}}

Rules:
- Draft PR only, and for this run open NO pull request at all: push your branch and stop. If your environment opens one automatically, it must be a DRAFT with base dd/p7-big-board, and you say so in your report.
- Never mark any PR ready for review, never merge, never enable auto-merge, never deploy or publish anything.
- Do not push to main, dd/scaffold, any dd/p1-* through dd/p7-* branch, and do not force-push.
- Touch only this repository (BoydVC/draft-day). Nothing related to KPD/kpdlawgroup or debt collection.
- Zero runtime dependencies and no network code; test/guards.test.ts stays byte-identical; src/server/http.ts changes only on the static files line, one import and GET /api/ledger; no web fonts, other-origin assets, SVG/canvas built from ledger data, localStorage, sessionStorage, cookies or history writes.
Run every VERIFY step in the spec, including updating and executing the verify-draft-day skill (empty state, seed-ledger, the ledger probes at every listed width and scheme, seed-ledger tuesday, the Big Board Ledger link). Save screenshots under /opt/cursor/artifacts/war-room/ AND commit the eight the spec names under docs/screens/p8-season-ledger/.
End your final message with exactly one dd-report block for {{BRANCH}} as described in the spec (the eight committed screenshot repo paths in "screenshots"), then START, what works, what does not, the screenshot paths, the probe JSON lines, the safety-fact proof output, the stack-probe output, and open questions.
```

After the launches, one LOG.tsv row per candidate: `./log.sh combine "p8 launched c1 ledger book" "START 93dca59; branch dd/p8-season-ledger-a" "<agent id>" "running"`.

### On each candidate finish (revival)
Do these in order, for the candidate that finished. Do not message Boyd.
1. `CloudAgent dump` (agent id) → `tail -n 1` the transcript; save the final report to `runs/p8/c<N>-final.md`. If the run errored or was cancelled, go to step 6.
2. Extract the `dd-report` block. `gh api repos/BoydVC/draft-day/branches/dd/p8-season-ledger-<a|b|c>` → exists and head equals `headSha`. Missing report or branch = **error** (step 6).
3. `gh api 'repos/BoydVC/draft-day/pulls?head=BoydVC:dd/p8-season-ledger-<x>&state=all'`. Candidates must open none. If one exists and is not a draft, set it to draft at once and log a lesson; if it is a draft, leave it and note it (close nothing, merge nothing).
4. Touch-map check: `gh api repos/BoydVC/draft-day/compare/93dca59db747e8306ab460e38d7ddf978031987e...<headSha> --jq '.files[].filename'`. Note any do-not-touch edit (including any non-sanctioned line in the six closed-list files) for the judge's second read.
   - Box spot-check (no clone): **`runs/p8/spotcheck.sh <N> <headSha>`** does all of the below in one go (smoke-tested on START). Manual form:
     ```
     H=<headSha>; N=<1|2|3>; D=runs/p8/c$N; rm -rf $D && mkdir -p $D/test/fixtures/ledger $D/screens $D/src/ui $D/src/core $D/src/store $D/src/server $D/src/cli
     for f in src/ui/app.js src/ui/index.html src/ui/ledger.js src/ui/ledger.css src/server/http.ts src/cli/dd.ts src/store/ledger.ts src/store/eventlog.ts; do
       gh api "repos/BoydVC/draft-day/contents/$f?ref=$H" -H 'Accept: application/vnd.github.raw' > "$D/$f" 2>/dev/null || true
     done
     for f in $(gh api "repos/BoydVC/draft-day/contents/src/core?ref=$H" --jq '.[].name'); do
       gh api "repos/BoydVC/draft-day/contents/src/core/$f?ref=$H" -H 'Accept: application/vnd.github.raw' > "$D/src/core/$f"
     done
     for f in $(gh api "repos/BoydVC/draft-day/contents/test/fixtures/ledger?ref=$H" --jq '.[].name'); do
       gh api "repos/BoydVC/draft-day/contents/test/fixtures/ledger/$f?ref=$H" -H 'Accept: application/vnd.github.raw' > "$D/test/fixtures/ledger/$f"
     done
     for f in $(gh api "repos/BoydVC/draft-day/contents/docs/screens/p8-season-ledger?ref=$H" --jq '.[].name' 2>/dev/null); do
       gh api "repos/BoydVC/draft-day/contents/docs/screens/p8-season-ledger/$f?ref=$H" -H 'Accept: application/vnd.github.raw' > "$D/screens/$f"
     done
     node tools/ledger-calc.mjs "$D" | tail -1
     bun tools/ledger-calc.mjs "$D" --engine | tail -1   # may need src/report etc.; "engine n/a" is not an error
     (cd "$D/test/fixtures/ledger" && sha256sum *)
     ls "$D/screens" | wc -l
     for f in test/replay.test.ts test/replay.pooled.test.ts test/linter.test.ts test/linter.pooled.test.ts test/bigboard.test.ts test/bigboard.pooled.test.ts test/phone.test.ts; do
       mkdir -p "$D/$(dirname $f)"; gh api "repos/BoydVC/draft-day/contents/$f?ref=$H" -H 'Accept: application/vnd.github.raw' > "$D/$f"
       diff -u runs/p8/start/$f "$D/$f" --label a/$f --label b/$f
     done > "$D/closed-list.diff"; diff <(rg '^[+-] ' runs/p8/sanctioned-test-edits.diff) <(rg '^[+-] ' "$D/closed-list.diff") && echo "closed-list exact"
     ```
     Expect `TOTAL 22/22` on the oracle, engine rows if it loads, eleven sha256 values equal to the spec's, 8 screenshots, and `closed-list exact` (phone W5 may differ in variable naming: read it). Look at `ledger-390-dark.png` yourself with Read.
5. Record for the judge's second read: tests count, oracle total, engine result, screenshot count, touch-map notes.
6. Error once → one relaunch with the same parameters and prompt (log it). Error twice → drop it.
7. Log `./log.sh combine "p8 finished cN" "head <sha7>, tests <n>, oracle 22/22, engine <r>, 8 screens" "<bc-…>" "finished"`.
8. If another candidate is still running, stop and wait for its revival. When all three are settled: ≥2 finished → step 2; exactly 1 → walkover (skip 2–3; graft directly from that branch); 0 → pick fails, log it.

## 2. Film Room judge, pass 1
Fixed label maps (also in `SPEC-009-rubric.json`):
- Pass 1: **A = c2 (b), B = c3 (c), C = c1 (a)**
- Pass 2 (reversed): **A = c1 (a), B = c3 (c), C = c2 (b)**

Parameters: action `launch`, repo as above, starting_ref `dd/p7-big-board`, title `Draft Day P8 Season Ledger judge · pass 1`, files = `SPEC-009-season-ledger.judge.md` + the eleven fixtures, model omit.

Prompt (fill `{{SHA_A}}` etc. from the pass-1 map):
```
You are the Film Room judge for SPEC 009 (uploads/SPEC-009-season-ledger.judge.md), pass 1. You score; you do not build the feature. The eleven fixtures are in uploads/ (sha256 in the spec). START_REF is dd/p7-big-board and START is 93dca59db747e8306ab460e38d7ddf978031987e.

Candidates, anonymized. Refer to them ONLY by label, never by branch name, commit message or author:
- Label A: commit {{SHA_A}}
- Label B: commit {{SHA_B}}
- Label C: commit {{SHA_C}}
Fetch each by SHA and give each its own worktree. Do not look up which branch a SHA belongs to.

Do this, in order:
1. Write ONE black-box test file, test/ledger.pooled.test.ts, from ACCEPTANCE lines Q1-Q18, using only the uploaded fixtures (committed under test/fixtures/ledger/ byte-identical), ledger-harness.mjs, Pick 4's dom-harness.mjs, src/ui/ read as text, and src/core/index.ts + src/cli/dd.ts + src/server/http.ts as entry points. Derive expected values from expected.json and the harness, not from any candidate's output. Wiring assertions check relative order only. Commit it on a new branch dd/p8-season-ledger-judge started from dd/p7-big-board and push that branch. That is the only thing you may push.
2. For each label, record hard gates: build = npx tsc --noEmit exit 0; tests = its own npm test exit 0 (pooled file not in the worktree); journey = verify-draft-day launches, control.sh seed-ledger prints "seeded ledger", and cdp-shot.mjs on #/ledger at 390x844 dark prints "ok":true with scrollWidth <= 390, screenshot saved.
3. Only after gates are recorded, copy the same pooled file into each worktree and run it. Record passed/total (same total for every label).
4. For screen: the 8 cdp-shot runs the rubric names. Paste ok, scrollWidth, problems, offOrigin; look at #/ledger 390 dark and 1280 light yourself.
5. For writer: run the rubric's probes (concurrent record, bad batch, re-import, POST/PUT to /api/ledger with the file's sha256 before and after).
6. Measure diff vs 93dca59db747e8306ab460e38d7ddf978031987e; check the touch map, including that the six closed-list files change only on the fifteen sanctioned lines (that edit is correct, not a penalty).
7. Stack probe: merge-base --is-ancestor START <sha>; fetch dd/p7-big-board; merge-tree if its head moved.
8. Score every rubric criterion 0-4 with evidence. Do not reward length.
9. At most 2 trades per non-base label.

Rules: open NO pull request (draft only if forced, base dd/p7-big-board). Never mark ready, never merge, never auto-merge, never deploy. Do not push to main, scaffold, p1–p7, or candidate branches. Touch only this repository. Nothing KPD/collections. Zero runtime deps.
End with exactly one dd-judgement block (one pass, labels only, valid JSON) plus rationale, probe lines, and stack-probe output.
```

### On judge finish
1. Dump; save the raw report to `runs/p8/judge-pass1.raw.md`, then `runs/p8/judge-pass1.md` (repair JSON only if needed, note it).
2. `node tools/filmroom-calc.mjs SPEC-009-rubric.json runs/p8/judge-pass1.md --risks c1=<n>,c2=<n>,c3=<n>`.
3. Grok Bot second read: compare files, `node tools/ledger-calc.mjs runs/p8/c<N>` → `TOTAL 22/22`, look at screenshots, log agree/disagree.
4. `needSecondPass: true` → step 2b; else step 3.

## 2b. Film Room judge, pass 2 (only on close call)
Same as pass 1, title `Draft Day P8 Season Ledger judge · pass 2 (reversed)`, labels from the pass-2 map (A=c1, B=c3, C=c2). Step 1 becomes: use `dd/p8-season-ledger-judge`'s pooled test unchanged; push nothing. First line: score from scratch; do not read any earlier judgement.

Then `node tools/filmroom-calc.mjs SPEC-009-rubric.json runs/p8/judge-pass1.md runs/p8/judge-pass2.md --risks …`. Write `runs/p8/film-room-result.md` for the grafter (START, base, runner-ups, trades, calculator output, swap, second read). **Do not skip pass 2 on a close call.**

## 3. Trade (graft) → the one draft PR
`{{PR_BASE}}` = `dd/p7-big-board`. Check its head right before launch.
- action `launch`; repo as above; starting_ref `{{BASE_BRANCH}}` (the winning candidate branch); title `Draft Day P8 Season Ledger · trade + draft PR`
- files: full `SPEC-009-season-ledger.md` + eleven fixtures + `runs/p8/film-room-result.md`; model omit

Prompt:
```
You are the grafter for Draft Day Pick 8 (SPEC 009, uploads/SPEC-009-season-ledger.md). Your starting branch {{BASE_BRANCH}} won the Film Room; uploads/film-room-result.md has the scorecard and the trade list. START_REF is dd/p7-big-board and START is 93dca59db747e8306ab460e38d7ddf978031987e. The eleven fixtures must stay byte-identical under test/fixtures/ledger/.
1. Create branch dd/p8-season-ledger from {{BASE_BRANCH}}.
2. Port each listed trade by hand; stay inside the touch map; keep one mental model.
3. Add test/ledger.pooled.test.ts from dd/p8-season-ledger-judge unchanged.
4. Commit uploads/SPEC-009-season-ledger.md as docs/SPEC-009-season-ledger.md. Add DECISIONS.tsv rows. Grafter-only paths only as the touch map allows. The six closed-list test files change only on the fifteen sanctioned lines; tags stay literal.
5. Run every VERIFY step; re-shoot all eight screenshots under docs/screens/p8-season-ledger/.
6. Open ONE DRAFT PR from dd/p8-season-ledger into {{PR_BASE}} titled "Draft Day Pick 8: Season Ledger (SPEC 009)". Body starts with "Draft only. Do not merge, enable auto-merge, or mark ready for review." Include START, synthesis, VERIFY, Screenshots (blob URLs), and a stack note: stacked on #9 ← #8 ← #7 ← #6 ← #5 ← #3 ← #2 ← #1.
Rules: draft only; never ready/merge/auto-merge/deploy; no push to main/scaffold/p1–p7/candidates; BoydVC/draft-day only; nothing KPD/collections; zero runtime deps; no network code.
End with one dd-report for dd/p8-season-ledger plus "PR: #<number>".
```
Confirm `draft: true` and base `dd/p7-big-board`. Log PR number and head SHA.

## 4. Physical (verify the draft PR)
- action `launch`; starting_ref `dd/p8-season-ledger`; title `Draft Day P8 Season Ledger · physical`
- files: full SPEC-009 + eleven fixtures; model omit

Prompt:
```
You are the verifier for draft PR #{{PR}} (branch dd/p8-season-ledger, head {{HEAD_SHA}}) built from SPEC 009 with START 93dca59db747e8306ab460e38d7ddf978031987e. CI green is an input, not a verdict.
Run npm test, tsc, selftest, doctor, sha256sum fixtures. Drive features/season-ledger.md (empty state, seed-ledger, ledger-phone, ledger-desktop, seed-ledger tuesday, ledger-link). Prove the safety fact (certainty 4 or 5), including POST/PUT/DELETE to /api/ledger leaving the file's sha256 unchanged. Check the touch map including the grafter-only row and the fifteen sanctioned closed-list lines.
Do not change product code. Draft only; never ready/merge/deploy; push nothing.
End with exactly one dd-verdict block {prNumber, headSha, verdict, ledger, certainty, evidence, fixLoops}. Keep "ledger" to one of live-ui-verified, unit-test-verified, type-check-only, verifier-blocked, verifier-failed; put evidence only in "evidence".
```
- **VERIFIED** → confirm draft; copy the 8 `docs/screens/p8-season-ledger/*.png` via `gh api` (raw) into `runs/p8/screens-final/`; **no message to Boyd** (quiet rule). Append the verdict to the box's own season ledger notes (`runs/LEDGER-*.md`).
- **NOT_VERIFIED / INCONCLUSIVE** → reply queue to the graft agent (max 2 loops). W19-only miss → reply queue to the physical to re-check VERIFY 9 only.

## 5. Logging
Prefix decisions with `p8`. Phases: speccing, combine, judging, grafting, physical.
```
./log.sh combine "p8 launched c1 ledger book" "START 93dca59; branch dd/p8-season-ledger-a" "<bc-…>" "running"
./log.sh combine "p8 launched c2 merge desk" "START 93dca59; branch dd/p8-season-ledger-b" "<bc-…>" "running"
./log.sh combine "p8 launched c3 audit trail" "START 93dca59; branch dd/p8-season-ledger-c" "<bc-…>" "running"
./log.sh combine "p8 finished cN" "head <sha>, tests <n>, oracle 22/22, engine <r>, 8 screens" "<bc-…>" "finished"
./log.sh judging "p8 judge pass 1 launched" "A=c2 B=c3 C=c1" "<bc-…>" "running"
./log.sh judging "p8 judge pass 1 done" "base …; closeCall …" "<bc-…>" "ok"
./log.sh judging "p8 second read" "agree|disagree: <note>" "-" "agree|disagree"
./log.sh judging "p8 judge pass 2 launched" "A=c1 B=c3 C=c2" "<bc-…>" "running"
./log.sh grafting "p8 graft launched" "base cN dd/p8-season-ledger-x @<sha> -> dd/p8-season-ledger, draft PR into dd/p7-big-board" "<bc-…>" "running"
./log.sh physical "p8 physical launched" "PR #<n> @<sha>" "<bc-…>" "running"
./log.sh physical "p8 physical VERIFIED" "PR #<n> @<sha> certainty 5 fixLoops 0, still draft" "<bc-…>" "VERIFIED"
```

## Open risks (read before launch)
- **Chrome is not Safari.** No real-device proof claimed.
- **Pre-existing 1280 W8 board/pick-page problems** stay out of scope (must not grow).
- **Seeds stack up** in one DATA dir; `seed-ledger` checks the file bytes and the summary and says to `cleanup` + `launch` first.
- **Node 22 not on the box.** Box checks use node 20 for the oracle and bun for TS (engine cross-check, simulation).
- **Cloud VM Chrome / WebSocket** may yield an INCONCLUSIVE journey (environment); one relaunch.
- **The real answer is "re-run #1".** After Pick 8 lands, the scaffold's physical is the obvious next ledger action (a separate run; not part of this pick).

## STATUS
(updated as the pick runs)
- **Mon Oct 19 ~10:06 AM ET: LAUNCHED** c1 `bc-63869f17-d38a-510e-a5de-67e47cfd8d23` (`dd/p8-season-ledger-a`, ledger book), c2 `bc-b13be4e9-2215-5805-9f4c-ee9fc601c219` (`dd/p8-season-ledger-b`, merge desk), c3 `bc-afc119a7-ce34-5eb3-866b-3d4c431d27ee` (`dd/p8-season-ledger-c`, audit trail). All watched by the launching executor run. Preconditions passed (base `93dca59` unchanged, no p8 branches, PRs #1–#9 open drafts, make-copies ok, oracle 22/22, START exit 2, engine 11/11).
- **NEXT:** "On each candidate finish (revival)" for each of the three ids above. If this run is gone when they finish, any later run: `CloudAgent get` each id (or `watch` it), then follow §1 "On each candidate finish" → §2 judge pass 1.
