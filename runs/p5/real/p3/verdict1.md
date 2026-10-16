Draft PR #5 at `06ce1ae4d2bd0068f2f331bb0009c53e91f7e3df` is **NOT_VERIFIED**. The Locker Room journeys passed. `dd lessons --json` still writes a C1 control from a payload to stdout, so the safety fact does not hold. No product code was changed, and the PR was left as a draft.

## Commands

`npm test`: 124 pass, 0 fail.

`npx tsc --noEmit`: exit 0. The first attempt downloaded the unrelated `tsc` package because `node_modules` was missing. After `npm ci` from the lockfile, the local TypeScript compiler exited 0. The worktree stayed clean.

`dd selftest` exit 0:

```
DATA_DIR=/tmp/dd-selftest-RC5WnB
happy p-20261017-01 drafted
policy p-20261017-02 failed
walkover p-20261017-03 drafted
close p-20261017-04 drafted
```

`dd doctor` exit 0:

```
node: pass 22.14.0
data: pass /workspace/data
config: pass
targets: pass 1
port: pass 4420
```

`control.sh doctor` passed on the verify server. Its `port:` line read `fail 45920 in use`, which is the helper's expected reading while that server holds the port.

## VERIFY 5

`sha256sum test/fixtures/lessons/lessons-week.jsonl` is `300d45a76d9f7d68834d764aa66c2f4fee2b2cb9dfdb7fdc02894da8f80ced5c` (94 lines). That matches the spec.

`dd lessons` on the split week printed these 36 lines, matching the spec:

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

`--since 2026-10-16 --until 2026-10-12` printed `error: since must be before until` and exited 2.

## Journeys

`control.sh launch` seeded four selftest picks, then `control.sh doctor` passed. The Big Board link and the four-row read happened before `seed-lessons`. At 1280×800 the fourth row started at y=811, so that frame clips it. `big-board.png` is a second selftest data dir at 1280×1200, still before any `seed-lessons`, with all four rows inside the viewport. API ids matched the table: `p-20261017-01` drafted, runs 8; `p-20261017-02` failed, runs 0; `p-20261017-03` drafted, runs 6; `p-20261017-04` drafted, runs 7. The `Locker Room` link points at `#/lessons` and sits outside the Big Board region.

`seed-lessons` returned `seeded lessons week`.

At `#/lessons?since=2026-10-11&until=2026-10-16` and 1280×800 the summary was `7 lessons from 5 picks · 27 findings · 6 one-offs`. Since and Until were prefilled. Show set the hash to `#/lessons?since=2026-10-11&until=2026-10-16`. Lesson 1 was `1. inconclusive:verifier-blocked` / `architecture`. Lesson 2 was `2. gate:journey` / `check`. Lesson 2's Receipts links were `p-20261011-01 #11`, `p-20261012-01 #10`, `p-20261012-01 #10`, `p-20261012-01 #12`. Choosing the first landed on `#/picks/p-20261011-01` with idea `Add a status legend to the Big Board`.

The rank-1 card puts its first receipt in a paragraph above the list named Receipts. That list has the other finding. Lesson 2's Receipts list has one item per finding.

At 390×844, `document.documentElement.scrollWidth` was **390** (`clientWidth` 390, `body.scrollWidth` 390).

Clear, from the windowed hash, set the hash to `#/lessons`.

Live, on `#/lessons` with no window: the first `lesson_recorded` topic `Locker live` showed under One-offs as `lesson:locker live · 1 finding` in 157 ms after the record process exited (374 ms from spawn). `LOCKER_live` on the second pick moved it into Lessons as `8. lesson:locker live` with `2 picks · 2 findings` in 52 ms after that record exited (241 ms from spawn).

With focus in Since, another lesson left the summary `8 lessons from 11 picks · 35 findings · 9 one-offs` and the empty dates unchanged for 2391 ms.

The hostile topic `<img src=x onerror=alert(1)>` showed as the one-off text `lesson:<img src=x onerror=alert(1)> · 1 finding`. Lesson 5's receipt text was `p-20261014-01 #15 <img src=x onerror=alert(1)> rendered as text, but the swap chip overflowed at 390 px`, with zero `img` elements on that item. The Locker Room region had 0 `img`, 0 `script`, and 0 `iframe` elements, and every `a[href]` matched `^#/picks/p-\d{8}-\d{2}$`.

`control.sh cleanup` left all seven screenshots in place.

