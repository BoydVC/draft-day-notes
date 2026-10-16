// Box-only: builds Pick 7's ScoutingReport JSON from SPEC-008-big-board.md (the scout Grok Bot actually wrote).
import { readFileSync, writeFileSync } from "node:fs";
const spec = readFileSync(new URL("../../../../SPEC-008-big-board.md", import.meta.url), "utf8");
const launch = readFileSync(new URL("../../../../LAUNCH-008.md", import.meta.url), "utf8");
const section = (name) => { const m = spec.match(new RegExp(`^## ${name}\\n([\\s\\S]*?)(?=^## |^<!--)`, "m")); return m ? m[1].trim() : ""; };
const restatement = section("GOAL");
const acceptance = [...spec.matchAll(/^- \*\*(B\d+)\*\* WHEN (.+?) THE SYSTEM SHALL (.+?)(?: → (.+))?$/gm)].map((m) => ({ id: m[1], when: m[2].replace(/\*\*/g, ""), shall: m[3] + (m[4] ? ` → ${m[4]}` : "") }));
const rubric = [...spec.matchAll(/^\| `([a-z]+)` \| ([^|]+?) \| ([123]) \| (.+) \|$/gm)].map((m) => ({ id: m[1], name: m[2].trim(), weight: Number(m[3]), howToGrade: m[4].trim() }));
const sketch = spec.match(/### Design sketch \(usage first\)\n```\n([\s\S]*?)```/)[1].trim();
const verifyPlan = [...section("VERIFY \\(run all; paste results in your final message, and the grafter pastes them in the PR body\\)").matchAll(/^\d+\. (.+)$/gm)].map((m) => m[1]);
const safety = spec.match(/Safety fact \(blast-radius, prove at certainty 4 = ran it\): \*\*"(.+?)"\*\*/)[1];
const angles = [...launch.matchAll(/^\| c[123] \| `[^`]+` \| `[^`]+` \| (.+) \|$/gm)].map((m) => m[1].trim());
const forbidden = [...section("FORBIDDEN").matchAll(/^- (.+)$/gm)].map((m) => m[1]);
const report = { restatement, acceptance, rubric, designSketch: sketch, verifyPlan, safetyFact: safety, angles, forbidden };
for (const [k, v] of Object.entries(report)) if (!v || (Array.isArray(v) && !v.length)) throw new Error("empty " + k);
console.log(acceptance.length, rubric.length, verifyPlan.length, angles.length, forbidden.length);
writeFileSync(new URL("./report.json", import.meta.url), JSON.stringify(report, null, 1) + "\n");
