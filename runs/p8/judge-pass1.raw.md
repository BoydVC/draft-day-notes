Pass 1 is a three-way tie on the rubric. Every label clears the gates and the pooled file 18/18. The advisory base is C, because the weighted means match and C’s diff is the smallest.

```dd-judgement
{"passes":[{"order":["A","B","C"],"cards":[{"label":"A","gates":{"build":"pass","tests":"pass","journey":"pass"},"crossTests":{"passed":18,"total":18},"diff":{"files":41,"added":3575,"removed":18},"scores":[{"criterionId":"ledger","score":4,"evidence":"node --test test/ledger.pooled.test.ts: Q1-Q10 pass; six expectedFor rows, the import, and the three mutations match"},{"criterionId":"engine","score":4,"evidence":"src/core/ledger.ts:298 calls reduce() once per admitted pick; Q10 and Q14 pass; no harness copy in src/"},{"criterionId":"writer","score":4,"evidence":"Q13-Q14 pass; hostile record writes nothing; re-import is +0; POST/PUT/DELETE 404 and sha256 64f56556d3f6498937abf20a0dc6538b5ee73166f7e678d2385309a42a52e2f6 unchanged"},{"criterionId":"screen","score":4,"evidence":"8 cdp-shot runs: ok true, scrollWidth equals the viewport, problems [], offOrigin [], small []; empty state reads No open PRs"},{"criterionId":"glance","score":4,"evidence":"390 dark shot: Not merge-safe yet and Re-run #1 before you merge sit above the first cards, whose status words are unverified and docs-only"},{"criterionId":"safety","score":4,"evidence":"Q16 pass: hostile titles stay text, repo evil.example/x draws no external href, poison pick id stays text; grep of src/ui/ledger.* is clean; offOrigin []"},{"criterionId":"stack","score":4,"evidence":"41 paths inside the touch map; the six closed-list files change only the 15 sanctioned lines; merge-base ancestor; START_REF unchanged"}]},{"label":"B","gates":{"build":"pass","tests":"pass","journey":"pass"},"crossTests":{"passed":18,"total":18},"diff":{"files":41,"added":3670,"removed":18},"scores":[{"criterionId":"ledger","score":4,"evidence":"node --test test/ledger.pooled.test.ts: Q1-Q10 pass; six expectedFor rows, the import, and the three mutations match"},{"criterionId":"engine","score":4,"evidence":"src/core/ledger.ts:314 calls reduce() once per admitted pick; Q10 and Q14 pass; no harness copy in src/"},{"criterionId":"writer","score":4,"evidence":"Q13-Q14 pass; hostile record writes nothing; re-import is +0; POST/PUT/DELETE 404 and sha256 64f56556d3f6498937abf20a0dc6538b5ee73166f7e678d2385309a42a52e2f6 unchanged"},{"criterionId":"screen","score":4,"evidence":"8 cdp-shot runs: ok true, scrollWidth equals the viewport, problems [], offOrigin [], small []; empty state reads No open PRs"},{"criterionId":"glance","score":4,"evidence":"390 dark shot: the summary line shows merge-safe through none and re-run #1, and the first rows show the status words unverified and docs-only"},{"criterionId":"safety","score":4,"evidence":"Q16 pass: hostile titles stay text, repo evil.example/x draws no external href, poison pick id stays text; grep of src/ui/ledger.* is clean; offOrigin []"},{"criterionId":"stack","score":4,"evidence":"41 paths inside the touch map; the six closed-list files change only the 15 sanctioned lines; merge-base ancestor; START_REF unchanged"}]},{"label":"C","gates":{"build":"pass","tests":"pass","journey":"pass"},"crossTests":{"passed":18,"total":18},"diff":{"files":41,"added":3501,"removed":18},"scores":[{"criterionId":"ledger","score":4,"evidence":"node --test test/ledger.pooled.test.ts: Q1-Q10 pass; six expectedFor rows, the import, and the three mutations match"},{"criterionId":"engine","score":4,"evidence":"src/core/ledger.ts:369 calls reduce() once per admitted pick; Q10 and Q14 pass; no harness copy in src/"},{"criterionId":"writer","score":4,"evidence":"Q13-Q14 pass; hostile record writes nothing; re-import is +0; POST/PUT/DELETE 404 and sha256 64f56556d3f6498937abf20a0dc6538b5ee73166f7e678d2385309a42a52e2f6 unchanged; withLock creates the data dir"},{"criterionId":"screen","score":4,"evidence":"8 cdp-shot runs: ok true, scrollWidth equals the viewport, problems [], offOrigin [], small []; empty state reads No open PRs"},{"criterionId":"glance","score":4,"evidence":"390 dark shot: the summary is the first line (merge-safe through none, re-run #1) and the next rows show unverified and docs-only as words"},{"criterionId":"safety","score":4,"evidence":"Q16 pass: hostile titles stay text, repo evil.example/x draws no external href, poison pick id stays text; grep of src/ui/ledger.* is clean; offOrigin []"},{"criterionId":"stack","score":4,"evidence":"41 paths inside the touch map; the six closed-list files change only the 15 sanctioned lines; merge-base ancestor; START_REF unchanged; smallest added+removed of the three"}]}]}]}],"base":"C","runnerUps":["A","B"],"trades":[{"from":"A","what":"plain-language merge call","pointers":["src/ui/ledger.js:80-93"],"why":"the first heading says whether the stack is merge-safe and the next line names the re-run before the row list"},{"from":"B","what":"verdict sequence disclosure","pointers":["src/ui/ledger.js:61-82"],"why":"opening a row shows the ordered verdicts and the drift line that produced the status"}],"swapConsistent":null}
```

