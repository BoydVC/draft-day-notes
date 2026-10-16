// Box-only: derive a dd scouting report (parseScoutingReport shape) from an arena spec + its launch file.
// usage: node tools/spec-to-report.mjs SPEC.md SPEC-rubric.json LAUNCH.md > report.json
import { readFileSync } from "node:fs";
const [specPath, rubricPath, launchPath] = process.argv.slice(2);
const spec = readFileSync(specPath, "utf8"), rubric = JSON.parse(readFileSync(rubricPath, "utf8")), launch = readFileSync(launchPath, "utf8");
const section = (name) => { const m = spec.match(new RegExp(`^## ${name}[^\\n]*\\n([\\s\\S]*?)(?=^## |(?![\\s\\S]))`, "m")); return m ? m[1] : ""; };
const clean = (s) => s.replace(/\*\*/g, "").replace(/`/g, "").replace(/\s+/g, " ").trim();
const restatement = clean(section("GOAL").split(/\n\s*\n/)[0]);
const acceptance = [...spec.matchAll(/^- \*\*([A-Z]\d+)\*\* (WHEN [\s\S]*?)(?=\n- \*\*[A-Z]\d|\n\n)/gm)].map((m) => {
  const body = clean(m[2]).replace(/ → .*$/, "");
  const i = body.indexOf(" THE SYSTEM SHALL ");
  return { id: m[1], when: body.slice(5, i).trim(), shall: body.slice(i + 18).trim() };
});
const howTo = Object.fromEntries([...spec.matchAll(/^\| `([a-z0-9_-]+)` \| [^|]+ \| [123] \| ([^\n]+?) \|$/gm)].map((m) => [m[1], clean(m[2])]));
const sketch = (spec.match(/### Design sketch[^\n]*\n```\n([\s\S]*?)```/) || [, ""])[1].trim();
const verifyPlan = [...section("VERIFY").matchAll(/^(\d+)\. ([^\n]+)/gm)].map((m) => clean(m[2]).slice(0, 400));
const safety = clean((section("VERIFY").match(/\*\*"([\s\S]*?)"\*\*/) || [, ""])[1]);
const angles = [...launch.matchAll(/^\| c\d \| `[^`]+` \| `[^`]+` \| ([^\n]+?) \|$/gm)].map((m) => clean(m[1]));
const forbidden = [...section("FORBIDDEN").matchAll(/^- ([^\n]+)/gm)].map((m) => clean(m[1]));
const report = { restatement, acceptance, rubric: rubric.rubric.map((r) => ({ id: r.id, name: r.name, weight: r.weight, howToGrade: howTo[r.id] })),
  designSketch: sketch, verifyPlan, safetyFact: safety, angles, forbidden };
for (const [k, v] of Object.entries(report)) if (!v || (Array.isArray(v) && !v.length)) { console.error("empty " + k); process.exit(1); }
if (report.rubric.some((r) => !r.howToGrade)) { console.error("missing howToGrade"); process.exit(1); }
console.log(JSON.stringify(report, null, 1));
