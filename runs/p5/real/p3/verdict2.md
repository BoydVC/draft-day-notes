The control-character fix at `e242a533d04d68a5a4472bce283eb06866e79d96` holds. `dd lessons --json` and `GET /api/lessons` emit no raw U+007F–U+009F, the bytes match, and `JSON.parse` restores the payload. The rest of SPEC 004 re-checked clean.

**Tests and commands.** `npm test` passed 124/124. After the lockfile's TypeScript was installed, `npx tsc --noEmit` exited 0.

`dd selftest` exited 0:

```
DATA_DIR=/tmp/dd-selftest-Jb5mb6
happy p-20261017-01 drafted
policy p-20261017-02 failed
walkover p-20261017-03 drafted
close p-20261017-04 drafted
```

`dd doctor`:

```
node: pass 22.14.0
data: pass /workspace/data
config: pass
targets: pass 1
port: pass 4420
```

**Fixture and VERIFY 5.** `sha256sum test/fixtures/lessons/lessons-week.jsonl` is `300d45a76d9f7d68834d764aa66c2f4fee2b2cb9dfdb7fdc02894da8f80ced5c`. The week split into a scratch data dir printed these 36 lines:

```
7 lessons from 5 picks · 27 findings · 6 one-offs
1. architecture  inconclusive:verifier-blocked  2 picks  2 findings
   Make control.sh doctor fail before any drive when the verifier would end verifier-blocked, so a physical never spends a run on it.
   where .cursor/skills/verify-draft-day/helpers/control.sh
   must fail on p-20261012-01#16, p-20261013-01#16
2. check  gate:journey  2 picks  4 findings
   Refuse a candidate_finished report at record time unless it proves the journey gate passed, so the Film Room never scores a card that fails it.
   where src/report/parse.ts parseCandidateReport
   must fail on p-20261011-01#11, p-20261012-01#10, p-20261012-01#12
3. check  score:tests  2 picks  4 findings
   Write criterion tests into every scouting report as an ACCEPTANCE line, so the judge's pooled cross-test fails the mistake instead of the rubric scoring it.
   where src/briefs/scout.md
   must fail on p-20261011-01#11, p-20261012-01#10, p-20261012-01#12
4. check  score:warroom  2 picks  2 findings
   Write criterion warroom into every scouting report as an ACCEPTANCE line, so the judge's pooled cross-test fails the mistake instead of the rubric scoring it.
   where src/briefs/scout.md
   must fail on p-20261011-01#11, p-20261014-01#11
5. skill  not_verified:live-ui-verified  2 picks  2 findings
   Add the journey the physical failed to the verify skill's feature map, so candidates drive it in their own VERIFY before they report.
   where .cursor/skills/verify-draft-day/features/
   must fail on p-20261011-01#15, p-20261014-01#15
6. review  lesson:draft  2 picks  2 findings
   Boyd names the engine check for "draft"; until then it stays a human review item.
   where Boyd
   must fail on p-20261011-01#19, p-20261012-01#20
7. review  lesson:film room  2 picks  2 findings
   Boyd names the engine check for "film room"; until then it stays a human review item.
   where Boyd
   must fail on p-20261013-01#18, p-20261014-01#19
one-offs
- judge:unresolved-label  p-20261014-01  3 findings
- gate:tests  p-20261014-01  2 findings
- inconclusive:verifier-failed  p-20261015-01  1 finding
- judge:bad-criterion  p-20261015-01  1 finding
- lesson:combine  p-20261015-01  1 finding
- lesson:xss  p-20261015-01  1 finding
```

`--since 2026-10-12 --until 2026-10-14`:

```
1 lesson from 2 picks · 9 findings · 4 one-offs
1. architecture  inconclusive:verifier-blocked  2 picks  2 findings
   Make control.sh doctor fail before any drive when the verifier would end verifier-blocked, so a physical never spends a run on it.
   where .cursor/skills/verify-draft-day/helpers/control.sh
   must fail on p-20261012-01#16, p-20261013-01#16
one-offs
- gate:journey  p-20261012-01  3 findings
- score:tests  p-20261012-01  2 findings
- lesson:draft  p-20261012-01  1 finding
- lesson:film room  p-20261013-01  1 finding
```

`--since 2026-10-16 --until 2026-10-12` wrote `error: since must be before until` on stderr and exited 2. `dd help` lists `dd lessons [--since YYYY-MM-DD] [--until YYYY-MM-DD]`.

**Journeys.** `control.sh doctor` passed on the verify server. Before `seed-lessons`, the Big Board had four pick links, a `drafted` chip, a `failed` chip, and non-blank runs, matching `GET /api/board`. The `Locker Room` link pointed at `#/lessons` and sat outside the Big Board region. `seed-lessons` returned the summary `7 lessons from 5 picks · 27 findings · 6 one-offs`.

