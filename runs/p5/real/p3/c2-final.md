The gardener is on `dd/p3-lessons-b` (`a6d5b13acd147a52ad28a0ae0164aa4034caa27e`), pushed and not opened as a pull request.

```dd-report
{"branch":"dd/p3-lessons-b","headSha":"a6d5b13acd147a52ad28a0ae0164aa4034caa27e","summary":"Gardener turns pick logs into ranked lessons in two stages, findings() then groupFindings(), and the Locker Room shows each group's receipts as a table.","commands":[{"cmd":"npm test","exit":0}],"tests":{"added":16,"passing":true},"screenshots":["lessons-board-link.png","lessons-week.png","lessons-receipts.png","lessons-phone.png","lessons-live.png","lessons-hostile.png"],"risks":[]}
```

**What works.** `findings(logs, window)` is stage 1 and returns one flat, sorted `Finding[]`. `groupFindings()` is stage 2: it only sees that list, applies the repeat rule, ranks by `CORRECTION_ORDER`, and attaches one proposal. `gardener()`, `dd lessons`, and `GET /api/lessons` share that report. L1–L14, L18, and L19 are in `test/lessons.test.ts`. The full suite is 108 passing. `npx tsc --noEmit` exits 0. `test/guards.test.ts` is unchanged. The fixture sha256 is `300d45a76d9f7d68834d764aa66c2f4fee2b2cb9dfdb7fdc02894da8f80ced5c`.

`dd selftest` printed:

```
DATA_DIR=/tmp/dd-selftest-HAW9eW
happy p-20261017-01 drafted
policy p-20261017-02 failed
walkover p-20261017-03 drafted
close p-20261017-04 drafted
```

`dd doctor` printed `node: pass 22.14.0`, `data: pass /workspace/data`, `config: pass`, `targets: pass 1`, `port: pass 4420`.

`dd lessons --data` on the split week printed these 36 lines:

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

`--since 2026-10-12 --until 2026-10-14` printed `1 lesson from 2 picks · 9 findings · 4 one-offs` and the `inconclusive:verifier-blocked` lesson. `--since 2026-10-16 --until 2026-10-12` exited 2 with `error: since must be before until`.

The verify skill was updated and driven. `control.sh doctor` passed. The Big Board showed four seeded picks and a Locker Room link outside that region. `seed-lessons` returned the seven-lesson summary. The first `gate:journey` receipt opened `#/picks/p-20261011-01`. At 390×844, `document.documentElement.scrollWidth` was 390. A `Locker live` topic appeared under One-offs in 261 ms, and `LOCKER_live` on a second pick promoted `lesson:locker live` with `2 picks` in 152 ms. Focus inside the Window form survived a later `dd record`. Lesson 5 showed the literal `<img src=x onerror=alert(1)>` evidence. The hostile one-off stayed text: the Locker Room region had no `img` or `script` element, and every link inside it matched `#/picks/p-########-##`. Cleanup left the six screenshots in place.

**What does not.** Nothing in the VERIFY list failed. This pick does not apply a proposal, edit `src/report/parse.ts`, `src/briefs/scout.md`, or the journeys a proposal names.

**Screenshot paths.**

- `/opt/cursor/artifacts/war-room/lessons-board-link.png`
- `/opt/cursor/artifacts/war-room/lessons-week.png`
- `/opt/cursor/artifacts/war-room/lessons-receipts.png`
- `/opt/cursor/artifacts/war-room/lessons-phone.png`
- `/opt/cursor/artifacts/war-room/lessons-live.png`
- `/opt/cursor/artifacts/war-room/lessons-hostile.png`

**Safety-fact proof.**

```
scratch /tmp/dd-safety-02Jo
recorded pick p-20261017-01
recorded markup topic and control-character topic through dd record
wrote p-20261020-07/events.jsonl whose pick_created.payload.id is p-20261017-01
text mode C0/C1 on a line: false
json mode raw C0/C1 besides newline: false
L14: terminal text replaced ESC with ? and JSON kept it escaped
K1 skip: {"pickId":"p-20261020-07","reason":"id mismatch"}
findings stay on p-20261017-01; stolen-finding is absent
GET /api/lessons matches dd lessons --json
nodes: 52, hrefs: 2, bad tag: none, bad href: none
L18: payload markup stayed text and every href is #/picks/<id>
safety fact holds
```

**Stack probe.**

```
on-stack
60b1625518f61de576205c73318afd54c3384798
dd/p2-timeline unchanged
```

`git diff --name-only 60b1625518f61de576205c73318afd54c3384798...HEAD` lists only touch-map paths: the new lessons core, UI, fixture, and tests, plus the one allowed hunk in `index.ts`, `eventlog.ts`, `dd.ts`, `http.ts`, `index.html`, `app.js`, `commands.test.ts`, the verify skill, and `docs/DECISIONS.tsv`.

**Open questions.**

- A proposal that names `src/report/parse.ts`, `src/briefs/scout.md`, or the verify skill is text. Nothing in this pick edits those files. A later pick would have to apply them.
- This branch stacks on `dd/p2-timeline` at `60b1625`. If Pick 1 or Pick 2 gains fix commits, or Boyd rejects either, this branch needs a rebase before it can merge.