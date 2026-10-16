# Ready-to-run launch: Pick 2, Pick timeline (SPEC 003), 3-candidate arena

Mirrors `LAUNCH-002.md`. Written Sat Oct 17, 2026 for the **Sat Oct 17, 6:33 PM ET** run. Pick 2 is driven **by hand** like Pick 1: the `dd` CLI is not on the box (no clones, ever), so Grok Bot plays the driver, does the selection math with `tools/filmroom-calc.mjs SPEC-003-rubric.json …`, and checks timeline numbers against the box-side oracle `tools/timeline-calc.mjs`. Model: **omit on every launch** (Boyd has not named one). Budget: 3 candidates + 1-2 judge passes + 1 graft + 1 physical = 6-7 runs, plus at most 1 relaunch per candidate and 2 fix replies.

**Base: `dd/scaffold`, not Pick 1.** Pick 2 is a sibling of Pick 1, not stacked on it. Pick 1 is not grafted or verified yet, and the timeline only reports recorded event facts ("judge named c2"); it never re-derives the Film Room base, so nothing in it needs Pick 1's code. SPEC 003's binding touch map keeps the two picks file-disjoint except two named hunks (`src/server/http.ts` `pickView()` and `docs/DECISIONS.tsv`), so either PR can merge first.

Pick 1 may still be running (judge, graft or physical) at 6:33 PM. That is fine: the two arenas share no branches. Never pause, relaunch or reply to a Pick 1 agent from this file.

