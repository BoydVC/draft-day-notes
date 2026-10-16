All three labels pass the gates and the pooled file **18/18**. Weighted means are **A 4.00**, **C 4.00**, **B 3.73**. A and C tie on the mean; the advisory base is **A** because its diff is smaller (3519 lines against 3593). Nothing was pushed.

C’s first `npm test`, run beside the other two, exited 1 when three server tests were cancelled on `127.0.0.1:4420`. Run alone it was 336 pass, exit 0. The tests gate is that isolated run.

## Screen probes

Every run: `problems=[]`, `offOrigin=[]`, `small=[]`.

| Run | A ok / scrollWidth | B ok / scrollWidth | C ok / scrollWidth |
|---|---|---|---|
| ledger-empty-390-dark | true / 390 | true / 390 | true / 390 |
| ledger-390-dark | true / 390 | true / 390 | true / 390 |
| ledger-390-light | true / 390 | true / 390 | true / 390 |
| ledger-430-dark | true / 430 | true / 430 | true / 430 |
| ledger-1280-light | true / 1280 | true / 1280 | true / 1280 |
| ledger-1280-dark | true / 1280 | true / 1280 | true / 1280 |
| board-ledger-link-390-dark | true / 390 | true / 390 | true / 390 |
| ledger-tuesday-390-dark | true / 390 | true / 390 | true / 390 |

I looked at 390 dark, 390 light, and 1280 light. Text wraps in words. Links measure at least 44×44 (A’s ledger links are 48). Empty state reads `No open PRs`. The Big Board shows `Ledger` (A 81×48, B 75×44, C 73×44). C’s status chips are 32px tall and are text, not tap targets.

On a 390×844 dark phone, A’s summary (y 306–398) reads merge-safe through none, re-run #1, and 4 docs-only, and #2’s docs-only why sits fully on screen (y 634–800). C leads with “Not merge-safe yet” (y 240–271) and “Re-run #1 before you merge.” (y 275–319), with #2’s docs-only why on screen (y 465–638). B’s summary is on screen (y 298–390), and the first docs-only row starts at y 894, below the fold, because each phone row is a tall stack of labels.

## Writer probes

Same result for A, B, and C. Two concurrent `dd ledger record` runs of different lines both printed `ledger +1 (0 already recorded)`, both lines landed once, and every line parsed. A batch with one bad line exited 1 with `line 2: bad kind` and left no file. A second import printed `ledger +0 (9 already recorded)` and the sha256 did not change. `POST`, `PUT`, and `DELETE` to `/api/ledger` returned 404, and the file sha256 stayed `25ddd3ebe3fee8c8d85dd9c145c9a2108068777542e366a628d02af782b2b96b`. The only append is `appendLedger` under `withLock`.

## Stack probe

```
A on-stack
B on-stack
C on-stack
FETCH_HEAD=93dca59db747e8306ab460e38d7ddf978031987e
START_REF unchanged
```

`git diff --name-only START...sha` is the same 41 touch-map paths for each label. The eleven fixture sha256 values match the spec. The six closed-list files differ only on the fifteen sanctioned lines, and that diff is identical across labels. `removed` is 18 for each (those fifteen lines plus one line each in `SKILL.md`, `control.sh`, and `http.ts`). PNG files are counted as files, not lines. `added+removed` is A 3519, C 3593, B 3688. `package.json` and `test/guards.test.ts` are unchanged. No runtime dependencies.

## Scores

Ledger, engine, writer, screen, and safety are 4 for every label. Pooled Q1–Q10 covers the six rows, the import, and the three mutations. Each admit path calls `reduce()` once. `dd ledger --json` matches `GET /api/ledger`. Hostile text stays text, a forged `evil.example/x` repo draws no external href, and the poisoned pick id stays text.

Glance is 4 for A and C and 3 for B, for the fold positions above. Stack is 4 for A and C and 3 for B, because B’s diff is the largest while still inside the map.

