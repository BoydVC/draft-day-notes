The season ledger page stays stale after a ledger write. Hostile event and PR text stays text in the running War Room.

## What it does

From `868f779` to `ace89ea` the War Room grew from one board into nine views (board, pick, replay, linter, lessons, stats, ledger) served by one file, `src/server/http.ts`. Each pick added a script, a stylesheet, and usually a route. The shell in `src/ui/index.html` loads all of them on every page. Live refresh is one `EventSource` on `/api/events`. The server polls `signature()` every 250ms and, when that string changes, sends `event: update` with a version number. The browser then refetches whatever view is open.

Two things that string does not say: `signature()` only stats each pick's `events.jsonl` and `intake.jsonl` (`src/store/eventlog.ts:130-147`). `ledger.jsonl`, which `GET /api/ledger` reads (`src/server/http.ts:306-315`), is not in it. And the phone wrapping rules that keep long strings inside the viewport live entirely inside `@media (max-width: 480px)` (`src/ui/styles.css:288-378`). Above that width a Big Board cell is an ordinary table cell.

## The one fact it's safe because of

Untrusted idea, lesson, verdict, and PR text is stored and returned as JSON, then inserted with `createTextNode` / `setAttribute`. Nothing in the UI assigns `innerHTML`. A `javascript:` agent id never becomes a link. A PR number that is the string `javascript:alert(1)` is prefixed to `https://github.com/BoydVC/draft-day/pull/...`, so the scheme stays `https:` and the host stays `github.com`.

**Certainty: 5.** Proved in the War Room launched by `.cursor/skills/verify-draft-day/helpers/control.sh` (`http://127.0.0.1:45920`), headless Chrome, hostile pick `p-20261019-50` plus a ledger title containing `<img src=x onerror="window.__xss=1"><script>window.__xss=2</script>`.

```
HOSTILE-PICK 200 {"id":"p-20261019-50","idea":"<img src=x onerror=\"window.__xss=1\"><script>...
DOM 1280 #/picks/p-20261019-50 {"xss":null,"tags":[],"inline":0,"textHasPayload":true,"textHasScript":true,
  hrefs:[...,"https://github.com/BoydVC/draft-day/pull/javascript:alert(1)",
         "https://cursor.com/agents/bc-11111111-2222-4333-8444-555555555555",
         "https://github.com/BoydVC/draft-day/pull/7", ...]}
DOM 390 #/ledger  {"xss":null,"tags":[],"textHasPayload":true,
  hrefs:["#/","https://github.com/BoydVC/draft-day/pull/99","https://github.com/BoydVC/draft-day/pull/99"]}
SCHEME javascript:alert(1) → protocol https: host github.com
SCHEME foo/../../evil.example → protocol https: host github.com
       href https://github.com/BoydVC/draft-day/evil.example
```

Same result on the board, lessons, stats, replay, and linter, at 390 and 1280: `window.__xss` stayed unset, and `#app` gained no `img`, `script`, `iframe`, `svg`, `object`, or `embed`. The SSE frame for an idea that contained `<img` was only:

```
retry: 1000

event: update
data: {"version":1}
```

## Risks

**1. The open Season ledger does not move when the ledger file does.** Likelihood: high whenever the page is open and someone runs `dd ledger record` or `import-prs`. Cost: the merge call on screen is the previous one. `src/server/http.ts:121-128` broadcasts only after `signature()` changes, and `src/store/eventlog.ts:130-147` never stats `ledger.jsonl`. The ledger view is refreshed from that same event (`src/ui/app.js:570-611`, `656-658`).

Proved in the running page. After appending PR #98, the DOM sat on the old summary for 1.2s while `GET /api/ledger` had already moved. An unrelated inbox POST then woke the same page, so the channel itself was connected:

```
NUDGE {"before":"Not merge-safe yet || 1 open PR · stack #99 (1) · merge-safe through none · re-run #99 · 1 unverified",
       "mid":"1 open PR · stack #99 (1) · merge-safe through none · re-run #99 · 1 unverified",
       "apiMid":"2 open PRs · stack #98 (1) · merge-safe through none · re-run #98 · 1 unverified · 1 off stack",
       "nudged":true,
       "after":"2 open PRs · stack #98 (1) · merge-safe through none · re-run #98 · 1 unverified · 1 off stack"}
```

How to check: the script below. It exits 1 while the signature ignores `ledger.jsonl`.

**2. An unbreakable idea scrolls the desktop board sideways.** Likelihood: whenever an idea, lesson, or inbox row contains a long token (a URL, a hash, a pasted line). Cost: the whole page, header included, scrolls horizontally. The 480px block in `src/ui/styles.css:328-348` turns `#big-board` cells into wrapping blocks. At 1280 those cells are a normal table (`src/ui/app.js:188-214`) with no `overflow-wrap`. A 120-character run of A's on `p-20261019-50`:

```
LAYOUT 390  #/  {"w":390,"sw":390,"overflow":false}
LAYOUT 1280 #/  {"w":1280,"sw":1815,"overflow":true,"offenders":["TABLE. right=1815","THEAD. right=1815","TR. right=1815"]}
LAYOUT 1280 #/picks/p-20261019-50 {"w":1280,"sw":1477,"overflow":true}
LAYOUT 1280 #/picks/p-20261019-01 {"w":1280,"sw":1280,"overflow":false}
```

