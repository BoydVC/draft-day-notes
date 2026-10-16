# Ready-to-run launch: Pick 6, Scouting Report linter (SPEC 007), 3-candidate arena

Mirrors `LAUNCH-006.md`. Written Sun Oct 18, 2026, about 9:45 AM ET. It can launch as soon as the parent run says go. Like Picks 1–5, Pick 6 is driven **by hand**. The `dd` CLI is not on the box (no clones, ever), so Grok Bot plays the driver:
- It does the selection math with `tools/filmroom-calc.mjs SPEC-007-rubric.json …`.
- It checks the lint numbers with one box-side oracle, `tools/linter-check.mjs` (run with **node**: `node tools/linter-check.mjs` against `fixtures/linter`, or `node tools/linter-check.mjs <repo-root>` once a candidate has committed `test/fixtures/linter/`).

It reads branch files with `gh api repos/BoydVC/draft-day/contents/<path>?ref=<sha> -H 'Accept: application/vnd.github.raw'` (read only) and never clones. Model: **omit on every launch** (Boyd has not named one). Budget: 3 candidates, 1–2 judge passes, 1 graft and 1 physical = 6–7 runs, plus at most 1 relaunch per candidate and 2 fix replies. **Nothing in this file has been launched.**

**READY PATH (Sun Oct 18, 9:45 AM ET): `START_REF = dd/p5-replay`, `START = d1bd73c075173336f2d3a15b3a2ee288163b7b32` (draft PR #7, physical VERIFIED). Oracle on fixtures 14/14 (`runs/p6/oracle-fixtures.txt`); START mirror has no linter fixtures (baseline 0). The prompts below have START filled in.** Re-run step 0 only to confirm `dd/p5-replay` is still at `d1bd73c`. If it moved, redo steps 0.4–0.5 and the spec numbers before launch. There is one mode only: Pick 6 always sits on Pick 5.

**PR base for the graft: `dd/p5-replay`** (the Pick 5 PR branch). Pick 6 pushes only `dd/p6-linter*` branches. Never pause, relaunch or reply to a Pick 1–5 agent from this file.

**The three Pick 4/5 lessons are built in:**
- **W19.** The touch map pre-declares the grafter-only paths: `docs/SPEC-007-scouting-linter.md`, `test/linter.pooled.test.ts` and replacement `docs/screens/p6-linter/*.png`.
- **W8 at 1280.** S16 requires ≥44×44 Linter controls and links at every width, 1280 included.
- **Screenshots.** Eight PNGs are committed under `docs/screens/p6-linter/` and listed in the `dd-report` and the PR body. Artifact links are not relied on.

## 0. Preconditions (read-only checks, at launch time)
1. **The base is still where the spec says.** cursor-github `get_branch` owner=BoydVC, repo=draft-day, branch=`dd/p5-replay` → head `d1bd73c075173336f2d3a15b3a2ee288163b7b32` (verified Sun Oct 18, 9:45 AM ET). Then `list_pull_requests` head=`BoydVC:dd/p5-replay` → one open PR (#7) with `draft: true` and base `dd/p4-phone`. LOG.tsv shows its physical VERIFIED (Sat ~8:49 PM ET).
   - **If the head moved:** run `compare_commits` base=`d1bd73c…` head=`dd/p5-replay`. If the change touches `src/ui/*`, `src/server/http.ts`, `src/core/*`, `src/report/parse.ts`, `test/phone*.test.ts`, `test/guards.test.ts`, the verify skill, or `test/fixtures/{phone,replay}/*`, **stop**: refresh `runs/p6/start/`, re-derive baselines, rerun `./tools/make-copies.sh`. Otherwise put the new head in the prompts as `START` and log it.
   - **If a Pick 5 fix loop is open**, wait for it to settle.
2. **No run in progress:** `list_branches` returns no `dd/p6-linter*` branch. (Sun Oct 18, 9:45 AM ET: none.)
3. **The stack below is intact:** `get_pull_request` #7 → `draft: true`, base `dd/p4-phone`, not merged; #6 → draft, base `dd/p3-lessons`.
4. **Copies are clean:** `./tools/make-copies.sh` must print `ok:` for SPEC-002 through SPEC-006 and for `SPEC-007-scouting-linter` (candidate 232 lines, judge 247, full 257), then a final `ok`.
5. **The oracle agrees:** `node tools/linter-check.mjs` → `TOTAL 14/14`. `node tools/linter-check.mjs runs/p6/start` → exits 2 (no fixtures at START).
6. **Usage:** on-demand still disabled. Cursor Models pool resets about **Mon Oct 19, 8 PM ET**.

## 1. Combine: three candidate launches (send all three in one turn)
Common parameters for c1, c2 and c3:
- action: `launch`
- repo: `https://github.com/BoydVC/draft-day`
- starting_ref: `dd/p5-replay`
- files (13, in this order):
  - `file:///workspace/tokenmax/poteto-pipeline/SPEC-007-scouting-linter.candidate.md`
  - `file:///workspace/tokenmax/poteto-pipeline/fixtures/linter/good-replay.json`
  - `file:///workspace/tokenmax/poteto-pipeline/fixtures/linter/good-lessons.json`
  - `file:///workspace/tokenmax/poteto-pipeline/fixtures/linter/good-markdown.md`
  - `file:///workspace/tokenmax/poteto-pipeline/fixtures/linter/hostile-collide-angles.json`
  - `file:///workspace/tokenmax/poteto-pipeline/fixtures/linter/hostile-missing-ears.json`
  - `file:///workspace/tokenmax/poteto-pipeline/fixtures/linter/hostile-ungradeable.json`
  - `file:///workspace/tokenmax/poteto-pipeline/fixtures/linter/hostile-markup.json`
  - `file:///workspace/tokenmax/poteto-pipeline/fixtures/linter/hostile-soft.json`
  - `file:///workspace/tokenmax/poteto-pipeline/fixtures/linter/expected.json`
  - `file:///workspace/tokenmax/poteto-pipeline/fixtures/linter/linter-harness.mjs`
  - `file:///workspace/tokenmax/poteto-pipeline/fixtures/linter/linter-harness.d.mts`
  - `file:///workspace/tokenmax/poteto-pipeline/fixtures/linter/README.md`
  - These are the copy with no rubric and no angles, plus the twelve fixtures. **Never** attach any of these to a candidate: `SPEC-007-scouting-linter.md`, `.judge.md`, `SPEC-007-rubric.json`, `SPEC-007-review.md`, `tools/linter-check.mjs`, `runs/p6/*` or this file.
- model: omit

| Cand | title | branch (in prompt) | ANGLE line (in prompt) |
|---|---|---|---|
| c1 | `Draft Day P6 Linter · c1 rule ledger` | `dd/p6-linter-a` | Rule ledger: start from the three check families; src/core/linter.ts is one registry of rules (gradeability, EARS, angles) checked with satisfies so a new rule fails tsc until its row is complete; one pure lintScoutingReport, thin CLI and POST /api/lint-scout, and a minimal panel that renders the JSON with the binding DOM names; table-driven tests drive every fixture through the harness expectedFor. |
| c2 | `Draft Day P6 Linter · c2 scout checklist` | `dd/p6-linter-b` | Scout checklist: start from the War Room; the Linter panel reads like a scout's clipboard: a big pass/fail chip, three checklists (rubric, EARS, angles) with severity chips, paste-and-Lint on the phone in one thumb-reach stack (safe-area aware); tokens only, both schemes; transitions only inside @media (prefers-reduced-motion: no-preference); paused on any 390 px dark screenshot, a stranger can say pass or fail, which EARS are MISSING, and whether angles collide. |
| c3 | `Draft Day P6 Linter · c3 coverage matrix` | `dd/p6-linter-c` | Coverage matrix: start from the matrices; EARS×checks as a coverage grid and angles as a pairwise score matrix (cells at least 44x44 on desktop; stacked definition lists on phone); collision and MISSING cells marked aria-invalid / aria-current; VoiceOver order summary, paste, rubric, EARS, angles, hard, soft; extra chrome never breaks the binding DOM or the probe. |

Prompt (identical except `{{BRANCH}}` and `{{ANGLE}}`; START is already filled in):
```
Build SPEC 007 (uploads/SPEC-007-scouting-linter.candidate.md) in this repo. The twelve fixtures it names are in uploads/; commit each byte-identical under test/fixtures/linter/ and do not edit them. Pick 4's test/fixtures/phone/* and Pick 5's test/fixtures/replay/* are already in the repo; use them unchanged where needed.
Your starting ref is dd/p5-replay at commit d1bd73c075173336f2d3a15b3a2ee288163b7b32 (already checked out). Wherever the spec says START or START_REF, use exactly these. It is the top of a draft stack (dd/scaffold, dd/p1-film-room, dd/p2-timeline, dd/p3-lessons, dd/p4-phone, dd/p5-replay); push your work to a new branch named {{BRANCH}}. Read docs/ARCHITECTURE.md, docs/SPEC-001.md through docs/SPEC-006-replay.md and AGENTS.md first; SPEC 007 wins where they differ. The spec's touch map is binding. Do not edit a do-not-touch file, and do not create the grafter-only paths (docs/SPEC-007-scouting-linter.md, test/linter.pooled.test.ts).

Your angle (other agents are building the same spec from different angles; stay true to yours):
{{ANGLE}}

Rules:
- Draft PR only, and for this run open NO pull request at all: push your branch and stop. If your environment opens one automatically, it must be a DRAFT with base dd/p5-replay, and you say so in your report.
- Never mark any PR ready for review, never merge, never enable auto-merge, never deploy or publish anything.
- Do not push to main, dd/scaffold, any dd/p1-*, dd/p2-*, dd/p3-*, dd/p4-* or dd/p5-* branch, and do not force-push.
- Touch only this repository (BoydVC/draft-day). Nothing related to KPD/kpdlawgroup or debt collection.
- Zero runtime dependencies and no network code; test/guards.test.ts stays byte-identical; src/server/http.ts changes only on the static files line plus POST /api/lint-scout; no web fonts, other-origin assets, localStorage, sessionStorage, cookies or history writes.
Run every VERIFY step in the spec, including updating and executing the verify-draft-day skill (seed-linter, the fail/pass probes, the pick-page Lint link, the paste journey). Save screenshots under /opt/cursor/artifacts/war-room/ AND commit the eight the spec names under docs/screens/p6-linter/.
End your final message with exactly one dd-report block for {{BRANCH}} as described in the spec (the eight committed screenshot repo paths in "screenshots"), then START, what works, what does not, the screenshot paths, the probe JSON lines, the safety-fact proof output, the stack-probe output, and open questions.
```

After the launches, write one LOG.tsv row per candidate: `./log.sh combine "p6 launched c1 rule ledger" "START d1bd73c" "<agent id>" "running"`.

### On each candidate finish (revival)
1. `CloudAgent dump` → `tail -n 1` the transcript; save to `runs/p6/c<N>-final.md`.
2. Extract the `dd-report` block. `get_branch` → branch exists and head equals `headSha`. Missing report or branch = **error**.
3. If a PR exists and is not a draft, flip with `set_pull_request_draft` draft=true and log a lesson.
4. Touch-map check: `compare_commits` base=`d1bd73c075173336f2d3a15b3a2ee288163b7b32` head=`{{BRANCH}}`. Note do-not-touch edits for the judge's second read (stack penalty, not error).
   - Box spot-check (no clone):
     ```
     H=<headSha>; N=<1|2|3>; D=runs/p6/c$N; rm -rf $D && mkdir -p $D/test/fixtures/linter $D/screens $D/src/ui $D/src/core $D/src/server $D/src/report $D/src/cli
     for f in src/ui/app.js src/ui/index.html src/ui/linter.js src/ui/linter.css src/server/http.ts src/core/linter.ts src/core/index.ts src/report/parse.ts src/cli/dd.ts; do
       gh api "repos/BoydVC/draft-day/contents/$f?ref=$H" -H 'Accept: application/vnd.github.raw' > "$D/$f" 2>/dev/null || true
     done
     for f in $(gh api "repos/BoydVC/draft-day/contents/test/fixtures/linter?ref=$H" --jq '.[].name'); do
       gh api "repos/BoydVC/draft-day/contents/test/fixtures/linter/$f?ref=$H" -H 'Accept: application/vnd.github.raw' > "$D/test/fixtures/linter/$f"
     done
     for f in $(gh api "repos/BoydVC/draft-day/contents/docs/screens/p6-linter?ref=$H" --jq '.[].name' 2>/dev/null); do
       gh api "repos/BoydVC/draft-day/contents/docs/screens/p6-linter/$f?ref=$H" -H 'Accept: application/vnd.github.raw' > "$D/screens/$f"
     done
     node tools/linter-check.mjs "$D" | tail -1
     (cd "$D/test/fixtures/linter" && sha256sum *)
     ls "$D/screens" | wc -l
     ```
     Expect `TOTAL 14/14`, twelve sha256 values equal to the spec's, and 8 screenshots.
5. Error once → one relaunch. Error twice → drop it.
6. Log `p6 finished cN` with headSha, test count, oracle total and screenshot count.

When all three are settled: ≥2 finished → Film Room; exactly 1 → walkover (skip 2–3, physical opens DRAFT PR into dd/p5-replay); 0 → pick fails (`no_candidates`).

## 2. Film Room judge, pass 1
Fixed label maps (also in `SPEC-007-rubric.json`):
- Pass 1: **A = c1 (a), B = c2 (b), C = c3 (c)**
- Pass 2 (reversed): **A = c3 (c), B = c2 (b), C = c1 (a)**

Parameters: action `launch`, repo `https://github.com/BoydVC/draft-day`, starting_ref `dd/p5-replay`, title `Draft Day P6 Linter judge · pass 1`, files = judge copy + twelve fixtures, model omit.

Prompt (fill `{{SHA_A}}` etc. from pass-1 map):
```
You are the Film Room judge for SPEC 007 (uploads/SPEC-007-scouting-linter.judge.md), pass 1. You score; you do not build the feature. The twelve fixtures are in uploads/ (sha256 in the spec). START_REF is dd/p5-replay and START is d1bd73c075173336f2d3a15b3a2ee288163b7b32.

Candidates, anonymized. Refer to them ONLY by label, never by branch name, commit message or author:
- Label A: commit {{SHA_A}}
- Label B: commit {{SHA_B}}
- Label C: commit {{SHA_C}}
Fetch each by SHA and give each its own worktree. Do not look up which branch a SHA belongs to.

Do this, in order:
1. Write ONE black-box test file, test/linter.pooled.test.ts, from ACCEPTANCE lines S1-S14, using only the uploaded fixtures (committed under test/fixtures/linter/ byte-identical), linter-harness.mjs, src/ui/ as text, and src/server/http.ts + src/core/index.ts as entry points. Derive expected values from expected.json and the harness, not from any candidate's output. Commit it on a new branch dd/p6-linter-judge started from dd/p5-replay and push that branch. That is the only thing you may push.
2. For each label, record hard gates: build = npx tsc --noEmit exit 0; tests = its own npm test exit 0; journey = verify-draft-day launches, control.sh seed-linter prints "seeded linter", and cdp-shot.mjs on the linter route at 390x844 dark prints "ok":true with scrollWidth <= 390, screenshot saved.
3. Only after gates are recorded, copy the same pooled file into each worktree and run it. Record passed/total (same total for every label).
4. For screen: cdp-shot fail and pass states at 390x844 and 1280x800 light and dark (8 runs), plus pick page at 390 dark. Paste ok, scrollWidth, problems, offOrigin; look at fail 390 dark and pass 1280 light yourself.
5. Measure diff vs d1bd73c075173336f2d3a15b3a2ee288163b7b32; check touch map.
6. Stack probe: merge-base --is-ancestor START <sha>; fetch dd/p5-replay; merge-tree if head moved.
7. Score every rubric criterion 0-4 with evidence. Do not reward length.
8. At most 2 trades per non-base label.

Rules: open NO pull request (draft only if forced, base dd/p5-replay). Never mark ready, never merge, never auto-merge, never deploy. Do not push to main, scaffold, p1–p5, or candidate branches. Touch only this repository. Nothing KPD/collections. Zero runtime deps.
End with exactly one dd-judgement block (one pass, labels only) plus rationale, probe lines, and stack-probe output.
```

### On judge finish
1. Save `runs/p6/judge-pass1.md`.
2. `node tools/filmroom-calc.mjs SPEC-007-rubric.json runs/p6/judge-pass1.md --risks c1=<n>,c2=<n>,c3=<n>`.
3. Grok Bot second read: compare_commits, re-run `node tools/linter-check.mjs runs/p6/c<N>` → `TOTAL 14/14`, look at screenshots, log agree/disagree.
4. `needSecondPass: true` → step 2b; else step 3.

## 2b. Film Room judge, pass 2 (only on close call)
Same as pass 1, title `Draft Day P6 Linter judge · pass 2 (reversed)`, labels from pass-2 map (A=c3, B=c2, C=c1). Step 1 becomes: use `dd/p6-linter-judge`'s pooled test unchanged; push nothing. First line: score from scratch; do not read any earlier judgement.

Then `node tools/filmroom-calc.mjs SPEC-007-rubric.json runs/p6/judge-pass1.md runs/p6/judge-pass2.md --risks …`. Write `runs/p6/film-room-result.md` for the grafter (START, base, runner-ups, trades, calculator output, swap, second read).

**Do not skip pass 2 on a close call.**

## 3. Trade (graft) → the one draft PR
`{{PR_BASE}}` = `dd/p5-replay`. Check with `get_branch` right before launch.
- action: `launch`; repo as above; starting_ref `{{BASE_BRANCH}}`; title `Draft Day P6 Linter · trade + draft PR`
- files: full SPEC-007 + twelve fixtures + `runs/p6/film-room-result.md`; model omit

Prompt:
```
You are the grafter for Draft Day Pick 6 (SPEC 007, uploads/SPEC-007-scouting-linter.md). Your starting branch {{BASE_BRANCH}} won the Film Room; uploads/film-room-result.md has the scorecard and the trade list. START_REF is dd/p5-replay and START is d1bd73c075173336f2d3a15b3a2ee288163b7b32. The twelve fixtures must stay byte-identical under test/fixtures/linter/.
1. Create branch dd/p6-linter from {{BASE_BRANCH}}.
2. Port each listed trade by hand; stay inside the touch map; keep one mental model.
3. Add test/linter.pooled.test.ts from dd/p6-linter-judge unchanged.
4. Commit uploads/SPEC-007-scouting-linter.md as docs/SPEC-007-scouting-linter.md. Add DECISIONS.tsv rows. Grafter-only paths only as the touch map allows.
5. Run every VERIFY step; re-shoot all eight screenshots under docs/screens/p6-linter/.
6. Open ONE DRAFT PR from dd/p6-linter into {{PR_BASE}} titled "Draft Day Pick 6: Scouting Report linter (SPEC 007)". Body starts with "Draft only. Do not merge, enable auto-merge, or mark ready for review." Include START, synthesis, VERIFY, Screenshots (blob URLs), and stack note stacked on #7 ← #6 ← #5 ← #3 ← #2 ← #1.
Rules: draft only; never ready/merge/auto-merge/deploy; no push to main/scaffold/p1–p5/candidates; BoydVC/draft-day only; nothing KPD; zero runtime deps.
End with one dd-report for dd/p6-linter plus "PR: #<number>".
```
Confirm `draft: true` and base `dd/p5-replay`. Log PR number and head SHA.

## 4. Physical (verify the draft PR)
- action: `launch`; starting_ref `dd/p6-linter`; title `Draft Day P6 Linter · physical`
- files: full SPEC-007 + twelve fixtures; model omit

Prompt:
```
You are the verifier for draft PR #{{PR}} (branch dd/p6-linter, head {{HEAD_SHA}}) built from SPEC 007 with START d1bd73c075173336f2d3a15b3a2ee288163b7b32. CI green is an input, not a verdict.
Run npm test, tsc, selftest, doctor, sha256sum fixtures. Drive features/linter.md (seed-linter, fail/pass probes, Lint link, paste journey). Prove the safety fact (certainty 4 or 5). Check touch map including grafter-only row.
Do not change product code. Draft only; never ready/merge/deploy; push nothing.
End with exactly one dd-verdict block {prNumber, headSha, verdict, ledger, certainty, evidence, fixLoops}.
```
- **VERIFIED** → confirm draft; copy screens to `runs/p6/screens-final/`; **no message to Boyd** (quiet rule).
- **NOT_VERIFIED / INCONCLUSIVE** → reply queue to graft (max 2 loops). W19-only miss → reply queue to physical re-check VERIFY 9 only (Pick 4 precedent).

## 5. Logging
Prefix decisions with `p6`. Phases: combine, judging, grafting, physical.

### LOG.tsv row templates
```
./log.sh combine "p6 launched c1 rule ledger" "START d1bd73c" "<bc-…>" "running"
./log.sh combine "p6 launched c2 scout checklist" "START d1bd73c" "<bc-…>" "running"
./log.sh combine "p6 launched c3 coverage matrix" "START d1bd73c" "<bc-…>" "running"
./log.sh combine "p6 finished cN" "head <sha>, tests <n>, oracle 14/14, 8 screens" "<bc-…>" "finished"
./log.sh judging "p6 judge pass 1 launched" "A=c1 B=c2 C=c3" "<bc-…>" "running"
./log.sh judging "p6 judge pass 1 done" "base …; closeCall …" "<bc-…>" "ok"
./log.sh judging "p6 second read" "agree|disagree: <note>" "-" "agree|disagree"
./log.sh judging "p6 judge pass 2 launched" "A=c3 B=c2 C=c1" "<bc-…>" "running"
./log.sh grafting "p6 graft launched" "base cN dd/p6-linter-x @<sha> -> dd/p6-linter, draft PR into dd/p5-replay" "<bc-…>" "running"
./log.sh physical "p6 physical launched" "PR #<n> @<sha>" "<bc-…>" "running"
./log.sh physical "p6 physical VERIFIED" "PR #<n> @<sha> certainty 5 fixLoops 0, still draft" "<bc-…>" "VERIFIED"
```

## Open risks (read before launch)
- **dd/p5-replay could move.** Step 0.1 and VERIFY 8 catch it.
- **Chrome is not Safari.** No real-device proof claimed.
- **Pre-existing 1280 W8 board/pick-page problems** stay out of scope.
- **PNG weight** ~1–3 MB accepted for reveal retrieval.
- **No full box reference War Room build**; lint rule proven by harness/oracle 14/14.
- **Cloud VM Chrome / WebSocket** may yield INCONCLUSIVE journey (environment); one relaunch.
- **NOTHING in this file has been launched.** No `dd/p6-linter*` branches at write time (Sun Oct 18, 9:45 AM ET).

> **R15 ruling (Oct 18):** see runs/p6/RULING-R15.md. Attach it to the judge (both passes), the grafter and the physical, and paste its bullet for that role into each prompt.
