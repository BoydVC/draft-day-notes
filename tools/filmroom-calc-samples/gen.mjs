import { readFileSync, writeFileSync } from "node:fs";
const [rubricPath, out, scoresJson, base, totalStr] = process.argv.slice(2);
const cfg = JSON.parse(readFileSync(rubricPath, "utf8"));
const spec = JSON.parse(scoresJson);
const cards = Object.entries(spec).map(([label, v]) => ({
  label, gates: { build: "pass", tests: "pass", journey: v.gate ?? "pass" },
  crossTests: { passed: v.passed, total: Number(totalStr) },
  diff: { files: v.diff[0], added: v.diff[1], removed: v.diff[2] },
  scores: cfg.rubric.map((r, i) => ({ criterionId: r.id, score: v.s[i], evidence: `ev ${label} ${r.id}` })),
}));
const j = { passes: [{ order: Object.keys(spec), cards }], base, runnerUps: Object.keys(spec).filter((l) => l !== base), trades: [], swapConsistent: null };
writeFileSync(out, "notes\n```dd-judgement\n" + JSON.stringify(j) + "\n```\n");