The happy-path pick page at 1280 stayed at 1280. Phone probes at 390 would not see this. How to check: open `#/` at 1280 with that pick and compare `documentElement.scrollWidth` to `clientWidth`.

**3. Another page on 127.0.0.1 can append an inbox row.** Likelihood: low. It needs the War Room listening (default `127.0.0.1:4420` in `draftday.config.json`) and a page served from some other loopback port. Cost: one inbox row on the Big Board. It does not read the board back, and it does not merge. `POST /api/intake` (`src/server/http.ts:207-262`) JSON-parses the body and never looks at `Origin` or `Content-Type`.

A page on `http://127.0.0.1:45931` posted `text/plain` JSON. The row landed. The same page's `application/json` post did not, because that preflight is a 404 with no `Access-Control-Allow-*` header:

```
CSRF-INBOX {"before":4,"after":5,"plainLanded":true,"jsonLanded":false}
inbox offset 5: CSRF-LOOPBACK-MARKER
OPTIONS /api/intake → 404 {"error":"not found"}
```

How to check: from a second loopback origin, `fetch(war + "/api/intake", { method: "POST", headers: { "content-type": "text/plain" }, body })` and then `GET /api/board`.

## Cleared

- Traversal and odd methods do not escape the tree. Raw requests for `/../package.json`, `/%2e%2e/package.json`, `/app.js%2f%2e%2e%2f%2e%2e%2fpackage.json`, `/api/picks/..%2f..%2f..%2fetc%2fpasswd`, `/api/picks/p-20261019-01%00`, and `/api/picks/p-20261019-01%2f..%2f..%2fpackage.json` all returned 404 and none of the bodies contained `package.json` or `/etc/passwd`. `HEAD`, `OPTIONS`, `PUT`, `PATCH`, `DELETE`, `TRACE`, and `POST` on the read routes were 404. After all of those plus `POST /api/lint-scout`, the data directory hash was unchanged (4 files). Pick directory names stayed `p-YYYYMMDD-NN`. The `pick=../../package.json` query on `/api/lessons` is ignored and returns the empty window.
- The static allowlist matches the shell. Every `src` and `href` in the served `index.html` is one of `/`, `/index.html`, `/app.js`, `/styles.css`, `/timeline.js`, `/timeline.css`, `/lessons.js`, `/lessons.css`, `/replay.js`, `/replay.css`, `/linter.js`, `/linter.css`, `/bigboard.js`, `/bigboard.css`, `/ledger.js`, `/ledger.css`. Content types: HTML and the matching `text/javascript` / `text/css`, APIs `application/json`.
- Inbox live update works. `LIVE-BOARD-MARKER` showed up on the open board with `window.__boot` still 1, so the document did not reload.
- Phone layout holds with the hostile payload loaded. All nine routes at 390 had `scrollWidth === 390`. Replay's fixed bar was 116px tall against 128px of padding. The linter paste bar was 140px against 168px. Neither covered the page. The ledger title's computed `overflow-wrap` is `anywhere` (`src/ui/ledger.css:1-21`), and the ledger page at 1280 stayed 1280 wide with a 180-character token in the title.
- The duplicate globals are the same function. `el` in `app.js` and `linter.js` compare equal, and so do `count` in `bigboard.js` and `ledger.js`. `linter.js` loads after `replay.js` and its `function stop(){}` wins the global (`stop.length === 0`). `draftDayReplay.stop` was copied into the export at load time and is still the real one (`length === 1`).
- `test/guards.test.ts` passed on this tree: no Cursor or GitHub host under `src` except the relay's env-var URL, and tests import only `src/core/index.ts`, `src/cli/dd.ts`, and `src/server/http.ts`.
- `.dd-summary` in `bigboard.css` wins over the timeline rule and paints the decision-log summary at 17px. The pages still fit.

## Before you merge

This exits 1 today. It calls the real `signature()` the server polls. After a ledger append the string must change, or the open Season ledger will keep the old merge call:

```bash
node --experimental-strip-types --input-type=module <<'EOF'
import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { signature } from "./src/store/eventlog.ts";

const data = await mkdtemp(join(tmpdir(), "dd-sig-"));
const line = JSON.stringify({
  kind: "pr", at: "2026-10-19T18:10:00.000Z", repo: "BoydVC/draft-day", number: 98,
  title: "second row", headRef: "dd/x", headSha: "ef".repeat(20),
  baseRef: "main", draft: true, state: "open", merged: false,
});
const before = await signature(data);
await writeFile(join(data, "ledger.jsonl"), line + "\n");
const after = await signature(data);
console.log("before", JSON.stringify(before));
console.log("after ", JSON.stringify(after));
if (before === after) {
  console.error("BUG: ledger.jsonl is invisible to the live-update signature");
  process.exit(1);
}
console.log("signature moves when ledger.jsonl changes");
EOF
```

Against the running War Room, the same bug looks like this: open `#/ledger`, append a ledger line, wait a second, and read `[data-ledger="summary"]`. It stays on the old sentence while `GET /api/ledger` has the new one. `POST /api/intake` then refreshes that same page.

BLAST: 3 confirmed, 8 cleared, safety-fact proven
