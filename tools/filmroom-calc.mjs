#!/usr/bin/env node
// Box-side Film Room calculator for the hand-run picks (SPEC-002 selection order; SPEC-003 reuses it unchanged). Rubric ids, weights and label maps all come from the rubric.json argument, so it works for any pick.
// Zero deps, no network. Usage:
//   node filmroom-calc.mjs <rubric.json> <pass1.md|json> [pass2.md|json] [--risks c1=0,c2=1,c3=0]
// Each pass file holds the judge's dd-judgement block (labels only). Label maps come from rubric.json "labels".
import { readFileSync } from "node:fs";

const args = process.argv.slice(2);
const risksArg = args.find((a) => a.startsWith("--risks="))?.slice(8) ?? (args.includes("--risks") ? args[args.indexOf("--risks") + 1] : "");
const files = args.filter((a, i) => !a.startsWith("--") && args[i - 1] !== "--risks");
if (files.length < 2) { console.error("usage: filmroom-calc.mjs <rubric.json> <pass1> [pass2] [--risks c1=0,c2=1]"); process.exit(2); }
const cfg = JSON.parse(readFileSync(files[0], "utf8"));
const rubric = cfg.rubric;
const totalW = rubric.reduce((s, c) => s + c.weight, 0);
const risks = Object.fromEntries(risksArg.split(",").filter(Boolean).map((kv) => { const [k, v] = kv.split("="); return [k, Number(v)]; }));

function block(path) {
  const t = readFileSync(path, "utf8");
  const m = [...t.matchAll(/```dd-judgement\s*([\s\S]*?)```/g)];
  if (m.length > 1) throw new Error(`${path}: more than one dd-judgement block`);
  return JSON.parse(m.length ? m[0][1] : t);
}
function fail(msg) { console.error(`INVALID: ${msg}`); process.exit(2); }

function validate(j, labels, n) {
  if (!Array.isArray(j.passes) || j.passes.length !== 1) fail(`pass ${n}: exactly one pass per block`);
  const cards = j.passes[0].cards;
  const mapped = Object.keys(labels);
  const seen = new Set();
  const totals = new Set();
  for (const c of cards) {
    if (!mapped.includes(c.label)) fail(`pass ${n}: label ${c.label} not in label map`);
    if (seen.has(c.label)) fail(`pass ${n}: duplicate card ${c.label}`);
    seen.add(c.label);
    totals.add(c.crossTests.total);
    const ids = c.scores.map((s) => s.criterionId);
    for (const r of rubric) if (ids.filter((i) => i === r.id).length !== 1) fail(`pass ${n}: card ${c.label} must score ${r.id} exactly once`);
    for (const i of ids) if (!rubric.some((r) => r.id === i)) fail(`pass ${n}: unknown criterion ${i}`);
    for (const s of c.scores) if (!String(s.evidence ?? "").trim()) fail(`pass ${n}: empty evidence ${c.label}/${s.criterionId}`);
  }
  for (const l of mapped) if (!seen.has(l)) fail(`pass ${n}: missing card for ${l}`);
  if (totals.size > 1) fail(`pass ${n}: crossTests.total differs across cards`);
  const cand = /^c[1-5]$/;
  if (cand.test(j.base) || (j.runnerUps ?? []).some((x) => cand.test(x)) || (j.trades ?? []).some((t) => cand.test(t.from))) fail(`pass ${n}: cand id used instead of a label`);
}

const weighted = (card) => rubric.reduce((s, r) => s + (card.scores.find((x) => x.criterionId === r.id)?.score ?? 0) * r.weight, 0) / totalW;
const gatePass = (card) => !Object.values(card.gates).includes("fail");
const within10 = (a, b) => { const hi = Math.max(a, b); return hi === 0 || Math.abs(a - b) <= hi * 0.1 + 1e-9; };

