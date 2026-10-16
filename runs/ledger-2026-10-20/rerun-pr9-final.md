Draft PR #9 at `93dca59db747e8306ab460e38d7ddf978031987e` is verified. The War Room was launched from this checkout, driven in Chrome, and then cleaned up. Nothing was committed or pushed.

**Gates.** `npm test`: 318 pass, 0 fail, 0 skipped. `npx tsc --noEmit` exit 0. `dd selftest` exit 0: `happy p-20261020-01 drafted`, `policy p-20261020-02 failed`, `walkover p-20261020-03 drafted`, `close p-20261020-04 drafted`. `dd doctor` exit 0 (`node`, `data`, `config`, `targets`, and `port` all pass on a free port). `control.sh doctor` passed on the live server (`port: fail 45920 in use` while the other four checks passed). All seven `test/fixtures/bigboard/*` sha256 values match SPEC-008.

**Journeys.** After `seed-bigboard`, `GET /api/stats` was `13 picks · 9 drafted · verified 9/10 (2 first try) · 10 trades grafted` with `excluded.selftest` 4. These probes were `"ok":true`, `"offOrigin":[]`, and `scrollWidth` within the viewport: 390×844 dark and light, 430×932 dark, 1280×800 light and dark (sections in columns), Apply with Since `2026-10-17` (`#/stats?since=2026-10-17`, summary `6 picks · 4 drafted · verified 4/4 (2 first try) · 9 trades grafted`), `#/stats?until=2026-10-01` (`No picks yet`), and the Big Board at 390 dark with `Stats`. Screenshots and probe JSON are under `/opt/cursor/artifacts/war-room/`.

**Smoke and side effects.** The seeded board showed the War Room heading, drafted and failed chips, and run counts. Submitting `Show the run count in the page title` added a `queued` inbox row without a reload. `GET /api/board` included that inbox row, `intake.jsonl` grew by one line, and the four `events.jsonl` files were unchanged. Opening the happy pick from its link landed on `#/picks/p-20261020-01` with the drafted chip, the scouting restatement, and a scorecard marked `BASE` and `Single pass`. A trades link on `#/stats` opened `#/picks/p-20261010-07` with `offOrigin` `[]`. At 1280 the pre-existing Big Board links (`Locker Room`, the pick ids, `Add pick`) and the pick-page `Big Board` and `Draft PR` links are under 44×44. The `Stats` link was not in that set, and every stats-view probe at 1280 was `"ok":true`.

**Safety fact.** No pick log, and no sequence of opening stats, changing the window, or following its links, made the War Room request anything off-origin, render log text as markup, draw an href from anything but a valid pick id, or store anything. Harness proof exit 0:

```json
{
  "ok": true,
  "summary": "1 pick · 1 drafted · verified 1/1 (1 first try) · 3 trades grafted",
  "excludedSelftest": 1,
  "angleNames": [
    "<img src=x onerror=alert(1)>Rule ledger",
    "</li><script>alert(3)</script><a href=\"javascrip",
    "javascript"
  ],
  "painted": {
    "hrefs": ["#/picks/p-20261018-73"],
    "poisonedAsText": true,
    "poisonedAsHref": false
  },
  "sequence": {
    "hashWrites": ["#/stats", "#/stats?since=2026-10-17", "#/stats?since=2026-10-17", "#/picks/p-20261018-73", "#/", "#/stats"],
    "fetches": ["/api/stats", "/api/stats?since=2026-10-17", "/api/picks/p-20261018-73", "/api/board", "/api/stats"],
    "eventSources": ["/api/events"]
  },
  "storageHits": [],
  "historyHits": [],
  "grepHits": [],
  "problems": []
}
```

The painted tree had no `img`, `iframe`, `svg`, or `on*` attribute. The poisoned id `p-20261018-77"><img src=x>` was text. A live Chrome load of `#/stats?since=2026-10-17` reported `offOrigin: []`, `localStorage` length 0, `sessionStorage` length 0, an empty cookie, and `history.state` null. The only `script` nodes were the page’s own same-origin scripts.

`control.sh cleanup` removed the server and its data directory. The screenshots are still in `/opt/cursor/artifacts/war-room/`.

```dd-verdict
{"prNumber": 9, "headSha": "93dca59db747e8306ab460e38d7ddf978031987e", "verdict": "VERIFIED", "ledger": "live-ui-verified", "certainty": 5, "evidence": "npm test 318 pass, 0 fail, 0 skipped; tsc --noEmit exit 0; selftest exit 0 (happy drafted, policy failed, walkover drafted, close drafted); doctor exit 0 and control.sh doctor pass; sha256 7/7 match; 8 stats probes ok true offOrigin [] including window summary 6 picks and empty No picks yet; new-pick inbox line with events.jsonl unchanged; pick page drafted with BASE and Single pass; safety proof ok true, storageHits [], historyHits [], live offOrigin []", "fixLoops": 0}
```
SKILL-NOTES: none