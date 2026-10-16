The graft is on `dd/p3-lessons` at `06ce1ae`, and draft PR #5 targets `dd/p2-timeline`.

The base is the kind registry from `dd/p3-lessons-a`. Pass 2 flipped the winner, and the tie rule kept c1 because its diff was smaller (1635 lines against 1771). Two trades came across from `dd/p3-lessons-c`: the rank-1 gold card, whose first receipt is shown once above the rest of that lesson, and a Clear button that returns the hash to `#/lessons`. `loadLogs` no longer imports `PickLog`; that function is the only change in `src/store/eventlog.ts`. The judge pooled file is unchanged except three `LessonsReport` casts, which were required because `ReportLike` does not satisfy `lessonsText` and `npx tsc --noEmit` failed without them.

`npm test` is 124 passing. `tsc --noEmit` exits 0. The sample week prints the 36-line report, and the fixture hash is `300d45a76d9f7d68834d764aa66c2f4fee2b2cb9dfdb7fdc02894da8f80ced5c`. The War Room journey passed, including a 390 px `scrollWidth` of 390, live promotion in under a second, and Clear. Screenshots:

- `/opt/cursor/artifacts/war-room/lessons-board-link.png`
- `/opt/cursor/artifacts/war-room/lessons-week.png`
- `/opt/cursor/artifacts/war-room/lessons-receipts.png`
- `/opt/cursor/artifacts/war-room/lessons-phone.png`
- `/opt/cursor/artifacts/war-room/lessons-live.png`
- `/opt/cursor/artifacts/war-room/lessons-hostile.png`

Safety fact passed: the mismatched log was skipped, stolen findings stayed off the other pick, text mode had no C0/C1 characters, and the vm render made no markup nodes or stray links. Stack probe: `on-stack`, `FETCH_HEAD 60b1625518f61de576205c73318afd54c3384798`, `dd/p2-timeline unchanged`.

```dd-report
{"branch":"dd/p3-lessons","headSha":"06ce1ae4d2bd0068f2f331bb0009c53e91f7e3df","summary":"Grafted the kind-registry gardener with the rank-1 card, Clear button, and loadLogs type fix. 124 tests pass.","commands":[{"cmd":"npm test","exit":0},{"cmd":"npx tsc --noEmit","exit":0},{"cmd":"node --experimental-strip-types src/cli/dd.ts selftest","exit":0}],"tests":{"added":32,"passing":true},"screenshots":["lessons-board-link.png","lessons-week.png","lessons-receipts.png","lessons-phone.png","lessons-live.png","lessons-hostile.png"],"risks":[]}
```

PR: #5