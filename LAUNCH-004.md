# Ready-to-run launch: Pick 3, Lessons + gardener (SPEC 004), 3-candidate arena

Mirrors `LAUNCH-003.md`. Written Sat Oct 17, 2026 (afternoon), to launch as soon as the parent run says go (today). Like Picks 1 and 2, Pick 3 is driven **by hand**. The `dd` CLI is not on the box (no clones, ever), so Grok Bot plays the driver. It does the selection math with `tools/filmroom-calc.mjs SPEC-004-rubric.json …` and checks the lesson numbers against the box-side oracle `tools/lessons-calc.mjs`. Model: **omit on every launch** (Boyd has not named one). Budget: 3 candidates, 1-2 judge passes, 1 graft and 1 physical = 6-7 runs, plus at most 1 relaunch per candidate and 2 fix replies.

**Base: `dd/p2-timeline` at `60b1625518f61de576205c73318afd54c3384798` (draft PR #3), stacked, not a sibling.** The stack is now linear: #1 `dd/scaffold` → `main`, #2 `dd/p1-film-room` → `dd/scaffold`, #3 `dd/p2-timeline` → `dd/p1-film-room`, all drafts and all open (checked Sat Oct 17 afternoon). Pick 3 reads judge scorecards in the shape Pick 1 introduced (`JudgePass.pass`/`labels`, `validateJudgementContext`). Every edit point it shares is a list that Pick 2 created (the `files` array in `http.ts`, `index.html`, the `control.sh` `seed-*` cases, the `index.ts` export blocks). Stacked, those are appends. As a sibling, they would be guaranteed conflicts. SPEC 004's header gives the full reasoning. The Pick 3 PR's base is **`dd/p2-timeline`**.

Both earlier physicals came back **VERIFIED** with 0 fix loops (LOG.tsv, Sat Oct 17: Pick 1 PR #2 @ `ecec54c` at 1:44 PM ET, Pick 2 PR #3 @ `60b1625` at 1:49 PM ET), so the base should be stable. Pick 3 pushes only `dd/p3-lessons*` branches. Never pause, relaunch or reply to a Pick 1 or Pick 2 agent from this file. If Boyd or a late fix moves `dd/p2-timeline`, precondition 1 handles it.

## 0. Preconditions (read-only checks, at launch time)
1. cursor-github `get_branch` owner=BoydVC repo=draft-day branch=`dd/p2-timeline` → head `60b1625518f61de576205c73318afd54c3384798`. If it moved, run `compare_commits` with base `60b1625…` and head `dd/p2-timeline`.
   - If the change touches any file in SPEC 004's touch map, **stop**. The files are `src/core/index.ts`, `src/store/eventlog.ts`, `src/cli/dd.ts`, `src/server/http.ts`, `src/ui/index.html`, `src/ui/app.js`, `test/commands.test.ts`, the verify skill's `control.sh`, `features/README.md` and `SKILL.md`. Re-read those files remotely, re-ground SPEC 004's anchors, replace the sha `60b1625…` everywhere in it, rerun `./tools/make-copies.sh`, then launch.
   - If it touches none of them, replace `60b1625…` in the spec and in the judge/graft prompts below with the new head, rerun make-copies, and log it.
2. `get_pull_request` #3 → `draft: true`, base `dd/p1-film-room`, not merged. If Boyd merged #3 (or squashed the stack into `main`), use the branch it merged into as starting_ref and PR base everywhere below, re-ground anchors as in step 1, and log it.
3. `list_branches` → no `dd/p3-lessons*` branches yet. If one exists, a run already started: read LOG.tsv and resume instead of relaunching. (Sat Oct 17 afternoon: none. Branches were `main`, `dd/scaffold`, `dd/p1-film-room[-a|-b|-c]`, `dd/p2-timeline[-a|-b|-c]`.)
4. `./tools/make-copies.sh` → must print `ok: SPEC-002-film-room …`, `ok: SPEC-003-pick-timeline …`, `ok: SPEC-004-lessons …` and a final `ok`. It regenerates all three specs' candidate and judge copies and leak-checks them against each rubric JSON. It also checks that the spec's rubric and angle tables match `SPEC-004-rubric.json`, and that the spec carries the sha256 of `fixtures/lessons-week.jsonl` (`300d45a76d9f7d68834d764aa66c2f4fee2b2cb9dfdb7fdc02894da8f80ced5c`).
5. `node tools/lessons-calc.mjs fixtures/lessons-week.jsonl` → 36 lines. The first is `7 lessons from 5 picks · 27 findings · 6 one-offs`, the second `1. architecture  inconclusive:verifier-blocked  2 picks  2 findings`, and the last `- lesson:xss  p-20261015-01  1 finding`. Also `… --since 2026-10-12 --until 2026-10-14 | head -1` → `1 lesson from 2 picks · 9 findings · 4 one-offs`, and `… --copies 100 | head -1` → `13 lessons from 500 picks · 2700 findings · 0 one-offs`.
6. Cursor dashboard: on-demand still disabled, and the Cursor Models pool not near its cap. The billing period resets Oct 20 UTC, about Mon Oct 19 8 PM ET. Picks 1-3 share that pool.

## 1. Combine: three candidate launches (send all three in one turn)
Common parameters for c1, c2, c3:
- action: `launch`
- repo: `https://github.com/BoydVC/draft-day`
- starting_ref: `dd/p2-timeline`
- files: `file:///workspace/tokenmax/poteto-pipeline/SPEC-004-lessons.candidate.md` and `file:///workspace/tokenmax/poteto-pipeline/fixtures/lessons-week.jsonl`. These are the copy with no rubric and no angles, plus the sample week. **Never** attach `SPEC-004-lessons.md`, `.judge.md`, `SPEC-004-rubric.json` or this file to a candidate.
- model: omit

| Cand | title | branch (in prompt) | ANGLE line (in prompt) |
|---|---|---|---|
| c1 | `Draft Day P3 Lessons · c1 kind registry` | `dd/p3-lessons-a` | Kind registry: build src/core/lessons.ts around one Record<FindingKind, KindRule> registry checked with `satisfies`, so a new finding kind fails tsc until its row is complete; each row owns its event type, its payload-to-findings extractor, its level, stage status, `where` and `check` template; one pass over each seq-ordered log feeds a generic group-and-rank step; render the API's lists with the least DOM that meets L15. |
| c2 | `Draft Day P3 Lessons · c2 flat findings` | `dd/p3-lessons-b` | Flat findings first: two explicit stages; stage 1 projects every log into one flat, sorted Finding[] (also exported from core as an extra findings(logs, window) function), stage 2 only sees findings and groups them, applies the repeat rule, ranks and attaches proposals; tests pin each stage on its own; in the Locker Room show each group's findings as a compact receipts table (pick, seq, pass, cand, detail). |
| c3 | `Draft Day P3 Lessons · c3 weekly to-do` | `dd/p3-lessons-c` | Weekly to-do list: start from Boyd's Sunday-morning phone check and features/lessons.md; the Locker Room reads as an ordered list of things to fix, with a prominent first item (rank 1, its level chip, `where`, and its first receipt link at the top) and short lines for the rest; receipts sit behind native <details>; a Clear link next to Show drops the window (no date math in the browser); be strongest on plain sentences, accessible names and the 390 px layout, and keep the core as simple as the rules allow. |

Prompt (identical except `{{BRANCH}}` and `{{ANGLE}}` from the table):
```
Build SPEC 004 (uploads/SPEC-004-lessons.candidate.md) in this repo. The sample week it names is uploads/lessons-week.jsonl; commit it byte-identical as test/fixtures/lessons/lessons-week.jsonl.
Start from branch dd/p2-timeline (already checked out as your starting ref; it is the top of a draft stack: dd/scaffold, then dd/p1-film-room, then dd/p2-timeline) and push your work to a new branch named {{BRANCH}}. Read docs/ARCHITECTURE.md, docs/SPEC-001.md, docs/SPEC-002-film-room.md, docs/SPEC-003-pick-timeline.md and AGENTS.md in the repo first; SPEC 004 wins where they differ. The spec's touch map is binding: it names the one hunk you may change in each shared file so this pick stays a clean append on top of Picks 1 and 2. Do not edit a do-not-touch file.

Your angle (other agents are building the same spec from different angles; stay true to yours):
{{ANGLE}}

Rules:
- Draft PR only, and for this run open NO pull request at all: push your branch and stop. If your environment opens one automatically, it must be a DRAFT with base dd/p2-timeline, and you say so in your report.
- Never mark any PR ready for review, never merge, never enable auto-merge, never deploy or publish anything.
- Do not push to main, dd/scaffold, any dd/p1-* or dd/p2-* branch, and do not force-push.
- Touch only this repository (BoydVC/draft-day). Nothing related to KPD/kpdlawgroup or debt collection, in code, fixtures, proposals or examples.
- Zero runtime dependencies and no network code; test/guards.test.ts stays byte-identical. Links are plain strings; nothing in src/ requests them.
- The gardener only proposes. A proposal that names a file (src/report/parse.ts, src/briefs/scout.md, the verify skill) is text, not permission to edit that file.
Run every VERIFY step in the spec, including updating and executing the verify-draft-day skill and saving the War Room screenshots it names under /opt/cursor/artifacts/war-room/.
End your final message with exactly one dd-report block for {{BRANCH}} as described in the spec, then what works, what does not, the screenshot paths, the safety-fact proof output, the stack-probe output, and open questions.
```

After the launches: one LOG.tsv row per candidate (`./log.sh combine "launched p3 c1" "<why>" "<agent id>" "running"`).

### On each candidate finish (revival)
1. `CloudAgent dump` → `tail -n 1` the transcript; save the final message to `runs/p3/c<N>-final.md`.
2. Extract the `dd-report` block. Check with cursor-github `get_branch` that `{{BRANCH}}` exists and its head equals `headSha`. A missing or invalid report, or no branch, = **error**.
3. `list_pull_requests` head=`BoydVC:{{BRANCH}}`: if a PR exists and is not a draft, flip it with `set_pull_request_draft` draft=true (the standing draft rule), and log a lesson.
4. Touch-map check (cheap, before judging): `compare_commits` base=`dd/p2-timeline` head=`{{BRANCH}}`. If `test/guards.test.ts`, `package.json` dependencies, `src/report/parse.ts`, `src/briefs/*` or any other do-not-touch file changed, note it for the judge's second read. It is a `stack`/`truth` penalty, not an error.
5. Error once → one relaunch with the same parameters and the prompt prefixed `This is the one allowed relaunch of a run that errored: <one-line reason>.` Error twice → drop it (a dropout is a gap, never a pass).
6. Log `finished p3 cN` with headSha and the test count.

When all three are settled:
- **≥2 finished** → Film Room (step 2).
- **exactly 1 finished** → walkover: skip steps 2-3. Launch the physical (step 4) with starting_ref = that branch, and add to its prompt: `Walkover: open a DRAFT PR from this branch into dd/p2-timeline first (body starts "Draft only. Do not merge, enable auto-merge, or mark ready for review."), then verify it.`
- **0 finished** → the pick fails (reason `no_candidates`). Re-frame SPEC 004 before any rerun, and tell Boyd.

## 2. Film Room judge, pass 1
Fixed label maps (also in `SPEC-004-rubric.json`; keep this file off every agent). They differ from Pick 1's maps (p1 A=c2 B=c3 C=c1), Pick 2's (p1 A=c1 B=c3 C=c2) and the sample week's on purpose:
- Pass 1: **A = c3 (c), B = c1 (a), C = c2 (b)**
- Pass 2 (order reversed): **A = c2 (b), B = c1 (a), C = c3 (c)**

With N=3 the middle label (B = c1) is the same in both passes. That is the cost of a pure reversal and is accepted. If a candidate dropped, remove its label and keep the others' relative order (A, B, …).

Parameters:
- action: `launch`
- repo: `https://github.com/BoydVC/draft-day`
- starting_ref: `dd/p2-timeline`
- title: `Draft Day P3 Lessons judge · pass 1`
- files: `file:///workspace/tokenmax/poteto-pipeline/SPEC-004-lessons.judge.md` (has the rubric, no angles) and `file:///workspace/tokenmax/poteto-pipeline/fixtures/lessons-week.jsonl`
- model: omit

Prompt (fill `{{SHA_A}}` etc. from the candidates' verified head SHAs using the pass-1 map):
```
You are the Film Room judge for SPEC 004 (uploads/SPEC-004-lessons.judge.md), pass 1. You score; you do not build the feature. The sample week is uploads/lessons-week.jsonl (sha256 in the spec).

Candidates, anonymized. Refer to them ONLY by label, never by branch name, commit message or author:
- Label A: commit {{SHA_A}}
- Label B: commit {{SHA_B}}
- Label C: commit {{SHA_C}}
Fetch each by SHA (git fetch origin <sha>; if that fails, git fetch origin 'refs/heads/dd/p3-lessons-*' and check out by SHA only) and give each its own worktree (git worktree add /tmp/judge/A <sha>, and so on). Do not look up which branch a SHA belongs to.

Do this, in order:
1. Write ONE black-box test file, test/lessons.pooled.test.ts, from ACCEPTANCE lines L1-L14 and L18-L19 using only the public surface named in the spec's CONTEXT (src/core/index.ts, src/cli/dd.ts, src/server/http.ts, and src/ui/lessons.js read as text for the node:vm harness). Embed your own copy of the sample week inside the test (or under test/fixtures/lessons/ in the same commit) so it runs in any worktree. Derive expected values from the spec's literals, not from any candidate's output, and add hostile values of your own for L9/L14/L18. Commit it on a new branch dd/p3-lessons-judge started from dd/p2-timeline and push that branch. That is the only thing you may push.
2. For each label: hard gates (build = npx tsc --noEmit exit 0; tests = its own npm test exit 0; journey = its verify-draft-day skill launches, control.sh seed-lessons loads the week, and #/lessons?since=2026-10-11&until=2026-10-16 shows the Locker Room region with summary "7 lessons from 5 picks · 27 findings · 6 one-offs" and a first lesson headed "1. inconclusive:verifier-blocked", screenshot saved under /opt/cursor/artifacts/war-room/p3-judge-<label>.png).
3. Only after a label's gates are recorded (npm test globs test/*.test.ts, so a copied pooled file would leak into its own-tests gate), copy the same pooled test file into each worktree and run it (node --experimental-strip-types --test test/lessons.pooled.test.ts); record passed/total (total must be the same for every label).
4. Measure each diff: git diff --shortstat 60b1625518f61de576205c73318afd54c3384798...<sha> -- . ':(exclude)package-lock.json' → diff {files, added, removed}. Also run git diff --name-only 60b1625518f61de576205c73318afd54c3384798...<sha> against the touch map.
5. Stack probe for the `stack` criterion: for each label run git merge-base --is-ancestor 60b1625518f61de576205c73318afd54c3384798 <sha> && echo on-stack. Then git fetch origin dd/p2-timeline; if FETCH_HEAD is not 60b1625…, run git merge-tree --write-tree --name-only <sha> FETCH_HEAD per label (git older than 2.38: a scratch worktree with git merge --no-commit --no-ff, git diff --name-only --diff-filter=U, git merge --abort); otherwise write "dd/p2-timeline unchanged".
6. Score every rubric criterion 0-4 for every label, each with evidence (a command and its output, or file:line). Score criterion by criterion, not on overall feel. Do not reward length.
7. Recommend at most 2 trades per non-base label: {from: label, what, pointers: [file:line-range], why}.

Rules: open NO pull request (draft PR only if your environment forces one, base dd/p2-timeline). Never mark anything ready for review, never merge, never enable auto-merge, never deploy. Do not push to main, dd/scaffold, any dd/p1-* or dd/p2-* branch or any candidate branch, and do not force-push. Touch only this repository. Nothing related to KPD/kpdlawgroup or debt collection. Zero runtime dependencies, no network code in anything you commit.
End your final message with exactly one dd-judgement block (one pass, labels only, cards with gates, crossTests, diff and scores for every criterion, plus base, runnerUps, trades, swapConsistent: null), then a short rationale per label naming what you would keep and what you would reject, and the stack-probe output per label.
```

### On judge finish
1. Save the final message to `runs/p3/judge-pass1.md`.
2. Run `node tools/filmroom-calc.mjs SPEC-004-rubric.json runs/p3/judge-pass1.md --risks c1=<n>,c2=<n>,c3=<n>`, taking the risk counts from each `dd-report`.
   - Exit 2 means an invalid block. Reply to the judge once with the error. A second invalid block counts as a judge error.
   - It prints ranks, `closeCall`, `needSecondPass` and `base`. It was checked Sat Oct 17 on two scratch SPEC-004 passes: six criteria, weights 15.
3. Grok Bot second read:
   - Open each candidate's diff via cursor-github `compare_commits` base=`dd/p2-timeline` head=<branch> and check the scorecard against it.
   - Spot-check the base's numbers against `node tools/lessons-calc.mjs fixtures/lessons-week.jsonl --json`: the seven lessons, the six one-offs, the receipts, and the 36 text lines.
   - Record agree/disagree plus a one-line note in LOG.tsv. A disagreement is shown, not applied. If it is serious, tell Boyd before the graft.
4. `needSecondPass: true` → step 2b. Otherwise → step 3 with the calculator's `base`.

## 2b. Film Room judge, pass 2 (only when pass 1 was a close call)
Same parameters as pass 1, except the title is `Draft Day P3 Lessons judge · pass 2 (reversed)` and the prompt changes:
- Labels come from the **pass-2 map** (A = c2, B = c1, C = c3), listed in that order.
- Replace step 1 with: `Do not write new tests. Check out branch dd/p3-lessons-judge and use its test/lessons.pooled.test.ts (and any fixture it committed) unchanged as the pooled cross-test.` Nothing may be pushed in this pass.
- First line: `You are the Film Room judge for SPEC 004, pass 2. Score from scratch; do not look for or read any earlier judgement.`

Then save `runs/p3/judge-pass2.md` and run `node tools/filmroom-calc.mjs SPEC-004-rubric.json runs/p3/judge-pass1.md runs/p3/judge-pass2.md --risks …`. It prints `swap` (`consistent` or `flipped`), `tieRule`, `unstable`, and the final `base`/`runnerUps`. Trades come from the **last** pass (labels resolved with that pass's map): at most 2 per runner-up, none from the base.

Write `runs/p3/film-room-result.md` for the grafter. Include:
- the base cand, branch and head SHA;
- the runner-ups;
- each trade (cand, what, pointers, why);
- the calculator output, the swap state and the tie rule;
- the judge's rationale per label, translated from labels to cand ids now that judging is over;
- the stack-probe output;
- Grok Bot's second read.

## 3. Trade (graft) → the one draft PR
- action: `launch`
- repo: `https://github.com/BoydVC/draft-day`
- starting_ref: `{{BASE_BRANCH}}` (for example `dd/p3-lessons-b`)
- title: `Draft Day P3 Lessons · trade + draft PR`
- files: `file:///workspace/tokenmax/poteto-pipeline/SPEC-004-lessons.md`, `file:///workspace/tokenmax/poteto-pipeline/fixtures/lessons-week.jsonl`, `file:///workspace/tokenmax/poteto-pipeline/runs/p3/film-room-result.md`
- model: omit

Prompt:
```
You are the grafter for Draft Day Pick 3 (SPEC 004, uploads/SPEC-004-lessons.md). Your starting branch {{BASE_BRANCH}} won the Film Room; uploads/film-room-result.md has the scorecard and the trade list. The sample week is uploads/lessons-week.jsonl and must stay byte-identical at test/fixtures/lessons/lessons-week.jsonl.
1. Create branch dd/p3-lessons from {{BASE_BRANCH}}.
2. Port each listed trade by hand from its source branch into the base so the result keeps one mental model. Do not paste whole files, do not take more than the listed trades, do not change the base's architecture, and stay inside the spec's touch map.
3. Add test/lessons.pooled.test.ts (and any fixture it needs) from branch dd/p3-lessons-judge unchanged (fix it only if it contradicts the spec, and say why).
4. Commit uploads/SPEC-004-lessons.md as docs/SPEC-004-lessons.md. Add docs/DECISIONS.tsv rows for the base choice and each trade.
5. Run every VERIFY step in the spec, including the verify-draft-day skill, all six War Room screenshots plus lessons-board-link.png, the safety-fact proof and the stack probe against dd/p2-timeline.
6. Open ONE pull request from dd/p3-lessons into dd/p2-timeline (base dd/p2-timeline, NOT main) as a DRAFT, titled "Draft Day Pick 3: Lessons + gardener (SPEC 004)". The body starts with "Draft only. Do not merge, enable auto-merge, or mark ready for review." and includes: a synthesis note (base and why, swap result, each trade with its source branch, what was rejected and why), the VERIFY output, the screenshots, and the stack note "Stacked on #3 (dd/p2-timeline), which is stacked on #2 (dd/p1-film-room) and #1 (dd/scaffold). Merge after #3. Shared hunks with Pick 2: src/server/http.ts static files list, the verify skill's control.sh seed-* cases and usage line, docs/DECISIONS.tsv." followed by the stack-probe output.
Rules: draft PR only; never mark it ready for review, never merge, never enable auto-merge, never deploy. Do not push to main, dd/scaffold, any dd/p1-* or dd/p2-* branch or any candidate branch, and do not force-push. Touch only this repository. Nothing related to KPD/kpdlawgroup or debt collection. Zero runtime dependencies, no network code.
End your final message with one dd-report block for dd/p3-lessons plus a line "PR: #<number>".
```
After it finishes: `get_pull_request` → confirm `draft: true` and `base.ref == "dd/p2-timeline"`. If it is not a draft, `set_pull_request_draft` draft=true; never change anything else. Log the PR number and head SHA.

## 4. Physical (verify the draft PR)
- action: `launch`
- repo: as above
- starting_ref: `dd/p3-lessons`
- title: `Draft Day P3 Lessons · physical`
- files: `file:///workspace/tokenmax/poteto-pipeline/SPEC-004-lessons.md` and `file:///workspace/tokenmax/poteto-pipeline/fixtures/lessons-week.jsonl`
- model: omit

Prompt:
```
You are the verifier for draft PR #{{PR}} (branch dd/p3-lessons, head {{HEAD_SHA}}) in this repo, built from SPEC 004 (uploads/SPEC-004-lessons.md). CI green is an input, not a verdict.
Run npm test, npx tsc --noEmit, selftest and doctor, and check sha256sum test/fixtures/lessons/lessons-week.jsonl against the spec. Split the week into a scratch data dir and run dd lessons on it (VERIFY 5): compare all 36 lines with the spec, plus the windowed run and the exit-2 run. Then run the repo's .cursor/skills/verify-draft-day skill and drive every journey in features/lessons.md in your browser (the Locker Room link on the Big Board, the windowed week at 1280x800 with lesson 2's receipts and the first receipt link landing on #/picks/p-20261011-01, 390x844 with document.documentElement.scrollWidth recorded, the live one-off-to-lesson move within 2 s, hostile payloads), saving lessons-board-link.png and the six screenshots the spec names under /opt/cursor/artifacts/war-room/. Drive the Big Board's four-row proof before seed-lessons if you drive it at all. Prove the spec's safety fact by running code in a scratch data dir (certainty 4 or 5) and paste the output.
Do not change product code. If something fails, report it; do not fix it.
Rules: draft PR only; never mark it ready for review, never merge, never enable auto-merge, never deploy. Do not push to any branch. Touch only this repository. Nothing related to KPD/kpdlawgroup or debt collection. No network code, no new dependencies.
End your final message with exactly one dd-verdict block {prNumber, headSha, verdict, ledger, certainty, evidence, fixLoops} keyed to the head SHA you verified.
```
- **VERIFIED** at the PR's current head → confirm `draft: true` once more and log it. Announce it to Boyd in his chat only, with: the PR link, the base cand and its angle, the swap result, the trades, the screenshots, the stack order (#1 ← #2 ← #3 ← this), and the gardener's top proposal on the sample week. The proposal is shown as a suggestion and is never applied.
- **NOT_VERIFIED / INCONCLUSIVE** → `reply` (mode queue) to the **graft** agent with the verdict's evidence: `Fix these on dd/p3-lessons, keep the PR a draft, stay inside the touch map, re-run VERIFY, end with a dd-report: …`. Then rerun step 4. At most 2 fix loops. After that the pick fails, the PR stays a draft, and Grok Bot asks Boyd before touching the title.

## 5. Logging
Every launch, finish, judgement, calculator result, second read, trade list, PR number and verdict gets a `./log.sh <phase> <decision> <why> <evidence> <result>` row. The phases are combine, judging, grafting and physical. Prefix decisions with `p3` so they don't blur with Pick 1 and Pick 2 rows written the same day.

## Open risks (read before launch)
- **Stack drift (low now that both physicals are VERIFIED).** If anything commits to `dd/p1-film-room` or `dd/p2-timeline` after launch, the Pick 3 branches start behind. VERIFY 8 and the judge's stack probe measure this. Conflicts from a Pick 2 fix commit are noted, not penalized. The grafter merges the moved head in only if Grok Bot asks it to in a reply. It never rebases or force-pushes.
- **Merge order is fixed.** #3 must land before this PR. If Boyd rejects #2 or #3, Pick 3 needs a rebase onto whatever replaces them.
- **The Big Board still trusts `pick_created.payload.id`** (`loadPicks`). Pick 3 skips mismatched logs in the Locker Room only. A later pick (or the gardener's own first real lesson) should carry the K1 check into `loadPicks`.
- **The selftest data shows up in the unwindowed Locker Room.** Journeys use the date window for exact numbers. A physical that drives the unwindowed view and expects the fixture's summary would raise a false NOT_VERIFIED. The prompt names the windowed URL to avoid this.
- **No dd/p1 or p2 judge branches remain on the remote** (`dd/p1-film-room-judge` and `dd/p2-timeline-judge` are absent from `list_branches` as of Sat Oct 17 afternoon). This does not matter for Pick 3, whose judge creates `dd/p3-lessons-judge` fresh, but the grafter's step 3 needs that branch to exist when it runs.
