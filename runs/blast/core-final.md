The merge call can say a head is safe when a newer physical failed on that same head, and a retried `dd record` appends a second event. Both are in the engine the per-pick suites do not exercise. I ran the CLI and the real fold. Repo left untouched at `ace89ea`.

## What it does

`dd` appends one JSONL log per pick and a second log, `ledger.jsonl`. `reduce` rebuilds a pick from its log. The film room picks the graft base. Lessons, the linter, and big-board stats fold those same logs. `seasonLedger` is the merge call Boyd would read: stack order, then `mergeSafeThrough` as the longest prefix whose status is `fresh` or `docs-only`.

Two things the diffs leave implicit. Record idempotency is type plus key, and for launches, failures, judge passes, verdicts, and fix loops the CLI derives that key from a counter it just counted in the log. The merge call's "last verdict" is the last row after a fixed source order, every ledger line after every pick verdict, and `loadLogs` turns one bad JSONL line into "no events."

## The one fact it's safe because of

The design treats two facts as load-bearing. Both were run (step 4). Both failed.

**1. Recording the same event twice keeps one copy.** `docs/ARCHITECTURE.md:127` and SPEC-001 A5. `test/cli.test.ts:104` only re-records `scouting_report_written`, whose key is the constant `report`.

A second `candidate_failed` for the same candidate is a new key. On an `n=1` pick the candidate ends `dropped`, and with one duplicate launch plus one real failure `next` waits on that candidate forever (`relaunches` already 1, status still `running`).

```
drop log:
5 candidate_failed fail:c1:1
6 candidate_failed fail:c1:2
7 candidate_dropped drop:c1
c1 status=dropped failures=2

STUCK {"status":"running","failures":1,"relaunches":1,"next":"wait","waitingOn":["c1"]}

same verdict file twice → verdict:1 and verdict:2
fix twice → fix:1 and fix:2, fixLoops=2
judge twice → judge-launch:1 and judge-launch:2
```

The counter is here:

```165:169:src/cli/dd.ts
    if (type === "candidate_failed") {
      return { payload: { cand, attempt: countOf(events, "candidate_failed", cand) + 1 } };
    }
    if (type === "candidate_launched") {
      const attempt = countOf(events, "candidate_launched", cand) + 1;
```

`verdict_recorded` uses `verdicts.length + 1` (`src/cli/dd.ts:241`), `fix_requested` uses `fixLoops + 1` (`src/cli/dd.ts:244`), `judge_launched` uses `judgeLaunches + 1` (`src/cli/dd.ts:186`). The no-op check compares that freshly built key (`src/cli/dd.ts:276`).

**2. `mergeSafeThrough` means the current head's latest verdict is VERIFIED, or the only movement since the last VERIFIED is under `docs/`.** The fold's last row is not the latest in time.

A pick verdict at `2026-10-18` says `NOT_VERIFIED` on head `aaa…`. A ledger verdict at `2026-10-01` says `VERIFIED` on that same head. Result:

```
1 open PR · stack #2 (1) · merge-safe through #2 · re-run none · 1 fresh
sequence pick NOT_VERIFIED, then ledger VERIFIED
```

`src/core/ledger.ts:448` pushes every pick verdict, then `src/core/ledger.ts:456` pushes ledger verdicts sorted only among themselves. `src/core/ledger.ts:507` takes the last row whose SHA is the head. `src/core/ledger.ts:589` treats `fresh` as merge-safe.

## Risks

