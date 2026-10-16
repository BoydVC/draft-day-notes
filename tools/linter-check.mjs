#!/usr/bin/env node
// Box oracle for SPEC 007. Usage: node tools/linter-check.mjs [fixtures/linter]
// Or: node tools/linter-check.mjs <repo-root>  (looks for test/fixtures/linter or fixtures/linter)
import { readdirSync, existsSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { createHash } from "node:crypto";

const HERE = dirname(fileURLToPath(import.meta.url));
const arg = process.argv[2];
let fixtureDir;
if (!arg) fixtureDir = join(HERE, "..", "fixtures", "linter");
else if (existsSync(join(arg, "linter-harness.mjs"))) fixtureDir = arg;
else if (existsSync(join(arg, "test/fixtures/linter/linter-harness.mjs"))) fixtureDir = join(arg, "test/fixtures/linter");
else if (existsSync(join(arg, "fixtures/linter/linter-harness.mjs"))) fixtureDir = join(arg, "fixtures/linter");
else {
  console.error("no linter fixtures at", arg);
  process.exit(2);
}

const harnessUrl = pathToFileURL(join(fixtureDir, "linter-harness.mjs")).href;
const { lintScoutingReport, parseMarkdownScout, expectedFor } = await import(harnessUrl);
const expected = JSON.parse(readFileSync(join(fixtureDir, "expected.json"), "utf8"));

let pass = 0;
let total = 0;
const fail = (msg) => {
  console.log("FAIL", msg);
};
const ok = (msg) => {
  console.log("OK  ", msg);
  pass++;
};

const jsonFixtures = [
  "good-replay.json",
  "good-lessons.json",
  "hostile-collide-angles.json",
  "hostile-missing-ears.json",
  "hostile-ungradeable.json",
  "hostile-markup.json",
  "hostile-soft.json",
];

for (const name of jsonFixtures) {
  total++;
  const doc = JSON.parse(readFileSync(join(fixtureDir, name), "utf8"));
  const report = lintScoutingReport(doc);
  const got = expectedFor(name, report);
  const want = expected[name];
  if (JSON.stringify(got) === JSON.stringify(want)) ok(`${name} ${report.summary}`);
  else fail(`${name} got ${JSON.stringify(got)} want ${JSON.stringify(want)}`);
}

total++;
{
  const md = readFileSync(join(fixtureDir, "good-markdown.md"), "utf8");
  const report = lintScoutingReport(parseMarkdownScout(md));
  const got = expectedFor("good-markdown.md", report);
  if (JSON.stringify(got) === JSON.stringify(expected["good-markdown.md"])) ok(`good-markdown.md ${report.summary}`);
  else fail(`good-markdown.md got ${JSON.stringify(got)}`);
}

// S1-style unit checks inside the harness
total++;
{
  const r = lintScoutingReport(JSON.parse(readFileSync(join(fixtureDir, "hostile-collide-angles.json"), "utf8")));
  const pair = r.angles.find((p) => p.i === 0 && p.j === 1);
  if (pair && pair.collide && pair.score === 0.75) ok("collide jaccard 0.75");
  else fail(`collide pair ${JSON.stringify(pair)}`);
}

total++;
{
  const r = lintScoutingReport(JSON.parse(readFileSync(join(fixtureDir, "hostile-missing-ears.json"), "utf8")));
  if (r.ears.filter((e) => e.status === "MISSING").map((e) => e.id).join(",") === "R2,R5,R14,R19,R20") ok("missing ears set");
  else fail("missing ears set");
}

total++;
{
  const r = lintScoutingReport(JSON.parse(readFileSync(join(fixtureDir, "hostile-ungradeable.json"), "utf8")));
  if (r.criteria.filter((c) => c.severity === "hard").map((c) => c.id).join(",") === "frames,deck,screen") ok("ungradeable set");
  else fail("ungradeable set");
}

total++;
{
  // mutation: empty howToGrade on good-replay frames must hard-fail
  const doc = JSON.parse(readFileSync(join(fixtureDir, "good-replay.json"), "utf8"));
  doc.rubric[0].howToGrade = "";
  const r = lintScoutingReport(doc);
  if (!r.ok && r.hard.some((h) => h.id === "frames")) ok("mutation empty howToGrade");
  else fail("mutation empty howToGrade");
}

total++;
{
  const doc = JSON.parse(readFileSync(join(fixtureDir, "good-replay.json"), "utf8"));
  doc.angles[1] = doc.angles[0];
  const r = lintScoutingReport(doc);
  if (!r.ok && r.angles.some((p) => p.collide)) ok("mutation identical angles");
  else fail("mutation identical angles");
}

total++;
{
  // sha of expected.json present
  const sum = createHash("sha256").update(readFileSync(join(fixtureDir, "expected.json"))).digest("hex");
  if (sum.length === 64) ok(`expected.json sha ${sum.slice(0, 12)}…`);
  else fail("expected sha");
}

console.log(`TOTAL ${pass}/${total}`);
process.exit(pass === total ? 0 : 1);
