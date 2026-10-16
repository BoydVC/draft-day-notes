`dd lessons --json` and `GET /api/lessons` now share `lessonsJson`. It keeps `JSON.stringify`'s U+0000–U+001F escapes and also writes U+007F–U+009F as `\u007f`–`\u009f`. `JSON.parse` of that text is still the report. The API body is that text plus the newline `console.log` adds, so the two outputs match byte for byte.

L14 records a lesson whose topic and text contain U+007F, U+0085, and U+009F, checks that `--json` stdout has none of those characters raw, and checks that the API body equals that stdout. `test/lessons.pooled.test.ts` was left as it was. `docs/SPEC-004-lessons.md` and the pooled file stay in the tree because the graft instructions require them; the PR body says so.

`npm test` is 124 passing, `npx tsc --noEmit` exits 0, and selftest still prints the four scenario lines. The safety-fact proof passed, including the DEL and C1 lesson. Draft PR #5 is still a draft against `dd/p2-timeline`.

```dd-report
{"branch":"dd/p3-lessons","headSha":"e242a533d04d68a5a4472bce283eb06866e79d96","summary":"lessonsJson escapes U+007F-U+009F so dd lessons --json and GET /api/lessons match and round-trip. 124 tests pass.","commands":[{"cmd":"npm test","exit":0},{"cmd":"npx tsc --noEmit","exit":0},{"cmd":"node --experimental-strip-types src/cli/dd.ts selftest","exit":0}],"tests":{"added":32,"passing":true},"screenshots":["lessons-board-link.png","lessons-week.png","lessons-receipts.png","lessons-phone.png","lessons-live.png","lessons-hostile.png"],"risks":[]}
```

PR: #5