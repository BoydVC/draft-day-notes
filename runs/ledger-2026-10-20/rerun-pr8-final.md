Re-verified draft PR #8 at `dc38660f2f3fdaadcfd2e879693e24cb21a05eba` on `dd/p6-linter`. Nothing was committed, pushed, or edited.

`npm test` finished with 286 tests, 286 pass, 0 fail, 0 skipped. `npx tsc --noEmit` exited 0. `dd selftest` exited 0 and printed `happy p-20261020-01 drafted`, `policy p-20261020-02 failed`, `walkover p-20261020-03 drafted`, and `close p-20261020-04 drafted`. `dd doctor` exited 0 (`node`, `data`, `config`, `targets`, and `port` all pass on 4420). All 12 `test/fixtures/linter/*` sha256 values match `docs/SPEC-007-scouting-linter.md`.

The War Room launched through `control.sh`, and `control.sh doctor` passed (the live server makes the `port:` line read `fail 45920 in use`). In the browser, the Big Board showed the four seeded picks. Adding `Show the run count in the page title` queued an inbox row with Pick `queued`, grew `intake.jsonl` by one line, and did not write `events.jsonl` or a new pick directory. The happy pick page showed `drafted`, the restatement, `Single pass`, `BASE`, `VERIFIED`, and `Draft PR #17`. At 1280 that page’s probe is `ok: false` only for the pre-existing Big Board link (74×22) and Draft PR link (85×17).

Linter journeys, all `ok: true`, `offOrigin: []`, `scrollWidth` within the viewport, and no control under 44×44:

- Fail `p-20261018-61`: `fail · 5 hard`, R1 `ok`, R2/R5/R14/R19/R20 `MISSING`, one column at 390 and three at 1280.
- Pass `p-20261018-62`: `data-ok="true"`, summary `pass`, six criteria `ok`, six EARS `ok`, angle pairs `0.00`.
- Pick page at 390 dark shows `Lint` → `#/picks/p-20261018-61/linter`.
- Pasting `good-replay.json` and pressing `Lint` flipped that fail panel to `pass`.

Safety fact, run in headless Chrome against the live panel (certainty 5). Opening the fail panel, pasting `hostile-markup.json`, and pasting `good-markdown.md` left `ok: true`:

```json
{"ok":true,"pass":{"openedFail":true,"missingEars":true,"hostileText":true,"hostileClean":true,"markdownPass":true,"storage":true,"offOrigin":true,"sameOriginPosts":true},"network":{"offOrigin":[]},"hostile":{"dataOk":"true","summary":"pass","bad":[],"onAttrs":[],"hrefs":["#/","#/picks/p-20261018-61"],"hits":{"localStorage":0,"sessionStorage":0,"cookie":0,"history":0}},"markdown":{"dataOk":"true","summary":"pass","ears":[["T1","ok"],["T2","ok"],["T3","ok"]]}}
```

Hostile strings stayed text. There was no `img`, `script`, `iframe`, or `on*` attribute. Every `href` was `#/` or `#/picks/…`. Storage and history hooks stayed at 0. The only new requests were same-origin `POST /api/lint-scout`. `control.sh cleanup` removed the server and data directory. Screenshots and `safety-proof.json` are under `/opt/cursor/artifacts/war-room/`.

```dd-verdict
{"prNumber": 8, "headSha": "dc38660f2f3fdaadcfd2e879693e24cb21a05eba", "verdict": "VERIFIED", "ledger": "live-ui-verified", "certainty": 5, "evidence": "npm test 286 pass / 0 fail / 0 skip; tsc --noEmit exit 0; selftest exit 0 happy/policy/walkover/close drafted-failed-drafted-drafted; dd doctor exit 0; 12/12 fixture sha256 match; control.sh launch+doctor+seed-linter; board 4 picks ok; new pick inbox+intake.jsonl +1 and events.jsonl unchanged; linter fail/pass/paste/pick-link probes ok true offOrigin [] scrollWidth<=width controls>=44; DOM fail R2/R5/R14/R19/R20 MISSING and paste/pass data-ok true; safety-proof ok true no markup/off-origin/storage", "fixLoops": 0}
```
SKILL-NOTES: features/linter.md tells you to paste into the Lint document box and press Lint via cdp-shot.mjs, but that driver has no type or click flag, so the paste only runs through --before; SKILL.md never says control.sh doctor still exits 0 when dd doctor prints port: fail because the War Room already holds the port.