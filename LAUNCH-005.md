# Ready-to-run launch: Pick 4, Phone War Room (SPEC 005), 3-candidate arena

Mirrors `LAUNCH-004.md`. Written Sat Oct 17, 2026 (afternoon). PLAN slot: Sun Oct 18, 1:33 PM ET. It can launch earlier, once the parent run says go. Like Picks 1-3, Pick 4 is driven **by hand**. The `dd` CLI is not on the box (no clones, ever), so Grok Bot plays the driver. It does the selection math with `tools/filmroom-calc.mjs SPEC-005-rubric.json …` and checks the phone numbers with two box-side oracles:
- `tools/phone-calc.mjs` covers W1-W6 and W10.
- `tools/phone-harness-check.mjs` covers W11-W17, through `fixtures/phone/dom-harness.mjs`.

It reads the branch files with `gh api …/contents?ref=` and never clones. Model: **omit on every launch** (Boyd has not named one). Budget: 3 candidates, 1-2 judge passes, 1 graft and 1 physical = 6-7 runs, plus at most 1 relaunch per candidate and 2 fix replies. Nothing in this file has been launched.

**READY PATH (Sat Oct 17, re-derived): Mode S, `START_REF = dd/p3-lessons`, `START = e242a533d04d68a5a4472bce283eb06866e79d96` (draft PR #5). Oracles at START: phone-calc 80, with `--css lessons.css` 82, harness 36/53; Locker Room probe W8 30 + W9 10 at all four runs. The prompts below have START filled in. Re-run step 0 only to confirm `dd/p3-lessons` head is still `e242a53`; if it moved, redo step 0.5 and the spec numbers.** Touch map: Pick 4 may edit `src/ui/lessons.css` (color literals → existing tokens, plus one optional size-only phone block); `lessons.js` stays do-not-touch.

**Starting ref: decided at launch time, one of two modes (SPEC 005 "Starting ref").**
- **Mode S (preferred):** `START_REF = dd/p3-lessons`, the Pick 3 graft branch, as soon as it exists with its draft PR open. `START` is its head at launch.
- **Mode F (fallback):** `START_REF = dd/p2-timeline`, `START = 60b1625518f61de576205c73318afd54c3384798` (draft PR #3). The touch map then stays file-disjoint from the Pick 3 lane (`src/core/lessons.ts`, `src/ui/lessons.js`, `src/ui/lessons.css`, `test/lessons*`, `test/fixtures/lessons/*`, `features/lessons.md`, `seed-lessons`).
- The box merge probe of the reference build against all three real Pick 3 candidates (`dd/p3-lessons-a` `a104b28`, `-b` `a6d5b13`, `-c` `2925579`) over `60b1625` conflicted only in `docs/DECISIONS.tsv`, in both orders. Results: `runs/p4/mergesim/real-p3.txt`.

**PR base for the graft: `dd/p3-lessons`**, the Pick 3 PR branch, in both modes. A Mode F branch merges into it cleanly, per the same probe. Fall back to `dd/p2-timeline` only if `dd/p3-lessons` does not exist when the graft launches. Then say in the PR body that it must be retargeted to the Pick 3 PR before review. Pick 4 pushes only `dd/p4-phone*` branches. Never pause, relaunch or reply to a Pick 1-3 agent from this file.

## 0. Preconditions (read-only checks, at launch time)
1. **Pick the mode.** Call cursor-github `get_branch` with owner=BoydVC, repo=draft-day, branch=`dd/p3-lessons`.
   - **It exists:** call `list_pull_requests` with head=`BoydVC:dd/p3-lessons`. Expect one open PR with `draft: true` and base `dd/p2-timeline`. Read LOG.tsv for its physical.
   - **Mode S** applies when that physical is VERIFIED, or when no physical has run and no fix loop is open. Set `START` to the branch head and `START_REF` to `dd/p3-lessons`.
   - **Wait or fall back:** if a Pick 3 fix loop is open (NOT_VERIFIED with a reply queued), its fix commit would move `START` under the candidates. Wait for it, or use Mode F. Log the choice.
   - **It does not exist:** Mode F. Check `dd/p2-timeline` → head `60b1625518f61de576205c73318afd54c3384798`.
     - If it moved, run `compare_commits` base=`60b1625…` head=`dd/p2-timeline`.
     - If the change touches `src/ui/{index.html,styles.css,timeline.css,app.js}`, the verify skill's `SKILL.md`, `features/README.md` or `features/new-pick.md`, **stop**. Re-read those files remotely into `runs/p4/base/`, rerun step 5, re-derive the spec's baselines, rerun `./tools/make-copies.sh`, then launch.
     - Otherwise use the new head as `START` and log it.
2. **No run in progress:** `list_branches` returns no `dd/p4-phone*` branches. If one exists, a run already started: read LOG.tsv and resume instead of relaunching. (Sat Oct 17, 2:30 PM ET: none. Branches were `main`, `dd/scaffold`, `dd/p1-film-room[-a|-b|-c]`, `dd/p2-timeline[-a|-b|-c]`, `dd/p3-lessons-[a|b|c]`.)
3. **The stack below is intact:** `get_pull_request` #3 returns `draft: true`, base `dd/p1-film-room`, not merged. If Boyd merged anything in the stack, use the branch it merged into, re-ground as in step 1, and log it.
4. **Copies are clean:** `./tools/make-copies.sh` must print `ok:` for SPEC-002, -003, -004 and `SPEC-005-phone-war-room`, then a final `ok`.
   - It leak-checks the SPEC-005 candidate and judge copies against `SPEC-005-rubric.json`.
   - It checks that the rubric and angle tables match the JSON.
   - It checks that the spec carries the sha256 of all five `fixtures/phone/*` files.
5. **Oracles agree with the spec's baselines** (exact output strings in `runs/p4/*.txt`):
   - `node tools/phone-calc.mjs runs/p4/base` → `result fail (80 problems)`.
   - `node tools/phone-harness-check.mjs runs/p4/base` → `36/53 pass`.
   - The same two on `runs/p4/ref` → `result pass (0 problems)` and `53/53 pass`.
   - **Mode S:** first copy `src/ui/*` at `START` into `runs/p4/start/src/ui/` with `gh api repos/BoydVC/draft-day/contents/src/ui/<f>?ref=START -H 'Accept: application/vnd.github.raw'` (no clone). Then expect `node tools/phone-calc.mjs runs/p4/start` → `80 problems`, the same run with `--css lessons.css` → **82** (START `e242a53` carries 2 `lessons.css` literals, `.dd-level` and `.dd-first`; spec W5/W18 re-derived Sat Oct 17, 3:45 PM ET), and the harness → `36/53 pass`.
   - If Mode S differs anywhere else, re-derive the W5/W18 baselines in the spec before launch.
6. **Usage:** on the Cursor dashboard, on-demand is still disabled and the Cursor Models pool is not near its cap. The billing period resets Oct 20 UTC, about Mon Oct 19 8 PM ET. Picks 1-4 share that pool.

## 1. Combine: three candidate launches (send all three in one turn)
Common parameters for c1, c2, c3:
- action: `launch`
- repo: `https://github.com/BoydVC/draft-day`
- starting_ref: `dd/p3-lessons` (ready path; Mode S `dd/p3-lessons`, Mode F `dd/p2-timeline`)
- files:
  - `file:///workspace/tokenmax/poteto-pipeline/SPEC-005-phone-war-room.candidate.md`
  - `file:///workspace/tokenmax/poteto-pipeline/fixtures/phone/board-states.json`
  - `file:///workspace/tokenmax/poteto-pipeline/fixtures/phone/dom-harness.mjs`
  - `file:///workspace/tokenmax/poteto-pipeline/fixtures/phone/dom-harness.d.mts`
  - `file:///workspace/tokenmax/poteto-pipeline/fixtures/phone/probe.js`
  - `file:///workspace/tokenmax/poteto-pipeline/fixtures/phone/cdp-shot.mjs`
  - These are the copy with no rubric and no angles, plus the five fixtures. **Never** attach `SPEC-005-phone-war-room.md`, `.judge.md`, `SPEC-005-rubric.json`, `tools/phone-*.mjs` (the oracles), `runs/p4/ref*` or this file to a candidate.
- model: omit

| Cand | title | branch (in prompt) | ANGLE line (in prompt) |
|---|---|---|---|
| c1 | `Draft Day P4 Phone · c1 token ledger` | `dd/p4-phone-a` | Token ledger: start from styles.css; name every color once in the two token blocks, rewrite each rule to reference tokens, chip families as five selector lists, and sizes as a short set of phone rules appended at the end; change app.js only as far as the form rules force, in the smallest diff that passes W12-W17; dark screenshots should look like START apart from sizes. |
| c2 | `Draft Day P4 Phone · c2 intake state machine` | `dd/p4-phone-b` | Intake state machine: start from the New pick form; model it as one module-level record with a phase (idle, sending, done, failed), the kept idea and the last sentence; one pure function maps an answer (or a thrown error) to {phase, sentence, keepIdea} through a single table that is the spec's outcome table; one paint function writes the record onto whatever form is on screen; tests name each transition; CSS plain and correct. |
| c3 | `Draft Day P4 Phone · c3 card-stack board` | `dd/p4-phone-c` | Card-stack board: start from Boyd's thumb; at 600 px and below the Big Board's table reflows (CSS only, same DOM) into one block per pick with the idea first and large, the big chip, then the id link, stage and runs, each labeled from a data-* attribute boardTable() sets on the cell; Add pick spans the form's width on a phone; be strongest on the 390x844 screenshots and accessible names; tokens and the form still meet every line. |

Prompt (identical except `{{BRANCH}}`, `{{ANGLE}}`, `{{START_REF}}`=dd/p3-lessons, `{{START}}`=06ce1ae4…, `{{MODE}}`=S, already filled in):
```
Build SPEC 005 (uploads/SPEC-005-phone-war-room.candidate.md) in this repo. The five fixtures it names are uploads/board-states.json, uploads/dom-harness.mjs, uploads/dom-harness.d.mts, uploads/probe.js and uploads/cdp-shot.mjs; commit each byte-identical under test/fixtures/phone/ and do not edit them.
Your starting ref is dd/p3-lessons at commit e242a533d04d68a5a4472bce283eb06866e79d96 (already checked out). Wherever the spec says START or START_REF, use exactly these. This is Mode S in the spec's "Starting ref" table; confirm it from your tree (Mode S if and only if src/ui/lessons.js exists) and say which mode you built in your report. It is the top of a draft stack (dd/scaffold, dd/p1-film-room, dd/p2-timeline, dd/p3-lessons); push your work to a new branch named {{BRANCH}}. Read docs/ARCHITECTURE.md, docs/SPEC-001.md, docs/SPEC-002-film-room.md, docs/SPEC-003-pick-timeline.md, docs/SPEC-004-lessons.md if present, and AGENTS.md first; SPEC 005 wins where they differ. The spec's touch map is binding: it names the one hunk you may change in each shared file so this pick stays a clean layer on top of Picks 1-3. Do not edit a do-not-touch file, and in Mode F do not create any Pick 3 lane file.

Your angle (other agents are building the same spec from different angles; stay true to yours):
{{ANGLE}}

Rules:
- Draft PR only, and for this run open NO pull request at all: push your branch and stop. If your environment opens one automatically, it must be a DRAFT with base dd/p3-lessons, and you say so in your report.
- Never mark any PR ready for review, never merge, never enable auto-merge, never deploy or publish anything.
- Do not push to main, dd/scaffold, any dd/p1-*, dd/p2-* or dd/p3-* branch, and do not force-push.
- Touch only this repository (BoydVC/draft-day). Nothing related to KPD/kpdlawgroup or debt collection, in code, fixtures, tests or examples.
- Zero runtime dependencies and no network code; test/guards.test.ts stays byte-identical; src/server/http.ts does not change; no web fonts, other-origin assets, localStorage, sessionStorage or cookies.
Run every VERIFY step in the spec, including updating and executing the verify-draft-day skill and saving the phone screenshots it names under /opt/cursor/artifacts/war-room/ (cdp-shot.mjs needs Chrome; on Node 20 run it with --experimental-websocket).
End your final message with exactly one dd-report block for {{BRANCH}} as described in the spec, then your mode and START, what works, what does not, the screenshot paths, the probe JSON lines, the safety-fact proof output, the stack-probe output, and open questions.
```

After the launches: one LOG.tsv row per candidate (`./log.sh combine "p4 launched c1 token ledger" "<mode, START>" "<agent id>" "running"`).

### On each candidate finish (revival)
1. `CloudAgent dump` → `tail -n 1` the transcript; save the final message to `runs/p4/c<N>-final.md`.
2. Extract the `dd-report` block. Use cursor-github `get_branch` to check that `{{BRANCH}}` exists and its head equals `headSha`. A missing or invalid report, or no branch, = **error**. A reported mode that differs from the launch mode = **error** (wrong tree).
3. `list_pull_requests` head=`BoydVC:{{BRANCH}}`: if a PR exists and is not a draft, flip it with `set_pull_request_draft` draft=true (the standing draft rule), and log a lesson.
4. Touch-map check (cheap, before judging): `compare_commits` base=`e242a533d04d68a5a4472bce283eb06866e79d96` head=`{{BRANCH}}`.
   - If `test/guards.test.ts`, `package.json`, `src/server/http.ts`, `src/ui/lessons.js`, any `src/core|cli|store|report` file, an existing test, or (Mode F) any Pick 3 lane path changed, note it for the judge's second read. It is a `stack` penalty, not an error.
   - Box spot-check (no clone): pull the candidate's `src/ui/*` and `test/fixtures/phone/*` with `gh api …/contents?ref=<headSha>` into `runs/p4/c<N>/`. Then run `node tools/phone-calc.mjs runs/p4/c<N>` (Mode S: add `--css lessons.css`), `node tools/phone-harness-check.mjs runs/p4/c<N>`, and `sha256sum runs/p4/c<N>/test/fixtures/phone/*`. Log the results. They inform the second read and do not replace the judge.
5. Error once → one relaunch with the same parameters and the prompt prefixed `This is the one allowed relaunch of a run that errored: <one-line reason>.` Error twice → drop it (a dropout is a gap, never a pass).
6. Log `p4 finished cN` with headSha, test count, mode, and the two oracle results.

When all three are settled:
- **≥2 finished** → Film Room (step 2).
- **exactly 1 finished** → walkover: skip steps 2-3. Launch the physical (step 4) with starting_ref = that branch, and add to its prompt: `Walkover: open a DRAFT PR from this branch into {{PR_BASE}} first (body starts "Draft only. Do not merge, enable auto-merge, or mark ready for review."), then verify it.`
- **0 finished** → the pick fails (reason `no_candidates`). Re-frame SPEC 005 before any rerun, and tell Boyd.

## 2. Film Room judge, pass 1
Fixed label maps (also in `SPEC-005-rubric.json`; keep this file off every agent). These differ on purpose from every earlier map: Pick 1 (p1 A=c2 B=c3 C=c1, p2 A=c1 B=c3 C=c2), Pick 2 (p1 A=c1 B=c3 C=c2, p2 A=c2 B=c3 C=c1), Pick 3 (p1 A=c3 B=c1 C=c2, p2 A=c2 B=c1 C=c3). They are also the first maps whose fixed middle label is c2:
- Pass 1: **A = c3 (c), B = c2 (b), C = c1 (a)**
- Pass 2 (order reversed): **A = c1 (a), B = c2 (b), C = c3 (c)**

With N=3 the middle label stays the same in both passes, which is the cost of a pure reversal and is accepted. Pass 2 happens to map A→a, B→b, C→c. The judge never sees branch names, so the alignment carries no information; the prompt also forbids looking up which branch a SHA belongs to. If a candidate dropped, remove its label and keep the others' relative order (A, B, …).

Parameters:
- action: `launch`
- repo: `https://github.com/BoydVC/draft-day`
- starting_ref: `dd/p3-lessons`
- title: `Draft Day P4 Phone judge · pass 1`
- files: `file:///workspace/tokenmax/poteto-pipeline/SPEC-005-phone-war-room.judge.md` (has the rubric, no angles), plus the five `fixtures/phone/*` files as in step 1
- model: omit

Prompt (fill `{{SHA_A}}` etc. from the candidates' verified head SHAs using the pass-1 map):
```
You are the Film Room judge for SPEC 005 (uploads/SPEC-005-phone-war-room.judge.md), pass 1. You score; you do not build the feature. The five fixtures are in uploads/ (sha256 in the spec). START_REF is dd/p3-lessons and START is e242a533d04d68a5a4472bce283eb06866e79d96 (Mode S).

Candidates, anonymized. Refer to them ONLY by label, never by branch name, commit message or author:
- Label A: commit {{SHA_A}}
- Label B: commit {{SHA_B}}
- Label C: commit {{SHA_C}}
Fetch each by SHA (git fetch origin <sha>; if that fails, git fetch origin 'refs/heads/dd/p4-phone-*' and check out by SHA only) and give each its own worktree (git worktree add /tmp/judge/A <sha>, and so on). Do not look up which branch a SHA belongs to. Also add a worktree for START (git worktree add /tmp/judge/start e242a533d04d68a5a4472bce283eb06866e79d96) for the dark-screenshot comparison.

Do this, in order:
1. Write ONE black-box test file, test/phone.pooled.test.ts, from ACCEPTANCE lines W1-W6 and W10-W17, using only the uploaded fixtures (committed under test/fixtures/phone/ in the same commit, byte-identical) and the files under src/ui/ read as text or loaded through dom-harness.mjs. Derive expected values from the spec's literals (token names, pinned dark hexes, contrast minimums, status families, status sentences, 10 board rows), not from any candidate's output, and add hostile values of your own for W15 and W17. Commit it on a new branch dd/p4-phone-judge started from dd/p3-lessons and push that branch. That is the only thing you may push.
2. For each label: hard gates (build = npx tsc --noEmit exit 0; tests = its own npm test exit 0; journey = its verify-draft-day skill launches, and node test/fixtures/phone/cdp-shot.mjs on the Big Board at 390x844 in dark prints "ok":true with scrollWidth <= 390, screenshot saved under /opt/cursor/artifacts/war-room/p4-judge-<label>.png).
3. Only after a label's gates are recorded (npm test globs test/*.test.ts, so a copied pooled file would leak into its own-tests gate), copy the same pooled test file into each worktree and run it (node --experimental-strip-types --test test/phone.pooled.test.ts); record passed/total (total must be the same for every label).
4. For the thumb criterion, run cdp-shot.mjs per label on the Big Board and on the close selftest pick's page at 390x844 and 430x932 in light and dark (Mode S: also #/lessons?since=2026-10-11&until=2026-10-16 after control.sh seed-lessons), plus one 1280x800 Big Board screenshot; paste each JSON line's ok, scrollWidth, problems and offOrigin.
5. Measure each diff: git diff --shortstat e242a533d04d68a5a4472bce283eb06866e79d96...<sha> -- . ':(exclude)package-lock.json' → diff {files, added, removed}. Also run git diff --name-only e242a533d04d68a5a4472bce283eb06866e79d96...<sha> against the touch map for Mode S.
6. Stack probe for the stack criterion: for each label run git merge-base --is-ancestor e242a533d04d68a5a4472bce283eb06866e79d96 <sha> && echo on-stack. Then git fetch origin dd/p3-lessons; if FETCH_HEAD is not e242a533d04d68a5a4472bce283eb06866e79d96, run git merge-tree --write-tree --name-only <sha> FETCH_HEAD per label (git older than 2.38: a scratch worktree with git merge --no-commit --no-ff, git diff --name-only --diff-filter=U, git merge --abort); otherwise write "START_REF unchanged". Mode F only: if origin has dd/p3-lessons, run the same merge-tree per label against it.
7. Score every rubric criterion 0-4 for every label, each with evidence (a command and its output, or file:line). Score criterion by criterion, not on overall feel. Do not reward length.
8. Recommend at most 2 trades per non-base label: {from: label, what, pointers: [file:line-range], why}.

Rules: open NO pull request (draft PR only if your environment forces one, base dd/p3-lessons). Never mark anything ready for review, never merge, never enable auto-merge, never deploy. Do not push to main, dd/scaffold, any dd/p1-*, dd/p2-* or dd/p3-* branch or any candidate branch, and do not force-push. Touch only this repository. Nothing related to KPD/kpdlawgroup or debt collection. Zero runtime dependencies, no network code in anything you commit.
End your final message with exactly one dd-judgement block (one pass, labels only, cards with gates, crossTests, diff and scores for every criterion, plus base, runnerUps, trades, swapConsistent: null), then a short rationale per label naming what you would keep and what you would reject, the probe lines, and the stack-probe output per label.
```

### On judge finish
1. Save the final message to `runs/p4/judge-pass1.md`.
2. Run `node tools/filmroom-calc.mjs SPEC-005-rubric.json runs/p4/judge-pass1.md --risks c1=<n>,c2=<n>,c3=<n>`, taking the risk counts from each `dd-report`.
   - Exit 2 means an invalid block. Reply to the judge once with the error. A second invalid block counts as a judge error.
   - It prints ranks, `closeCall`, `needSecondPass` and `base`. It was checked Sat Oct 17 on two scratch SPEC-005 passes (`/tmp/p4/s1.md`, `s2.md`): six criteria, weights 15, labels resolved C→c1, B→c2, A→c3, swap consistent.
3. Grok Bot second read:
   - Open each candidate's diff via cursor-github `compare_commits` base=`e242a533d04d68a5a4472bce283eb06866e79d96` head=<branch> and check the scorecard against it.
   - Re-run both oracles on the base candidate's files (step 1's spot-check folder). Expect `result pass (0 problems)` and `53/53 pass`. Mode S: also `--css lessons.css` → 0.
   - Record agree/disagree plus a one-line note in LOG.tsv. A disagreement is shown, not applied. If it is serious, tell Boyd before the graft.
4. `needSecondPass: true` → step 2b. Otherwise → step 3 with the calculator's `base`.

## 2b. Film Room judge, pass 2 (only when pass 1 was a close call)
Same parameters as pass 1, except the title is `Draft Day P4 Phone judge · pass 2 (reversed)` and the prompt changes:
- Labels come from the **pass-2 map** (A = c1, B = c2, C = c3), listed in that order.
- Replace step 1 with: `Do not write new tests. Check out branch dd/p4-phone-judge and use its test/phone.pooled.test.ts (and the fixtures it committed) unchanged as the pooled cross-test.` Nothing may be pushed in this pass.
- First line: `You are the Film Room judge for SPEC 005, pass 2. Score from scratch; do not look for or read any earlier judgement.`

Then save `runs/p4/judge-pass2.md` and run `node tools/filmroom-calc.mjs SPEC-005-rubric.json runs/p4/judge-pass1.md runs/p4/judge-pass2.md --risks …`. It prints `swap` (`consistent` or `flipped`), `tieRule`, `unstable`, and the final `base`/`runnerUps`. Trades come from the **last** pass (labels resolved with that pass's map): at most 2 per runner-up, none from the base.

**Do not skip pass 2 on a close call.** Picks 1 and 2 skipped it, and both were logged as close calls. If the parent run decides to skip anyway, log `p4 pass 2 skipped` with the reason, and say so in the graft's synthesis note.

Write `runs/p4/film-room-result.md` for the grafter. Include:
- the mode, `START_REF` and `START`;
- the base cand, branch and head SHA;
- the runner-ups;
- each trade (cand, what, pointers, why);
- the calculator output, the swap state and the tie rule;
- the judge's rationale per label, translated from labels to cand ids now that judging is over;
- the probe lines and the stack-probe output;
- Grok Bot's second read.

## 3. Trade (graft) → the one draft PR
`{{PR_BASE}}` = `dd/p3-lessons` (check it with `get_branch` right before launch; if it is missing, `dd/p2-timeline` and log it).
- action: `launch`
- repo: `https://github.com/BoydVC/draft-day`
- starting_ref: `{{BASE_BRANCH}}` (for example `dd/p4-phone-b`)
- title: `Draft Day P4 Phone · trade + draft PR`
- files: `file:///workspace/tokenmax/poteto-pipeline/SPEC-005-phone-war-room.md`, the five `fixtures/phone/*` files, and `file:///workspace/tokenmax/poteto-pipeline/runs/p4/film-room-result.md`
- model: omit

Prompt:
```
You are the grafter for Draft Day Pick 4 (SPEC 005, uploads/SPEC-005-phone-war-room.md). Your starting branch {{BASE_BRANCH}} won the Film Room; uploads/film-room-result.md has the scorecard and the trade list. START_REF is dd/p3-lessons and START is e242a533d04d68a5a4472bce283eb06866e79d96 (Mode S). The five fixtures in uploads/ must stay byte-identical under test/fixtures/phone/.
1. Create branch dd/p4-phone from {{BASE_BRANCH}}.
2. Port each listed trade by hand from its source branch into the base so the result keeps one mental model. Do not paste whole files, do not take more than the listed trades, do not change the base's architecture, and stay inside the spec's touch map for Mode S.
3. Add test/phone.pooled.test.ts from branch dd/p4-phone-judge unchanged (fix it only if it contradicts the spec, and say why).
4. Commit uploads/SPEC-005-phone-war-room.md as docs/SPEC-005-phone-war-room.md. Add docs/DECISIONS.tsv rows for the base choice and each trade.
5. Run every VERIFY step in the spec, including the verify-draft-day skill, every phone screenshot plus phone-form-sending.png, phone-form-kept.png and phone-desktop-board.png, the safety-fact proof and the stack probe against dd/p3-lessons (Mode F: also against dd/p3-lessons when it exists).
6. Open ONE pull request from dd/p4-phone into {{PR_BASE}} (base {{PR_BASE}}, NOT main) as a DRAFT, titled "Draft Day Pick 4: Phone War Room (SPEC 005)". The body starts with "Draft only. Do not merge, enable auto-merge, or mark ready for review." and includes: the mode and START; a synthesis note (base and why, swap result, each trade with its source branch, what was rejected and why); the VERIFY output; the screenshots; and the stack note "Stacked on the Pick 3 PR (dd/p3-lessons), which is stacked on #3 (dd/p2-timeline), #2 (dd/p1-film-room) and #1 (dd/scaffold). Merge after the Pick 3 PR. Shared files with Pick 3: src/ui/app.js (different functions), src/ui/index.html (different lines), the verify skill's SKILL.md and features/README.md, docs/DECISIONS.tsv." followed by the stack-probe output. If {{PR_BASE}} is dd/p2-timeline, add: "Retarget this PR to dd/p3-lessons once that branch exists; the box merge probe showed only docs/DECISIONS.tsv in common."
Rules: draft PR only; never mark it ready for review, never merge, never enable auto-merge, never deploy. Do not push to main, dd/scaffold, any dd/p1-*, dd/p2-* or dd/p3-* branch or any candidate branch, and do not force-push. Touch only this repository. Nothing related to KPD/kpdlawgroup or debt collection. Zero runtime dependencies, no network code.
End your final message with one dd-report block for dd/p4-phone plus a line "PR: #<number>".
```
After it finishes: `get_pull_request` → confirm `draft: true` and `base.ref == "{{PR_BASE}}"`. If it is not a draft, `set_pull_request_draft` draft=true; never change anything else. Log the PR number and head SHA.

## 4. Physical (verify the draft PR)
- action: `launch`
- repo: as above
- starting_ref: `dd/p4-phone`
- title: `Draft Day P4 Phone · physical`
- files: `file:///workspace/tokenmax/poteto-pipeline/SPEC-005-phone-war-room.md` and the five `fixtures/phone/*` files
- model: omit

Prompt:
```
You are the verifier for draft PR #{{PR}} (branch dd/p4-phone, head {{HEAD_SHA}}) in this repo, built from SPEC 005 (uploads/SPEC-005-phone-war-room.md), Mode S with START e242a533d04d68a5a4472bce283eb06866e79d96. CI green is an input, not a verdict.
Run npm test, npx tsc --noEmit, selftest and doctor, and check sha256sum test/fixtures/phone/* against the spec. Then run the repo's .cursor/skills/verify-draft-day skill and drive every journey in features/phone.md: the Big Board and the close pick's page through test/fixtures/phone/cdp-shot.mjs at 390x844 and 430x932 in light and dark (paste every JSON line; each must be "ok":true with "offOrigin":[]), Mode S also #/lessons?since=2026-10-11&until=2026-10-16 after seed-lessons, the New pick form on a phone (Sending… held in flight, then a refused target whose error sentence and idea survive a live update caused by dd record), and the 1280x800 Big Board still a five-column table. Save every screenshot the spec names under /opt/cursor/artifacts/war-room/. Prove the spec's safety fact by running code (certainty 4 or 5) and paste the output.
Do not change product code. If something fails, report it; do not fix it.
Rules: draft PR only; never mark it ready for review, never merge, never enable auto-merge, never deploy. Do not push to any branch. Touch only this repository. Nothing related to KPD/kpdlawgroup or debt collection. No network code, no new dependencies.
End your final message with exactly one dd-verdict block {prNumber, headSha, verdict, ledger, certainty, evidence, fixLoops} keyed to the head SHA you verified.
```
- **VERIFIED** at the PR's current head → confirm `draft: true` once more and log it. Save the phone screenshots into `runs/p4/screens-final/` for the reveal. **No message to Boyd now** (the quiet rule; the Thursday reveal carries it): the reveal names the PR link, the mode, the base cand and its angle, the swap result, the trades, a light and a dark 390 px screenshot, and the stack order (#1 ← #2 ← #3 ← Pick 3 ← this).
- **NOT_VERIFIED / INCONCLUSIVE** → `reply` (mode queue) to the **graft** agent with the verdict's evidence: `Fix these on dd/p4-phone, keep the PR a draft, stay inside the touch map, re-run VERIFY, end with a dd-report: …`. Then rerun step 4. At most 2 fix loops. After that the pick fails, the PR stays a draft, and Grok Bot asks Boyd before touching the title.

## 5. Logging
Every launch, finish, judgement, calculator result, oracle spot-check, second read, trade list, PR number and verdict gets a `./log.sh <phase> <decision> <why> <evidence> <result>` row. The phases are combine, judging, grafting and physical. Prefix decisions with `p4` so they don't blur with Pick 1-3 rows written the same weekend, and put the mode (S or F) in the first `combine` row.

## Open risks (read before launch)
- **Pick 3's winner is unknown.** In Mode S the spec's W5/W18 baselines depend on which `lessons.css` the graft kept: 1 literal from `-a`, 0 from `-b`, 1 from `-c`, or a mix. Precondition 5 re-measures them. Candidates read their own tree, so a different count changes only the baseline, not the requirement.
- **Mode F leaves the Locker Room unthemed.** Two of three Pick 3 candidates hard-code one dark color, and all three have sub-44 px links. After both PRs merge, the Locker Room in light mode can show a dark pill on a light page. This is a one-file follow-up to `lessons.css` (tokens plus a 480 px size block) after both merge, already measured (`runs/p4/phone-calc-S-*.txt`, `runs/p4/probe-matrix.txt` `S*`/`p3*` rows). Do not fold it into either PR.
- **Merge order is fixed.** The Pick 3 PR must land before this PR. If Boyd rejects Pick 3, retarget to `dd/p2-timeline` (Mode F branches need nothing else; Mode S branches need a rebase that drops the `lessons.css` hunk).
- **Chrome is not Safari.** `cdp-shot.mjs` emulates an iPhone in headless Chrome (UA, DPR 3, touch, `prefers-color-scheme`). It does not run WebKit. The harness models iOS Safari's lost focus after a tap, but real-device quirks (the 16 px focus zoom, safe-area insets in landscape) are only approximated. Ask Boyd to open the War Room on his phone once at reveal time; nothing in the pipeline claims real-device proof.
- **Cloud VM tooling.** `cdp-shot.mjs` needs Chrome and a global `WebSocket` (Node 22, or Node 20 with `--experimental-websocket`). If a VM lacks Chrome, the journey gate fails as INCONCLUSIVE (environment), not as a product failure. The relaunch rule applies once.
- **The box reference build exists only to prove the spec is satisfiable** (`runs/p4/ref`, 53/53, 0 problems, every probe ok). It is never attached to an agent and never pushed.
- **No `dd/p1-film-room-judge`, `dd/p2-timeline-judge` or `dd/p3-lessons-judge` branch exists on the remote** (Sat Oct 17, 2:30 PM ET). Pick 4's judge creates `dd/p4-phone-judge` fresh, and the grafter's step 3 needs it to exist when it runs.