<img alt="Locker Room link on the Big Board" src="/opt/cursor/artifacts/war-room/lessons-board-link.png" />
<img alt="Four selftest rows" src="/opt/cursor/artifacts/war-room/big-board.png" />
<img alt="Windowed week, lessons 1 and 2" src="/opt/cursor/artifacts/war-room/lessons-week.png" />
<img alt="Lesson 2 receipts" src="/opt/cursor/artifacts/war-room/lessons-receipts.png" />
<img alt="Phone width" src="/opt/cursor/artifacts/war-room/lessons-phone.png" />
<img alt="Live lesson with 2 picks" src="/opt/cursor/artifacts/war-room/lessons-live.png" />
<img alt="Hostile markup as text" src="/opt/cursor/artifacts/war-room/lessons-hostile.png" />

## Pooled casts

The three `as unknown as LessonsReport` casts are at `test/lessons.pooled.test.ts` lines 760, 843, and 856. `reportOf` returns `gardener(...)` widened to `ReportLike`, whose `kind` and `level` are `string`, so that value is not assignable to `LessonsReport`. The cast puts the same object back. Each call still asserts the spec's literal text: L11 compares the printed 36 lines, and L14 compares the `?[2jwipe` lines and scans every line for U+0000–U+001F and U+007F–U+009F. They do not weaken an assertion.

## Safety fact

Scratch dir `/tmp/dd-safety-lessons-isiUn9`. Markup and control characters went through `dd record` (NUL in the lesson text via `--file`, because Node rejects NUL in argv). A directory `p-20261020-07` carried another pick's id plus a `stolen-pick` lesson. `gardener()` also received `../etc`.

Text mode:

```
0 lessons from 2 picks · 3 findings · 3 one-offs
one-offs
- lesson:?[2jwipe  p-20261017-01  1 finding
- lesson:?[2jwipe?  p-20261017-02  1 finding
- lesson:<img src=x onerror=alert(1)>  p-20261017-01  1 finding
skipped p-20261020-07: id mismatch
```

Those text lines contain no C0 or C1 character. JSON escapes `\u0000`, `\u001b`, and `\u0007`. The same JSON stdout still contains raw **U+007F** and **U+009F**. U+009F is C1, so `dd lessons --json` writes a C1 control from a payload to the terminal.

The rest of the proof passed: K1 listed `p-20261020-07` as `id mismatch` and did not attribute `stolen-pick`; `../etc` was `bad pick id` and produced no finding; `GET /api/lessons` matched `dd lessons --json`; `draftDayLessons` made no `img`, `script`, or `iframe`, set no `on*` attribute, and every href was `#/picks/p-20261017-01` or `#/picks/p-20261017-02`. A report whose finding ids were `../etc` and `javascript:alert(1)` rendered those strings as text and created no link.

## Stack

`git merge-base --is-ancestor 60b1625518f61de576205c73318afd54c3384798 HEAD` printed `on-stack`. `origin/dd/p2-timeline` is still `60b1625518f61de576205c73318afd54c3384798`.

`git diff --name-only 60b1625...HEAD` adds `docs/SPEC-004-lessons.md` and `test/lessons.pooled.test.ts`, which are outside the touch map. Both arrived in the grafter commits. Candidate `a104b28` stays inside the map. Every other path is on the map.

```dd-verdict
{"prNumber":5,"headSha":"06ce1ae4d2bd0068f2f331bb0009c53e91f7e3df","verdict":"NOT_VERIFIED","ledger":"live-ui-verified","certainty":5,"evidence":["npm test 124/124 pass; npx tsc --noEmit exit 0; selftest printed happy drafted, policy failed, walkover drafted, close drafted","sha256 of lessons-week.jsonl is 300d45a76d9f7d68834d764aa66c2f4fee2b2cb9dfdb7fdc02894da8f80ced5c; dd lessons printed the spec's 36 lines; the 2026-10-12..14 window matched; since after until exited 2","Locker Room journeys passed: windowed summary and lesson 2 receipt p-20261011-01 #11 landed on #/picks/p-20261011-01, scrollWidth 390, live promotion 52 ms after record exit, Clear returned to #/lessons, hostile markup stayed text","dd lessons text mode replaced C0/C1 with ?; dd lessons --json wrote raw U+007F and U+009F from a recorded payload, and U+009F is C1","Three LessonsReport casts restore gardener()'s value after reportOf widens it to ReportLike; L11 and L14 still assert the spec's literal strings"],"fixLoops":0}
```