The season ledger is on `dd/p8-season-ledger-c` at `a6d412680a1ec4e9db65d33488b2a8e6753335ce`. No pull request was opened.

At 390 the merge order is labeled stacked rows. At 1280 the same DOM is a table.

<img alt="Season ledger at 390 dark" src="/opt/cursor/artifacts/war-room/ledger-390-dark.png" />
<img alt="Season ledger table at 1280 light" src="/opt/cursor/artifacts/war-room/ledger-1280-light.png" />
<img alt="Big Board Ledger link at 390 dark" src="/opt/cursor/artifacts/war-room/board-ledger-link-390-dark.png" />

```dd-report
{"branch":"dd/p8-season-ledger-c","headSha":"a6d412680a1ec4e9db65d33488b2a8e6753335ce","summary":"The season ledger folds reduce() verdicts and the append-only book into fresh, docs-only, stale, failed, and unverified, and each row opens onto that proof.","commands":[{"cmd":"npm test","exit":0},{"cmd":"npx tsc --noEmit","exit":0}],"tests":{"added":18,"passing":true},"screenshots":["docs/screens/p8-season-ledger/ledger-390-dark.png","docs/screens/p8-season-ledger/ledger-390-light.png","docs/screens/p8-season-ledger/ledger-430-dark.png","docs/screens/p8-season-ledger/ledger-1280-light.png","docs/screens/p8-season-ledger/ledger-1280-dark.png","docs/screens/p8-season-ledger/ledger-tuesday-390-dark.png","docs/screens/p8-season-ledger/ledger-empty-390-dark.png","docs/screens/p8-season-ledger/board-ledger-link-390-dark.png"],"risks":[]}
```

START `93dca59db747e8306ab460e38d7ddf978031987e` (`dd/p7-big-board`).

What works: `npm test` is 336 passing, including Q1–Q18. `tsc --noEmit` exits 0. `dd selftest` prints `happy p-20261019-01 drafted`, `policy p-20261019-02 failed`, `walkover p-20261019-03 drafted`, `close p-20261019-04 drafted`. Standalone `dd doctor` prints `node: pass 22.14.0`, `data: pass`, `config: pass`, `targets: pass 1`, `port: pass 4420`. All eleven fixture sha256 values match the spec, and `git diff --quiet START` on the do-not-touch set prints `untouched`. `http.ts` changes are one import, `GET /api/ledger`, and the static files line. The six closed-list files change by exactly the 15 sanctioned lines (`2+2+2+1+4+4`). `seed-ledger` and `seed-ledger tuesday` both match their summaries. Every phone probe is `ok: true` with empty `problems` and `offOrigin`.

What does not: nothing in the VERIFY list is unfinished.

Screenshots, committed and under `/opt/cursor/artifacts/war-room/`:

- `docs/screens/p8-season-ledger/ledger-390-dark.png`
- `docs/screens/p8-season-ledger/ledger-390-light.png`
- `docs/screens/p8-season-ledger/ledger-430-dark.png`
- `docs/screens/p8-season-ledger/ledger-1280-light.png`
- `docs/screens/p8-season-ledger/ledger-1280-dark.png`
- `docs/screens/p8-season-ledger/ledger-tuesday-390-dark.png`
- `docs/screens/p8-season-ledger/ledger-empty-390-dark.png`
- `docs/screens/p8-season-ledger/board-ledger-link-390-dark.png`

Probe lines (`ok`, `scrollWidth`, `problems`, `offOrigin`):

```json
{"url":"http://127.0.0.1:45920/#/ledger","width":390,"scheme":"dark","ok":true,"scrollWidth":390,"problems":[],"offOrigin":[]}
{"url":"http://127.0.0.1:45920/#/ledger","width":390,"scheme":"dark","ok":true,"scrollWidth":390,"problems":[],"offOrigin":[]}
{"url":"http://127.0.0.1:45920/#/ledger","width":390,"scheme":"light","ok":true,"scrollWidth":390,"problems":[],"offOrigin":[]}
{"url":"http://127.0.0.1:45920/#/ledger","width":430,"scheme":"dark","ok":true,"scrollWidth":430,"problems":[],"offOrigin":[]}
{"url":"http://127.0.0.1:45920/#/ledger","width":1280,"scheme":"light","ok":true,"scrollWidth":1280,"problems":[],"offOrigin":[]}
{"url":"http://127.0.0.1:45920/#/ledger","width":1280,"scheme":"dark","ok":true,"scrollWidth":1280,"problems":[],"offOrigin":[]}
{"url":"http://127.0.0.1:45920/#/","width":390,"scheme":"dark","ok":true,"scrollWidth":390,"problems":[],"offOrigin":[]}
{"url":"http://127.0.0.1:45920/#/ledger","width":390,"scheme":"dark","ok":true,"scrollWidth":390,"problems":[],"offOrigin":[]}
```

The first line is the empty book. The last line is Tuesday. The `#/` line is the Big Board Ledger link.

Safety-fact proof:

```text
safety-fact http sha256=64f56556d3f6498937abf20a0dc6538b5ee73166f7e678d2385309a42a52e2f6 unchanged=true post=404 put=404 delete=404
safety-fact dom hostile=text edges=text evil-hrefs=none storage=0 markup-nodes=0
```

Hostile and edges paint with no `img`, `script`, `iframe`, `svg`, or `on*` attribute. Titles and notes that contain `<img`, `<script>`, `<svg>`, and `<iframe` stay text. A hand-made ledger with repo `evil.example/x` and pick id `p-20261018-77"><img src=x>` produces no external href. Storage, cookie, and history traps stay at 0. Every probe `offOrigin` is `[]`.

Stack probe: `on-stack`. `git fetch origin dd/p7-big-board` then `FETCH_HEAD` is `93dca59db747e8306ab460e38d7ddf978031987e`. START_REF unchanged. `git diff --name-only START...HEAD` stays inside the touch map, including the eight screenshots.

Open questions: none.
