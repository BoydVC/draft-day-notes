# Ready-to-run launch: Pick 5, Replay mode (SPEC 006), 3-candidate arena

Mirrors `LAUNCH-005.md`. Written Sat Oct 17, 2026, about 7:05 PM ET. It can launch as soon as the parent run says go. Like Picks 1-4, Pick 5 is driven **by hand**. The `dd` CLI is not on the box (no clones, ever), so Grok Bot plays the driver:
- It does the selection math with `tools/filmroom-calc.mjs SPEC-006-rubric.json …`.
- It checks the replay numbers with one box-side oracle, `tools/replay-check.mjs` (run with **bun**: `bun tools/replay-check.mjs <root>`). The oracle covers R1-R18 through `fixtures/replay/replay-harness.mjs` and starts the root's own `http.ts` for R18.

It reads branch files with `gh api repos/BoydVC/draft-day/contents/<path>?ref=<sha> -H 'Accept: application/vnd.github.raw'` (read only) and never clones. Model: **omit on every launch** (Boyd has not named one). Budget: 3 candidates, 1-2 judge passes, 1 graft and 1 physical = 6-7 runs, plus at most 1 relaunch per candidate and 2 fix replies. **Nothing in this file has been launched.**

**READY PATH (Sat Oct 17, 7:00 PM ET): `START_REF = dd/p4-phone`, `START = c6cfad415576c2c14653955aff972a6d8c613ab1` (draft PR #6, physical VERIFIED). Oracle at START 6/55 (`runs/p5/oracle-start.txt`); box ref 192/192 (`runs/p5/oracle-ref.txt`). The prompts below have START filled in.** Re-run step 0 only to confirm `dd/p4-phone` is still at `c6cfad4`. If it moved, redo steps 0.4-0.5 and the spec numbers before launch. There is one mode only (no Mode S/F split): Pick 5 always sits on Pick 4.

**PR base for the graft: `dd/p4-phone`** (the Pick 4 PR branch). Pick 5 pushes only `dd/p5-replay*` branches. Never pause, relaunch or reply to a Pick 1-4 agent from this file.

**The three Pick 4 lessons are built in:**
- **W19.** The touch map pre-declares the grafter-only paths: `docs/SPEC-006-replay.md`, `test/replay.pooled.test.ts` and replacement `docs/screens/p5-replay/*.png`.
- **W8 at 1280.** R19 requires ≥44×44 Replay controls and links at every width, 1280 included.
- **Screenshots.** Ten PNGs are committed under `docs/screens/p5-replay/` and listed in the `dd-report` and the PR body. Artifact links are not relied on.

## 0. Preconditions (read-only checks, at launch time)
1. **The base is still where the spec says.** cursor-github `get_branch` owner=BoydVC, repo=draft-day, branch=`dd/p4-phone` → head `c6cfad415576c2c14653955aff972a6d8c613ab1` (verified Sat Oct 17, 7:00 PM ET). Then `list_pull_requests` head=`BoydVC:dd/p4-phone` → one open PR (#6) with `draft: true` and base `dd/p3-lessons`. LOG.tsv shows its physical VERIFIED (Sat 5:53 PM ET).
   - **If the head moved:** run `compare_commits` base=`c6cfad4…` head=`dd/p4-phone`. If the change touches anything below, **stop**: re-read those files remotely into `runs/p5/start/`, rerun step 5, re-derive the spec's baselines, then rerun `./tools/make-copies.sh`. The files are `src/ui/*`, `src/server/http.ts`, `src/core/timeline*`, `test/phone*.test.ts`, `test/guards.test.ts`, the verify skill (`SKILL.md`, `features/README.md`, `helpers/control.sh`) and `test/fixtures/phone/*`. Otherwise, put the new head in the prompts as `START` and log it.
   - **If a Pick 4 fix loop is open** (a NOT_VERIFIED with a reply queued), wait for it to settle; it would move `START` under the candidates.
2. **No run in progress:** `list_branches` returns no `dd/p5-replay*` branch. If one exists, a run already started: read LOG.tsv and resume instead of relaunching. (Sat Oct 17, 7:00 PM ET: none. Branches were `main`, `dd/scaffold`, `dd/p1-film-room[-a|-b|-c]`, `dd/p2-timeline[-a|-b|-c]`, `dd/p3-lessons[-a|-b|-c|-judge]`, `dd/p4-phone[-a|-b|-c|-judge]`.)
3. **The stack below is intact:** `get_pull_request` #6 → `draft: true`, base `dd/p3-lessons`, not merged; #5 → draft, base `dd/p2-timeline`. If Boyd merged anything in the stack, use the branch it merged into, re-ground as in step 1, and log it.
4. **Copies are clean:** `./tools/make-copies.sh` must print `ok:` for SPEC-002 through SPEC-005 and for `SPEC-006-replay` (candidate 238 lines, judge 253, full 263), then a final `ok`. It leak-checks the SPEC-006 candidate and judge copies against `SPEC-006-rubric.json`, checks that the rubric and angle tables match the JSON, and checks that the spec carries the sha256 of all twelve `fixtures/replay/*` files.
5. **The oracle agrees with the spec's baselines** (exact output in `runs/p5/*.txt`):
   - `bun tools/replay-check.mjs runs/p5/start` → last line `TOTAL 6/55`.
   - `bun tools/replay-check.mjs runs/p5/ref` → `TOTAL 192/192`.
   - `runs/p5/start` is the remote-read mirror of `c6cfad4` (no clone). If step 1 found a move, refresh it file by file with `gh api …/contents/<path>?ref=<new head> -H 'Accept: application/vnd.github.raw'`.
6. **Usage:** on the Cursor dashboard, on-demand is still disabled and the Cursor Models pool is not near its cap. The billing period resets Oct 20 UTC, about **Mon Oct 19, 8 PM ET**, and Picks 1-5 share that pool. Launch Pick 5 well before then: the whole arena took about 3h 40m for Pick 4.

## 1. Combine: three candidate launches (send all three in one turn)
Common parameters for c1, c2 and c3:
- action: `launch`
- repo: `https://github.com/BoydVC/draft-day`
- starting_ref: `dd/p4-phone`
- files (13, in this order):
  - `file:///workspace/tokenmax/poteto-pipeline/SPEC-006-replay.candidate.md`
  - `file:///workspace/tokenmax/poteto-pipeline/fixtures/replay/p-20261017-94.events.jsonl`
  - `file:///workspace/tokenmax/poteto-pipeline/fixtures/replay/p-20261017-93.events.jsonl`
  - `file:///workspace/tokenmax/poteto-pipeline/fixtures/replay/p-20261017-98.events.jsonl`
  - `file:///workspace/tokenmax/poteto-pipeline/fixtures/replay/p-20261017-99.events.jsonl`
  - `file:///workspace/tokenmax/poteto-pipeline/fixtures/replay/p-20261017-94.pick.json`
  - `file:///workspace/tokenmax/poteto-pipeline/fixtures/replay/p-20261017-93.pick.json`
  - `file:///workspace/tokenmax/poteto-pipeline/fixtures/replay/p-20261017-98.pick.json`
  - `file:///workspace/tokenmax/poteto-pipeline/fixtures/replay/p-20261017-99.pick.json`
  - `file:///workspace/tokenmax/poteto-pipeline/fixtures/replay/p-20261010-07.pick.json`
  - `file:///workspace/tokenmax/poteto-pipeline/fixtures/replay/replay-harness.mjs`
  - `file:///workspace/tokenmax/poteto-pipeline/fixtures/replay/replay-harness.d.mts`
  - `file:///workspace/tokenmax/poteto-pipeline/fixtures/replay/README.md`
  - These are the copy with no rubric and no angles, plus the twelve fixtures (about 0.2 MB in total). **Never** attach any of these to a candidate: `SPEC-006-replay.md`, `.judge.md`, `SPEC-006-rubric.json`, `SPEC-006-review.md`, `tools/replay-check.mjs` (the oracle), `runs/p5/ref*` or this file.
- model: omit

| Cand | title | branch (in prompt) | ANGLE line (in prompt) |
|---|---|---|---|
| c1 | `Draft Day P5 Replay · c1 frame engine` | `dd/p5-replay-a` | Frame engine: start from the frame rule; write one pure function that maps (timeline, index) to a frame, row by row from the spec's frame table, one module-level playback record (pick id, index, playing, timer), and one paint function that updates persistent nodes in place; smallest app.js hunks; plain CSS that meets the size rules; tests drive every frame of every fixture through compareFrame. |
| c2 | `Draft Day P5 Replay · c2 broadcast booth` | `dd/p5-replay-b` | Broadcast booth: start from the demo video; the film reads like a sports broadcast: a big scoreboard (clock, status chip, stage, counter), the caption as a lower third, and at 1280 px the runs as a field of lanes beside the film; on a phone the controls sit in one thumb-reach bar (safe-area aware) under the film; transitions only inside @media (prefers-reduced-motion: no-preference); tokens only, both schemes; paused on any 390 px dark screenshot, a stranger can say how long the pick has run, what just happened and who is still on the field. |
| c3 | `Draft Day P5 Replay · c3 chapter cuts` | `dd/p5-replay-c` | Chapter cuts: start from the story; cut the film into chapters by stage: a Chapters nav outside the Replay controls group with one link or button per stage reached so far (each at least 44x44, never a .chip), jumping to that stage's first event, the current chapter marked; the fix loop in Pick 3 and the NOT_VERIFIED in Pick 4 are easy to find; accessible names and aria-valuetext read well in VoiceOver order (film, controls, chapters, lists); extra controls never break the playback rules or the probe. |

Prompt (identical except `{{BRANCH}}` and `{{ANGLE}}`; START is already filled in):
```
Build SPEC 006 (uploads/SPEC-006-replay.candidate.md) in this repo. The twelve fixtures it names are in uploads/ (p-20261017-94.events.jsonl, p-20261017-93.events.jsonl, p-20261017-98.events.jsonl, p-20261017-99.events.jsonl, the five *.pick.json files, replay-harness.mjs, replay-harness.d.mts and README.md); commit each byte-identical under test/fixtures/replay/ and do not edit them. Pick 4's test/fixtures/phone/* (dom-harness.mjs, probe.js, cdp-shot.mjs) are already in the repo; use them unchanged.
Your starting ref is dd/p4-phone at commit c6cfad415576c2c14653955aff972a6d8c613ab1 (already checked out). Wherever the spec says START or START_REF, use exactly these. It is the top of a draft stack (dd/scaffold, dd/p1-film-room, dd/p2-timeline, dd/p3-lessons, dd/p4-phone); push your work to a new branch named {{BRANCH}}. Read docs/ARCHITECTURE.md, docs/SPEC-001.md, docs/SPEC-002-film-room.md, docs/SPEC-003-pick-timeline.md, docs/SPEC-004-lessons.md, docs/SPEC-005-phone-war-room.md and AGENTS.md first; SPEC 006 wins where they differ. The spec's touch map is binding: it names the one hunk you may change in each shared file so this pick stays a clean layer on top of Picks 1-4. Do not edit a do-not-touch file, and do not create the grafter-only paths (docs/SPEC-006-replay.md, test/replay.pooled.test.ts).

Your angle (other agents are building the same spec from different angles; stay true to yours):
{{ANGLE}}

Rules:
- Draft PR only, and for this run open NO pull request at all: push your branch and stop. If your environment opens one automatically, it must be a DRAFT with base dd/p4-phone, and you say so in your report.
- Never mark any PR ready for review, never merge, never enable auto-merge, never deploy or publish anything.
- Do not push to main, dd/scaffold, any dd/p1-*, dd/p2-*, dd/p3-* or dd/p4-* branch, and do not force-push.
- Touch only this repository (BoydVC/draft-day). Nothing related to KPD/kpdlawgroup or debt collection, in code, fixtures, tests or examples. (The uploaded real logs quote the repo's own guard sentence that says so; leave the fixtures byte-identical and add no such text anywhere else.)
- Zero runtime dependencies and no network code; test/guards.test.ts stays byte-identical; src/server/http.ts changes only on the static files line; no web fonts, other-origin assets, localStorage, sessionStorage, cookies or history writes; replay.js never formats a duration.
Run every VERIFY step in the spec, including updating and executing the verify-draft-day skill (seed-replay, the 18 replay probes, the pick-page probes, the fix-loop, play and live shots; run the live shot last). Save the screenshots under /opt/cursor/artifacts/war-room/ AND commit the ten the spec names under docs/screens/p5-replay/ (cdp-shot.mjs needs Chrome; on Node 20 run it with --experimental-websocket).
End your final message with exactly one dd-report block for {{BRANCH}} as described in the spec (the ten committed screenshot repo paths in "screenshots"), then START, what works, what does not, the screenshot paths, the probe JSON lines, the safety-fact proof output, the stack-probe output, and open questions.
```

After the launches, write one LOG.tsv row per candidate: `./log.sh combine "p5 launched c1 frame engine" "START c6cfad4" "<agent id>" "running"`.

### On each candidate finish (revival)
1. `CloudAgent dump` → `tail -n 1` the transcript; save the final message to `runs/p5/c<N>-final.md`.
2. Extract the `dd-report` block. cursor-github `get_branch` → `{{BRANCH}}` exists and its head equals `headSha`. A missing or invalid report, or no branch, = **error**.
3. `list_pull_requests` head=`BoydVC:{{BRANCH}}`: if a PR exists and is not a draft, flip it with `set_pull_request_draft` draft=true (the standing draft rule) and log a lesson.
4. Touch-map check (cheap, before judging): `compare_commits` base=`c6cfad415576c2c14653955aff972a6d8c613ab1` head=`{{BRANCH}}`.
   - If any of these changed, note it for the judge's second read: `test/guards.test.ts`, `package.json`, any `src/core|cli|store|report|briefs` file, `src/ui/{styles,timeline,lessons}.css`, `src/ui/{timeline,lessons}.js`, `test/fixtures/{phone,timeline,lessons}/*`, an existing test other than the two-line `test/phone.test.ts` W5 hunk, more than the one `files` line of `src/server/http.ts`, or a grafter-only path. It is a `stack` penalty, not an error.
   - Box spot-check (no clone; `gh api` read only):
     ```
     H=<headSha>; N=<1|2|3>; D=runs/p5/c$N; rm -rf $D && cp -r runs/p5/start $D
     for f in src/ui/app.js src/ui/index.html src/ui/replay.js src/ui/replay.css src/server/http.ts; do gh api "repos/BoydVC/draft-day/contents/$f?ref=$H" -H 'Accept: application/vnd.github.raw' > $D/$f; done
     mkdir -p $D/test/fixtures/replay $D/screens
     for f in $(gh api "repos/BoydVC/draft-day/contents/test/fixtures/replay?ref=$H" --jq '.[].name'); do gh api "repos/BoydVC/draft-day/contents/test/fixtures/replay/$f?ref=$H" -H 'Accept: application/vnd.github.raw' > $D/test/fixtures/replay/$f; done
     for f in $(gh api "repos/BoydVC/draft-day/contents/docs/screens/p5-replay?ref=$H" --jq '.[].name'); do gh api "repos/BoydVC/draft-day/contents/docs/screens/p5-replay/$f?ref=$H" -H 'Accept: application/vnd.github.raw' > $D/screens/$f; done
     bun tools/replay-check.mjs $D | tail -1; (cd $D/test/fixtures/replay && sha256sum *); ls $D/screens | wc -l
     ```
     Expect `TOTAL 192/192` (any lower number names the failing R lines), twelve sha256 values equal to the spec's, and 10 screenshots. Also pull any other `src/ui/*` file the compare lists. Look at `screens/replay-94-at11-390-dark.png` and `replay-94-at11-1280-light.png` with Read. The results inform the second read; they do not replace the judge.
5. Error once → one relaunch with the same parameters and the prompt prefixed `This is the one allowed relaunch of a run that errored: <one-line reason>.` Error twice → drop it (a dropout is a gap, never a pass).
6. Log `p5 finished cN` with the headSha, test count, oracle total and screenshot count.

When all three are settled:
- **≥2 finished** → Film Room (step 2).
- **Exactly 1 finished** → walkover: skip steps 2-3. Launch the physical (step 4) with starting_ref = that branch, and add to its prompt: `Walkover: open a DRAFT PR from this branch into dd/p4-phone first (body starts "Draft only. Do not merge, enable auto-merge, or mark ready for review."), then verify it.`
- **0 finished** → the pick fails (reason `no_candidates`). Re-frame SPEC 006 before any rerun, and tell Boyd.

## 2. Film Room judge, pass 1
These are the fixed label maps (also in `SPEC-006-rubric.json`; keep this file off every agent). They differ on purpose from every earlier pass-1 map: Pick 1 (A=c2 B=c3 C=c1), Pick 2 (A=c1 B=c3 C=c2), Pick 3 (A=c3 B=c1 C=c2) and Pick 4 (A=c3 B=c2 C=c1).
- Pass 1: **A = c2 (b), B = c1 (a), C = c3 (c)**
- Pass 2 (order reversed): **A = c3 (c), B = c1 (a), C = c2 (b)**

With N=3 the middle label (B = c1) stays the same in both passes. That is the cost of a pure reversal, and it is accepted. If a candidate dropped, remove its label and keep the others' relative order (A, B, …). Checked Sat Oct 17 on two scratch passes (`/tmp/p5/s1.md`, `s2.md`): six criteria, weights 15, labels resolved B→c1, A→c2, C→c3 in pass 1 and A→c3, C→c2 in pass 2, swap consistent.

Parameters:
- action: `launch`
- repo: `https://github.com/BoydVC/draft-day`
- starting_ref: `dd/p4-phone`
- title: `Draft Day P5 Replay judge · pass 1`
- files: `file:///workspace/tokenmax/poteto-pipeline/SPEC-006-replay.judge.md` (has the rubric, no angles), plus the twelve `fixtures/replay/*` files exactly as in step 1
- model: omit

Prompt (fill `{{SHA_A}}` etc. from the candidates' verified head SHAs using the pass-1 map):
```
You are the Film Room judge for SPEC 006 (uploads/SPEC-006-replay.judge.md), pass 1. You score; you do not build the feature. The twelve fixtures are in uploads/ (sha256 in the spec). START_REF is dd/p4-phone and START is c6cfad415576c2c14653955aff972a6d8c613ab1.

Candidates, anonymized. Refer to them ONLY by label, never by branch name, commit message or author:
- Label A: commit {{SHA_A}}
- Label B: commit {{SHA_B}}
- Label C: commit {{SHA_C}}
Fetch each by SHA (git fetch origin <sha>; if that fails, git fetch origin 'refs/heads/dd/p5-replay-*' and check out by SHA only) and give each its own worktree (git worktree add /tmp/judge/A <sha>, and so on). Do not look up which branch a SHA belongs to.

Do this, in order:
1. Write ONE black-box test file, test/replay.pooled.test.ts, from ACCEPTANCE lines R1-R18, using only the uploaded fixtures (committed under test/fixtures/replay/ in the same commit, byte-identical), test/fixtures/replay/replay-harness.mjs, the files under src/ui/ read as text or loaded through the harness, and src/server/http.ts and src/core/index.ts as entry points. Derive expected values from the spec's literals and frameAt(), not from any candidate's output, and add hostile values of your own for R13 and R14. Commit it on a new branch dd/p5-replay-judge started from dd/p4-phone and push that branch. That is the only thing you may push.
2. For each label, record the hard gates: build = npx tsc --noEmit exit 0; tests = its own npm test exit 0; journey = its verify-draft-day skill launches, control.sh seed-replay prints "seeded replay", and node test/fixtures/phone/cdp-shot.mjs on #/picks/p-20261017-94/replay?at=11 at 390x844 in dark prints "ok":true with scrollWidth <= 390 and chips holding exactly one chip whose status is judging, screenshot saved under /opt/cursor/artifacts/war-room/p5-judge-<label>.png.
3. Only after a label's gates are recorded (npm test globs test/*.test.ts, so a copied pooled file would leak into its own-tests gate), copy the same pooled test file into each worktree and run it (node --experimental-strip-types --test test/replay.pooled.test.ts). Record passed/total; the total must be the same for every label.
4. For the screen criterion, run cdp-shot.mjs per label on #/picks/p-20261017-94/replay?at=1, ?at=11 and ?at=20 at 390x844, 430x932 and 1280x800 in light and dark (18 runs), plus the pick page at 390x844 dark. Paste each JSON line's ok, scrollWidth, chips (status only), problems and offOrigin, and look at the ?at=11 390 dark and 1280 light screenshots yourself.
5. Measure each diff: git diff --shortstat c6cfad415576c2c14653955aff972a6d8c613ab1...<sha> -- . ':(exclude)package-lock.json' gives diff {files, added, removed}; PNG files count as files, not lines. Also check git diff --name-only c6cfad415576c2c14653955aff972a6d8c613ab1...<sha> against the touch map.
6. Stack probe for the stack criterion: for each label run git merge-base --is-ancestor c6cfad415576c2c14653955aff972a6d8c613ab1 <sha> && echo on-stack. Then git fetch origin dd/p4-phone. If FETCH_HEAD is not c6cfad415576c2c14653955aff972a6d8c613ab1, run git merge-tree --write-tree --name-only <sha> FETCH_HEAD per label (git older than 2.38: a scratch worktree with git merge --no-commit --no-ff, git diff --name-only --diff-filter=U, git merge --abort). Otherwise write "START_REF unchanged".
7. Score every rubric criterion 0-4 for every label, each with evidence (a command and its output, or file:line). Score criterion by criterion, not on overall feel. Do not reward length.
8. Recommend at most 2 trades per non-base label: {from: label, what, pointers: [file:line-range], why}.

Rules: open NO pull request (draft PR only if your environment forces one, base dd/p4-phone). Never mark anything ready for review, never merge, never enable auto-merge, never deploy. Do not push to main, dd/scaffold, any dd/p1-*, dd/p2-*, dd/p3-* or dd/p4-* branch or any candidate branch, and do not force-push. Touch only this repository. Nothing related to KPD/kpdlawgroup or debt collection. Zero runtime dependencies, no network code in anything you commit.
End your final message with exactly one dd-judgement block (one pass, labels only, cards with gates, crossTests, diff and scores for every criterion, plus base, runnerUps, trades, swapConsistent: null), then a short rationale per label naming what you would keep and what you would reject, the probe lines, and the stack-probe output per label.
```

### On judge finish
1. Save the final message to `runs/p5/judge-pass1.md`.
2. Run `node tools/filmroom-calc.mjs SPEC-006-rubric.json runs/p5/judge-pass1.md --risks c1=<n>,c2=<n>,c3=<n>`, with the risk counts from each `dd-report`.
   - Exit 2 means an invalid block. Reply to the judge once with the error. A second invalid block counts as a judge error.
   - It prints ranks, `closeCall`, `needSecondPass` and `base`.
3. Grok Bot second read:
   - Open each candidate's diff with cursor-github `compare_commits` base=`c6cfad415576c2c14653955aff972a6d8c613ab1` head=<branch>, and check the scorecard against it.
   - Re-run the oracle on the base candidate's spot-check folder (`bun tools/replay-check.mjs runs/p5/c<N>` → `TOTAL 192/192`).
   - Look at its committed screenshots in `runs/p5/c<N>/screens/`.
   - Record agree/disagree plus a one-line note in LOG.tsv. A disagreement is shown, not applied. If it is serious, tell Boyd before the graft.
4. `needSecondPass: true` → step 2b. Otherwise → step 3 with the calculator's `base`.

## 2b. Film Room judge, pass 2 (only when pass 1 was a close call)
Same parameters as pass 1, except the title is `Draft Day P5 Replay judge · pass 2 (reversed)`, and the prompt changes:
- Labels come from the **pass-2 map** (A = c3, B = c1, C = c2), listed in that order.
- Step 1 is replaced with: `Do not write new tests. Check out branch dd/p5-replay-judge and use its test/replay.pooled.test.ts (and the fixtures it committed) unchanged as the pooled cross-test.` Nothing may be pushed in this pass.
- The first line is: `You are the Film Room judge for SPEC 006, pass 2. Score from scratch; do not look for or read any earlier judgement.`

Then save `runs/p5/judge-pass2.md` and run `node tools/filmroom-calc.mjs SPEC-006-rubric.json runs/p5/judge-pass1.md runs/p5/judge-pass2.md --risks …`. It prints `swap` (`consistent` or `flipped`), `tieRule`, `unstable`, and the final `base` and `runnerUps`. Trades come from the **last** pass (labels resolved with that pass's map): at most 2 per runner-up, none from the base.

**Do not skip pass 2 on a close call.** If the parent run decides to skip anyway, log `p5 pass 2 skipped` with the reason, and say so in the graft's synthesis note.

Write `runs/p5/film-room-result.md` for the grafter, with:
- `START_REF` and `START`;
- the base cand, branch and head SHA;
- the runner-ups;
- each trade (cand, what, pointers, why);
- the calculator output, the swap state and the tie rule;
- the judge's rationale per label, translated from labels to cand ids now that judging is over;
- the probe lines and the stack-probe output;
- Grok Bot's second read.

## 3. Trade (graft) → the one draft PR
`{{PR_BASE}}` = `dd/p4-phone`. Check it with `get_branch` right before launch. If its head moved from `c6cfad4`, say so in the synthesis note; the stack probe in VERIFY 8 covers the merge.
- action: `launch`
- repo: `https://github.com/BoydVC/draft-day`
- starting_ref: `{{BASE_BRANCH}}` (for example `dd/p5-replay-a`)
- title: `Draft Day P5 Replay · trade + draft PR`
- files: `file:///workspace/tokenmax/poteto-pipeline/SPEC-006-replay.md`, the twelve `fixtures/replay/*` files, and `file:///workspace/tokenmax/poteto-pipeline/runs/p5/film-room-result.md`
- model: omit

Prompt:
```
You are the grafter for Draft Day Pick 5 (SPEC 006, uploads/SPEC-006-replay.md). Your starting branch {{BASE_BRANCH}} won the Film Room; uploads/film-room-result.md has the scorecard and the trade list. START_REF is dd/p4-phone and START is c6cfad415576c2c14653955aff972a6d8c613ab1. The twelve fixtures in uploads/ must stay byte-identical under test/fixtures/replay/.
1. Create branch dd/p5-replay from {{BASE_BRANCH}}.
2. Port each listed trade by hand from its source branch into the base so the result keeps one mental model. Do not paste whole files, do not take more than the listed trades, do not change the base's architecture, and stay inside the spec's touch map.
3. Add test/replay.pooled.test.ts from branch dd/p5-replay-judge unchanged (fix it only if it contradicts the spec, and say why).
4. Commit uploads/SPEC-006-replay.md as docs/SPEC-006-replay.md. Add docs/DECISIONS.tsv rows for the base choice and each trade. These two paths and the pooled test are the touch map's grafter-only row; add nothing else outside the touch map.
5. Run every VERIFY step in the spec: the verify-draft-day skill, the 18 replay probes, the pick-page probes, the fix-loop, play and live shots (live last), the safety-fact proof and the stack probe against dd/p4-phone. Re-shoot all ten screenshots the spec names from the grafted code and commit them over the base's copies under docs/screens/p5-replay/.
6. Open ONE pull request from dd/p5-replay into {{PR_BASE}} (base {{PR_BASE}}, NOT main) as a DRAFT, titled "Draft Day Pick 5: Replay mode (SPEC 006)". The body starts with "Draft only. Do not merge, enable auto-merge, or mark ready for review." It includes: START; a synthesis note (the base and why, the swap result, each trade with its source branch, what was rejected and why); the VERIFY output; a Screenshots section listing all ten docs/screens/p5-replay/*.png repo paths, with the 390 dark ?at=11 and 1280 light ?at=11 shown as images by their blob URL at the head commit (https://github.com/BoydVC/draft-day/blob/<head sha>/docs/screens/p5-replay/<file>?raw=true); and the stack note "Stacked on the Pick 4 PR #6 (dd/p4-phone), which is stacked on #5 (dd/p3-lessons), #3 (dd/p2-timeline), #2 (dd/p1-film-room) and #1 (dd/scaffold). Merge after #6. Shared files with Pick 4: src/ui/app.js (different functions), src/ui/index.html (two new lines), src/server/http.ts (the static files line), test/phone.test.ts (the W5 file list), the verify skill's SKILL.md, features/README.md and helpers/control.sh, docs/DECISIONS.tsv." followed by the stack-probe output.
Rules: draft PR only; never mark it ready for review, never merge, never enable auto-merge, never deploy. Do not push to main, dd/scaffold, any dd/p1-*, dd/p2-*, dd/p3-* or dd/p4-* branch or any candidate branch, and do not force-push. Touch only this repository. Nothing related to KPD/kpdlawgroup or debt collection. Zero runtime dependencies, no network code.
End your final message with one dd-report block for dd/p5-replay (the ten screenshot repo paths in "screenshots") plus a line "PR: #<number>".
```
After it finishes: `get_pull_request` → confirm `draft: true` and `base.ref == "dd/p4-phone"`. If it is not a draft, `set_pull_request_draft` draft=true, and change nothing else. `list_pull_request_files` → the ten PNGs and `docs/SPEC-006-replay.md` are there, and nothing falls outside the touch map. Log the PR number and head SHA.

## 4. Physical (verify the draft PR)
- action: `launch`
- repo: as above
- starting_ref: `dd/p5-replay`
- title: `Draft Day P5 Replay · physical`
- files: `file:///workspace/tokenmax/poteto-pipeline/SPEC-006-replay.md` and the twelve `fixtures/replay/*` files
- model: omit

Prompt:
```
You are the verifier for draft PR #{{PR}} (branch dd/p5-replay, head {{HEAD_SHA}}) in this repo, built from SPEC 006 (uploads/SPEC-006-replay.md) with START c6cfad415576c2c14653955aff972a6d8c613ab1. CI green is an input, not a verdict.
Run npm test, npx tsc --noEmit, selftest and doctor, and check sha256sum test/fixtures/replay/* against the spec. Then run the repo's .cursor/skills/verify-draft-day skill and drive every journey in features/replay.md: seed-replay; the 18 replay probes of p-20261017-94 (?at=1, 11, 20 × 390x844, 430x932, 1280x800 × light, dark; paste every JSON line; each must be "ok":true with "offOrigin":[] and exactly one chip of the frame's status); the pick page at 390 and 430 in both schemes ("ok":true) and at 1280 light (no problem names Replay); the Pick 3 fix loop at ?at=21; Play from ?at=1&play=1 advancing in a real browser; and, last, a live update via dd record extending the film to "Event 20 of 21" on the same frame. Save every screenshot under /opt/cursor/artifacts/war-room/ and compare them with the ten committed under docs/screens/p5-replay/ (same screens, same frames). Prove the spec's safety fact by running code (certainty 4 or 5) and paste the output. Check git diff --name-only c6cfad415576c2c14653955aff972a6d8c613ab1...HEAD against the touch map, including its grafter-only row (docs/SPEC-006-replay.md, test/replay.pooled.test.ts, docs/screens/p5-replay/*.png are sanctioned there).
Do not change product code. If something fails, report it; do not fix it.
Rules: draft PR only; never mark it ready for review, never merge, never enable auto-merge, never deploy. Do not push to any branch. Touch only this repository. Nothing related to KPD/kpdlawgroup or debt collection. No network code, no new dependencies.
End your final message with exactly one dd-verdict block {prNumber, headSha, verdict, ledger, certainty, evidence, fixLoops} keyed to the head SHA you verified.
```
- **VERIFIED** at the PR's current head → confirm `draft: true` once more and log it. Copy the committed screenshots into `runs/p5/screens-final/` for the reveal (read only): `for f in $(gh api "repos/BoydVC/draft-day/contents/docs/screens/p5-replay?ref=<head>" --jq '.[].name'); do gh api "repos/BoydVC/draft-day/contents/docs/screens/p5-replay/$f?ref=<head>" -H 'Accept: application/vnd.github.raw' > runs/p5/screens-final/$f; done`. **No message to Boyd now** (the quiet rule; the Thursday reveal carries it). The reveal names the PR link, the base cand and its angle, the swap result, the trades, the 390 dark and 1280 light `?at=11` screenshots, the play shot, and the stack order (#1 ← #2 ← #3 ← #5 ← #6 ← this). The `?at=1&play=1` deep link is the demo-video recording path.
- **NOT_VERIFIED / INCONCLUSIVE** → `reply` (mode queue) to the **graft** agent with the verdict's evidence: `Fix these on dd/p5-replay, keep the PR a draft, stay inside the touch map, re-run VERIFY, re-commit any screenshot that changed, end with a dd-report: …`. Then rerun step 4. At most 2 fix loops. After that the pick fails, the PR stays a draft, and Grok Bot asks Boyd before touching the title. If the only failure is a touch-map path that the grafter-only row sanctions, rule on it as on Pick 4 (reply queue to the physical: re-check VERIFY 9 only, fixLoops 0).

## 5. Logging
Every launch, finish, judgement, calculator result, oracle spot-check, second read, trade list, PR number and verdict gets a `./log.sh <phase> <decision> <why> <evidence> <result>` row. The phases are combine, judging, grafting and physical. Prefix decisions with `p5` so they don't blur with Pick 1-4 rows written the same weekend.

## Open risks (read before launch)
- **dd/p4-phone could move.** If a late Pick 4 fix lands, `START` moves under the candidates. Step 0.1 catches it. VERIFY 8's merge-tree catches it after launch.
- **Chrome is not Safari.** `cdp-shot.mjs` emulates an iPhone in headless Chrome (UA, DPR 3, touch, `prefers-color-scheme`) and does not run WebKit. Range-slider styling and safe-area insets differ most on a real iPhone. Ask Boyd to scrub one replay on his phone at reveal time; nothing claims real-device proof.
- **Timing journeys.** Play and Live depend on real-browser timing (`--wait 4500`, `sleep 2`). Both passed on the box (Play reached `Event 5 of 20`; Live showed `Event 20 of 21`). They are journeys, not hard gates. The spec's retry rule re-seeds first.
- **Clocks are approximated.** The P3/P4 fixture timestamps are the edges of the orchestrator's tool calls (`fixtures/replay/README.md`), not a running `dd`. Durations are self-consistent (the R18 parity check), but they may differ by minutes from the wall clock. P3's `Intake 3h 32m` is real.
- **Pick 4's last frames show `Physical · not_verified`.** The re-check was a reply to the same agent, which `dd` can't express as a second run. The frame-19 caption says VERIFIED. The demo voice-over should say "re-checked".
- **The 1280 W8 board and pick-page problems are pre-existing.** The Big Board and pick page carry 11 sub-44 targets at 1280 from earlier picks. They are out of scope here (R19 checks only that none names `Replay`). A one-file follow-up after the stack merges.
- **PNG weight.** Ten committed screenshots add roughly 2-4 MB to the PR (the box ref shots were 200-500 KB each). Accepted, so that the reveal can retrieve them.
- **Fixture text mentions KPD.** The real scouting reports quote the repo's own FORBIDDEN guard sentence ("Nothing KPD, kpdlawgroup, or debt-collection related…"), the same text already in the repo docs. No other KPD content is anywhere in the fixtures.
- **Commit trailer.** PR #6's graft commit `c6cfad4` carries `Co-authored-by: Christopher Boyd <[redacted-email]>` (added by Cursor from the account's git identity). It is metadata only. Mention it to Boyd at the reveal in case he wants his personal address on BoydVC commits.
- **The box reference build exists only to prove the spec is satisfiable** (`runs/p5/ref`: 192/192, `bun test` 165 pass, `tsc` clean, 18/18 probes ok). It is never attached to an agent and never pushed.
- **Cloud VM tooling.** `cdp-shot.mjs` needs Chrome and a global `WebSocket` (Node 22, or Node 20 with `--experimental-websocket`). If a VM lacks Chrome, the journey gate fails as INCONCLUSIVE (environment), not as a product failure. The relaunch rule applies once.
