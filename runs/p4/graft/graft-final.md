Draft Day Pick 4 is on `dd/p4-phone` at `c6cfad415576c2c14653955aff972a6d8c613ab1`. The draft pull request is #6, based on `dd/p3-lessons`.

Mode S. START_REF `dd/p3-lessons`. START `e242a533d04d68a5a4472bce283eb06866e79d96`.

The base is c1, the token ledger, `dd/p4-phone-a` at `d32032a`. Film Room pass 2 kept it at 4.00 with a consistent swap and the smallest diff, so the graft keeps that model: one token ledger, phone rules inside the existing 480px block, and one module-level form record that `formPanel` paints.

- From c2 (`dd/p4-phone-b` at `3075b51`): the intake outcome table. The five sentences, the phase, and whether the idea is kept live in one registry, painted onto the existing form state.
- From c3 (`dd/p4-phone-c` at `8b52c4c`): `data-label` on each board cell, with `attr(data-label)` captions when the header row is hidden. Cells stay in DOM order.
- Left behind: c2 and c3's unwrapped status line (c1's `overflow-wrap: anywhere` stays), c2's desktop-wide 44px min-heights, and c3's phone order that puts the idea above the pick id.
- `test/phone.pooled.test.ts` is the judge file from `dd/p4-phone-judge` at `92ae88e`, unchanged. It matches the spec.

`npm test` is 219 pass, 0 fail. `npx tsc --noEmit` exits 0. Selftest prints `happy p-20261017-01 drafted`, `policy p-20261017-02 failed`, `walkover p-20261017-03 drafted`, `close p-20261017-04 drafted`. Doctor passes. All five fixture sha256 values match the spec. `test/guards.test.ts`, `src/server/http.ts`, and `package.json` are untouched.

Every phone probe has `"ok":true`, `"offOrigin":[]`, and `scrollWidth` equal to the viewport: Big Board, close pick `p-20261017-04`, and Locker Room, at 390 and 430, in light and dark. `Sending…` shows with `Add pick` dimmed. After a refused target, a blur, and `lesson_recorded`, the redrawn form still shows `target is not in targets.json` and the idea. A 2,000-character error at 390 dark keeps `scrollWidth` 390. The 1280×800 board is still the five-column table. Its probe `ok` is false only for the original desktop sizes (Add pick 96×35, pick links about 99×17), which the Film Room kept.

Screenshots are in `/opt/cursor/artifacts/war-room/`: `phone-board-390-light.png`, `phone-board-390-dark.png`, `phone-board-430-light.png`, `phone-board-430-dark.png`, `phone-pick-390-light.png`, `phone-pick-390-dark.png`, `phone-pick-430-light.png`, `phone-pick-430-dark.png`, `phone-lessons-390-light.png`, `phone-lessons-390-dark.png`, `phone-lessons-430-light.png`, `phone-lessons-430-dark.png`, `phone-form-sending.png`, `phone-form-kept.png`, `phone-long-error-390-dark.png`, `phone-desktop-board.png`. They are still there after `control.sh cleanup`.

The safety proof, through `dom-harness.mjs`, submitted three times per outcome, blurred, and redrew twice. Each outcome was one `POST /api/intake`, same-origin `/api/` URLs only, one `EventSource` on `/api/events`, the exact status sentence, hostile text only as text, `Add pick` enabled, the idea kept on failure, and no unhandled rejection. `offOrigin` is `[]` on every probe line.

Stack probe: `on-stack`, FETCH_HEAD `e242a533d04d68a5a4472bce283eb06866e79d96`, `START_REF unchanged`.

Stacked on the Pick 3 PR (dd/p3-lessons), which is stacked on #3 (dd/p2-timeline), #2 (dd/p1-film-room) and #1 (dd/scaffold). Merge after the Pick 3 PR. Shared files with Pick 3: src/ui/app.js (different functions), src/ui/index.html (different lines), the verify skill's SKILL.md and features/README.md, docs/DECISIONS.tsv.

```
on-stack
e242a533d04d68a5a4472bce283eb06866e79d96
START_REF unchanged
```

```dd-report
{"branch":"dd/p4-phone","headSha":"c6cfad415576c2c14653955aff972a6d8c613ab1","summary":"Grafted c2's intake outcome table and c3's phone cell captions onto the c1 token ledger.","commands":[{"cmd":"npm test","exit":0},{"cmd":"npx tsc --noEmit","exit":0}],"tests":{"added":95,"passing":true},"screenshots":["phone-board-390-light.png","phone-board-390-dark.png","phone-board-430-light.png","phone-board-430-dark.png","phone-pick-390-light.png","phone-pick-390-dark.png","phone-pick-430-light.png","phone-pick-430-dark.png","phone-lessons-390-light.png","phone-lessons-390-dark.png","phone-lessons-430-light.png","phone-lessons-430-dark.png","phone-form-sending.png","phone-form-kept.png","phone-long-error-390-dark.png","phone-desktop-board.png"],"risks":["At 1280 the probe reports W8 for the original desktop link and button sizes. Phone widths pass."]}
```

PR: #6