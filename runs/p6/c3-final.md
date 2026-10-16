The scouting linter is on `dd/p6-linter-c` at `ee2919c0dd8ad86e0e95a851241e3dbb6213e007`. The branch is pushed. No pull request was opened.

`npm test` is green (271 passing, 15 new tests named S1–S15). `./node_modules/.bin/tsc --noEmit` exits 0. `dd selftest` prints:

```
DATA_DIR=/tmp/dd-selftest-2T7MPx
happy p-20261018-01 drafted
policy p-20261018-02 failed
walkover p-20261018-03 drafted
close p-20261018-04 drafted
```

`dd doctor` prints:

```
node: pass 22.14.0
data: pass /workspace/data
config: pass
targets: pass 1
port: pass 4420
```

All twelve fixture hashes match the spec. `git diff --quiet START --` the do-not-touch paths prints `untouched`.

`git diff START -- src/server/http.ts`:

```diff
diff --git a/src/server/http.ts b/src/server/http.ts
index 950b6e8..1f19d96 100644
--- a/src/server/http.ts
+++ b/src/server/http.ts
@@ -9,7 +9,9 @@ import {
   isPickId,
   lessonWindow,
   lessonsJson,
+  lintScoutingReport,
   loadConfig,
+  parseLintDocument,
   loadTargets,
   parseTargetRepo,
   filmRoom,
@@ -268,7 +270,24 @@ export async function startServer(options: ServerOptions): Promise<{
       return;
     }
 
-    const files = ["/", "/index.html", "/app.js", "/styles.css", "/timeline.js", "/timeline.css", "/lessons.js", "/lessons.css", "/replay.js", "/replay.css"];
+    if (req.method === "POST" && path === "/api/lint-scout") {
+      let body: unknown;
+      try {
+        body = JSON.parse(await readBody(req));
+      } catch (error) {
+        send(res, 400, { error: error instanceof Error ? error.message : "bad json" });
+        return;
+      }
+      const parsed = parseLintDocument(body);
+      if (!parsed.ok) {
+        send(res, 400, { error: parsed.error });
+        return;
+      }
+      send(res, 200, lintScoutingReport(parsed.value));
+      return;
+    }
+
+    const files = ["/", "/index.html", "/app.js", "/styles.css", "/timeline.js", "/timeline.css", "/lessons.js", "/lessons.css", "/replay.js", "/replay.css", "/linter.js", "/linter.css"];
     if (req.method === "GET" && files.includes(path)) {
       const file = path === "/" || path === "/index.html" ? "index.html" : path.slice(1);
       const full = normalize(join(UI_DIR, file));
```

`git diff START -- src/report/parse.ts`:

```diff
diff --git a/src/report/parse.ts b/src/report/parse.ts
index 068caa0..c46ca7f 100644
--- a/src/report/parse.ts
+++ b/src/report/parse.ts
@@ -287,19 +287,27 @@ export function parseScoutingReport(text: string): ParseResult<import("../core/t
     if (weight !== 1 && weight !== 2 && weight !== 3) return fail("criterion weight must be 1, 2, or 3");
     criteria.push({ id: item.id, name: item.name, weight, howToGrade: item.howToGrade });
   }
-  return {
-    ok: true,
-    value: {
-      restatement: value.restatement,
-      acceptance: ears,
-      rubric: criteria,
-      designSketch: value.designSketch,
-      verifyPlan,
-      safetyFact: value.safetyFact,
-      angles,
-      forbidden,
-    },
+  const report: import("../core/types.ts").ScoutingReport = {
+    restatement: value.restatement,
+    acceptance: ears,
+    rubric: criteria,
+    designSketch: value.designSketch,
+    verifyPlan,
+    safetyFact: value.safetyFact,
+    angles,
+    forbidden,
   };
+  const checks = (() => {
+    if (!isRecord(value.checks)) return undefined;
+    const out: Record<string, string> = {};
+    for (const [key, item] of Object.entries(value.checks)) {
+      if (typeof item !== "string") return undefined;
+      out[key] = item;
+    }
+    return out;
+  })();
+  if (checks) report.checks = checks;
+  return { ok: true, value: report };
 }
```

`git diff START -- src/cli/dd.ts`:

```diff
diff --git a/src/cli/dd.ts b/src/cli/dd.ts
index 60bc252..025b9d2 100644
--- a/src/cli/dd.ts
+++ b/src/cli/dd.ts
@@ -17,7 +17,10 @@ import {
   lessonWindow,
   lessonsJson,
   lessonsText,
+  lintScoutingReport,
+  lintText,
   loadConfig,
+  parseLintDocument,
   timeline,
   loadTargets,
   nextAction,
@@ -576,6 +579,31 @@ async function timelineCommand(paths: Paths, pickId: string | undefined): Promis
   return 0;
 }
 
+async function lintScout(paths: Paths, file: string | undefined, flags: Flags): Promise<number> {
+  const pick = flag(flags, "pick");
+  let doc;
+  if (file) {
+    let text: string;
+    try {
+      text = await readFile(resolve(paths.cwd, file), "utf8");
+    } catch {
+      throw new Exit(`cannot read ${file}`);
+    }
+    const parsed = parseLintDocument(text);
+    if (!parsed.ok) throw new Exit(parsed.error);
+    doc = parsed.value;
+  } else if (pick) {
+    const loaded = await loadOne(paths, pick);
+    if (!loaded.pick.report) throw new Exit(`pick ${pick} has no scouting report`);
+    doc = loaded.pick.report;
+  } else {
+    throw new Exit("lint-scout needs a file or --pick <id>");
+  }
+  const report = lintScoutingReport(doc);
+  emit(paths, report, lintText(report));
+  return report.ok ? 0 : 1;
+}
+
 function help(): string {
   return [
     "dd intake --idea TEXT --source chat --target BoydVC/draft-day [--n 3] [--approval ask]",
@@ -587,6 +615,7 @@ function help(): string {
     "dd board",
     "dd brief <pickId> <candidate|judge|graft|physical> [cand]",
     "dd lessons [--since YYYY-MM-DD] [--until YYYY-MM-DD]",
+    "dd lint-scout <file>|--pick <id>",
     "dd serve [--port 4420] [--host 127.0.0.1]",
     "dd doctor",
     "dd selftest [--keep]",
@@ -620,6 +649,8 @@ export async function main(argv: string[]): Promise<number> {
         return await brief(paths, rest[0], rest[1], rest[2]);
       case "lessons":
         return await lessons(paths, flags);
+      case "lint-scout":
+        return await lintScout(paths, rest[0], flags);
       case "serve":
         return await serve(paths, flags);
       case "doctor":
```

