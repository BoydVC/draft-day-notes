The Locker Room gardener is on `dd/p3-lessons-a` (`a104b28e3cbddff951c60a2682bce43ed380abbe`), stacked on `dd/p2-timeline`. No pull request was opened.

```dd-report
{"branch":"dd/p3-lessons-a","headSha":"a104b28e3cbddff951c60a2682bce43ed380abbe","summary":"Locker Room gardener groups repeated findings and proposes one check per lesson.","commands":[{"cmd":"npm test","exit":0}],"tests":{"added":16,"passing":true},"screenshots":["lessons-week.png","lessons-board-link.png","lessons-receipts.png","lessons-phone.png","lessons-live.png","lessons-hostile.png"],"risks":[]}
```

**What works.** `gardener()` reads seq-ordered logs through one `Record<FindingKind, KindRule>` registry (`satisfies`), so a new finding kind fails `tsc` until its row is complete. The sample week is the seven lessons, six one-offs, and 36-line text report in the spec. `dd lessons`, `GET /api/lessons`, and `#/lessons` share that report. `npm test` is 108 passing. `npx tsc --noEmit` exits 0. `test/guards.test.ts` is unchanged. The fixture sha256 is `300d45a76d9f7d68834d764aa66c2f4fee2b2cb9dfdb7fdc02894da8f80ced5c`.

`dd selftest` exits 0:

```
DATA_DIR=/tmp/dd-selftest-KykycE
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

`dd lessons --data $D` prints the 36 lines from the spec, including the summary `7 lessons from 5 picks · 27 findings · 6 one-offs`. `--since 2026-10-12 --until 2026-10-14` prints `1 lesson from 2 picks · 9 findings · 4 one-offs` and the `inconclusive:verifier-blocked` lesson. `--since 2026-10-16 --until 2026-10-12` prints `error: since must be before until` and exits 2.

The War Room journey passed: four-row Big Board with the Locker Room link outside that region, windowed lessons 1–2, receipt `p-20261011-01 #11` opening `#/picks/p-20261011-01`, phone `scrollWidth` 390, live promotion of `lesson:locker live` to 2 picks within 2 seconds, the Window form left alone while focused, and hostile markup kept as text.

**What does not.** Nothing in the acceptance set is failing. A judgement card that makes `reduce()` throw (a card with no `crossTests`) is caught so the pass still finishes; that log’s rubric is then empty, so an in-rubric low score is reported as `judge:bad-criterion`. Logs `dd record` writes do not hit that path.

**Screenshots**

- `/opt/cursor/artifacts/war-room/lessons-board-link.png`
- `/opt/cursor/artifacts/war-room/lessons-week.png`
- `/opt/cursor/artifacts/war-room/lessons-receipts.png`
- `/opt/cursor/artifacts/war-room/lessons-phone.png`
- `/opt/cursor/artifacts/war-room/lessons-live.png`
- `/opt/cursor/artifacts/war-room/lessons-hostile.png`

**Safety-fact proof**

```
PASS K1 id mismatch is skipped — [{"pickId":"p-20261020-07","reason":"id mismatch"}]
PASS K1 stolen topic is not a finding
PASS text mode has no C0/C1 except newlines
PASS text mode escapes the topic
PASS json keeps controls escaped
PASS api matches dd lessons --json — status 200
PASS vm creates no img script or iframe — section,h2,p,form,div,label,input,div,label,input,button,h3,ul,h3,ul,li,ul,li,a
PASS vm sets no on* attribute
PASS vm string children stay text
PASS vm hrefs are only pick pages — #/picks/p-20261017-01
PASS dd lessons text exit 0
PASS dd lessons json exit 0
safety-fact: proved
```

**Stack probe**

```
on-stack
60b1625518f61de576205c73318afd54c3384798
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

**Open questions.** When `reduce()` throws, should the gardener still read the last `scouting_report_written` rubric, or is an empty rubric the right failure mode? Proposals name `src/report/parse.ts`, `src/briefs/scout.md`, and the verify skill; this pick does not edit them.