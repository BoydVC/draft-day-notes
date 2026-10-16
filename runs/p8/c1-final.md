The Season Ledger is on `dd/p8-season-ledger-a` at `34e82bfce5469ec5f5d44d6163fee86ef1c7d1d3`, pushed to origin. No pull request was opened.

`npm test` passed (336 tests). `npx tsc --noEmit` exited 0. `dd selftest` printed `DATA_DIR=/tmp/dd-selftest-vLXPQE`, `happy p-20261019-01 drafted`, `policy p-20261019-02 failed`, `walkover p-20261019-03 drafted`, `close p-20261019-04 drafted`. `dd doctor` printed `node: pass 22.14.0`, `data: pass /workspace/data`, `config: pass`, `targets: pass 1`, `port: pass 4420`. The eleven fixture hashes match the spec. `git diff --quiet START --` the do-not-touch list printed `untouched`.

`src/server/http.ts` against START:

```diff
@@ -13,6 +13,8 @@ import {
   lintScoutingReport,
   loadConfig,
   loadTargets,
+  ledgerJson,
+  seasonLedger,
   parseLintDocument,
   parseTargetRepo,
   filmRoom,
@@ -26,6 +28,7 @@ import {
 import type { DraftEvent } from "../core/events.ts";
 import { appendInbox, inboxCursor, readInbox } from "../store/inbox.ts";
 import { loadLogs, loadPicks, readEvents, signature } from "../store/eventlog.ts";
+import { readLedgerFile } from "../store/ledger.ts";
@@ -300,7 +303,19 @@ export async function startServer(options: ServerOptions): Promise<{
-    const files = ["/", "/index.html", "/app.js", "/styles.css", "/timeline.js", "/timeline.css", "/lessons.js", "/lessons.css", "/replay.js", "/replay.css", "/linter.js", "/linter.css", "/bigboard.js", "/bigboard.css"];
+    if (req.method === "GET" && path === "/api/ledger") {
+      const targets = await loadTargets(options.targetsPath);
+      if (targets.length === 0) {
+        send(res, 500, { error: "no targets" });
+        return;
+      }
+      const payload = `${ledgerJson(seasonLedger(await loadLogs(options.dataDir), await readLedgerFile(options.dataDir, targets), targets[0] ?? "", Date.now()))}\n`;
+      res.writeHead(200, { "content-type": "application/json", "cache-control": "no-store" });
+      res.end(payload);
+      return;
+    }
+
+    const files = ["/", "/index.html", "/app.js", "/styles.css", "/timeline.js", "/timeline.css", "/lessons.js", "/lessons.css", "/replay.js", "/replay.css", "/linter.js", "/linter.css", "/bigboard.js", "/bigboard.css", "/ledger.js", "/ledger.css"];
```

The six closed-list files change only the fifteen sanctioned lines: sheets end `"bigboard.css", "ledger.css"`, scripts end `"bigboard.js", "ledger.js", "app.js"`, the linter pooled slice is `+ 5` with `ledger.js`, and the big-board pooled linter slice is `+ 4` with `ledger.js`.

```dd-report
{"branch":"dd/p8-season-ledger-a","headSha":"34e82bfce5469ec5f5d44d6163fee86ef1c7d1d3","summary":"Season ledger: one kind table, a six-phase fold over reduce(), a locked CLI append, and an ordered #/ledger list.","commands":[{"cmd":"npm test","exit":0}],"tests":{"added":18,"passing":true},"screenshots":["docs/screens/p8-season-ledger/ledger-390-dark.png","docs/screens/p8-season-ledger/ledger-390-light.png","docs/screens/p8-season-ledger/ledger-430-dark.png","docs/screens/p8-season-ledger/ledger-1280-light.png","docs/screens/p8-season-ledger/ledger-1280-dark.png","docs/screens/p8-season-ledger/ledger-tuesday-390-dark.png","docs/screens/p8-season-ledger/ledger-empty-390-dark.png","docs/screens/p8-season-ledger/board-ledger-link-390-dark.png"],"risks":[]}
```

START `93dca59db747e8306ab460e38d7ddf978031987e`

What works: Q1–Q18, the real and Tuesday summaries, empty `No open PRs`, `seed-ledger` byte-identical to `ledger-real.jsonl`, and every probe `ok: true` with `offOrigin: []`. The Big Board shows `Ledger`. Cleanup left the screenshots in place.

What does not: nothing in the verify list.

Screenshot paths:

- `docs/screens/p8-season-ledger/ledger-390-dark.png`
- `docs/screens/p8-season-ledger/ledger-390-light.png`
- `docs/screens/p8-season-ledger/ledger-430-dark.png`
- `docs/screens/p8-season-ledger/ledger-1280-light.png`
- `docs/screens/p8-season-ledger/ledger-1280-dark.png`
- `docs/screens/p8-season-ledger/ledger-tuesday-390-dark.png`
- `docs/screens/p8-season-ledger/ledger-empty-390-dark.png`
- `docs/screens/p8-season-ledger/board-ledger-link-390-dark.png`

Copies are also under `/opt/cursor/artifacts/war-room/`.

Probe lines (`ok`, `scrollWidth`, `problems`, `offOrigin`):

- empty 390 dark: `true`, `390`, `[]`, `[]`
- ledger 390 dark: `true`, `390`, `[]`, `[]`
- ledger 390 light: `true`, `390`, `[]`, `[]`
- ledger 430 dark: `true`, `430`, `[]`, `[]`
- ledger 1280 light: `true`, `1280`, `[]`, `[]`
- ledger 1280 dark: `true`, `1280`, `[]`, `[]`
- board 390 dark: `true`, `390`, `[]`, `[]`
- tuesday 390 dark: `true`, `390`, `[]`, `[]`

Safety-fact proof:

```
safety-fact: sha256 64f56556d3f6498937abf20a0dc6538b5ee73166f7e678d2385309a42a52e2f6 unchanged after POST PUT DELETE
safety-fact: hostile edges evil painted; no img/script/iframe/svg/on*; hrefs allowed; storage untouched
```

Every probe `offOrigin` is `[]`.

Stack probe:

```
on-stack
FETCH_HEAD=93dca59db747e8306ab460e38d7ddf978031987e
START_REF unchanged
```

Open questions: none.
