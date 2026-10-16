# SPEC 010: Swap-bias meter (Pick 9)

The ninth arena. Three Cursor cloud agents build this spec on `BoydVC/draft-day`, each from its own angle, each starting from the **same starting ref**: `START_REF = dd/p10-polish` (draft PR #12) at `START = f538403f4271eef15b25b35f113ba81a6b23d54d`. The stack is `dd/scaffold` (#1) ← `dd/p1-film-room` (#2) ← `dd/p2-timeline` (#3) ← `dd/p3-lessons` (#5) ← `dd/p4-phone` (#6) ← `dd/p5-replay` (#7) ← `dd/p6-linter` (#8) ← `dd/p7-big-board` (#9) ← `dd/p8-season-ledger` (#10) ← `dd/p9-engine-hardening` (#11) ← `dd/p10-polish` (#12) ← this pick. The winning branch becomes a **draft** PR whose base is `dd/p10-polish`, not `main`. Read `docs/ARCHITECTURE.md`, `docs/SPEC-001.md` through `docs/SPEC-009-season-ledger.md`, `docs/SPEC-008-big-board.md` (the stats you extend) and `AGENTS.md` first. Where this spec and those files disagree, this spec wins for this PR.

The Film Room judges every close pick twice: pass 1 in one label order, pass 2 with the order reversed. When the two passes name different winners the pick is **flipped** and the tie rule picks the base. Published work on LLM judges (Zheng et al. 2023, *Judging LLM-as-a-Judge*; Wang et al. 2023, *Large Language Models are not Fair Evaluators*) reports position bias big enough that roughly a third to a half of close pairwise calls flip when the order is swapped. Draft Day already has the data: of the five real arena picks, Pick 3 and Pick 7 flipped (**2 of 5, 40%**). Nobody can see that today without reading logs. The **Swap-bias meter** adds one metric to the Big Board stats registry: how often the reversed pass flipped, which label positions win, the flip rate per judge model (or model pair), every judged pick's swap state, and a **read-only counterfactual**, "which picks would have no base under a strict *tie unless both passes agree* rule". It changes no selection math: the base every pick gets stays exactly what Film Room says.

It ships the way Pick 7's metrics did: one more row in `src/core/bigboard.ts`'s metric registry (`METRIC_IDS` gains `"swap"`, `BigBoardStats` gains `swap`), so `dd stats`, `dd stats --json`, `GET /api/stats` and the stats view at `#/stats` all get it from the same fold, with no new route, no new file in `src/ui/` and no wiring change.

Uploaded with this spec, all in `fixtures/swap/`. Commit each one **byte-identical** under `test/fixtures/swap/`. Write your tests against them and do not edit them:
- `models.jsonl`, sha256 `d95d27ab9937db43fad99c05c5c22e956a8e052157471dfc0600d4205549f2ce`. Nine picks (171 events), each a real Pick 3–7 log re-identified `p-20261020-01` … `-09` with one named change: judge models on both passes, a cross-family pair, one model spelled two ways, a single-pass pick, a flip with no pass-2 winner, a `selftest` pick, a pass with no model.
- `hostile.jsonl`, sha256 `a6f7d0d99f1412160a03afb5227f1408850ff8e58d24febb5ca68df3af3cfc86`. Six logs (115 events): `judgeModel` markup and `javascript:`, U+2028/U+0085/U+0007 and a 200-character name, non-string and blank names, a bad pick id, an `id mismatch` log.
- `expected.json`, sha256 `dd1957973deac807d809f4ec7de3540c73d679d620ae95e1d032dcecb72bd568`. Nine rows (`season`, `league`, `league-oct17`, `models`, `season-models`, `hostile`, `season-models-hostile`, `season-models-oct18`, `empty`): input files (repo paths, concatenated in order), window, fixed `now` and `expect` = `swapFor(swapOracle(…))`.
- `swap-harness.mjs`, sha256 `0c854f75a221135e16e6835e92db1b695afc7258fd39847d89bf55ea08d2651d`, and its types `swap-harness.d.mts`, sha256 `13abc8fe3a064ae693978cdbdc2649cac607bf14f4e5920653c8765d7d430adc`. The swap rule as plain JavaScript, independent of `src/` (it re-derives every pass winner from the event log): `EXCLUDED_SOURCES`, `DEFAULT_MODEL`, `MODEL_NAME_MAX`, `SWAP_STATES`, `ratio`, `percentText`, `judgeModelName`, `judgeModelKey`, `pairOf`, `readLogs`, `swapOracle`, `swapFor`, `swapText`, `swapHeadline`, `swapStrictLine`.
- `README.md`, sha256 `c255c0b72eb7378faf5e7a7d79318a15ab06a6ed62469903db8fd510d60f0215`. Provenance of every file above.

Two inputs are already in the repo at `START` and are read in place, unchanged: `test/fixtures/ledger/picks.jsonl` (the real Picks 3–7) and `test/fixtures/bigboard/league.jsonl` (Pick 7's 13-pick league). Pick 4's Chrome tools are used unchanged: `test/fixtures/phone/cdp-shot.mjs`, `probe.js` and `dom-harness.mjs`.

Every number below was produced by the harness. The harness was cross-checked **9/9** rows against the engine's own `reduce()` + `filmRoom()` at `START` (box script over a read-only mirror of the repo files, never cloned). At `START` there is no `swap` metric and no `test/fixtures/swap/` (fail-to-start: the oracle finds 0 fixtures). The touch map's two sanctioned test lines were applied to a scratch copy of `START` with a reference `swap` row wired into the registry and a placeholder section in `bigboard.js`: without them exactly **7** tests fail (`test/bigboard.pooled.test.ts` B1, B2, B5, B7, B8, B9, B13, all deep-equality against the Big Board oracle, which has no `swap` field); with them every test passes and `tsc --noEmit` exits 0.

Brief fields follow the pstack orchestrate brief template (GOAL, SCOPE, CONTEXT, ACCEPTANCE, VERIFY, TIMEBOX, FORBIDDEN, REPORT, STANDING).

## GOAL
Add the Swap-bias meter as one metric of the Big Board stats. Given the pick logs in the data directory and the stats window, `bigBoardStats(...).swap` returns a machine-readable `SwapStats`: judged picks, single-pass vs two-pass, consistent vs flipped and the flip rate, how many flips the tie rule settled, the strict-rule counterfactual, winner share by label position, the flip rate per judge model or model pair, and one row per judged pick. `bigBoardText` prints it as one block, `dd stats --json` and `GET /api/stats` carry it, and the stats view paints it. Boyd opens `#/stats` on his iPhone and within five seconds can say how often the reversed pass flipped the call and which picks would have no base under the strict rule.

## SCOPE
In:
- `src/core/bigboard.ts`: the `swap` metric. `DEFAULT_MODEL = "account default"`, `MODEL_NAME_MAX = 48`, `judgeModelName(value)`, the types below, `foldSwap` over the admitted book using `filmRoom()` (import from `./filmroom.ts`), a `swap` row in the metric registry (`METRIC_IDS` gains `"swap"` directly after `"verify"`), `BigBoardStats.swap`, and its text block. All swap logic lives here.
- `src/core/index.ts`: add the new names to the existing Big Board value and type export blocks.
- `src/ui/bigboard.js` and `src/ui/bigboard.css`: the Swap bias section (binding DOM below), painted from `stats.swap`.
- `test/swap.test.ts` (new), `test/fixtures/swap/*` (the 6 uploads, byte-identical), and the **two sanctioned lines** in `test/bigboard.pooled.test.ts` (touch map).
- `.cursor/skills/verify-draft-day/`: `features/swap-bias.md` (new), one bullet in `features/README.md`, one `## Drive` sentence and the `## Helpers` sentence in `SKILL.md`, and a `seed-swap` case in `helpers/control.sh`.
- `docs/screens/p11-swap-bias/*.png` (the eight screenshots VERIFY 6 names).
- `docs/DECISIONS.tsv` rows for non-obvious choices.

Out:
- Changing which base any pick gets. `src/core/filmroom.ts`, `score.ts`, `reducer.ts` and the tie rule are untouched; the strict rule is display-only.
- A new route, view file, API endpoint, CLI command or event type. Writing anything (the meter is a pure fold).
- Changing any existing Big Board number, line, attribute or section (angles, slots, trades, verify, stages, summary, skipped).
- Any runtime dependency, web font, icon, image, SVG/canvas built from data, anything loaded from another origin, viewport reads in JavaScript.
- Calling a model, reading a model's real identity from anywhere but `judgement_recorded.payload.judgeModel`.

### Touch map (binding; every shared file names the one hunk this pick may change)
| File | Pick 9 may | Earlier picks in the stack |
|---|---|---|
| `test/swap.test.ts`, `test/fixtures/swap/*` (the 6 uploads), `.cursor/skills/verify-draft-day/features/swap-bias.md`, `docs/screens/p11-swap-bias/*.png` (the 8 names in VERIFY 6) | create | none |
| `src/core/bigboard.ts` | add the swap constants, types, `judgeModelName`, `foldSwap`, the `swap` registry row and its text, `"swap"` in `METRIC_IDS` after `"verify"`, `swap` in `BigBoardStats` and in `bigBoardStats`'s return, and one `import { filmRoom } from "./filmroom.ts"` line. Do not change any existing fold, text function, gate, constant or type field | Pick 7 wrote it (#11 and #12 did not change it) |
| `src/core/index.ts` | add the new names inside the existing `from "./bigboard.ts"` value and type export blocks (keep them sorted as they are) | Picks 3–8 each appended a block |
| `src/ui/bigboard.js` | add the Swap bias section (and its helpers) inside `draftDayBigBoard`'s `dd-stats-grid`, directly after the `Verify pass rate` section; you may add one leader tile in `leaders()`; every other line stays | Pick 7 wrote it |
| `src/ui/bigboard.css` | append rules for the new section (tokens only) | Pick 7 wrote it |
| **Sanctioned test edit (exact text, proven by simulation)** `test/bigboard.pooled.test.ts` | after line 30 (`import { … } from "./fixtures/phone/dom-harness.mjs";`) insert `import { swapOracle } from "./fixtures/swap/swap-harness.mjs";`; line 149 `  return bigBoardOracle(input, window, now);` becomes `  return { ...bigBoardOracle(input, window, now), swap: swapOracle(input, window, now) } as BigBoardStats;`. Change nothing else in that file. Because that file deep-equals the whole stats object against the oracle, `SwapStats` must have **exactly** the harness's fields, nothing extra | Pick 7 judge wrote it |
| `.cursor/skills/verify-draft-day/SKILL.md` | one sentence appended to the existing `## Drive` bullet about `Stats` (the Swap bias section), and `seed-swap` added to the command list in the `## Helpers` sentence | Picks 1, 3–8 edited Drive/Helpers |
| `.cursor/skills/verify-draft-day/features/README.md` | insert ONE bullet directly after the `Big Board stats` bullet | Picks 1, 3–8 each inserted one |
| `.cursor/skills/verify-draft-day/helpers/control.sh` | one new `seed-swap)` case directly before `cleanup)`, and `seed-swap` added to the usage line | Picks 5–8 added seeds |
| `docs/DECISIONS.tsv` | append rows | every pick appends (**named shared hunk**, keep both sides) |
| **Grafter only (sanctioned, ordered by the orchestrator):** `docs/SPEC-010-swap-bias.md` (create), `test/swap.pooled.test.ts` (create, copied from `dd/p11-swap-bias-judge`), `docs/screens/p11-swap-bias/*.png` (replace with the grafter's own captures) | create / replace | Picks 3–8 grafts added the same kinds of path |
| `src/core/{filmroom,score,reducer,ledger,lessons,linter,timeline,next,transitions,budget,policy,ids,target,events,types}.ts`, `src/store/*`, `src/server/*`, `src/cli/*`, `src/report/*`, `src/briefs/*`, `src/ui/{app.js,index.html,styles.css,timeline.*,lessons.*,replay.*,linter.*,ledger.*}`, `test/fixtures/{fake-driver.ts,timeline/*,lessons/*,phone/*,replay/*,linter/*,bigboard/*,ledger/*}`, every other existing `test/*.test.ts` (and every other line of `test/bigboard.pooled.test.ts`), every other `features/*.md`, `README.md`, `AGENTS.md`, `package.json`, `targets.json`, `docs/SPEC-00[1-9]*`, `docs/screens/p[1-9]*`, `docs/screens/p10*` | **do not touch** | Picks 1–8 and #11/#12 own them |
| `test/guards.test.ts` | **never touch** | never touch |

If you believe a do-not-touch file must change, stop and write it under "Open questions" in your report instead of editing it.

## CONTEXT

### What the stack already has (anchors at `START` `f538403`)
| Where | What exists | What it means for this pick |
|---|---|---|
| `src/core/bigboard.ts` metric registry | `METRIC_IDS` `["logs","angles","slots","trades","verify","stages","summary"]`; `LEDGER` rows `{dom:{aria,row}, fold, text}`; `statContainers()`; `admit()` gives the counted book (gardener skip reasons, `EXCLUDED_SOURCES` `["selftest"]`, window on `pick_created.ts`) | The swap row is one more registry row: `dom: {aria: "Swap bias", row: "data-model"}`. `bigboard.test.ts` B15 already checks that `bigboard.js` contains every registry row's aria label and row attribute, so the view must carry both. The book you fold is the same admitted book the other metrics use. |
| `filmRoom(pick)` (`core/filmroom.ts`) | `{base, swap: "single" \| "consistent" \| "flipped", passes: [{pass, winner, lines: [{label, cand, …}]}], tieRule, …}` or `null` | **The only source of pass winners, labels and swap state.** A pick is *judged* when `filmRoom` returns non-null with a `base`. Do not re-walk events or re-score cards. |
| `reduce(...).judgement.passes[i].judgeModel` | optional string (reducer `text()` of the `judgement_recorded` payload) | The only source of the model name. Missing → `account default`. No real log names a model today, so the real season groups under `account default`. |
| `bigBoardText` | one block per registry row in `METRIC_IDS` order | Inserting `"swap"` after `"verify"` puts the Swap bias block between Verify pass rate and Time per stage. |
| `dd stats [--json]`, `GET /api/stats` | serialize `bigBoardStats(loadLogs, window)` | They carry `swap` with **no code change**. `judgeModelName` already replaces control and separator characters, so the JSON stays safe. |
| `draftDayBigBoard(stats, el)` (`bigboard.js`) | paints `dd-leaders`, the window form, `dd-stats-grid` sections, Skipped logs; pick links via `pickHref` (`p-YYYYMMDD-NN` only) | The Swap bias section goes in the grid after Verify pass rate. Reuse `pickHref`. |
| T18 / L18 / W5 / W11 / A15 | ban `innerHTML` and the like, color literals (W5 already reads `bigboard.css`), viewport reads, `fetch(` outside `app.js` | They already scan `bigboard.js`/`bigboard.css`; nothing to add. |
| `styles.css` (Pick 4) | tokens; phone ≥48 px buttons at ≤480 | Every new link/control ≥44×44 at every width in `bigboard.css`. |

### SwapStats (binding; `swapOracle` in the harness is this as code)
```ts
type SwapState = "single" | "consistent" | "flipped";
interface SwapLabelRow { label: string; wins: number; passes: number; rate: number | null }
interface SwapModelRow { key: string; name: string; picks: number; flipped: number; rate: number | null; pickIds: string[] }
interface SwapPickRow  { pickId: string; swap: SwapState; winners: (CandId | null)[]; base: CandId; models: string[] }
interface SwapStats {
  judged: number; single: number; twoPass: number; consistent: number; flipped: number; rate: number | null;
  tieRule: number; strict: string[]; labels: SwapLabelRow[]; models: SwapModelRow[]; rows: SwapPickRow[];
}
function judgeModelName(value: unknown): string;   // exported from core
// BigBoardStats gains: swap: SwapStats
```
**Exactly these fields, in this order, no extras** (the pooled Big Board test deep-equals the whole object). `rate` uses the Big Board's `ratio` (3 decimal places; `null` when the denominator is 0).

### The swap rule (binding)
| Step | Rule |
|---|---|
| Admit | The Big Board's admitted, windowed book (same skips, same `selftest` exclusion, same window). Picks in pick-id order. |
| Judged rows | For each admitted pick, `room = filmRoom(pick)`; keep it when `room` is non-null and `room.base` is set. Row: `pickId`, `swap = room.swap`, `winners = room.passes.map(p => p.winner)`, `base = room.base`, `models` = `judgeModelName` of each recorded pass's `judgeModel`, passes sorted by pass number. |
| Counts | `judged` = rows; `single` = rows with swap `single`; `twoPass` = the rest; `flipped` = rows with swap `flipped`; `consistent` = `twoPass − flipped`; `rate` = ratio(flipped, twoPass). |
| Tie rule | `tieRule` = rows whose `room.tieRule` is set (Film Room's own tie-rule record: flipped **and** both passes have a winner). |
| Strict counterfactual | `strict` = pick ids of every flipped row, in row order: under "tie unless both passes agree" these would have no base. Display only. |
| Labels | Over every pass view **with a winner**: each line's `label` gets `passes += 1`; the winner's label gets `wins += 1`. Rows for `A`…`E` in that order, only labels that appeared; `rate` = ratio(wins, passes). |
| Model names | `judgeModelName(v)`: not a string, or blank after trimming → `account default`. Otherwise collapse each whitespace run (`\s+`) to one space and trim, replace every U+0000–U+001F, U+007F–U+009F, U+2028, U+2029 with U+FFFD, cap at **48 code points**, `trimEnd`. Key = name lower-cased. |
| Models | Two-pass rows only. Pair key = `k1` when pass 1 and pass 2 keys are equal, else `"k1 + k2"` (pass order; not sorted). Display `name` = the first row's names (same rule). One `SwapModelRow` per key: `picks`, `flipped`, `rate` = ratio(flipped, picks), `pickIds` in row order. Sorted by `picks` descending, then `key` ascending. |
| Text | `swapText(swap)` exactly (harness): judged 0 → `Swap bias` / `  no judged picks`; else `Swap bias`, `  two-pass <n> · flipped <f> (<pct>) · single <s>`, `  tie rule settled <t>`, `  Strict rule (tie unless both passes agree): no base for <ids, or none>`, `  label wins A <w>/<p> <pct> · …`, then one `  <name> flipped <f>/<p> <pct>` per model row. `percentText` = Big Board percent (rounded, `—` for null). |

Worked examples (oracle-checked; `now` 2026-10-20T00:00:00Z):
- `season` (the real Picks 3–7) → judged 5, two-pass 5, flipped 2 (40%), tie rule settled 2, strict `p-20261017-93, p-20261018-97`, labels A 5/10, B 3/10, C 2/10, one model row `account default` 2/5. **Today's answer: the reversed pass flipped 2 of 5 real calls; a strict rule would have left Pick 3 and Pick 7 without a base.**
- `league` → judged 8, two-pass 6, flipped 1 (0.167). `league-oct17` (Since 2026-10-17) → 4, 4, 1 (0.25).
- `models` → judged 8 (the selftest copy excluded), two-pass 7, flipped 4 (0.571); `p-20261020-04`'s `"  Grok-4 "` + `"grok-4"` is one key `grok-4` displayed `Grok-4`; `p-20261020-07` is flipped but not tie-rule (no pass-2 winner) and still in `strict`; `p-20261020-09` pairs `grok-4 + account default`.
- `season-models` (what `seed-swap` serves) → judged 13, two-pass 12, flipped 6 (50%), tie rule 5; headline `Reversed pass flipped 6 of 12 two-pass picks (50%)`.
- `hostile` → judged 4, two-pass 4, flipped 2; markup names are text, `grok\u2028-4\u0085\u0007` becomes `grok\uFFFD-4\uFFFD\uFFFD`, the 200-x name is capped at 48, non-string and blank names are `account default`, the bad-id and id-mismatch logs are skipped (Big Board reasons).
- `season-models-hostile` (`seed-swap hostile`) → 17, 16, 8. `season-models-oct18` (Since 2026-10-18) → 5, 5, 3 (0.6). `empty` → judged 0, rate null, text `Swap bias` / `  no judged picks`.

### Stats view DOM (binding names; tests and probes read these)
| Node | Contract |
|---|---|
| root | one element with `aria-label="Swap bias"` inside the stats view, with `data-judged`, `data-two-pass`, `data-flipped`, `data-single`, `data-tie-rule` (numbers) and `data-strict` (`strict` joined with `,`) |
| headline | element `data-swap="headline"` holding `swapHeadline(swap)` exactly: `No judged picks yet` / `No two-pass picks yet` / `Reversed pass flipped <f> of <n> two-pass picks (<pct>)` |
| strict | element `data-swap="strict"` holding `swapStrictLine(swap)` exactly, present only when `twoPass > 0` |
| models | list `aria-label="Swap bias by judge model"`: one `li` per model row in order with `data-model="<key>"`, `data-picks`, `data-flipped`; text shows the name (as text) and `<flipped>/<picks>` |
| labels | list `aria-label="Winner by label"`: one `li` per label row with `data-winner-label`, `data-wins`, `data-passes` (not `data-label`: the board already uses that attribute) |
| picks | list `aria-label="Swap by pick"`: one `li` per row with `data-pick`, `data-swap` (the state word, also in text) and `data-base`; the pick id is an `a` to `#/picks/<id>` only when `pickHref` accepts it |
| states | the swap state is always a word in text; color (tokens only) is extra |

Everything else (tile, meter bar made of CSS boxes, headings, layout) is yours. Tokens only. No `innerHTML`. Every link ≥44×44 at every width.

### Report blocks
Candidate output (`x` is your branch letter):
````
```dd-report
{"branch":"dd/p11-swap-bias-x","headSha":"<40 hex>","summary":"...","commands":[{"cmd":"npm test","exit":0}],"tests":{"added":16,"passing":true},"screenshots":["docs/screens/p11-swap-bias/stats-swap-390-dark.png"],"risks":[]}
```
````
Judge output for one pass (labels only, never cand ids):
````
```dd-judgement
{"passes":[{"order":["A","B","C"],"cards":[{"label":"A","gates":{"build":"pass","tests":"pass","journey":"pass"},"crossTests":{"passed":30,"total":32},"diff":{"files":10,"added":500,"removed":5},"scores":[{"criterionId":"swap","score":4,"evidence":"node --test test/swap.pooled.test.ts: J1-J9 pass"}]}]}],"base":"A","runnerUps":["B","C"],"trades":[{"from":"B","what":"swap headline","pointers":["src/ui/bigboard.js:150-170"],"why":"reads the flip rate above the fold"}],"swapConsistent":null}
```
````

### Design sketch (usage first)
```
Boyd, phone in dark mode, on the Big Board, taps Stats, scrolls to (or sees a tile for) Swap bias:
  Swap bias
  [ Reversed pass flipped 6 of 12 two-pass picks (50%) ]
  Strict rule (tie unless both passes agree): no base for p-20261017-93, p-20261018-97, …
  Winner by label     A 12/24 · B 7/24 · C 5/24
  Swap bias by judge model
    account default              2/5 flipped
    claude-opus-4.5              2/2 flipped
    grok-4                       0/2 flipped
    …
  Swap by pick
    p-20261017-93  flipped     base c2
    p-20261017-94  consistent  base c1
    …
Grok Bot, after a reversed pass:   dd stats   → "Swap bias / two-pass 5 · flipped 2 (40%) · single 0 …"
```

<!-- ANGLES:BEGIN (orchestrator only; stripped from candidate and judge copies) -->
## ARENA ANGLES (orchestrator only: each candidate sees only its own angle in its launch prompt, and the judge sees none, so labels stay anonymous)
| Cand | Branch | Angle | What it should look like if done well |
|---|---|---|---|
| c1 | `dd/p11-swap-bias-a` | **Bias ledger.** Start from the data. `foldSwap` is a short pipeline of named pure phases over `filmRoom()` (judged rows → counts → label tallies → model pairs → strict list), each reading only the previous phase, with `judgeModelName` as one small table of replacement rules. The view is plain lists with the binding DOM names, no tile. Table-driven tests run every `expected.json` row through the public `bigBoardStats` and `swapFor`. | A reviewer ticks each phase against the swap-rule table row by row. Fewest lines in `bigboard.js`/`.css`. |
| c2 | `dd/p11-swap-bias-b` | **Flip gauge.** Start from Boyd glancing at his phone. A fourth leader tile `data-leader="swap"` shows the flip rate as a big number with a CSS meter (two token-colored boxes, widths from a `style` custom property, no SVG) and the headline sentence, so the answer is above the fold at 390 dark; the section repeats it with one meter per judge model and the strict line in plain words. Tokens only, both schemes, motion only inside `prefers-reduced-motion: no-preference`. | Paused on the 390 dark screenshot, a stranger can say how often the reversed pass flipped and that Picks 3 and 7 would have had no base, within five seconds. |
| c3 | `dd/p11-swap-bias-c` | **Evidence trail.** Start from proof: every number links to its picks. The models list and the per-pick list use `<details>` (closed by default, no JS state) whose bodies list each pick's pass winners with labels and judge models, linking to the pick page; at 1280 the per-pick list lays its `li` rows out as aligned columns under a labelled header line (CSS grid; the binding `li` rows stay), at ≤600 px the same DOM reflows to labeled stacked rows (CSS only). | Boyd or a reviewer can answer "which picks flipped under grok-4, and who won each pass?" without leaving the page; no sideways scroll at 390; binding DOM intact. |
<!-- ANGLES:END -->

<!-- RUBRIC:BEGIN (judge and orchestrator only; stripped from candidate copies) -->
## HIDDEN RUBRIC (Film Room judge only; never in a candidate prompt)
Score each criterion 0-4 with evidence (a command and its output, or `file:line`). Weighted mean over all six; weights total 13.

| id | Criterion | Weight | How to grade (0 = absent/wrong, 2 = partly, 4 = fully, proven) |
|---|---|---|---|
| `swap` | Swap fidelity on fixtures | 3 | Your pooled J1–J9. Then by hand: run `bigBoardStats` (public core export) on every `expected.json` row and compare `swapFor(stats.swap)` with the row and `stats.swap` deep-equal to `swapOracle`; run the three mutations (drop P3's pass 2 from `picks.jsonl`; set P4's pass-2 `judgeModel` to `grok-4`; swap the winner of P6's pass 2) and confirm each changes `swap` the way the harness says. 4 = all nine rows exact, full-object equality and all three mutations. One wrong row = 2 at most. Extra fields in `SwapStats`, a sorted pair key, or labels counted from passes without a winner = 1 at most. |
| `engine` | One source of truth | 2 | J7 and a read of `foldSwap`. 4 = winners, labels, swap state and tie rule come only from `filmRoom()` over `reduce()` (no second event walker, no re-scoring), model names only from `judgement.passes[].judgeModel`, text from the same `SwapStats`, and `dd stats --json`.swap equals `/api/stats`.swap. Harness code copied into `src/` = 2 at most. Any change to which base a pick gets = 0. |
| `screen` | Swap screens | 2 | Run `cdp-shot.mjs` on `#/stats` (after `seed-swap`) at 390×844 dark and light, 430×932 dark, 1280×800 light and dark, the hostile seed at 390 dark, the empty state, and the Since 2026-10-18 window (8 runs). 4 = every probe `ok: true`, `scrollWidth` ≤ width, `offOrigin` `[]`, every new link ≥ 44×44 at every width, the empty state reads `No judged picks yet` and the window reads `flipped 3 of 5`. 2 = one W7/W8/W9 problem left. 0 = sideways scroll at 390. Screenshots required for a 3 or 4. |
| `glance` | Bias at a glance | 2 | Look at the 390×844 dark screenshot yourself (`season-models` seed). 4 = without scrolling, or with one obvious scroll to a labelled section, you can read the flip rate (6 of 12, 50%) and which picks the strict rule would leave without a base; states are words. 2 = all there but needs hunting. 0 = raw JSON or numbers with no labels. |
| `safety` | Untrusted model names | 2 | Re-run the safety-fact proof with `hostile.jsonl` and your own extras (a `judgeModel` of `<svg onload=alert(1)>`, one of `https://evil.example/x`, a hand-built `SwapStats` row with pick id `p-20261020-77"><img src=x>`). Grep `src/ui/bigboard.*` for `innerHTML`, `outerHTML`, `insertAdjacentHTML`, `document.write`, `eval(`, `new Function`, `localStorage`, `sessionStorage`, `document.cookie`, `history.`, `@import`, `url(http`. Any off-origin request, markup from a model name, an href not from a valid pick id, a raw control character in `dd stats` output, or stored state = 0. |
| `stack` | Clean stack, small diff | 2 | `git diff --name-only START...<sha>` stays inside the touch map; any edit to a do-not-touch file (including any line of `test/bigboard.pooled.test.ts` beyond the two sanctioned ones, or any existing Big Board fold) caps this at 1. `git diff START -- src/core/filmroom.ts src/core/score.ts src/core/reducer.ts` empty. `git merge-base --is-ancestor START <sha>` holds; if `dd/p10-polish` moved, `git merge-tree` conflicts at most in `docs/DECISIONS.tsv`. Compare `diff.added + diff.removed` with the others (PNG files count as files, not lines). Zero runtime deps. |

Hard gates (the judge sets these per card): **build** = `npx tsc --noEmit` exit 0. **tests** = the candidate's own `npm test` exit 0. **journey** = the verify skill launches, `control.sh seed-swap` prints `seeded swap`, and `cdp-shot.mjs` on `#/stats` at 390×844 in dark prints `"ok":true` with `scrollWidth` ≤ 390, screenshot saved.

Pooled cross-tests: the judge writes one black-box file, `test/swap.pooled.test.ts`, from J1–J14, using only the uploaded fixtures, `swap-harness.mjs`, the existing `test/fixtures/{ledger/picks.jsonl,bigboard/league.jsonl}`, Pick 4's `dom-harness.mjs`, the files under `src/ui/` read as text, and the three entry points (`src/core/index.ts`, `src/cli/dd.ts`, `src/server/http.ts`). The judge commits it with the 6 fixtures on `dd/p11-swap-bias-judge` and runs that same file against every candidate after recording that candidate's gates. (`npm test` runs `test/*.test.ts`, so the pooled file must not be in the worktree during the **tests** gate.)

Selection (the orchestrator computes it from your scores with `tools/filmroom-calc.mjs`; score honestly, do not steer): gate-failing cards are out. Contenders are cards within 0.10 of the best pooled pass rate. The base is the highest weighted mean among contenders. A top two within 10% triggers a reversed second pass. A winner that flips between passes is settled by fewer diff lines, then fewer files, then fewer risks, then the lower cand id. Your own `base` is advisory and recorded as a disagreement when it differs.
<!-- RUBRIC:END -->

## ACCEPTANCE (EARS; each line names the test or journey that proves it)
Baselines were measured, not written by hand. At `START` `f538403` there is no `swap` metric and no `test/fixtures/swap` (0 fixtures). Against the uploads the oracle is **9/9** rows plus **3/3** mutations. Each line below must go from its baseline to passing.
- **J1** WHEN `judgeModelName` (core export) is given `undefined`, `42`, `{}`, `"   "`, `"\t"`, `"  Grok-4 "`, `"grok\u2028-4\u0085\u0007"`, `"a\n\n b"`, 200 `x`s and `<img src=x onerror=alert(1)>` THE SYSTEM SHALL return exactly what the harness's `judgeModelName` returns for each (`account default` ×5, `Grok-4`, `grok\uFFFD-4\uFFFD\uFFFD`, `a b`, 48 `x`s, the markup unchanged as a string), and `DEFAULT_MODEL`/`MODEL_NAME_MAX` SHALL be exported. (Baseline: no export.) → `test/swap.test.ts` "J1 model names"
- **J2** WHEN `bigBoardStats` runs on `test/fixtures/ledger/picks.jsonl` (via the harness's `readLogs`) THE SYSTEM SHALL return `swap` with judged 5, two-pass 5, flipped 2, rate 0.4, tieRule 2, strict `["p-20261017-93","p-20261018-97"]`, labels A 5/10, B 3/10, C 2/10, one model `account default` 2/5, and `swapFor(stats.swap)` equal to the `season` row. → "J2 real season"
- **J3** WHEN it runs on every row of `expected.json` (files concatenated, window, `now`) THE SYSTEM SHALL match `swapFor` of all nine rows exactly. → "J3 expected.json"
- **J4** WHEN it runs on every row THE SYSTEM SHALL return `stats.swap` deep-equal to `swapOracle(logs, window, now)` (same fields, same order, no extras). → "J4 full shape"
- **J5** WHEN it runs on `models.jsonl` THE SYSTEM SHALL key `p-20261020-04` under `grok-4` displayed `Grok-4`, pair `p-20261020-03` as `claude-opus-4.5 + grok-4` and `p-20261020-05` as `grok-4 + claude-opus-4.5` (pass order, not sorted), pair `p-20261020-09` as `grok-4 + account default`, count `p-20261020-06` as single and in no model row, exclude `p-20261020-08` (selftest), and count `p-20261020-07` as flipped and strict but not tie-rule. → "J5 models and pairs"
- **J6** WHEN, in `picks.jsonl`, (a) P3's (`p-20261017-93`) pass-2 `judgement_recorded` is dropped, (b) P4's (`p-20261017-94`) pass-2 payload gets `judgeModel: "grok-4"`, or (c) P6's (`p-20261018-96`) pass-2 card `C` (candidate `c1`, the pass-1 winner) gets `gates.tests: "fail"` THE SYSTEM SHALL change `swap` exactly as the harness does: (a) single 1, two-pass 4, flipped 1 (0.25), strict `[p-20261018-97]`, `account default` 1/4; (b) models `account default` 2/4 and `account default + grok-4` 0/1; (c) flipped 3 (0.6), tie rule 3, strict adds `p-20261018-96`. (Oracle: engine and harness agree 3/3.) → "J6 mutations"
- **J7** WHEN `bigBoardStats` runs on `season-models` THE SYSTEM SHALL agree, pick by pick, with rows built in the test from `filmRoom(reduce(events, now))` (public core exports): same `swap`, `winners`, `base`, and `tieRule` count; and no pick's `filmRoom(...).base` SHALL differ from START's behaviour (the base each pick gets is unchanged). → "J7 engine agreement"
- **J8** WHEN `bigBoardText` renders any `expected.json` row THE SYSTEM SHALL contain `swapText(stats.swap)` as one block directly after the Verify pass rate block and before the Time per stage block; every other block and the summary line SHALL be unchanged from `START` (the Big Board `expected.json` rows still pass); `statContainers()` SHALL include `{id: "swap", aria: "Swap bias", row: "data-model"}` after `verify`. → "J8 text and registry"
- **J9** WHEN `dd stats --json` and `GET /api/stats` run on a data dir holding `season-models` THE SYSTEM SHALL both carry `swap` equal to `bigBoardStats` of the same logs; WITH `--since 2026-10-18` / `?since=2026-10-18` it SHALL equal the `season-models-oct18` row; `dd stats` text SHALL contain the Swap bias block with no U+0000–U+001F (other than `\n`), U+007F–U+009F, U+2028 or U+2029. → "J9 CLI and API"
- **J10** WHEN `draftDayBigBoard(stats, el)` paints `season-models` (in a `vm` sandbox, as the Big Board tests do) THE SYSTEM SHALL render the binding DOM: root `Swap bias` with every data attribute equal to `stats.swap`, the headline and strict line exactly `swapHeadline`/`swapStrictLine`, one model `li` per model row in order, one label `li` per label row, one pick `li` per row; WHEN it paints `empty` THE SYSTEM SHALL show `No judged picks yet` and no strict line. → "J10 view"
- **J11** WHEN the `hostile` and `season-models-hostile` stats (plus a hand-built `SwapStats` with a model name `<svg onload=alert(1)>` and a row pick id `p-20261020-77"><img src=x>`) are painted THE SYSTEM SHALL create no `img`, `script`, `iframe` or `svg` node and no `on*` attribute; every hostile string SHALL appear as text; every `href` SHALL be `#/`, `#/stats…` or `#/picks/p-YYYYMMDD-NN`; the bad pick id SHALL get no link. → "J11 hostile text stays text"
- **J12** WHEN `src/ui/bigboard.js` and `bigboard.css` are read THE SYSTEM SHALL still contain no `fetch(`, no viewport reads, no color literals, no `innerHTML`/`eval`/`localStorage`/`history.`, and SHALL contain `"Swap bias"` and `data-model` (B15); `test/bigboard.pooled.test.ts` SHALL differ from `START` by exactly the two sanctioned lines. → "J12 source rules" + B15
- **J13** WHEN the stats view is probed with `cdp-shot.mjs` after `seed-swap` at 390×844 dark and light, 430×932 dark, 1280×800 light and dark, after `seed-swap hostile` at 390 dark, at `#/stats?until=2026-10-01` and at `#/stats?since=2026-10-18` THE SYSTEM SHALL print `"ok":true`, `"offOrigin":[]`, `scrollWidth` ≤ width, every new link ≥44×44, the empty state `No judged picks yet` and the window headline `Reversed pass flipped 3 of 5 two-pass picks (60%)`. → journeys `features/swap-bias.md` "swap-phone", "swap-desktop", "swap-hostile", "swap-empty", "swap-window"
- **J14** WHEN `npm test` runs after this change THE SYSTEM SHALL pass every earlier test (SPEC 001–009 suites, #11/#12 tests, import boundary, network grep, T18, L18, W1–W17, B1–B16 with the two sanctioned lines) with `test/guards.test.ts` byte-identical, zero runtime dependencies, the 6 uploads byte-identical (sha256 above), `test/fixtures/{phone,replay,lessons,timeline,linter,bigboard,ledger}/*` unchanged, `dd selftest` printing its `happy`, `policy`, `walkover` and `close` lines unchanged, and `git diff --name-only START...HEAD` inside the touch map. → full `npm test` + VERIFY 3, 5 and 9
- **J15** WHEN the verify skill's `features/swap-bias.md` is driven THE SYSTEM SHALL seed through `seed-swap`, produce the eight screenshots of VERIFY 6, commit them under `docs/screens/p11-swap-bias/`, and list their repo paths in the `dd-report` `screenshots` field. → journey "swap-phone"

## VERIFY (run all; paste results in your final message, and the grafter pastes them in the PR body)
1. `npm test` green; `test/swap.test.ts` names each test with its J-id.
2. `npx tsc --noEmit` exit 0.
3. `node --experimental-strip-types src/cli/dd.ts selftest` exit 0, printing `DATA_DIR=…` and the lines `happy … drafted`, `policy … failed`, `walkover … drafted`, `close … drafted`.
4. `node --experimental-strip-types src/cli/dd.ts doctor` output.
5. `sha256sum test/fixtures/swap/*`: all six must equal the values at the top of this spec. Run `git diff --quiet START -- test/guards.test.ts package.json targets.json src/core/filmroom.ts src/core/score.ts src/core/reducer.ts src/core/ledger.ts src/core/lessons.ts src/core/linter.ts src/core/timeline.ts src/store src/server src/cli src/report src/briefs src/ui/app.js src/ui/index.html src/ui/styles.css test/fixtures/phone test/fixtures/timeline test/fixtures/lessons test/fixtures/replay test/fixtures/linter test/fixtures/bigboard test/fixtures/ledger && echo untouched`. Paste `git diff START -- test/bigboard.pooled.test.ts` (exactly the two sanctioned lines) and `git diff --stat START -- src/core/bigboard.ts src/core/index.ts src/ui/bigboard.js src/ui/bigboard.css`.
6. Verify skill (update first, then execute once):
   - Write `features/swap-bias.md` (Sub-features `swap-phone`, `swap-desktop`, `swap-hostile`, `swap-empty`, `swap-window`; How to get to it; Driving it; Gotchas), add its bullet after `Big Board stats` in `features/README.md`, add the Drive sentence and `seed-swap` to `SKILL.md`, and add the `seed-swap` case to `control.sh`. `seed-swap` (no argument) writes every pick in `test/fixtures/ledger/picks.jsonl` and `test/fixtures/swap/models.jsonl` to `$DATA/picks/<id>/events.jsonl` (replacing those files, the way `seed-bigboard` does), checks that `GET /api/stats` has `swap.twoPass` 12, `swap.flipped` 6 and `swap.judged` 13, and prints `seeded swap`. `seed-swap hostile` then also writes `test/fixtures/swap/hostile.jsonl` (skipping lines whose pick id is not a safe directory name, i.e. not `p-YYYYMMDD-NN`), checks `swap.twoPass` 16 and `swap.flipped` 8, and prints `seeded swap hostile`. On any mismatch it prints what it got and says to run `control.sh cleanup` then `launch` first (other seeds add judged picks).
   - `control.sh cleanup`, `control.sh launch`, `control.sh doctor`. With `URL` from `/tmp/dd-verify/state.env` (source it), probe `#/stats?until=2026-10-01` at 390×844 dark (empty). Then `control.sh seed-swap`; probe `#/stats` at 390×844 dark and light, 430×932 dark, 1280×800 light and dark, and `#/stats?since=2026-10-18` at 390×844 dark. Then `control.sh seed-swap hostile`; probe `#/stats` at 390×844 dark. Paste each JSON line's `ok`, `scrollWidth`, `problems`, `offOrigin`. (The Swap bias section may be below the fold: take the shot after scrolling it into view with `--before` if your angle puts it there, and say so.)
   - Commit exactly these eight under `docs/screens/p11-swap-bias/` and list their repo paths in your report and the `dd-report` `screenshots` field: `stats-swap-390-dark.png`, `stats-swap-390-light.png`, `stats-swap-430-dark.png`, `stats-swap-1280-light.png`, `stats-swap-1280-dark.png`, `stats-swap-hostile-390-dark.png`, `stats-swap-empty-390-dark.png`, `stats-swap-window-390-dark.png`.
   - `control.sh cleanup`; confirm the screenshots still exist.
7. Safety fact (blast-radius, prove at certainty 4 = ran it): **"No judge-model string, angle or pick log (real, hostile, skipped or excluded) and no sequence of opening the stats view can make the War Room request anything off-origin, render a model name or pick id as markup, draw an `href` from anything but a valid pick id, or store anything in `localStorage`, `sessionStorage`, cookies or `history`; and the swap meter never changes which base any pick gets (`filmroom.ts`, `score.ts` and `reducer.ts` byte-identical to START, every pick's `filmRoom(...).base` unchanged)."** Prove it with a script or test that paints the `hostile` and `season-models-hostile` stats (plus the J11 hand-built `SwapStats`) through `draftDayBigBoard` with a DOM harness, asserts no `img`/`script`/`iframe`/`svg`/`on*`, every `href` allowed, no storage access; then compares every pick's base in `season-models` against the same fold at START (or against `git diff --quiet START -- src/core/filmroom.ts src/core/score.ts src/core/reducer.ts` plus J7). Paste the `offOrigin` field from the VERIFY 6 probe lines. Paste the output.
8. Stack probe: `git merge-base --is-ancestor START HEAD && echo on-stack`. Then `git fetch origin dd/p10-polish && git rev-parse FETCH_HEAD`. If that is not `START`, run `git merge-tree --write-tree --name-only HEAD FETCH_HEAD` and paste the result (conflicts should be at most `docs/DECISIONS.tsv`); otherwise write `START_REF unchanged`.
9. `git diff --name-only START...HEAD` pasted; every path must be allowed by the touch map (the two sanctioned lines and the grafter's three sanctioned kinds of path included).

## TIMEBOX
One run. If something is not done, push what passes and list the rest under "Not done". Do not stop at a plan.

## FORBIDDEN
- Draft PRs only. Never mark a PR ready for review, never merge, never enable auto-merge, never deploy or publish anything.
- Candidates open **no** pull request at all (push your branch only). If your environment opens one automatically, it must be a draft with base `dd/p10-polish`, and say so in your report.
- Touch only `BoydVC/draft-day`. Nothing KPD, kpdlawgroup, or debt-collection related, in code, fixtures, tests or examples.
- Do not push to `main`, `dd/scaffold`, `dd/p1-*` … `dd/p10-*`, and do not force-push.
- Do not edit a file the touch map marks do-not-touch, and do not edit any line of `test/bigboard.pooled.test.ts` beyond the sanctioned two.
- No runtime dependencies, no network code (the A15 guard stays as is), no secrets, no LLM calls, no web fonts or other-origin assets, no `localStorage`/`sessionStorage`/cookies/`history` writes.

## REPORT
End your final message with exactly one fenced `dd-report` block (format above) for your branch, with the eight committed screenshot paths in `screenshots`. Then give: `START`, what works, what does not, the screenshot paths, the probe JSON lines, the safety-fact proof output, the stack-probe output, and open questions.

## STANDING
- One way to do each task; registries over hand-synced lists. The swap meter is one row of the Big Board metric registry over `filmRoom()`; the UI only paints `SwapStats`.
- A counterfactual is shown, never applied. Selection math changes only by its own spec.
- The DOM is never the store. Layout is CSS. The DOM is the same at every width; JavaScript never measures the viewport. Colors come only from Pick 4's tokens.
- Tests assert behavior through the uploaded fixtures, the harness and the public entry points, with expected values taken from `expected.json` and this spec (pstack `principle-test-behavior-not-implementation`).
- Log non-obvious choices in `docs/DECISIONS.tsv` (ts, phase, decision, why, evidence, result).