```dd-judgement
{
  "passes": [
    {
      "order": ["A", "B", "C"],
      "cards": [
        {
          "label": "A",
          "gates": {"build": "pass", "tests": "pass", "journey": "pass"},
          "crossTests": {"passed": 18, "total": 18},
          "diff": {"files": 41, "added": 3501, "removed": 18},
          "scores": [
            {"criterionId": "ledger", "score": 4, "evidence": "node --test test/ledger.pooled.test.ts Q1-Q10 pass: six expectedFor rows, the import, and the three mutations"},
            {"criterionId": "engine", "score": 4, "evidence": "src/core/ledger.ts:369 admit calls reduce(); ledgerText and ledgerJson render that SeasonLedger; Q14 dd ledger --json matches GET /api/ledger"},
            {"criterionId": "writer", "score": 4, "evidence": "two concurrent record runs both exit 0 (+1 each), 2 unique lines, torn []; bad batch exit 1 and file absent; re-import +0 with sha unchanged; POST/PUT/DELETE 404 and sha 25ddd3ebe3fee8c8 unchanged; appendLedger holds withLock"},
            {"criterionId": "screen", "score": 4, "evidence": "8 cdp-shot runs ok true, problems [], offOrigin [], scrollWidth 390/430/1280; empty text No open PRs; measured links at least 48px at 390 and 1280"},
            {"criterionId": "glance", "score": 4, "evidence": "390x844 dark: summary y306-398 reads merge-safe through none, re-run #1, 4 docs-only; #2 docs-only why is fully on screen (y634-800)"},
            {"criterionId": "safety", "score": 4, "evidence": "Q16 pass; repo evil.example/x paints no href; title <img src=x onerror=alert(1)> and pick id p-20261018-77\"><img src=x stay text; no banned tokens in ledger.js/css; POST/PUT leave the file sha unchanged"},
            {"criterionId": "stack", "score": 4, "evidence": "git diff --name-only stays in the touch map (41 files); the six closed-list files change only the 15 sanctioned lines; removed 18; merge-base --is-ancestor holds; START_REF unchanged; added+removed 3519"}
          ]
        },
        {
          "label": "B",
          "gates": {"build": "pass", "tests": "pass", "journey": "pass"},
          "crossTests": {"passed": 18, "total": 18},
          "diff": {"files": 41, "added": 3670, "removed": 18},
          "scores": [
            {"criterionId": "ledger", "score": 4, "evidence": "node --test test/ledger.pooled.test.ts Q1-Q10 pass: six expectedFor rows, the import, and the three mutations"},
            {"criterionId": "engine", "score": 4, "evidence": "src/core/ledger.ts:314 admit calls reduce(); store re-exports the same seasonLedger; Q14 dd ledger --json matches GET /api/ledger"},
            {"criterionId": "writer", "score": 4, "evidence": "two concurrent record runs both exit 0 (+1 each), 2 unique lines, torn []; bad batch exit 1 and file absent; re-import +0 with sha unchanged; POST/PUT/DELETE 404 and sha 25ddd3ebe3fee8c8 unchanged; appendLedger holds withLock"},
            {"criterionId": "screen", "score": 4, "evidence": "8 cdp-shot runs ok true, problems [], offOrigin [], scrollWidth 390/430/1280; empty text No open PRs; measured links at least 44px, including Ledger 75x44"},
            {"criterionId": "glance", "score": 3, "evidence": "390x844 dark summary y298-390 has merge-safe through none and re-run #1, but the first docs-only row starts at y894, below the 844 fold"},
            {"criterionId": "safety", "score": 4, "evidence": "Q16 pass; repo evil.example/x paints no href; title <img src=x onerror=alert(1)> and pick id p-20261018-77\"><img src=x stay text; no banned tokens in ledger.js/css; POST/PUT leave the file sha unchanged"},
            {"criterionId": "stack", "score": 3, "evidence": "touch map holds and the 15 closed-list lines match; ancestor holds; START_REF unchanged; added+removed 3688, the largest of the three"}
          ]
        },
        {
          "label": "C",
          "gates": {"build": "pass", "tests": "pass", "journey": "pass"},
          "crossTests": {"passed": 18, "total": 18},
          "diff": {"files": 41, "added": 3575, "removed": 18},
          "scores": [
            {"criterionId": "ledger", "score": 4, "evidence": "node --test test/ledger.pooled.test.ts Q1-Q10 pass: six expectedFor rows, the import, and the three mutations"},
            {"criterionId": "engine", "score": 4, "evidence": "src/core/ledger.ts:298 admit calls reduce(); store re-exports the same seasonLedger; Q14 dd ledger --json matches GET /api/ledger"},
            {"criterionId": "writer", "score": 4, "evidence": "two concurrent record runs both exit 0 (+1 each), 2 unique lines, torn []; bad batch exit 1 and file absent; re-import +0 with sha unchanged; POST/PUT/DELETE 404 and sha 25ddd3ebe3fee8c8 unchanged; appendLedger holds withLock"},
            {"criterionId": "screen", "score": 4, "evidence": "8 cdp-shot runs ok true, problems [], offOrigin [], scrollWidth 390/430/1280; empty h2 reads No open PRs; measured links at least 44px (status chips are 32px text, not targets)"},
            {"criterionId": "glance", "score": 4, "evidence": "390x844 dark: h2 Not merge-safe yet y240-271, Re-run #1 before you merge y275-319, #2 docs-only why fully on screen y465-638"},
            {"criterionId": "safety", "score": 4, "evidence": "Q16 pass; repo evil.example/x paints no href; title <img src=x onerror=alert(1)> and pick id p-20261018-77\"><img src=x stay text; no banned tokens in ledger.js/css; POST/PUT leave the file sha unchanged"},
            {"criterionId": "stack", "score": 4, "evidence": "git diff --name-only stays in the touch map (41 files); the six closed-list files change only the 15 sanctioned lines; removed 18; ancestor holds; START_REF unchanged; added+removed 3593"}
          ]
        }
      ]
    }
  ],
  "base": "A",
  "runnerUps": ["C", "B"],
  "trades": [
    {
      "from": "C",
      "what": "merge-desk headline",
      "pointers": ["src/ui/ledger.js:80-87", "src/ui/ledger.css:17-34"],
      "why": "A sentence above the rows says Not merge-safe yet and Re-run #1 before you merge, with the docs-only why still on the first screen"
    },
    {
      "from": "B",
      "what": "verdict-sequence disclosure",
      "pointers": ["src/ui/ledger.js:61-83"],
      "why": "The closed row keeps position, status, why, and title visible, and one tap opens the verdict sequence, drift, and parent"
    }
  ],
  "swapConsistent": null
}
```