At 1280×800 the windowed Locker Room showed that summary, the Window form prefilled `2026-10-11` / `2026-10-16`, seven lessons, lesson 1 headed `1. inconclusive:verifier-blocked` with chip `architecture`, and lesson 2 headed `2. gate:journey` with chip `check`. Lesson 2's Receipts list started with `p-20261011-01 #11`. Choosing it landed on `#/picks/p-20261011-01` without a reload. Lesson 1's first receipt is the link `p-20261012-01 #16` above its Receipts list; that list contains the second receipt.

At 390×844, `document.documentElement.scrollWidth` was **390**.

On `#/lessons`, `lesson:locker live` appeared under One-offs 158 ms after the first record, then moved into Lessons with `2 picks` 54 ms after the second. With Since focused and set to `2026-10-01`, another record left the summary and the date unchanged. Lesson 5's windowed receipt showed the literal `<img src=x onerror=alert(1)>` evidence from `p-20261014-01`. The unwindowed one-off showed `<img src=x onerror=alert(1)>` and `<script>alert(1)</script>` as text. The Locker Room region had no `img`, `script`, or `iframe`, and every `a[href]` matched `^#/picks/p-\d{8}-\d{2}$`. Cleanup left the six screenshots in place:

- `/opt/cursor/artifacts/war-room/lessons-board-link.png`
- `/opt/cursor/artifacts/war-room/lessons-week.png`
- `/opt/cursor/artifacts/war-room/lessons-receipts.png`
- `/opt/cursor/artifacts/war-room/lessons-phone.png`
- `/opt/cursor/artifacts/war-room/lessons-live.png`
- `/opt/cursor/artifacts/war-room/lessons-hostile.png`

**Safety fact** (scratch dir `/tmp/dd-safety-9X06aB`, certainty 5). Hostile topics and texts went through `dd record`, including markup and U+001B, U+0007, U+007F, U+0085, and U+009F. A directory `p-20261020-07` whose `pick_created.payload.id` named another pick was skipped as `id mismatch`, and its `stolen-finding` topic produced no finding. `gardener()` on pick id `../etc` skipped it as `bad pick id` and did not throw.

```
PASS text mode has no C0/C1 except newlines
PASS json stdout has no raw U+007F-U+009F or other C0/C1 except newline
PASS json stdout escapes DEL and C1
PASS json stdout escapes C0
PASS json round-trips markup topic and text
PASS json round-trips control text and the normalized topic
PASS GET /api/lessons 200
PASS GET /api/lessons has no raw U+007F-U+009F or other C0/C1 except newline
PASS GET /api/lessons matches dd lessons --json byte for byte — api 1414 cli 1414
PASS GET body round-trips markup and controls
PASS vm creates no img/script/iframe
PASS vm sets no on* attribute
PASS vm hrefs are only pick pages
PASS vm shows markup as text
PASS non-pick id renders no link
PASS src/ui has no HTML injection sinks
SAFETY_FACT pass
```

**Stack.** `60b1625518f61de576205c73318afd54c3384798` is an ancestor of HEAD. `origin/dd/p2-timeline` is still that commit: `dd/p2-timeline unchanged`.

`git diff --name-only 60b1625...HEAD` is inside the touch map, plus `docs/SPEC-004-lessons.md` and `test/lessons.pooled.test.ts`, which the graft required. `test/guards.test.ts` and `package.json` are unchanged.

```dd-verdict
{"prNumber":5,"headSha":"e242a533d04d68a5a4472bce283eb06866e79d96","verdict":"VERIFIED","ledger":"live-ui-verified","certainty":5,"evidence":["/opt/cursor/artifacts/war-room/lessons-board-link.png","/opt/cursor/artifacts/war-room/lessons-week.png","/opt/cursor/artifacts/war-room/lessons-receipts.png","/opt/cursor/artifacts/war-room/lessons-phone.png","/opt/cursor/artifacts/war-room/lessons-live.png","/opt/cursor/artifacts/war-room/lessons-hostile.png","npm test 124 pass","npx tsc --noEmit exit 0","sha256 300d45a76d9f7d68834d764aa66c2f4fee2b2cb9dfdb7fdc02894da8f80ced5c","dd lessons 36 lines match","window 1 lesson from 2 picks · 9 findings · 4 one-offs","bad window exit 2","scrollWidth 390","receipt #/picks/p-20261011-01","live one-off 158ms then 2 picks in 54ms","json and GET /api/lessons byte match 1414 with no raw U+007F-U+009F"],"fixLoops":1}
```