function tie(a, b) { // a, b: {cand, diff}
  const lines = (x) => (x.diff ? x.diff.added + x.diff.removed : Infinity);
  const filesN = (x) => (x.diff ? x.diff.files : Infinity);
  const keys = [["diff_lines", lines], ["files", filesN], ["risks", (x) => risks[x.cand] ?? 99]];
  for (const [k, f] of keys) if (f(a) !== f(b)) return { winner: f(a) < f(b) ? a.cand : b.cand, deciding: k, detail: `${a.cand}=${f(a)} ${b.cand}=${f(b)}` };
  return { winner: a.cand < b.cand ? a.cand : b.cand, deciding: "cand_id", detail: "" };
}

function rankPass(j, labels, n) {
  validate(j, labels, n);
  const lines = j.passes[0].cards.map((c) => ({
    cand: labels[c.label], label: c.label, gatePass: gatePass(c), diff: c.diff,
    rate: c.crossTests.total ? c.crossTests.passed / c.crossTests.total : null,
    cross: `${c.crossTests.passed}/${c.crossTests.total}`, weighted: weighted(c),
    scores: Object.fromEntries(c.scores.map((s) => [s.criterionId, s.score])),
  }));
  const passers = lines.filter((l) => l.gatePass);
  const best = Math.max(...passers.map((l) => l.rate ?? -1), -1);
  for (const l of lines) l.contender = l.gatePass && (l.rate === null || best < 0 || l.rate >= best - 0.10);
  const ranked = [...passers].sort((x, y) => {
    if (x.contender !== y.contender) return x.contender ? -1 : 1;
    if (Math.abs(x.weighted - y.weighted) >= 1e-9) return y.weighted - x.weighted;
    return tie(x, y).winner === x.cand ? -1 : 1;
  });
  ranked.forEach((l, i) => (l.rank = i + 1));
  const judgeBase = labels[j.base] ?? null;
  return { pass: n, lines, ranked, winner: ranked[0]?.cand ?? null, judgeBase };
}

const passes = files.slice(1).map((f, i) => rankPass(block(f), cfg.labels[`pass${i + 1}`], i + 1));
const p1 = passes[0];
const closeCall = p1.ranked.length >= 2 && within10(p1.ranked[0].weighted, p1.ranked[1].weighted);
let base = p1.winner, swap = "single", tieRule = null;
if (passes.length === 2) {
  const p2 = passes[1];
  if (p2.winner === p1.winner) swap = "consistent";
  else {
    swap = "flipped";
    const a = p2.lines.find((l) => l.cand === p1.winner), b = p2.lines.find((l) => l.cand === p2.winner);
    tieRule = { between: [p1.winner, p2.winner], ...tie(a, b) };
    base = tieRule.winner;
  }
}
const unstable = passes.length === 2 ? rubric.map((r) => r.id).filter((id) => passes[0].lines.some((l) => {
  const o = passes[1].lines.find((m) => m.cand === l.cand); return o && Math.abs((l.scores[id] ?? 0) - (o.scores[id] ?? 0)) >= 2; })) : [];
const final = passes[passes.length - 1];
for (const p of passes) {
  console.log(`\nPass ${p.pass}  (judge picked ${p.judgeBase ?? "-"}; board winner ${p.winner ?? "-"})`);
  for (const l of [...p.lines].sort((x, y) => (x.rank ?? 99) - (y.rank ?? 99)))
    console.log(`  ${l.cand}·${l.label}  rank ${l.rank ?? "— (gate fail)"}  gates ${l.gatePass ? "pass" : "FAIL"}  cross ${l.cross}${l.contender || !l.gatePass ? "" : " (outside band)"}  weighted ${l.weighted.toFixed(2)}  diff ${l.diff ? `+${l.diff.added} -${l.diff.removed} ${l.diff.files}f` : "n/a"}`);
}
const out = {
  base, runnerUps: final.ranked.map((l) => l.cand).filter((c) => c !== base), closeCall, swap,
  swapConsistent: swap === "single" ? null : swap === "consistent", tieRule, unstable,
  judgeDisagrees: passes.some((p) => p.judgeBase && p.judgeBase !== p.winner),
  needSecondPass: passes.length === 1 && closeCall,
};
console.log("\n" + JSON.stringify(out, null, 2));
