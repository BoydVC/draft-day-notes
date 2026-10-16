# Ready-to-run launch: Pick 1, Film Room scorecards (SPEC 002), 3-candidate arena

Mirrors `LAUNCH.md`. Written Fri Oct 16, 2026 for the **Sat Oct 17, 9:33 AM ET** run. Pick 1 is driven **by hand**: the `dd` CLI is not on the box (no clones, ever), so Grok Bot plays the driver and does the selection math with `tools/filmroom-calc.mjs` (the same rules SPEC 002 asks the code to implement). Model: **omit on every launch** (Boyd has not named one). Budget: 3 candidates + 1-2 judge passes + 1 graft + 1 physical = 6-7 runs, plus at most 1 relaunch per candidate and 2 fix replies.

## 0. Preconditions (read-only checks, 9:33 AM)
1. cursor-github `get_branch` owner=BoydVC repo=draft-day branch=`dd/scaffold` → head `f51dae856e0018258732d09507de5e41429cc277`. If it moved, still use `dd/scaffold` as `starting_ref`, note the new SHA in LOG.tsv, and replace `f51dae8…` in the judge/graft prompts below with the new head (the `git diff` base).
2. `get_pull_request` #1 → `draft: true`, base `main`, not merged. If Boyd merged it, use `main` as starting_ref and PR base everywhere below and log it.
3. `list_branches` → no `dd/p1-film-room*` branches yet (else a run already started; read LOG.tsv and resume instead of relaunching).
4. Run `./tools/make-copies.sh` → must print `ok:` (regenerates the candidate and judge copies and checks for rubric/angle leaks).
5. Cursor dashboard: on-demand still disabled; Cursor Models pool not near its cap (it resets ~Mon Oct 19 8 PM ET).

## 1. Combine: three candidate launches (send all three in one turn)
Common parameters for c1, c2, c3:
- action: `launch`
- repo: `https://github.com/BoydVC/draft-day`
- starting_ref: `dd/scaffold`
- files: `file:///workspace/tokenmax/poteto-pipeline/SPEC-002-film-room.candidate.md` (the rubric-free, angle-free copy; **never** attach `SPEC-002-film-room.md`, `.judge.md` or `SPEC-002-rubric.json` to a candidate)
- model: omit

| Cand | title | branch (in prompt) | ANGLE line (in prompt) |
|---|---|---|---|
| c1 | `Draft Day P1 Film Room · c1 minimal reducer` | `dd/p1-film-room-a` | Minimal pure reducer: extend src/core/score.ts in place with a few pure functions computed on demand from Pick; add no new module unless forced; render the API's filmRoom with the least DOM that meets F14; delete what you replace. |
| c2 | `Draft Day P1 Film Room · c2 rubric engine` | `dd/p1-film-room-b` | Table-driven rubric engine: put the Film Room in a new src/core/filmroom.ts where the selection order is an ordered registry of rankers ({id, label, compare}) and the tie rule is an ordered registry of keys; generate reason/deciding text from those registries; tests iterate the registries. |
| c3 | `Draft Day P1 Film Room · c3 War Room first` | `dd/p1-film-room-c` | War Room first: start from the phone-sized Scorecard Boyd reads; write .cursor/skills/verify-draft-day/features/film-room.md and the FilmRoom view model from the screen first, then fill the core function to produce it; be strongest on accessible names, the pass toggle, explanation sentences and a 390 px layout. |

