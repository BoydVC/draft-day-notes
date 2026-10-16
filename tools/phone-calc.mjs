#!/usr/bin/env node
// Box-side oracle for SPEC 005 W1-W6 (head tags, token grammar, contrast, color literals, chip families).
// Usage: node tools/phone-calc.mjs <root containing src/ui> [--json]
// Reads src/ui/index.html, src/ui/styles.css, src/ui/timeline.css (and any other src/ui/*.css it is told
// about with --css name.css). Zero deps. Exit 0 = every check passes, 1 = problems listed.
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const args = process.argv.slice(2);
const root = args.find((a) => !a.startsWith("--"));
if (!root) { console.error("usage: phone-calc.mjs <root> [--css extra.css] [--json]"); process.exit(2); }
const asJson = args.includes("--json");
const extra = args.flatMap((a, i) => (a === "--css" ? [args[i + 1]] : []));
const ui = (f) => join(root, "src", "ui", f);

// ---- the binding tables (SPEC 005 "Tokens", "Contrast", "Status families") ----
export const TOKENS = [
  "bg", "bg-2", "glow", "ink", "muted", "line", "field", "field-line", "card", "gold", "on-accent",
  "green", "red", "blue", "amber",
  "chip-bg", "chip-ink", "chip-done-bg", "chip-done-ink", "chip-stop-bg", "chip-stop-ink",
  "chip-review-bg", "chip-review-ink", "chip-work-bg", "chip-work-ink",
];
export const DARK_PINNED = {
  bg: "#12160f", "bg-2": "#1b2216", glow: "#2a3824", ink: "#f4f0e4", muted: "#c3bba6", line: "#3a4632",
  field: "#10150e", card: "#141b12", gold: "#f0c14a", "on-accent": "#1b1608",
  green: "#8fce6a", red: "#ef7d6a", blue: "#8eb6e0", amber: "#e2a15a",
  "chip-bg": "#31402a", "chip-ink": "#f4f0e4", "chip-done-bg": "#24532a", "chip-done-ink": "#8fce6a",
  "chip-stop-bg": "#4a2822", "chip-stop-ink": "#ef7d6a", "chip-review-bg": "#24364a", "chip-review-ink": "#8eb6e0",
  "chip-work-bg": "#4a3a20", "chip-work-ink": "#e2a15a",
};
export const PAIRS = [
  ["ink", "bg", 4.5], ["ink", "bg-2", 4.5], ["ink", "card", 4.5], ["ink", "field", 4.5],
  ["muted", "bg", 4.5], ["muted", "bg-2", 4.5], ["muted", "card", 4.5],
  ["gold", "bg", 4.5], ["gold", "bg-2", 4.5], ["gold", "card", 4.5], ["on-accent", "gold", 4.5],
  ["green", "bg-2", 4.5], ["red", "bg-2", 4.5], ["blue", "bg-2", 4.5], ["amber", "bg-2", 4.5],
  ["chip-ink", "chip-bg", 4.5], ["chip-done-ink", "chip-done-bg", 4.5], ["chip-stop-ink", "chip-stop-bg", 4.5],
  ["chip-review-ink", "chip-review-bg", 4.5], ["chip-work-ink", "chip-work-bg", 4.5],
  ["field-line", "bg-2", 3], ["field-line", "field", 3],
];
export const FAMILIES = {
  intake: "", scouting: "", awaiting_go: "work", combine: "work", judging: "review", grafting: "work",
  physical: "review", drafted: "done", failed: "stop", cancelled: "stop",
};
const NAMED = /\b(white|black|red|green|blue|gray|grey|silver|yellow|orange|purple|pink|brown|navy|teal|olive|maroon|lime|aqua|fuchsia|gold|beige|ivory|khaki|tan|crimson|coral|salmon|tomato|indigo|violet)\b/i;
const COLOR_PROPS = /^(color|background|background-color|background-image|border|border-(top|right|bottom|left)(-color)?|border-color|outline|outline-color|box-shadow|text-shadow|fill|stroke|caret-color|accent-color|text-decoration(-color)?|column-rule(-color)?)$/i;