## Rationale

Weighted mean is 4.0 for A, B, and C (weights 3+2+2+2+2+2+2). Pass rate is 18/18 for each, so all three stay inside the contender band. The means do not separate them. C is the advisory base on the smaller diff: added+removed is 3519, then A at 3593, then B at 3688. File count is 41 for each, PNG files counted as files and not as lines. A reversed second pass is the orchestrator’s call; this pass does not flip a winner.

The ledger, engine, writer, and safety scores are the same because the pooled file and the extra probes agree. Each fold matches `expectedFor` on all six rows, the import lines, and the three mutations. Each claim and verdict comes from one `reduce()` call. `dd ledger --json` matches `GET /api/ledger`. Concurrent records both land, a bad batch writes nothing, a second import adds nothing, and POST, PUT, and DELETE leave `ledger.jsonl` at sha256 `64f56556d3f6498937abf20a0dc6538b5ee73166f7e678d2385309a42a52e2f6`. C does not call `mkdir` itself; `withLock` creates the data directory, and a record into a missing directory still appended.

The screen and glance scores are the same because all 24 shots (8 per label) returned `ok: true`, `scrollWidth` equal to the viewport, `problems: []`, `offOrigin: []`, and `small: []`, including 1280. The empty state reads `No open PRs`. On the real 390 dark shot, each label shows merge-safe through none, re-run #1, and the words `unverified` and `docs-only` without scrolling. The 1280 light shots keep those words in the row. The two trades are presentation only: A’s heading states the call in a sentence, and B’s row disclosure shows the verdict sequence. Neither changes the fold.

The stack score is 4 for each. `git diff --name-only` stays inside the touch map. The six closed-list files change on exactly the 15 sanctioned lines (numstat 4+4+1+2+2+2). `package.json` and `test/guards.test.ts` are untouched. `http.ts` is the static files line, the ledger import, and `GET /api/ledger`.

Pooled tests live on `dd/p8-season-ledger-judge` (`3366d0f`), which is the only branch this run pushed. No pull request was opened.

## Probe lines

Journey seed: each of A, B, and C printed `seeded ledger`. Journey shot at 390×844 dark: `ok true`, `scrollWidth 390`.

Screen probes, each `problems []`, `offOrigin []`, `small []`:

| Label | Shot | ok | scrollWidth |
|---|---|---|---|
| A, B, C | `#/ledger` empty 390 dark | true | 390 |
| A, B, C | `#/ledger` 390 dark | true | 390 |
| A, B, C | `#/ledger` 390 light | true | 390 |
| A, B, C | `#/ledger` 430 dark | true | 430 |
| A, B, C | `#/ledger` 1280 light | true | 1280 |
| A, B, C | `#/ledger` 1280 dark | true | 1280 |
| A, B, C | `#/ledger` tuesday 390 dark | true | 390 |
| A, B, C | `#/` Big Board 390 dark | true | 390 |

Writer: POST, PUT, and DELETE `/api/ledger` returned 404 for A, B, and C. File sha256 before and after: `64f56556d3f6498937abf20a0dc6538b5ee73166f7e678d2385309a42a52e2f6`.

Own tests before the pooled file was copied: `npx tsc --noEmit` empty output, exit 0; `npm test` 336 pass, 0 fail, for each label.

## Stack probe

```
git merge-base --is-ancestor 93dca59db747e8306ab460e38d7ddf978031987e c0cb80a7529ce0d3d78796f89b20bdac19ea6699 && echo on-stack
on-stack
git merge-base --is-ancestor 93dca59db747e8306ab460e38d7ddf978031987e a6d412680a1ec4e9db65d33488b2a8e6753335ce && echo on-stack
on-stack
git merge-base --is-ancestor 93dca59db747e8306ab460e38d7ddf978031987e 34e82bfce5469ec5f5d44d6163fee86ef1c7d1d3 && echo on-stack
on-stack
git fetch origin dd/p7-big-board && git rev-parse FETCH_HEAD
93dca59db747e8306ab460e38d7ddf978031987e
START_REF unchanged
```
