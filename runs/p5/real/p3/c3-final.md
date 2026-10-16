Pick 3 is on `dd/p3-lessons-c` at `29255794b0b700fdb05ee1e10a7e8e4769ce6920`, pushed to origin. No pull request was opened.

```dd-report
{"branch":"dd/p3-lessons-c","headSha":"29255794b0b700fdb05ee1e10a7e8e4769ce6920","summary":"Sunday Locker Room: gardener ranks the week's fixes, rank 1 leads with its chip, where, and first receipt, and Clear drops the window.","commands":[{"cmd":"npm test","exit":0}],"tests":{"added":16,"passing":true},"screenshots":["lessons-week.png"],"risks":[]}
```

**What works.** The gardener, `dd lessons`, and `GET /api/lessons` share one read-only function. `npm test` is 108 passing, 0 failing, including L1–L14, L18, and L19. `./node_modules/.bin/tsc --noEmit` exits 0. `test/guards.test.ts` has an empty diff against `60b1625`. The fixture sha256 is `300d45a76d9f7d68834d764aa66c2f4fee2b2cb9dfdb7fdc02894da8f80ced5c`.

Selftest and doctor:

```
DATA_DIR=/tmp/dd-selftest-yBE2MV
happy p-20261017-01 drafted
policy p-20261017-02 failed
walkover p-20261017-03 drafted
close p-20261017-04 drafted
selftest_exit:0
node: pass 22.14.0
data: pass /workspace/data
config: pass
targets: pass 1
port: pass 4420
doctor_exit:0
```

`dd lessons` on the sample week (36 lines):

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

Window `2026-10-12` until `2026-10-14`:

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

`--since 2026-10-16 --until 2026-10-12` prints `error: since must be before until` and exits 2.

The War Room journey was driven in headless Chrome: Big Board link outside `#big-board`, window prefilled, lessons 1–7, lesson 2's first receipt landing on `#/picks/p-20261011-01`, `scrollWidth` 390 at 390×844, live promotion of `lesson:locker live` to 2 picks within 2 seconds, and hostile markup left as text. Clear, next to Show, sets the hash to `#/lessons` and empties Since.

**What does not.** Nothing in the acceptance lines is failing. Skipped logs stay in the CLI and the JSON. The Locker Room page lists lessons and one-offs only, so a mismatched directory never appears there as a row.

**Screenshots**

- `/opt/cursor/artifacts/war-room/lessons-board-link.png`
- `/opt/cursor/artifacts/war-room/lessons-week.png`
- `/opt/cursor/artifacts/war-room/lessons-receipts.png`
- `/opt/cursor/artifacts/war-room/lessons-phone.png`
- `/opt/cursor/artifacts/war-room/lessons-live.png`
- `/opt/cursor/artifacts/war-room/lessons-hostile.png`

**Safety-fact proof**

```
text exit 0
0 lessons from 2 picks · 2 findings · 2 one-offs
one-offs
- lesson:?[2jwipe?  p-20261017-02  1 finding
- lesson:<img src=x onerror=alert(1)>  p-20261017-01  1 finding
skipped p-20261020-07: id mismatch
L14 text has C0/C1 besides newlines: false
K1 skip line present: true
stolen text in terminal: false
JSON skipped: [{"pickId":"p-20261020-07","reason":"id mismatch"}]
finding pick ids: ["p-20261017-02","p-20261017-01"]
stolen detail in JSON: false
control char survived in JSON value: true
raw ESC in JSON stdout: false
API matches dd lessons --json: true
L18 tags include img/script/iframe: false
L18 on* attributes: []
L18 hrefs: ["#/picks/p-20261017-02","#/picks/p-20261017-01"]
L18 every href is a pick link: true
L18 markup stayed text: true
L18 foreign id stayed text: false
safety fact: pass
```

The last false line is the skipped id `p-20261020-07` being absent from the page. It was not turned into a link. Findings stayed on the two real pick ids.

**Stack probe**

```
on-stack
FETCH_HEAD=60b1625518f61de576205c73318afd54c3384798
dd/p2-timeline unchanged
```

`git diff --name-only 60b1625518f61de576205c73318afd54c3384798...HEAD`:

```
.cursor/skills/verify-draft-day/SKILL.md
.cursor/skills/verify-draft-day/features/README.md
.cursor/skills/verify-draft-day/features/lessons.md
.cursor/skills/verify-draft-day/helpers/control.sh
docs/DECISIONS.tsv
src/cli/dd.ts
src/core/index.ts
src/core/lessons.ts
src/server/http.ts
src/store/eventlog.ts
src/ui/app.js
src/ui/index.html
src/ui/lessons.css
src/ui/lessons.js
test/commands.test.ts
test/fixtures/lessons/lessons-week.jsonl
test/lessons.test.ts
```

**Open questions.** Clear is a submit button named Clear, drawn as a gold underline beside Show. An `<a href="#/lessons">` inside `lessons.js` would fail L18, which only allows `#/picks/<id>`. Proposals still name `src/report/parse.ts`, `src/briefs/scout.md`, and the verify skill. Those files were left as they were.