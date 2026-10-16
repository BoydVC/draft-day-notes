Verified head `84ed4466d0b45b9067c47b3e16470be0a23ae98b` on `dd/p1-film-room`. No product files changed, and nothing was committed or pushed.

`npm test`: 60 pass, 0 fail, 0 skip. `npx tsc --noEmit` exited 0. `dd selftest` exited 0 and printed `happy p-20261020-01 drafted`, `policy p-20261020-02 failed`, `walkover p-20261020-03 drafted`, `close p-20261020-04 drafted`. Standalone `dd doctor` exited 0 (`node`, `data`, `config`, `targets`, and `port` all pass on 4420). `docs/SPEC-002-film-room.md` lists no sha256 fixtures.

`control.sh launch` seeded those four picks and served `http://127.0.0.1:45920`. `control.sh doctor` passed. The live `port:` line is `port: fail 45920 in use` because that server holds the port. Chrome 154 drove the War Room.

- Big Board showed the four seeded rows (`big-board.png`).
- New pick `Show the run count in the page title` queued without a reload. Status text was `Queued in the inbox.`, the Pick cell was `queued`, and `GET /api/board` listed that inbox row. `intake.jsonl` went from missing to one line. The four `events.jsonl` hashes were unchanged, and no new pick directory appeared (`big-board-after-new-pick.png`, retaken at 1280×1400 so the heading and the new row are both in frame).
- Happy pick `p-20261020-01` opened at `#/picks/p-20261020-01` without a reload: `drafted`, the War Room restatement, `Single pass`, `BASE`, `VERIFIED`, and `Draft PR #17`. `Big Board` returned to `#/` (`pick-page.png`).
- Close pick `p-20261020-04`: `Swap: flipped`, `Close call`, `BASE` on c2, and `Passes split (c1 won pass 1, c2 won pass 2). Tie rule: c2 over c1 on diff_lines (200 vs 271).` (`film-room-flipped.png`, 1280×800). Pass 1 set `aria-pressed` true and Pass 2 false, with no reload. Rank 1 changed from c2 on pass 2 to c1 on pass 1 (`film-room-pass1.png`). At 390×844 the columns are one track, the base column is first, and horizontal overflow is 0 (`film-room-phone.png`). The happy pick chip is `Single pass` with no pass buttons (`film-room-single.png`).
- Live pick `p-20261020-05` showed `Film Room has not scored this pick.` After `judgement_recorded`, the scorecard rendered in 310ms with the same document token and one navigation entry (`film-room-live.png`). The judge named the low score; the board kept the gate passer: `Judge picked c2; the board picked c1.` plus the second-read note (`film-room-disagree.png`). The gate-failing candidate stayed `rank: null`.

The lesson-recorded path in `features/live-updates.md` was not driven. `control.sh cleanup` stopped pid 4376 and removed the data directory. The screenshots and `probe.json` are still under `/opt/cursor/artifacts/war-room/`.

Safety fact, run through `dd record` (judge names the journey-failer as base and gives it all 4s):

```
data=/tmp/dd-safety-suVrWp
pick=p-20261020-01
record_exit=0
judge_named_base_label=B which maps to c1 (journey fail, all scores 4)
safety-fact: recorded a judgement that names the gate-failer as base and gives it all 4s
safety-fact: judgeBase=c1 filmRoom.base=c2 rank[c1]=null gatePass[c1]=false gatePass[base]=true judgeDisagrees=true judgement.base=c2
```

```dd-verdict
{"prNumber": 2, "headSha": "84ed4466d0b45b9067c47b3e16470be0a23ae98b", "verdict": "VERIFIED", "ledger": "live-ui-verified", "certainty": 4, "evidence": "npm test 60 pass, 0 fail, 0 skip; tsc --noEmit exit 0; selftest exit 0 happy/policy/walkover/close; doctor exit 0 and control.sh doctor pass (port fail 45920 in use while serving); no sha256 fixtures in SPEC-002; Chrome journeys: 4 seeded rows, new pick queued with no reload, intake.jsonl 0 to 1 line, events.jsonl unchanged, happy pick drafted with Single pass BASE VERIFIED and Draft PR #17, close scorecard BASE Swap flipped Close call diff_lines, Pass 1 aria-pressed rank1 c1 vs pass2 c2, phone 390x844 base column first overflowX 0, live scorecard in 310ms, disagree Judge picked c2 board picked c1; safety judgeBase=c1 filmRoom.base=c2 rank[c1]=null gatePass[c1]=false gatePass[base]=true", "fixLoops": 0}
```
SKILL-NOTES: literal `dd intake` is GNU coreutils and exits 1 (`unrecognized option '--idea'`), the project CLI is `node --experimental-strip-types src/cli/dd.ts`; film-room live/disagree steps omit `--data`, `--cand`, and the JSON or dd-judgement bodies those records require; unscored copy is "Film Room has not scored this pick."; pick-page.md calls the pick id the page heading, while h1 stays "War Room" and the id is h2#pick-title; status chips render uppercase via CSS (DRAFTED/FAILED/INTAKE) while the skill quotes lowercase; the new-pick row and the War Room heading do not both fit in an 800px-tall viewport (scrollHeight 1400)