Prompt (identical except `{{BRANCH}}` and `{{ANGLE}}` from the table):
```
Build SPEC 002 (uploads/SPEC-002-film-room.candidate.md) in this repo.
Start from branch dd/scaffold (already checked out as your starting ref) and push your work to a new branch named {{BRANCH}}. Read docs/ARCHITECTURE.md, docs/SPEC-001.md and AGENTS.md in the repo first; SPEC 002 wins where they differ.

Your angle (other agents are building the same spec from different angles; stay true to yours):
{{ANGLE}}

Rules:
- Draft PR only, and for this run open NO pull request at all: push your branch and stop. If your environment opens one automatically, it must be a DRAFT with base dd/scaffold, and you say so in your report.
- Never mark any PR ready for review, never merge, never enable auto-merge, never deploy or publish anything.
- Do not push to main or dd/scaffold, and do not force-push.
- Touch only this repository (BoydVC/draft-day). Nothing related to KPD/kpdlawgroup or debt collection, in code, fixtures or examples.
- Zero runtime dependencies and no network code; the A15 guard test stays as it is.
Run every VERIFY step in the spec, including executing the verify-draft-day skill and saving the War Room screenshots it names under /opt/cursor/artifacts/war-room/.
End your final message with exactly one dd-report block for {{BRANCH}} as described in the spec, then what works, what does not, the screenshot paths, the safety-fact proof output, and open questions.
```

After the launches: one LOG.tsv row per candidate (`./log.sh combine "launched c1" "<why>" "<agent id>" "running"`).

### On each candidate finish (revival)
1. `CloudAgent dump` → `tail -n 1` the transcript; save the final message to `runs/p1/c<N>-final.md`.
2. Extract the `dd-report` block. Check with cursor-github `get_branch` that `{{BRANCH}}` exists and its head equals `headSha`. Missing/invalid report or no branch = **error**.
3. `list_pull_requests` head=`BoydVC:{{BRANCH}}`: if a PR exists and is not draft, flip it with `set_pull_request_draft` draft=true (the standing draft rule), and log a lesson.
4. Error once → one relaunch with the same parameters and the prompt prefixed `This is the one allowed relaunch of a run that errored: <one-line reason>.` Error twice → drop it (a dropout is a gap, never a pass).
5. Log `finished cN` with headSha and the test count.

When all three are settled:
- **≥2 finished** → Film Room (step 2).
- **exactly 1 finished** → walkover: skip steps 2-3; launch the physical (step 4) with starting_ref = that branch and add to its prompt: `Walkover: open a DRAFT PR from this branch into dd/scaffold first, then verify it.`
- **0 finished** → pick fails (reason `no_candidates`); re-frame SPEC 002 before any rerun. Tell Boyd.

## 2. Film Room judge, pass 1
Fixed label maps (also in `SPEC-002-rubric.json`; keep this file off every agent):
- Pass 1: **A = c2 (b), B = c3 (c), C = c1 (a)**
- Pass 2 (order reversed): **A = c1 (a), B = c3 (c), C = c2 (b)**
If a candidate dropped, remove its label and keep the others' relative order (A, B, …).

Parameters:
- action: `launch`
- repo: `https://github.com/BoydVC/draft-day`
- starting_ref: `dd/scaffold`
- title: `Draft Day P1 Film Room judge · pass 1`
- files: `file:///workspace/tokenmax/poteto-pipeline/SPEC-002-film-room.judge.md` (has the rubric, no angles)
- model: omit

