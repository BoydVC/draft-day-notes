# test/fixtures/model (SPEC 011, Pick 10 Model check)

Commit every file here byte-identical. Tests read them; nothing edits them.

- `model-harness.mjs` (+ `model-harness.d.mts` types): plain JavaScript, never imports `src/`. It defines the
  bounded scenario space (`scenarioSpace({quick})`: 7560 points full, 648 quick), the fake-driver `Scenario` each
  point becomes (`toScenario`), an independent model of how each point must end (`predict`, written from SPEC 001
  and ARCHITECTURE §3.3, not from the reducer), the ten named extra sequences (`SEQUENCES`), the binding
  transition relation (`TRANSITION_ROWS`, 31 rows `[from, event, guard, to]`: 29 observed plus the two rows of the
  alias status `scouting`), `TERMINAL`, `ALIAS_STATUSES`, `BUDGET` and `tripleKey`.
- `expected.json`: `{quick, full}`, each a `SweepReport` without `results`, as the sweep must print it with
  `--json`. Produced on the box by driving the engine at START (a read-only mirror of the repo files, never a
  clone) through the existing fake driver with a selftest-style io, one fresh temp data dir per scenario, and
  applying the census rules of SPEC 011 with the engine's own `reduce()`. While producing it, `predict()` was
  compared with the engine on all 7560 points (0 differences) and the invariants V1–V6 were checked on every
  run (0 problems). The observed relation is exactly the 29 non-alias rows of `TRANSITION_ROWS`; against the
  START `TRANSITIONS` table it has 11 triples the table lacks and the table has 14 rows nothing produces.
  Timestamps are not stored: every count is independent of the wall clock.