## 0. Preconditions (read-only checks, 6:33 PM)
1. cursor-github `get_branch` owner=BoydVC repo=draft-day branch=`dd/scaffold` → head `f51dae856e0018258732d09507de5e41429cc277`. If it moved: `compare_commits` base=`f51dae8…` head=`dd/scaffold`. If the change touches any file in SPEC 003's touch map (`src/server/http.ts`, `src/ui/app.js`, `src/ui/index.html`, `src/core/index.ts`, `src/cli/dd.ts`, the verify skill, `README.md`), **stop**: re-ground SPEC 003's anchors and the sha `f51dae8…` everywhere in it, rerun `./tools/make-copies.sh`, then launch. If it touches none of them, replace `f51dae8…` in the judge/graft prompts below with the new head and log it.
2. `get_pull_request` #1 → `draft: true`, base `main`, not merged. If Boyd merged it, use `main` as starting_ref and PR base everywhere below and log it.
3. `list_branches` → no `dd/p2-timeline*` branches yet (else a run already started; read LOG.tsv and resume instead of relaunching). Note whether `dd/p1-film-room` exists (the judge and grafter probe it; absent is fine).
4. `./tools/make-copies.sh` → must print `ok: SPEC-002-film-room …`, `ok: SPEC-003-pick-timeline …` and a final `ok`. It regenerates both specs' candidate and judge copies, leak-checks them against each rubric JSON, checks the spec's rubric/angle tables match `SPEC-003-rubric.json`, and checks the fixture's sha256 is the one in the spec. If you touched SPEC 002 since its launch, also run `sha256sum -c /tmp/spec002-copies.sha` (if that file still exists) to confirm Pick 1's copies did not change under its running judge.
5. `node tools/timeline-calc.mjs fixtures/p-20261010-07.events.jsonl` → first line `p-20261010-07  drafted  4h 43m  9 runs` and line 25 `runs 9: candidate 4 (1 relaunch), judge 2, graft 1, physical 1, fix 1` (the spec's sample numbers; the run/stage/link tables follow). Calculator sample blocks for both rubrics live in `tools/filmroom-calc-samples/` (`node gen.mjs` rebuilds them).
6. Cursor dashboard: on-demand still disabled; Cursor Models pool not near its cap (billing period resets Oct 20 UTC, so ~Mon Oct 19 8 PM ET). Pick 1's runs and these runs share that pool.

## 1. Combine: three candidate launches (send all three in one turn)
Common parameters for c1, c2, c3:
- action: `launch`
- repo: `https://github.com/BoydVC/draft-day`
- starting_ref: `dd/scaffold`
- files: `file:///workspace/tokenmax/poteto-pipeline/SPEC-003-pick-timeline.candidate.md` and `file:///workspace/tokenmax/poteto-pipeline/fixtures/p-20261010-07.events.jsonl` (the rubric-free, angle-free copy plus the sample pick; **never** attach `SPEC-003-pick-timeline.md`, `.judge.md` or `SPEC-003-rubric.json` to a candidate)
- model: omit

| Cand | title | branch (in prompt) | ANGLE line (in prompt) |
|---|---|---|---|
| c1 | `Draft Day P2 Timeline · c1 registry fold` | `dd/p2-timeline-a` | Event registry fold: build src/core/timeline.ts around one Record<EventType, rule> registry (title, links, whether the event opens or closes a run) checked with `satisfies`, so a new event type fails tsc; one left fold over seq-ordered events yields entries, runs and spans; render the API's lists with the least DOM that meets T15. |
| c2 | `Draft Day P2 Timeline · c2 spans first` | `dd/p2-timeline-b` | Spans first: model the pick as intervals; one interval builder produces stage spans and run spans as the primary data, entries are points attached to their span, and every duration comes from one span helper; in the War Room add a compact per-stage strip of run bars sized by percentages the core provides (plain CSS) above the event list. |
| c3 | `Draft Day P2 Timeline · c3 snapshot story` | `dd/p2-timeline-c` | Snapshot story: start from the 390 px screen and features/timeline.md; derive each entry by replaying reduce() after every event and describing what changed between consecutive Pick snapshots, so the log can never disagree with the reducer; be strongest on plain-English sentences, stage grouping and accessible names. |

Prompt (identical except `{{BRANCH}}` and `{{ANGLE}}` from the table):
```
Build SPEC 003 (uploads/SPEC-003-pick-timeline.candidate.md) in this repo. The sample pick it names is uploads/p-20261010-07.events.jsonl; commit it byte-identical as test/fixtures/timeline/p-20261010-07.events.jsonl.
Start from branch dd/scaffold (already checked out as your starting ref) and push your work to a new branch named {{BRANCH}}. Read docs/ARCHITECTURE.md, docs/SPEC-001.md and AGENTS.md in the repo first; SPEC 003 wins where they differ. Another pick (SPEC 002) is being built at the same time on dd/p1-film-room* branches; the spec's touch map is binding so the two stay mergeable. Do not edit a do-not-touch file.

Your angle (other agents are building the same spec from different angles; stay true to yours):
{{ANGLE}}

Rules:
- Draft PR only, and for this run open NO pull request at all: push your branch and stop. If your environment opens one automatically, it must be a DRAFT with base dd/scaffold, and you say so in your report.
- Never mark any PR ready for review, never merge, never enable auto-merge, never deploy or publish anything.
- Do not push to main, dd/scaffold or any dd/p1-* branch, and do not force-push.
- Touch only this repository (BoydVC/draft-day). Nothing related to KPD/kpdlawgroup or debt collection, in code, fixtures or examples.
- Zero runtime dependencies and no network code; test/guards.test.ts stays byte-identical. Links are plain strings; nothing in src/ requests them.
Run every VERIFY step in the spec, including executing the verify-draft-day skill and saving the War Room screenshots it names under /opt/cursor/artifacts/war-room/.
End your final message with exactly one dd-report block for {{BRANCH}} as described in the spec, then what works, what does not, the screenshot paths, the safety-fact proof output, the stack-probe output, and open questions.
```

After the launches: one LOG.tsv row per candidate (`./log.sh combine "launched p2 c1" "<why>" "<agent id>" "running"`).

### On each candidate finish (revival)
1. `CloudAgent dump` → `tail -n 1` the transcript; save the final message to `runs/p2/c<N>-final.md`.
2. Extract the `dd-report` block. Check with cursor-github `get_branch` that `{{BRANCH}}` exists and its head equals `headSha`. Missing/invalid report or no branch = **error**.
3. `list_pull_requests` head=`BoydVC:{{BRANCH}}`: if a PR exists and is not draft, flip it with `set_pull_request_draft` draft=true (the standing draft rule), and log a lesson.
4. Touch-map check (cheap, before judging): `compare_commits` base=`dd/scaffold` head=`{{BRANCH}}` → if `test/guards.test.ts` or `package.json` dependencies changed, note it for the judge's second read (it is a `stack`/`truth` penalty, not an error).
5. Error once → one relaunch with the same parameters and the prompt prefixed `This is the one allowed relaunch of a run that errored: <one-line reason>.` Error twice → drop it (a dropout is a gap, never a pass).
6. Log `finished p2 cN` with headSha and the test count.

When all three are settled:
- **≥2 finished** → Film Room (step 2).
- **exactly 1 finished** → walkover: skip steps 2-3; launch the physical (step 4) with starting_ref = that branch and add to its prompt: `Walkover: open a DRAFT PR from this branch into dd/scaffold first (body starts "Draft only. Do not merge, enable auto-merge, or mark ready for review."), then verify it.`
- **0 finished** → pick fails (reason `no_candidates`); re-frame SPEC 003 before any rerun. Tell Boyd.

## 2. Film Room judge, pass 1
Fixed label maps (also in `SPEC-003-rubric.json`; keep this file off every agent). They differ from Pick 1's maps and from the sample pick's maps on purpose:
- Pass 1: **A = c1 (a), B = c3 (c), C = c2 (b)**
- Pass 2 (order reversed): **A = c2 (b), B = c3 (c), C = c1 (a)**
With N=3 the middle label (B = c3) is the same in both passes; that is the cost of a pure reversal and is accepted. If a candidate dropped, remove its label and keep the others' relative order (A, B, …).

Parameters:
- action: `launch`
- repo: `https://github.com/BoydVC/draft-day`
- starting_ref: `dd/scaffold`
- title: `Draft Day P2 Timeline judge · pass 1`
- files: `file:///workspace/tokenmax/poteto-pipeline/SPEC-003-pick-timeline.judge.md` (has the rubric, no angles) and `file:///workspace/tokenmax/poteto-pipeline/fixtures/p-20261010-07.events.jsonl`
- model: omit

Prompt (fill `{{SHA_A}}` etc. from the candidates' verified head SHAs using the pass-1 map):
```
You are the Film Room judge for SPEC 003 (uploads/SPEC-003-pick-timeline.judge.md), pass 1. You score; you do not build the feature. The sample pick is uploads/p-20261010-07.events.jsonl (sha256 in the spec).

Candidates, anonymized. Refer to them ONLY by label, never by branch name, commit message or author:
- Label A: commit {{SHA_A}}
- Label B: commit {{SHA_B}}
- Label C: commit {{SHA_C}}
Fetch each by SHA (git fetch origin <sha>; if that fails, git fetch origin 'refs/heads/dd/p2-timeline-*' and check out by SHA only) and give each its own worktree (git worktree add /tmp/judge/A <sha>, and so on). Do not look up which branch a SHA belongs to.

Do this, in order:
1. Write ONE black-box test file, test/timeline.pooled.test.ts, from ACCEPTANCE lines T1-T14 and T18-T19 using only the public surface named in the spec's CONTEXT (src/core/index.ts, src/cli/dd.ts, src/server/http.ts). Embed your own copy of the sample pick inside the test (or under test/fixtures/timeline/ in the same commit) so it runs in any worktree. Derive expected values from the spec, not from any candidate's output, and add hostile values of your own for T11/T18. Commit it on a new branch dd/p2-timeline-judge started from dd/scaffold and push that branch. That is the only thing you may push.
2. For each label: hard gates (build = npx tsc --noEmit exit 0; tests = its own npm test exit 0; journey = its verify-draft-day skill launches, control.sh seed-timeline loads the sample, and the sample pick's Decision log shows the Runs table with a "c1 attempt 2" row and an "Agent c1 attempt 2" link, screenshot saved under /opt/cursor/artifacts/war-room/p2-judge-<label>.png).
3. Only after a label's gates are recorded (npm test globs test/*.test.ts, so a copied pooled file would leak into its own-tests gate), copy the same pooled test file into each worktree and run it (node --experimental-strip-types --test test/timeline.pooled.test.ts); record passed/total (total must be the same for every label).
4. Measure each diff: git diff --shortstat f51dae856e0018258732d09507de5e41429cc277...<sha> -- . ':(exclude)package-lock.json' → diff {files, added, removed}. Also run git diff --name-only f51dae856e0018258732d09507de5e41429cc277...<sha> against the touch map.
5. Stack probe for the `stack` criterion: if git ls-remote origin dd/p1-film-room finds a branch, git fetch origin dd/p1-film-room and for each label run git merge-tree --write-tree --name-only <sha> FETCH_HEAD (git older than 2.38: a scratch worktree with git merge --no-commit --no-ff, git diff --name-only --diff-filter=U, git merge --abort). Otherwise write "dd/p1-film-room not present" and grade `stack` on the touch map and diff size alone.
6. Score every rubric criterion 0-4 for every label, each with evidence (a command and its output, or file:line). Score criterion by criterion, not on overall feel. Do not reward length.
7. Recommend at most 2 trades per non-base label: {from: label, what, pointers: [file:line-range], why}.

Rules: open NO pull request (draft PR only if your environment forces one, base dd/scaffold). Never mark anything ready for review, never merge, never enable auto-merge, never deploy. Do not push to main, dd/scaffold, any dd/p1-* branch or any candidate branch, and do not force-push. Touch only this repository. Nothing related to KPD/kpdlawgroup or debt collection. Zero runtime dependencies, no network code in anything you commit.
End your final message with exactly one dd-judgement block (one pass, labels only, cards with gates, crossTests, diff and scores for every criterion, plus base, runnerUps, trades, swapConsistent: null), then a short rationale per label naming what you would keep and what you would reject, and the stack-probe output per label.
```

### On judge finish
1. Save the final message to `runs/p2/judge-pass1.md`.
2. `node tools/filmroom-calc.mjs SPEC-003-rubric.json runs/p2/judge-pass1.md --risks c1=<n>,c2=<n>,c3=<n>` (risk counts from each `dd-report`). Exit 2 = invalid block: reply to the judge once with the error; a second invalid block counts as a judge error. It prints ranks, `closeCall`, `needSecondPass`, `base`. (Checked Sat Oct 17 on sample blocks for both rubrics: close call, flip with tie rule, gate fail, cand-id rejection, wrong-rubric rejection.)
3. Grok Bot second read: open each candidate's diff via cursor-github `compare_commits` base=`dd/scaffold` head=<branch>, check the scorecard against it, and spot-check the base's sample numbers against `node tools/timeline-calc.mjs fixtures/p-20261010-07.events.jsonl --json`. Record agree/disagree plus a one-line note in LOG.tsv. A disagreement is shown, not applied; if it is serious, tell Boyd before the graft.
4. `needSecondPass: true` → step 2b. Otherwise → step 3 with the calculator's `base`.

## 2b. Film Room judge, pass 2 (only when pass 1 was a close call)
Same parameters as pass 1, except title `Draft Day P2 Timeline judge · pass 2 (reversed)` and the prompt changes:
- Labels from the **pass-2 map** (A = c2, B = c3, C = c1), listed in that order.
- Replace step 1 with: `Do not write new tests. Check out branch dd/p2-timeline-judge and use its test/timeline.pooled.test.ts (and any fixture it committed) unchanged as the pooled cross-test.` Nothing may be pushed in this pass.
- First line: `You are the Film Room judge for SPEC 003, pass 2. Score from scratch; do not look for or read any earlier judgement.`

Then: save `runs/p2/judge-pass2.md` and run `node tools/filmroom-calc.mjs SPEC-003-rubric.json runs/p2/judge-pass1.md runs/p2/judge-pass2.md --risks …`. It prints `swap` (`consistent` or `flipped`), `tieRule`, `unstable`, and the final `base`/`runnerUps`. Trades come from the **last** pass (labels resolved with that pass's map), at most 2 per runner-up, none from the base.

Write `runs/p2/film-room-result.md` for the grafter: base cand + branch + head SHA, runner-ups, each trade (cand, what, pointers, why), the calculator output, the swap state and tie rule, the judge's rationale per label (translated from labels to cand ids, now that judging is over), the stack-probe output, and Grok Bot's second read.

## 3. Trade (graft) → the one draft PR
- action: `launch`
- repo: `https://github.com/BoydVC/draft-day`
- starting_ref: `{{BASE_BRANCH}}` (for example `dd/p2-timeline-b`)
- title: `Draft Day P2 Timeline · trade + draft PR`
- files: `file:///workspace/tokenmax/poteto-pipeline/SPEC-003-pick-timeline.md`, `file:///workspace/tokenmax/poteto-pipeline/fixtures/p-20261010-07.events.jsonl`, `file:///workspace/tokenmax/poteto-pipeline/runs/p2/film-room-result.md`
- model: omit

Prompt:
```
You are the grafter for Draft Day Pick 2 (SPEC 003, uploads/SPEC-003-pick-timeline.md). Your starting branch {{BASE_BRANCH}} won the Film Room; uploads/film-room-result.md has the scorecard and the trade list. The sample pick is uploads/p-20261010-07.events.jsonl and must stay byte-identical at test/fixtures/timeline/p-20261010-07.events.jsonl.
1. Create branch dd/p2-timeline from {{BASE_BRANCH}}.
2. Port each listed trade by hand from its source branch into the base so the result keeps one mental model. Do not paste whole files, do not take more than the listed trades, do not change the base's architecture, and stay inside the spec's touch map.
3. Add test/timeline.pooled.test.ts (and any fixture it needs) from branch dd/p2-timeline-judge unchanged (fix it only if it contradicts the spec, and say why).
4. Commit uploads/SPEC-003-pick-timeline.md as docs/SPEC-003-pick-timeline.md. Add docs/DECISIONS.tsv rows for the base choice and each trade.
5. Run every VERIFY step in the spec, including the verify-draft-day skill, all six War Room screenshots, the safety-fact proof and the stack probe against dd/p1-film-room.
6. Open ONE pull request from dd/p2-timeline into dd/scaffold (base dd/scaffold, NOT main) as a DRAFT, titled "Draft Day Pick 2: Pick timeline (SPEC 003)". The body starts with "Draft only. Do not merge, enable auto-merge, or mark ready for review." and includes: a synthesis note (base and why, swap result, each trade with its source branch, what was rejected and why), the VERIFY output, the screenshots, and the stack note "Stacked on #1 (dd/scaffold). Sibling of Pick 1 (dd/p1-film-room), not stacked on it; expected shared hunks: src/server/http.ts pickView() and docs/DECISIONS.tsv; either PR can merge first." followed by the stack-probe output.
Rules: draft PR only; never mark it ready for review, never merge, never enable auto-merge, never deploy. Do not push to main, dd/scaffold, any dd/p1-* branch or any candidate branch, and do not force-push. Touch only this repository. Nothing related to KPD/kpdlawgroup or debt collection. Zero runtime dependencies, no network code.
End your final message with one dd-report block for dd/p2-timeline plus a line "PR: #<number>".
```
After it finishes: `get_pull_request` → confirm `draft: true` and `base.ref == "dd/scaffold"` (if not draft, `set_pull_request_draft` draft=true; never change anything else). Log PR number + head SHA.

## 4. Physical (verify the draft PR)
- action: `launch`; repo as above; starting_ref: `dd/p2-timeline`; title `Draft Day P2 Timeline · physical`; files: `file:///workspace/tokenmax/poteto-pipeline/SPEC-003-pick-timeline.md` and `file:///workspace/tokenmax/poteto-pipeline/fixtures/p-20261010-07.events.jsonl`; model: omit.

Prompt:
```
You are the verifier for draft PR #{{PR}} (branch dd/p2-timeline, head {{HEAD_SHA}}) in this repo, built from SPEC 003 (uploads/SPEC-003-pick-timeline.md). CI green is an input, not a verdict.
Run npm test, npx tsc --noEmit, selftest and doctor, and check sha256sum test/fixtures/timeline/p-20261010-07.events.jsonl against the spec. Run dd timeline on the sample (VERIFY 5) and compare every line with the spec's sample numbers. Then run the repo's .cursor/skills/verify-draft-day skill and drive every journey in features/timeline.md in your browser (sample pick at 1280x800, Runs table and agent links, 390x844 with document.documentElement.scrollWidth recorded, the happy selftest pick, live update within 2 s, hostile payloads), saving the six screenshots the spec names under /opt/cursor/artifacts/war-room/. Drive the Big Board's three-row proof before seed-timeline if you drive it at all. Prove the spec's safety fact by running code (certainty 4 or 5) and paste the output.
Do not change product code. If something fails, report it; do not fix it.
Rules: draft PR only; never mark it ready for review, never merge, never enable auto-merge, never deploy. Do not push to any branch. Touch only this repository. Nothing related to KPD/kpdlawgroup or debt collection. No network code, no new dependencies.
End your final message with exactly one dd-verdict block {prNumber, headSha, verdict, ledger, certainty, evidence, fixLoops} keyed to the head SHA you verified.
```
- **VERIFIED** at the PR's current head → confirm `draft: true` once more, log, and announce to Boyd in his chat only: PR link, base cand + angle, swap result, trades, screenshots, and whether it merges cleanly next to Pick 1.
- **NOT_VERIFIED / INCONCLUSIVE** → `reply` (mode queue) to the **graft** agent with the verdict's evidence: `Fix these on dd/p2-timeline, keep the PR a draft, stay inside the touch map, re-run VERIFY, end with a dd-report: …`; then rerun step 4. At most 2 fix loops; after that the pick fails, the PR stays a draft, and Grok Bot asks Boyd before touching the title.

## 5. Logging
Every launch, finish, judgement, calculator result, second read, trade list, PR number and verdict gets a `./log.sh <phase> <decision> <why> <evidence> <result>` row (phases: combine, judging, grafting, physical; prefix decisions with `p2` so they don't blur with Pick 1's rows written the same day).
