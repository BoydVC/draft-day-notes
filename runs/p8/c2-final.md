The season ledger is on `dd/p8-season-ledger-b` at `c0cb80a7529ce0d3d78796f89b20bdac19ea6699`. No pull request was opened.

At 390 dark the first three rail cards end at y=816 inside an 844px screen: the merge call, the re-run sentence, and cards for #1, #2, and #3 are all on screen. Tuesday reads merge-safe through #9.

<img alt="390 dark merge desk: Not merge-safe yet, re-run #1, first three cards" src="/opt/cursor/artifacts/war-room/ledger-390-dark.png" />
<img alt="Tuesday 390 dark: Merge-safe through #9, stack clear" src="/opt/cursor/artifacts/war-room/ledger-tuesday-390-dark.png" />
<img alt="Big Board 390 dark with the Ledger link" src="/opt/cursor/artifacts/war-room/board-ledger-link-390-dark.png" />

```dd-report
{"branch":"dd/p8-season-ledger-b","headSha":"c0cb80a7529ce0d3d78796f89b20bdac19ea6699","summary":"Season ledger tells Boyd how far the stack is merge-safe and which PRs to re-run, from dd ledger, GET /api/ledger, and a phone rail.","commands":[{"cmd":"npm test","exit":0},{"cmd":"npx tsc --noEmit","exit":0},{"cmd":"node --experimental-strip-types src/cli/dd.ts selftest","exit":0}],"tests":{"added":18,"passing":true},"screenshots":["docs/screens/p8-season-ledger/ledger-390-dark.png","docs/screens/p8-season-ledger/ledger-390-light.png","docs/screens/p8-season-ledger/ledger-430-dark.png","docs/screens/p8-season-ledger/ledger-1280-light.png","docs/screens/p8-season-ledger/ledger-1280-dark.png","docs/screens/p8-season-ledger/ledger-tuesday-390-dark.png","docs/screens/p8-season-ledger/ledger-empty-390-dark.png","docs/screens/p8-season-ledger/board-ledger-link-390-dark.png"],"risks":[]}
```

START `93dca59db747e8306ab460e38d7ddf978031987e` on `dd/p7-big-board`.

**What works.** `npm test` is 336 pass, 0 fail (18 new, Q1–Q18). `npx tsc --noEmit` exited 0. `dd selftest` printed `DATA_DIR=/tmp/dd-selftest-CETEXK`, `happy p-20261019-01 drafted`, `policy p-20261019-02 failed`, `walkover p-20261019-03 drafted`, `close p-20261019-04 drafted`. `dd doctor` printed `node: pass 22.14.0`, `data: pass /workspace/data`, `config: pass`, `targets: pass 1`, `port: pass 4420`. All eleven fixture sha256 values match the spec. `git diff --quiet START --` the do-not-touch paths printed `untouched`. `seed-ledger` printed `seeded ledger` and `seed-ledger tuesday` printed `seeded ledger tuesday`. Every phone probe printed `"ok":true` and `"offOrigin":[]`. Cleanup left the screenshots in place. `gh pr list --head dd/p8-season-ledger-b` is empty.

**What does not.** The VERIFY list is complete on this branch.

**Screenshot paths**

- `docs/screens/p8-season-ledger/ledger-390-dark.png`
- `docs/screens/p8-season-ledger/ledger-390-light.png`
- `docs/screens/p8-season-ledger/ledger-430-dark.png`
- `docs/screens/p8-season-ledger/ledger-1280-light.png`
- `docs/screens/p8-season-ledger/ledger-1280-dark.png`
- `docs/screens/p8-season-ledger/ledger-tuesday-390-dark.png`
- `docs/screens/p8-season-ledger/ledger-empty-390-dark.png`
- `docs/screens/p8-season-ledger/board-ledger-link-390-dark.png`

Same eight files are also under `/opt/cursor/artifacts/war-room/`.

**Probe lines** (`ok`, `scrollWidth`, `problems`, `offOrigin`)

- empty `#/ledger` 390×844 dark: `true`, `390`, `[]`, `[]`
- `#/ledger` 390×844 dark: `true`, `390`, `[]`, `[]`
- `#/ledger` 390×844 light: `true`, `390`, `[]`, `[]`
- `#/ledger` 430×932 dark: `true`, `430`, `[]`, `[]`
- `#/ledger` 1280×800 light: `true`, `1280`, `[]`, `[]`
- `#/ledger` 1280×800 dark: `true`, `1280`, `[]`, `[]`
- `#/` 390×844 dark: `true`, `390`, `[]`, `[]`
- tuesday `#/ledger` 390×844 dark: `true`, `390`, `[]`, `[]`

Verify-server doctor: `node: pass 22.14.0`, `data: pass /tmp/dd-verify-data-kxC5`, `config: pass`, `targets: pass 1`, `port: fail 45920 in use`, `doctor: pass http://127.0.0.1:45920 pid 6571`.

**Safety-fact proof**

```
hostile: tags=62 hrefs=4 banned=0 on=0 storageHits=0 offOriginCalls=0
edges: tags=154 hrefs=32 banned=0 on=0 storageHits=0 offOriginCalls=0
evil: tags=59 hrefs=0 banned=0 on=0 storageHits=0 offOriginCalls=0
POST /api/ledger 404 {"error":"not found"}
PUT /api/ledger 404 {"error":"not found"}
DELETE /api/ledger 404 {"error":"not found"}
GET /api/ledger 200 {"repo":"BoydVC/draft-day","summary":"9 open PRs · stack #1→#9 (8) · merge-safe
ledger sha256 before 64f56556d3f6498937abf20a0dc6538b5ee73166f7e678d2385309a42a52e2f6
ledger sha256 after  64f56556d3f6498937abf20a0dc6538b5ee73166f7e678d2385309a42a52e2f6
sha256 unchanged
safety fact: pass
```

Probe `offOrigin` on every line above is `[]`.

**Stack probe**

```
on-stack
93dca59db747e8306ab460e38d7ddf978031987e
START_REF unchanged
```

`git diff --name-only START...HEAD` is only touch-map paths: the skill files, `docs/DECISIONS.tsv`, the eight screenshots, `src/cli/dd.ts`, `src/core/index.ts`, `src/core/ledger.ts`, `src/server/http.ts`, `src/store/ledger.ts`, `src/ui/app.js`, `src/ui/index.html`, `src/ui/ledger.css`, `src/ui/ledger.js`, `test/ledger.test.ts`, `test/phone.test.ts`, the eleven fixtures, and the six closed-list test files.

`git diff START -- src/server/http.ts` is one import, the `GET /api/ledger` handler, and `"/ledger.js", "/ledger.css"` on the static files line. `git diff START --` the six closed-list files is the fifteen sanctioned stylesheet and script lines (2+2+2+1+4+4). `git diff START -- src/cli/dd.ts` is the ledger import, `readStdin` through `ledgerCommand`, the three help lines, and `case "ledger"`.

**Open questions.** None.
