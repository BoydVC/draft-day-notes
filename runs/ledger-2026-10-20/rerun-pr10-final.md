Season Ledger at `ace89ea6b0e208c3b7ec47a9b50ebd7176d30f3d` is verified. The suite, the CLI, and the live War Room all match the spec. Nothing was committed or pushed.

`git rev-parse HEAD` is `ace89ea6b0e208c3b7ec47a9b50ebd7176d30f3d` on `dd/p8-season-ledger`. `npm ci` installed the lockfile only. `npm test` finished with **354 pass, 0 fail, 0 skipped**. `npx tsc --noEmit` exited 0. `dd selftest` exited 0:

```
DATA_DIR=/tmp/dd-selftest-KKNdqI
happy p-20261020-01 drafted
policy p-20261020-02 failed
walkover p-20261020-03 drafted
close p-20261020-04 drafted
```

Bare `dd doctor` printed `node: pass 22.23.3`, `data: pass /workspace/data`, `config: pass`, `targets: pass 1`, `port: pass 4420`. All 11 fixture sha256 values in `docs/SPEC-009-season-ledger.md` match `sha256sum test/fixtures/ledger/*`.

`control.sh launch` served `http://127.0.0.1:45920` (data `/tmp/dd-verify-data-q5P8`, pid 5710). `control.sh doctor` passed, with `port: fail 45920 in use` while the other four lines passed. Every `cdp-shot` probe was `"ok":true`, `"offOrigin":[]`, `scrollWidth` equal to the viewport, and `small:[]` (ledger controls and links at least 44×44).

| Journey | What the page showed |
|---|---|
| Empty `#/ledger` 390 dark | Heading and summary `No open PRs`. Next line `Nothing to re-run.` |
| Seeded phone and desktop | `Not merge-safe yet`. `Re-run #1 before you merge.` Summary `9 open PRs · stack #1→#9 (8) · merge-safe through none · re-run #1 · 3 fresh, 4 docs-only, 1 unverified · 1 off stack`. #2’s closed row: `docs-only` `verified at ecec54c; head 84ed446 changed docs only (9 files)`. #4 off the stack, parent #3. |
| Tuesday 390 dark | `Merge-safe through #9`. `Nothing to re-run. The stack is clear.` Summary `8 open PRs · stack #1→#9 (8) · merge-safe through #9 · re-run none · 4 fresh, 4 docs-only`. #1 is `fresh`. #4 is under Closed. |
| Big Board link 390 dark | `Ledger` links to `#/ledger`. |

Opening #2’s disclosure showed the verdict sequence (`ledger · ecec54cd… · VERIFIED · certainty 5` and `certainty 4`), `Drift · 9 files · docs-only`, and `Parent #1`. `Big Board` returned to `#/`. Shots and probe JSON are in `/opt/cursor/artifacts/war-room/`. `control.sh cleanup` removed the server and the data directory and left those files in place.

Smoke on the same server, before the ledger seed: the Big Board listed the four selftest picks. Typing `Show the run count in the page title` and clicking `Add pick` queued the row (`queued`, `intake`) without a reload. `GET /api/board` included that inbox row. `intake.jsonl` grew by one line. All four `events.jsonl` hashes stayed the same, and no new pick directory appeared. The happy pick `p-20261020-01` opened at `#/picks/p-20261020-01` with chip `drafted`, restatement `You want the War Room to show each pick clearly.`, scorecard `Single pass` and `BASE` on c2, and physical `VERIFIED` with `Draft PR #17`.

Safety fact, from `Q14` and `Q16` in `test/ledger.test.ts` (both passed) plus the live server:

```
# safety-fact: sha256 64f56556d3f6498937abf20a0dc6538b5ee73166f7e678d2385309a42a52e2f6 unchanged after POST PUT DELETE
# safety-fact: hostile edges evil painted; no img/script/iframe/svg/on*; hrefs allowed; storage untouched
```

On the running War Room, `POST`, `PUT`, and `DELETE` `/api/ledger` each returned `404 {"error":"not found"}`. `ledger.jsonl` stayed `64f56556d3f6498937abf20a0dc6538b5ee73166f7e678d2385309a42a52e2f6`, which is the spec hash of `ledger-real.jsonl`. Browser resource requests stayed on `127.0.0.1:45920`. Ledger hrefs were only `#/`, `#/picks/p-YYYYMMDD-NN`, or `https://github.com/BoydVC/draft-day/pull/<n>`. `localStorage`, `sessionStorage`, and cookies stayed empty.

```dd-verdict
{"prNumber": 10, "headSha": "ace89ea6b0e208c3b7ec47a9b50ebd7176d30f3d", "verdict": "VERIFIED", "ledger": "live-ui-verified", "certainty": 5, "evidence": "npm test 354 pass, 0 fail, 0 skipped; tsc --noEmit exit 0; dd selftest exit 0 (happy/policy/walkover/close drafted,failed,drafted,drafted); dd doctor node/data/config/targets/port pass; control.sh doctor pass (port fail 45920 in use). sha256 11/11 match. Journeys ok offOrigin [] scrollWidth=width small=[]: empty No open PRs; seeded 390 dark/light, 430 dark, 1280 light/dark summary 9 open PRs merge-safe through none re-run #1, #2 docs-only why on the closed row; tuesday merge-safe through #9 re-run none; Ledger link on the board. Smoke: Add pick queued intake, intake.jsonl +1, events.jsonl unchanged, pick p-20261020-01 drafted Single pass BASE no reload. Safety Q14/Q16 pass: sha256 64f56556d3f6498937abf20a0dc6538b5ee73166f7e678d2385309a42a52e2f6 unchanged after POST PUT DELETE; hostile/edges/evil painted with no img/script/iframe/svg/on*, hrefs allowed, storage untouched. Live POST/PUT/DELETE /api/ledger 404 and the same sha256; live offOrigin [].", "fixLoops": 0}
```
SKILL-NOTES: none