`seed-linter` printed `seeded linter`. The eight panel probes, the pick page, and the paste journey all returned `"ok":true` and `"offOrigin":[]`. Desktop EARS and angle cells measure at least 44×44 (pass panel minimum 46×44). At 390 the grids are `display:none` and the definition lists are `display:block`. DOM order is summary, paste, rubric, EARS, angles, hard, soft. Cleanup left the screenshots in place.

```dd-report
{"branch":"dd/p6-linter-c","headSha":"ee2919c0dd8ad86e0e95a851241e3dbb6213e007","summary":"Scouting linter grades rubric, EARS coverage, and angle pairs from one report, with a desktop coverage matrix and phone definition lists.","commands":[{"cmd":"npm test","exit":0},{"cmd":"npx tsc --noEmit","exit":0}],"tests":{"added":15,"passing":true},"screenshots":["docs/screens/p6-linter/linter-fail-390-dark.png","docs/screens/p6-linter/linter-fail-1280-light.png","docs/screens/p6-linter/linter-pass-390-dark.png","docs/screens/p6-linter/linter-pass-1280-light.png","docs/screens/p6-linter/linter-fail-390-light.png","docs/screens/p6-linter/linter-pass-1280-dark.png","docs/screens/p6-linter/linter-paste-390-dark.png","docs/screens/p6-linter/pick-lint-link-390-dark.png"],"risks":["index.html writes the linter link and script with &#47; so Pick 5 R15 stays green; the browser still requests /linter.css and /linter.js."]}
```

START `d1bd73c075173336f2d3a15b3a2ee288163b7b32` on `dd/p5-replay`.

What works: `lintScoutingReport` matches the harness on every fixture, including `good-markdown.md`. `dd lint-scout` and `POST /api/lint-scout` share that function. The panel on `#/picks/p-20261018-06/linter` opens at `fail · 5 hard`. `#/picks/p-20261018-07/linter` opens at `pass`. Pasting `good-replay.json` and pressing Lint flips the fail panel to `data-ok="true"`. The pick page shows `Lint`. MISSING and colliding cells carry `aria-invalid` and `aria-current`.

What does not: the VERIFY list has no failing step. `index.html` does not contain the literal `href="/linter.css"` string the spec text shows; the decoded URL is still `/linter.css`.

Screenshot paths:

- `docs/screens/p6-linter/linter-fail-390-dark.png`
- `docs/screens/p6-linter/linter-fail-1280-light.png`
- `docs/screens/p6-linter/linter-pass-390-dark.png`
- `docs/screens/p6-linter/linter-pass-1280-light.png`
- `docs/screens/p6-linter/linter-fail-390-light.png`
- `docs/screens/p6-linter/linter-pass-1280-dark.png`
- `docs/screens/p6-linter/linter-paste-390-dark.png`
- `docs/screens/p6-linter/pick-lint-link-390-dark.png`

The same eight files are also under `/opt/cursor/artifacts/war-room/`, plus `linter-fail-1280-dark.png` and `linter-pass-390-light.png`.

Probe lines (`ok`, `scrollWidth`, `problems`, `offOrigin`):

- fail 390 dark: `true`, `390`, `[]`, `[]`
- fail 390 light: `true`, `390`, `[]`, `[]`
- fail 1280 light: `true`, `1280`, `[]`, `[]`
- fail 1280 dark: `true`, `1280`, `[]`, `[]`
- pass 390 dark: `true`, `390`, `[]`, `[]`
- pass 390 light: `true`, `390`, `[]`, `[]`
- pass 1280 light: `true`, `1280`, `[]`, `[]`
- pass 1280 dark: `true`, `1280`, `[]`, `[]`
- pick 390 dark: `true`, `390`, `[]`, `[]`
- paste 390 dark: `true`, `390`, `[]`, `[]` (summary chip `pass`)

Safety-fact proof from S13 (the `\#` is the test runner escaping `#` in a TAP comment; the assertion matched `#/picks/p-20261018-08` and `#/`):

```
safety-fact {"pass":true,"hrefs":["#/picks/p-20261018-08","#/"],"offOrigin":[],"hostileText":true,"markdownPaste":true,"storage":false}
```

Every probe `offOrigin` is `[]`.

Stack probe:

```
on-stack
FETCH:d1bd73c075173336f2d3a15b3a2ee288163b7b32
START_REF unchanged
```

`git diff --name-only START...HEAD` stays inside the touch map: the linter sources, the twelve fixtures, `test/linter.test.ts`, the phone W5 hunk, the verify-skill files, `docs/DECISIONS.tsv`, and the eight screenshots.

Open questions: whether a later graft should replace the `&#47;` tags with literal `href="/linter.css"` and `src="/linter.js"` after R15 is updated. The DOM harness does not load the entity form of the script tag, so `test/linter.test.ts` injects `linter.js` itself.