Prompt (fill `{{SHA_A}}` etc. from the candidates' verified head SHAs using the pass-1 map):
```
You are the Film Room judge for SPEC 002 (uploads/SPEC-002-film-room.judge.md), pass 1. You score; you do not build the feature.

Candidates, anonymized. Refer to them ONLY by label, never by branch name, commit message or author:
- Label A: commit {{SHA_A}}
- Label B: commit {{SHA_B}}
- Label C: commit {{SHA_C}}
Fetch each by SHA (git fetch origin <sha>; if that fails, git fetch origin 'refs/heads/dd/p1-film-room-*' and check out by SHA only) and give each its own worktree (git worktree add /tmp/judge/A <sha>, and so on). Do not look up which branch a SHA belongs to.

Do this, in order:
1. Write ONE black-box test file, test/film-room.pooled.test.ts, from the ACCEPTANCE lines F1-F18 using only the public surface named in the spec's CONTEXT (src/core/index.ts, src/cli/dd.ts, src/server/http.ts). Derive expected values from the spec, not from any candidate's output. Commit it on a new branch dd/p1-film-room-judge started from dd/scaffold and push that branch. That is the only thing you may push.
2. For each label: hard gates (build = npx tsc --noEmit exit 0; tests = its own npm test exit 0; journey = its verify-draft-day skill launches and the close pick's Scorecard shows BASE and a swap chip, screenshot saved under /opt/cursor/artifacts/war-room/judge-<label>.png).
3. Copy the same pooled test file into each worktree and run it; record passed/total (total must be the same for every label).
4. Measure each diff: git diff --shortstat f51dae856e0018258732d09507de5e41429cc277...<sha> -- . ':(exclude)package-lock.json' → diff {files, added, removed}.
5. Score every rubric criterion 0-4 for every label, each with evidence (a command and its output, or file:line). Score criterion by criterion, not on overall feel. Do not reward length.
6. Recommend at most 2 trades per non-base label: {from: label, what, pointers: [file:line-range], why}.

Rules: open NO pull request (draft PR only if your environment forces one, base dd/scaffold). Never mark anything ready for review, never merge, never enable auto-merge, never deploy. Do not push to main, dd/scaffold or any candidate branch, and do not force-push. Touch only this repository. Nothing related to KPD/kpdlawgroup or debt collection.
End your final message with exactly one dd-judgement block (one pass, labels only, cards with gates, crossTests, diff and scores for every criterion, plus base, runnerUps, trades, swapConsistent: null), then a short rationale per label naming what you would keep and what you would reject.
```

### On judge finish
1. Save the final message to `runs/p1/judge-pass1.md`.
2. `node tools/filmroom-calc.mjs SPEC-002-rubric.json runs/p1/judge-pass1.md --risks c1=<n>,c2=<n>,c3=<n>` (risk counts from each `dd-report`). It validates the block the way F2 says (exit 2 = invalid: reply to the judge once with the error; a second invalid block counts as a judge error) and prints ranks, `closeCall`, `needSecondPass`, `base`.
3. Grok Bot second read: open each candidate's diff via cursor-github `compare_commits` base=`dd/scaffold` head=<branch> and check the scorecard against it. Record agree/disagree plus a one-line note in LOG.tsv. A disagreement is shown, not applied (SPEC 002 F5/F15); if it is serious, tell Boyd before the graft.
4. `needSecondPass: true` → step 2b. Otherwise → step 3 with the calculator's `base`.

## 2b. Film Room judge, pass 2 (only when pass 1 was a close call)
Same parameters as pass 1, except title `Draft Day P1 Film Room judge · pass 2 (reversed)` and the prompt changes:
- Labels from the **pass-2 map** (A = c1, B = c3, C = c2), listed in that order.
- Replace step 1 with: `Do not write new tests. Check out branch dd/p1-film-room-judge and use its test/film-room.pooled.test.ts unchanged as the pooled cross-test.` Nothing may be pushed in this pass.
- First line: `You are the Film Room judge for SPEC 002, pass 2. Score from scratch; do not look for or read any earlier judgement.`

Then: save `runs/p1/judge-pass2.md` and run `node tools/filmroom-calc.mjs SPEC-002-rubric.json runs/p1/judge-pass1.md runs/p1/judge-pass2.md --risks …`. It prints `swap` (`consistent` or `flipped`), `tieRule`, `unstable`, and the final `base`/`runnerUps`. Trades come from the **last** pass (labels resolved with that pass's map), at most 2 per runner-up, none from the base.

Write `runs/p1/film-room-result.md` for the grafter: base cand + branch + head SHA, runner-ups, each trade (cand, what, pointers, why), the calculator output, the swap state and tie rule, the judge's rationale per label (translated from labels to cand ids, now that judging is over), and Grok Bot's second read.

## 3. Trade (graft) → the one draft PR
- action: `launch`
- repo: `https://github.com/BoydVC/draft-day`
- starting_ref: `{{BASE_BRANCH}}` (for example `dd/p1-film-room-b`)
- title: `Draft Day P1 Film Room · trade + draft PR`
- files: `file:///workspace/tokenmax/poteto-pipeline/SPEC-002-film-room.md`, `file:///workspace/tokenmax/poteto-pipeline/runs/p1/film-room-result.md`
- model: omit

Prompt:
```
You are the grafter for Draft Day Pick 1 (SPEC 002, uploads/SPEC-002-film-room.md). Your starting branch {{BASE_BRANCH}} won the Film Room; uploads/film-room-result.md has the scorecard and the trade list.
1. Create branch dd/p1-film-room from {{BASE_BRANCH}}.
2. Port each listed trade by hand from its source branch into the base so the result keeps one mental model. Do not paste whole files, do not take more than the listed trades, and do not change the base's architecture.
3. Add test/film-room.pooled.test.ts from branch dd/p1-film-room-judge unchanged (fix it only if it contradicts the spec, and say why).
4. Commit uploads/SPEC-002-film-room.md as docs/SPEC-002-film-room.md. Add docs/DECISIONS.tsv rows for the base choice and each trade.
5. Run every VERIFY step in the spec, including the verify-draft-day skill and all War Room screenshots.
6. Open ONE pull request from dd/p1-film-room into dd/scaffold (base dd/scaffold, NOT main) as a DRAFT, titled "Draft Day Pick 1: Film Room scorecards (SPEC 002)". The body starts with "Draft only. Do not merge, enable auto-merge, or mark ready for review." and includes: a synthesis note (base and why, swap result, each trade with its source branch, what was rejected and why), the VERIFY output, the screenshots, and the stack note "Stacked on #1 (dd/scaffold)".
Rules: draft PR only; never mark it ready for review, never merge, never enable auto-merge, never deploy. Do not push to main, dd/scaffold or any candidate branch, and do not force-push. Touch only this repository. Nothing related to KPD/kpdlawgroup or debt collection. Zero runtime dependencies, no network code.
End your final message with one dd-report block for dd/p1-film-room plus a line "PR: #<number>".
```
After it finishes: `get_pull_request` → confirm `draft: true` and `base.ref == "dd/scaffold"` (if not draft, `set_pull_request_draft` draft=true; never change anything else). Log PR number + head SHA.

## 4. Physical (verify the draft PR)
- action: `launch`; repo as above; starting_ref: `dd/p1-film-room`; title `Draft Day P1 Film Room · physical`; files: `file:///workspace/tokenmax/poteto-pipeline/SPEC-002-film-room.md`; model: omit.

Prompt:
```
You are the verifier for draft PR #{{PR}} (branch dd/p1-film-room, head {{HEAD_SHA}}) in this repo, built from SPEC 002 (uploads/SPEC-002-film-room.md). CI green is an input, not a verdict.
Run npm test, npx tsc --noEmit, selftest and doctor. Then run the repo's .cursor/skills/verify-draft-day skill and drive every film-room journey in features/film-room.md in your browser (flipped, pass toggle, phone width, single pass, live update, disagreement), saving screenshots under /opt/cursor/artifacts/war-room/. Prove the spec's safety fact by running code (certainty 4 or 5) and paste the output.
Do not change product code. If something fails, report it; do not fix it.
Rules: draft PR only; never mark it ready for review, never merge, never enable auto-merge, never deploy. Do not push to any branch. Touch only this repository. Nothing related to KPD/kpdlawgroup or debt collection.
End your final message with exactly one dd-verdict block {prNumber, headSha, verdict, ledger, certainty, evidence, fixLoops} keyed to the head SHA you verified.
```
- **VERIFIED** at the PR's current head → confirm `draft: true` once more, log, and announce to Boyd in his chat only: PR link, base cand + angle, swap result, trades, screenshots.
- **NOT_VERIFIED / INCONCLUSIVE** → `reply` (mode queue) to the **graft** agent with the verdict's evidence: `Fix these on dd/p1-film-room, keep the PR a draft, re-run VERIFY, end with a dd-report: …`; then rerun step 4. At most 2 fix loops; after that the pick fails, the PR stays a draft, and Grok Bot asks Boyd before touching the title.

## 5. Logging
Every launch, finish, judgement, calculator result, second read, trade list, PR number and verdict gets a `./log.sh <phase> <decision> <why> <evidence> <result>` row (phases: combine, judging, grafting, physical).
