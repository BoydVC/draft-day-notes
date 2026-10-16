Re-verified head `1f8610bbd5ddbe4d0f49dbfd319a1eec8a96689f` on `dd/p3-lessons`. The worktree was not modified.

`npm test` finished with **124 pass, 0 fail, 0 skipped**. `npx tsc --noEmit` exited 0. `dd selftest` exited 0 (`happy p-20261020-01 drafted`, `policy p-20261020-02 failed`, `walkover p-20261020-03 drafted`, `close p-20261020-04 drafted`). `dd doctor` exited 0 (`node`, `data`, `config`, `targets`, and `port` all pass on 4420). `sha256sum test/fixtures/lessons/lessons-week.jsonl` matches the spec: `300d45a76d9f7d68834d764aa66c2f4fee2b2cb9dfdb7fdc02894da8f80ced5c`.

`control.sh launch` then `control.sh doctor` passed (the helper’s `port: fail 45920 in use` line is the live server). In Chrome, the Big Board showed the four seeded picks and a `Locker Room` link to `#/lessons` outside that region. New pick queued `Show the run count in the page title` without a reload; `GET /api/board` included the inbox row, `intake.jsonl` grew from 0 to 1 line, and no `events.jsonl` changed. The happy pick page showed `drafted`, the War Room restatement, `Single pass`, and `BASE`. After `seed-lessons`, the windowed Locker Room showed `7 lessons from 5 picks · 27 findings · 6 one-offs`, lesson 1 `1. inconclusive:verifier-blocked` / `architecture`, lesson 2 `2. gate:journey` / `check`. Receipt `p-20261011-01 #11` landed on `#/picks/p-20261011-01`. At 390×844, `document.documentElement.scrollWidth` was 390. The live topic appeared under One-offs in 110ms and moved to Lessons with `2 picks` in 106ms. With `Since` focused, the summary and dates stayed put for 2 seconds. Hostile markup rendered as text: the Locker Room region had no `img`, `script`, or `iframe`, and every `a[href]` matched `^#/picks/p-\d{8}-\d{2}$`. `control.sh cleanup` removed the server and data directory. Screenshots and `probe.json` are in `/opt/cursor/artifacts/war-room/`.

Safety-fact proof (scratch data dir, `dd record`, mismatched log, `dd lessons` text and `--json`, `GET /api/lessons`, `draftDayLessons` in `node:vm`):

```
SAFETY-PROOF pass
markupPick=p-20261020-01
controlPick=p-20261020-02
K1 skipped=[{"pickId":"p-20261020-99","reason":"id mismatch"}]
directSkipped=[{"pickId":"../etc","reason":"bad pick id"},{"pickId":"p-20261020-01","reason":"unreadable"}]
textControls=none
jsonRawControls=none escapedESC=yes escapedBEL=yes
apiMatchesJson=yes
hrefs=#/picks/p-20261020-02,#/picks/p-20261020-01
hostileIdHrefs=#/picks/p-20261020-01
tags=section,h2,p,form,div,label,input,button,h3,ul,li,a
onAttrs=0 bannedSinks=0
--- lessons text ---
0 lessons from 2 picks · 2 findings · 2 one-offs
one-offs
- lesson:?[2jwipe?  p-20261020-02  1 finding
- lesson:<img src=x onerror=alert(1)>  p-20261020-01  1 finding
skipped p-20261020-99: id mismatch
```

```dd-verdict
{"prNumber": 5, "headSha": "1f8610bbd5ddbe4d0f49dbfd319a1eec8a96689f", "verdict": "VERIFIED", "ledger": "live-ui-verified", "certainty": 5, "evidence": "npm test 124 pass, 0 fail, 0 skipped, exit 0; tsc --noEmit exit 0; dd selftest exit 0 (happy/policy/walkover/close); dd doctor exit 0; sha256 lessons-week.jsonl matches 300d45a76d9f7d68834d764aa66c2f4fee2b2cb9dfdb7fdc02894da8f80ced5c; control.sh doctor pass; browser: 4 seeded rows, Locker Room link #/lessons outside Big Board, New pick queued with intake.jsonl +1 and events.jsonl unchanged, happy pick drafted with restatement, Single pass, and BASE, seed-lessons summary exact, lesson headings/chips, receipt p-20261011-01 #11, scrollWidth 390, live one-off 110ms then 2 picks 106ms, focus hold kept summary and dates, hostile markup as text with no img/script and only pick hrefs; safety proof pass (K1 id mismatch and ../ bad pick id, text mode C0 replaced, JSON escaped, API matches, vm hrefs only #/picks/p-########-##, no on* attrs, no banned DOM sinks)", "fixLoops": 0}
```
SKILL-NOTES: features/lessons.md Driving says the Locker Room region shows a Big Board link, but the link sits outside that region (the Gotchas bullet matches the page); the Window form also has a Clear button the feature file does not name; SKILL.md calls Candidates a textbox but the control is input type=number; the phone step follows the receipt click and never says to return to #/lessons (scrollWidth was measured after navigating back to the windowed Locker Room); at 1280x800 lesson 2's heading ends near y=794, so lessons-week.png was captured 818px tall to keep the heading and chip; control.sh doctor prints doctor: pass while dd doctor exits 1 because the line is port: fail <port> in use, and SKILL.md does not say that port line is expected to fail