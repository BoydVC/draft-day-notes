# Ready-to-run launch: Pick 9, Swap-bias meter (SPEC 010), 3-candidate arena

Mirrors `LAUNCH-009.md`. Written Tue Oct 20, 2026, about 10:15 AM ET. Driven by hand by Grok Bot (no clones on the box):
- Selection math: `node tools/filmroom-calc.mjs SPEC-010-rubric.json …`.
- Swap numbers: `fixtures/swap/swap-harness.mjs`; expected rows by `node tools/swap-expected-gen.mjs`; engine cross-check `bun tools/swap-engine-ref.ts runs/p9/start fixtures/swap` → `9/9` rows + `3/3` mutations.
- Candidate check: `tools/mirror.sh <sha> runs/p9/c<N>` (read-only contents API) then `bun tools/swap-calc.ts runs/p9/c<N>` → `swap-calc 30/30` expected (9 rows × swapFor/full shape/text block + name parity + constants + registry). At START it crashes (no `swap`): fail-to-start.
- Sanctioned test edit simulated on a scratch copy of START (`runs/p9/sanctioned-test-edits.diff`): 7 fail without (B1, B2, B5, B7, B8, B9, B13), all pass with (362 pass + 2 box-only env failures, tsc 0).

Model: **omit on every launch**. Budget: 3 candidates, 1–2 judge passes, 1 graft, 1 physical, at most 1 relaunch each and 2 fix replies. **Cursor-pool launches must start by ~6:15 PM ET Tue Oct 20 (pool resets ~7:20 PM ET).**

**START_REF = `dd/p10-polish`, START = `f538403f4271eef15b25b35f113ba81a6b23d54d` (draft PR #12; independent physical `bc-a9501b68` running at launch, 364/364 tests so far).** #12 did not touch `src/core/bigboard.ts`, `src/ui/bigboard.*`, `src/core/index.ts` or `test/bigboard*`; if a #12 fix loop moves the head, the graft merges it (expected conflicts: none or `docs/DECISIONS.tsv`).

**PR base for the graft: `dd/p10-polish`.** Pick 9 pushes only `dd/p11-swap-bias*` branches.

## 0. Preconditions (checked 10:10 AM ET)
1. `dd/p10-polish` head `f538403` ✔; PRs #1–#12 open drafts ✔; no `dd/p11*` branch ✔.
2. `tools/make-copies.sh SPEC-010-swap-bias` → `ok: candidate 213, judge 228, full 238` ✔.
3. Oracle 9/9 + 3/3 ✔. Sim ✔.

## 1. Combine
Common: action `launch`; repo `https://github.com/BoydVC/draft-day`; starting_ref `dd/p10-polish`; model omit.
files (7): `SPEC-010-swap-bias.candidate.md` + `fixtures/swap/{models.jsonl, hostile.jsonl, expected.json, swap-harness.mjs, swap-harness.d.mts, README.md}`. **Never** attach the full spec, judge copy, rubric JSON, tools, runs or this file.

| Cand | title | branch | angle |
|---|---|---|---|
| c1 | `Draft Day P9 Swap bias · c1 bias ledger` | `dd/p11-swap-bias-a` | Bias ledger (data first, named phases, plain lists) |
| c2 | `Draft Day P9 Swap bias · c2 flip gauge` | `dd/p11-swap-bias-b` | Flip gauge (glance first, leader tile + CSS meter) |
| c3 | `Draft Day P9 Swap bias · c3 evidence trail` | `dd/p11-swap-bias-c` | Evidence trail (details per model/pick, table at 1280) |

Prompt: `runs/p9/prompt-candidate.txt` with `{{BRANCH}}` / `{{ANGLE}}` filled (`runs/p9/prompt-c{1,2,3}.txt`).

### On each candidate finish
1. dump → `runs/p9/c<N>-final.md`; extract `dd-report`; branch head = `headSha`.
2. `gh api 'repos/BoydVC/draft-day/pulls?head=BoydVC:dd/p11-swap-bias-<x>&state=all'` → none (or draft; never close/merge).
3. `gh api repos/BoydVC/draft-day/compare/f538403…<sha> --jq '.files[].filename'` vs touch map.
4. `tools/mirror.sh <sha> runs/p9/c<N>`; `bun tools/swap-calc.ts runs/p9/c<N>`; `(cd runs/p9/c<N>/test/fixtures/swap && sha256sum *)`; `diff -u runs/p9/start/test/bigboard.pooled.test.ts runs/p9/c<N>/test/bigboard.pooled.test.ts` = the two sanctioned lines; `git`-free diff of filmroom/score/reducer = empty; look at `stats-swap-390-dark.png` (gh api raw → Read).
5. Log `./log.sh combine "p9 finished cN" "head <sha7>, tests <n>, swap-calc <x>/30, 8 screens" "<bc-…>" "finished"`.
6. When all settled: ≥2 finished → judge; 1 → walkover graft; 0 → fail.

## 2. Judge pass 1: A = c3 (c), B = c1 (a), C = c2 (b). Pass 2 (reversed): A = c2 (b), B = c1 (a), C = c3 (c).
Title `Draft Day P9 Swap bias judge · pass 1`, files = judge copy + 6 fixtures, prompt `runs/p9/prompt-judge1.txt`. Pass 2 only on a close call (`needSecondPass`), unchanged pooled file, push nothing, prompt `runs/p9/prompt-judge2.txt`.
## 3. Graft → `dd/p11-swap-bias`, ONE draft PR into `dd/p10-polish` titled "Draft Day Pick 9: Swap-bias meter (SPEC 010)". Files: full spec + 6 fixtures + `runs/p9/film-room-result.md`.
## 4. Physical on the new PR head (same verifier format as LAUNCH-009 §4 / PR #11 verify). NOT_VERIFIED → reply queue to the graft agent (max 2).

## STATUS
(updated as the pick runs)
- **Tue Oct 20 ~10:06 AM ET: LAUNCHED** c1 `bc-2d16817b-f093-5e89-83c7-0b5e3b18c276` (a, bias ledger), c2 `bc-349d7c3b-91c0-5a55-8bf8-9625d937ba5b` (b, flip gauge), c3 `bc-7758d5eb-2944-512d-9762-4167f4e120e3` (c, evidence trail). NEXT: §1 on each finish → judge pass 1.