**1. A revival double-records attempt-keyed events.** `src/cli/dd.ts:165`, `src/core/events.ts:46`. Likelihood high (the architecture's own revival case). Cost: that candidate is dropped, or its only relaunch is burned and `next` waits forever; a repeated verdict or fix burns the two-loop cap (`fixLoops` was already 2). Check: the script below.

**2. An older ledger VERIFIED hides a newer pick NOT_VERIFIED, and the CLI prints merge-safe.** `src/core/ledger.ts:448`, `src/core/ledger.ts:514`. Likelihood medium whenever a physical is stored on the pick and an earlier `dd ledger record` covered that SHA. Cost: Boyd merges a head a later physical failed. Proof is the fold output above.

**3. A crash mid-append of `events.jsonl` makes that pick's failing verdict disappear, and the same head becomes docs-only merge-safe.** `readEvents` throws on the torn line (`src/store/eventlog.ts:67`). `commitPick` then throws and does not repair. `loadLogs` stores `events: null` (`src/store/eventlog.ts:90`). The fold skips it as `unreadable` and classifies from the remaining ledger drift (`src/core/ledger.ts:520`). Likelihood low-medium (kill during `appendFile`). Cost: same false merge. Proof:

```
intact: failed, mergeSafeThrough=null, why=NOT_VERIFIED at aaaaaaa
after a torn tail: docs-only, mergeSafeThrough=8
dd ledger exit=0
summary=1 open PR · stack #8 (1) · merge-safe through #8 · re-run none · 1 docs-only
```

Same check also accepts `docs/./src/core/reducer.ts` as docs-only (`mergeSafeThrough=4`). `docs/../src/core/reducer.ts` is rejected (`bad files`). A `git diff --name-only` path will not contain `./`; a hand-built drift list can.

**4. `withLock` stops being a lock after 10 seconds, and the holder deletes the new owner's lock.** `src/store/eventlog.ts:8`, `src/store/eventlog.ts:26`, `src/store/eventlog.ts:20`. Likelihood low for today's critical sections (they are a read plus an append). Cost: two appends, duplicate `seq`, or a second writer entering while the first is still in `fn`. Proof: four 40ms sections overlapped 0 (`maxInside=1`). A 12s section did not:

```
b-enter …71307
a-leave …72802
c-enter …73308
cWaitMs=2
b-leave …73308
```

B entered while A was inside. A's `finally` unlinked the file. C took the lock in 2ms, before B left.

**5. Two `dd intake --from-inbox` processes duplicate every inbox row.** The cursor is read and picks are created with no lock around that pair (`src/cli/dd.ts:321`). Likelihood medium if the War Room pickup and a revival both run. Cost: two picks per idea, double the combine spend. Proof: 20 inbox lines, two concurrent processes, 40 pick directories. Run back to back: 20, then `{"picks":[]}`.

**6. The tie rule scores each winner from the later pass, so a pass-2 card that omits `diff` drops the smaller diff.** `src/core/filmroom.ts:239`. F8/F9 copy the same diff onto both passes, so they stay green. Likelihood medium-low (a reversed-pass card leaves `diff` out). Cost: the graft base is the larger diff. Proof, real `reduce` plus `filmRoom`: pass 1 winner `c1` at 50 lines, pass 2 winner `c2`, `c1`'s pass-2 card has no diff. Base `c2`, reason `diff_lines (250 vs missing)`.

## Cleared

- `scouting_report_written` and `candidate_finished` are real no-ops on a second `dd record` (second result `noop=true`). Their keys do not include a counter.
- Sections that finish in milliseconds do exclude each other (`maxInside=1`).
- A second sequential `dd intake --from-inbox` creates nothing.
- `appendLedger` does not glue a torn tail. It inserts a newline first (`src/store/ledger.ts:43`). The torn line is skipped as `not JSON`; the following verdict parses. One parsed entry, one skip.
- Pick ids are UTC. `2026-10-19T02:30:00.000Z` formats as `p-20261019-01` in both `Pacific/Honolulu` and `Pacific/Kiritimati`. Local `getDate()` was 18 and 19, so the zone actually changed. `dd` stamps `toISOString()`, which stayed `…Z`.
- The event envelope and `payload.physical` are the same shape as scaffold `f51dae8`. `checks` on a scouting report is optional (linter commit `2565267`). A nested verdict reduces to one `Physical`. A flat verdict payload reduces to `physical: undefined`, and the ledger's `goodVerdict` drops it.
- Drift file `src/core/reducer.ts` stays `stale` (`mergeSafeThrough=null`). `README.md` stays `stale`. `docs/../src/core/reducer.ts` is `bad files`.
- Runtime here is Node v22.14.0. Scripts and `dd doctor` are Node (`--experimental-strip-types`, `process.versions.node`). Bun is not installed, and the engine has no Bun branch. This is step 2 on the Bun question.

## Before you merge

This exits 1 on the false merge-safe call and on a retried failure. It uses the real fold and the real CLI.

```bash
node --experimental-strip-types /tmp/blast-catch.mjs
```

```javascript
// /tmp/blast-catch.mjs
import { execFile } from "node:child_process";
import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";
import { seasonLedger } from "/workspace/src/core/ledger.ts";
import { commitPick, loadLogs } from "/workspace/src/store/eventlog.ts";
import { appendLedger, readLedgerFile } from "/workspace/src/store/ledger.ts";

const exec = promisify(execFile);
const HEAD = "a".repeat(40);
const pickId = "p-20261019-02";
const data = await mkdtemp(join(tmpdir(), "dd-catch-"));
await commitPick(data, pickId, () => [
  { ts: "2026-10-18T18:00:00.000Z", type: "pick_created", by: "dd", key: "pick",
    payload: { id: pickId, idea: "ledger", source: "chat", target: "BoydVC/draft-day", n: 1, approval: "ask" } },
  { ts: "2026-10-18T18:30:00.000Z", type: "verdict_recorded", by: "dd", key: "verdict:1",
    payload: { attempt: 1, physical: { prNumber: 2, headSha: HEAD, verdict: "NOT_VERIFIED", ledger: "verifier-failed", certainty: 5, evidence: ["newer physical failed"], fixLoops: 0 } } },
]);
await appendLedger(data, [JSON.stringify({
  kind: "pr", at: "2026-10-19T00:00:00.000Z", repo: "BoydVC/draft-day", number: 2,
  title: "film", headRef: "dd/p1", headSha: HEAD, baseRef: "main", draft: true, state: "open", merged: false,
}), JSON.stringify({
  kind: "verdict", at: "2026-10-01T00:00:00.000Z", repo: "BoydVC/draft-day", number: 2,
  headSha: HEAD, verdict: "VERIFIED", ledger: "live-ui-verified", certainty: 5,
})]);
const ledger = seasonLedger(await loadLogs(data), await readLedgerFile(data, ["BoydVC/draft-day"]), "BoydVC/draft-day", Date.parse("2026-10-19T14:00:00Z"));
const row = ledger.rows.find((item) => item.number === 2);
if (row?.status === "fresh" || ledger.mergeSafeThrough === 2) {
  console.error(`FAIL merge-safe ${ledger.mergeSafeThrough} status=${row?.status} over a newer NOT_VERIFIED`);
  process.exit(1);
}
console.log("merge call kept the newer failure");
```

The retry half, after an `--approval auto --n 1` intake and a scouting report, is two `dd record <id> candidate_failed --cand c1` calls. The safe result is a second `"noop": true` and a candidate that is still `error`, not `dropped`. Today the second call appends `fail:c1:2` and `candidate_dropped`.

Full probes that produced the pasted output: `/tmp/blast-core.mjs`, `/tmp/blast-follow.mjs`.

BLAST: 6 confirmed, 8 cleared, safety-fact unproven