// ---- a tiny CSS parser: top-level rules and at-rule blocks, one level of nesting inside @media ----
function stripComments(css) { return css.replace(/\/\*[\s\S]*?\*\//g, ""); }
function splitDecls(body) {
  const out = []; let depth = 0, cur = "";
  for (const ch of body) {
    if (ch === "(") depth += 1;
    if (ch === ")") depth -= 1;
    if (ch === ";" && depth === 0) { out.push(cur); cur = ""; continue; }
    cur += ch;
  }
  out.push(cur);
  return out.map((d) => d.trim()).filter(Boolean).map((d) => {
    const i = d.indexOf(":");
    return { prop: d.slice(0, i).trim(), value: d.slice(i + 1).trim() };
  });
}
function parseBlock(css, start = 0) {
  const nodes = []; let i = start, prelude = "";
  while (i < css.length) {
    const ch = css[i];
    if (ch === "}") return { nodes, end: i + 1 };
    if (ch === ";" && prelude.trim().startsWith("@")) { nodes.push({ type: "at-stmt", prelude: prelude.trim() }); prelude = ""; i += 1; continue; }
    if (ch === "{") {
      const p = prelude.trim().replace(/\s+/g, " ");
      if (p.startsWith("@")) {
        const inner = parseBlock(css, i + 1);
        nodes.push({ type: "at", prelude: p, children: inner.nodes });
        i = inner.end;
      } else {
        const close = css.indexOf("}", i + 1);
        nodes.push({ type: "rule", prelude: p, selectors: p.split(",").map((s) => s.trim()), decls: splitDecls(css.slice(i + 1, close)) });
        i = close + 1;
      }
      prelude = "";
      continue;
    }
    prelude += ch; i += 1;
  }
  return { nodes, end: i };
}
const parse = (css) => parseBlock(stripComments(css)).nodes;
function rulesOf(nodes, inMedia = null) {
  const out = [];
  for (const n of nodes) {
    if (n.type === "rule") out.push({ ...n, media: inMedia });
    if (n.type === "at") out.push(...rulesOf(n.children, n.prelude));
  }
  return out;
}

// ---- contrast (WCAG 2.x relative luminance) ----
function lum(hex) {
  const c = [1, 3, 5].map((k) => parseInt(hex.slice(k, k + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
}
export function contrast(a, b) { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); }

const problems = [];
const lines = [];
const report = { root, schemes: {}, pairs: [], chips: [], literals: {}, head: {} };
const problem = (id, msg) => problems.push(`${id} ${msg}`);

// ---- W1 head ----
const html = readFileSync(ui("index.html"), "utf8");
const metas = [...html.matchAll(/<meta\b[^>]*>/gi)].map((m) => {
  const attrs = {}; for (const a of m[0].matchAll(/([a-z-]+)="([^"]*)"/gi)) attrs[a[1].toLowerCase()] = a[2];
  return attrs;
});
const viewport = metas.find((m) => m.name === "viewport")?.content ?? "";
report.head.viewport = viewport;
if (viewport !== "width=device-width, initial-scale=1, viewport-fit=cover") problem("W1", `viewport is "${viewport}"`);
if (/maximum-scale|user-scalable/i.test(viewport)) problem("W1", "viewport blocks zoom");
const cs = metas.find((m) => m.name === "color-scheme")?.content ?? null;
report.head.colorScheme = cs;
if (cs !== "light dark") problem("W1", `meta color-scheme is ${JSON.stringify(cs)}`);
const themeColor = {};
for (const m of metas.filter((m) => m.name === "theme-color")) {
  const scheme = /prefers-color-scheme:\s*(light|dark)/.exec(m.media ?? "")?.[1];
  if (scheme) themeColor[scheme] = (m.content ?? "").toLowerCase();
}
report.head.themeColor = themeColor;

// ---- W2 token grammar ----
const stylesCss = readFileSync(ui("styles.css"), "utf8");
const tree = parse(stylesCss);
const first = tree[0], second = tree[1];
const lightBlock = first?.type === "rule" && first.prelude === ":root" ? first : null;
const darkMedia = second?.type === "at" && /^@media \(prefers-color-scheme: ?dark\)$/.test(second.prelude) ? second : null;
const darkBlock = darkMedia?.children?.length === 1 && darkMedia.children[0].type === "rule" && darkMedia.children[0].prelude === ":root" ? darkMedia.children[0] : null;
if (!lightBlock) problem("W2", "styles.css does not open with a :root { … } block");
if (!darkBlock) problem("W2", "the second block is not @media (prefers-color-scheme: dark) { :root { … } }");
function tokensOf(block, name) {
  const t = {};
  for (const d of block?.decls ?? []) {
    if (d.prop.startsWith("--")) {
      if (!/^#[0-9a-f]{6}$/i.test(d.value)) problem("W2", `${name} ${d.prop} is "${d.value}", not #rrggbb`);
      t[d.prop.slice(2)] = d.value.toLowerCase();
    } else if (!(d.prop === "color-scheme")) problem("W2", `${name} block has a non-token declaration ${d.prop}`);
  }
  return t;
}
const light = tokensOf(lightBlock, "light"), dark = tokensOf(darkBlock, "dark");
const lightScheme = (lightBlock?.decls ?? []).find((d) => d.prop === "color-scheme")?.value;
if (lightBlock && lightScheme !== "light dark") problem("W2", `:root color-scheme is ${JSON.stringify(lightScheme)}`);
for (const k of TOKENS) {
  if (!(k in light)) problem("W2", `light is missing --${k}`);
  if (!(k in dark)) problem("W2", `dark is missing --${k}`);
}
for (const k of Object.keys(light)) if (!(k in dark)) problem("W2", `--${k} is light-only`);
for (const k of Object.keys(dark)) if (!(k in light)) problem("W2", `--${k} is dark-only`);
report.schemes = { light, dark };
for (const s of ["light", "dark"]) {
  const bg = (s === "light" ? light : dark).bg;
  if (!themeColor[s]) problem("W1", `no theme-color meta for ${s}`);
  else if (bg && themeColor[s] !== bg) problem("W1", `theme-color ${s} ${themeColor[s]} != --bg ${bg}`);
}

// ---- W4 dark pinned ----
for (const [k, v] of Object.entries(DARK_PINNED)) if (dark[k] && dark[k] !== v) problem("W4", `dark --${k} is ${dark[k]}, pinned ${v}`);

// ---- W3 contrast ----
for (const [fg, bgk, min] of PAIRS) {
  for (const [s, t] of [["light", light], ["dark", dark]]) {
    if (!t[fg] || !t[bgk]) continue;
    const r = contrast(t[fg], t[bgk]);
    report.pairs.push({ scheme: s, fg, bg: bgk, ratio: Number(r.toFixed(2)), min, ok: r >= min });
    if (r < min) problem("W3", `${s} --${fg} on --${bgk} is ${r.toFixed(2)} < ${min}`);
  }
}

// ---- W5 literals outside the two token blocks (styles.css, timeline.css, extras) ----
function literalScan(name, nodes, skip) {
  const hits = [];
  for (const r of rulesOf(nodes)) {
    if (skip.has(r.decls)) continue;
    for (const d of r.decls) {
      const v = d.value;
      if (/#[0-9a-f]{3,8}\b/i.test(v) || /\b(rgba?|hsla?|hwb|lab|lch|oklab|oklch|color)\(/i.test(v) || (COLOR_PROPS.test(d.prop) && NAMED.test(v.replace(/var\([^)]*\)/g, "")))) {
        hits.push(`${r.prelude} { ${d.prop}: ${v} }`);
      }
    }
  }
  report.literals[name] = hits;
  for (const h of hits) problem("W5", `${name}: ${h}`);
}
literalScan("styles.css", tree, new Set([lightBlock, darkBlock].filter(Boolean).map((b) => b.decls)));
for (const f of ["timeline.css", ...extra]) {
  if (!existsSync(ui(f))) { if (f !== "timeline.css") problem("W5", `${f} missing`); continue; }
  literalScan(f, parse(readFileSync(ui(f), "utf8")), new Set());
}

// ---- W6 chip families ----
const top = rulesOf(tree).filter((r) => r.media === null);
const chipDecl = (sel) => {
  let bg = null, ink = null;
  for (const r of top) {
    if (!r.selectors.some((s) => s.replace(/'/g, '"') === sel)) continue;
    for (const d of r.decls) {
      if (d.prop === "background" || d.prop === "background-color") bg = d.value;
      if (d.prop === "color") ink = d.value;
    }
  }
  return { bg, ink };
};
const base = chipDecl(".chip");
for (const [status, fam] of Object.entries(FAMILIES)) {
  const own = chipDecl(`.chip[data-status="${status}"]`);
  const bg = own.bg ?? base.bg, ink = own.ink ?? base.ink;
  const wantBg = `var(--chip-${fam ? fam + "-" : ""}bg)`, wantInk = `var(--chip-${fam ? fam + "-" : ""}ink)`;
  const ok = bg === wantBg && ink === wantInk;
  const ratios = {};
  for (const [s, t] of [["light", light], ["dark", dark]]) {
    const b = /var\(--([a-z0-9-]+)\)/.exec(bg ?? "")?.[1], k = /var\(--([a-z0-9-]+)\)/.exec(ink ?? "")?.[1];
    if (t[b] && t[k]) ratios[s] = Number(contrast(t[k], t[b]).toFixed(2));
  }
  report.chips.push({ status, family: fam || "default", bg, ink, ok, ...ratios });
  if (!ok) problem("W6", `${status} uses ${bg} / ${ink}, want ${wantBg} / ${wantInk}`);
}

// ---- W10 safe-area gutters (text check) ----
if (!/env\(safe-area-inset-left\)/.test(stylesCss) || !/env\(safe-area-inset-right\)/.test(stylesCss)) problem("W10", "styles.css does not use env(safe-area-inset-left) and env(safe-area-inset-right)");

report.problems = problems;
if (asJson) { console.log(JSON.stringify(report, null, 2)); }
else {
  lines.push(`head viewport "${viewport}" color-scheme ${JSON.stringify(cs)} theme-color light ${themeColor.light ?? "-"} dark ${themeColor.dark ?? "-"}`);
  lines.push(`tokens light ${Object.keys(light).length} dark ${Object.keys(dark).length} (required ${TOKENS.length})`);
  for (const p of report.pairs) lines.push(`pair ${p.scheme.padEnd(5)} --${p.fg} on --${p.bg} ${p.ratio.toFixed(2)} ${p.ok ? "ok" : "LOW"} (min ${p.min})`);
  for (const c of report.chips) lines.push(`chip ${c.status.padEnd(11)} ${c.family.padEnd(7)} ${c.ok ? "ok" : "WRONG"} light ${c.light ?? "-"} dark ${c.dark ?? "-"}`);
  for (const [f, hits] of Object.entries(report.literals)) lines.push(`literals ${f} ${hits.length}`);
  lines.push(problems.length ? `result fail (${problems.length} problems)` : "result pass (0 problems)");
  console.log(lines.join("\n"));
  if (problems.length) console.log(problems.map((p) => `- ${p}`).join("\n"));
}
process.exit(problems.length ? 1 : 0);
