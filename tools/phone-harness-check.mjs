#!/usr/bin/env node
// Box-side oracle for SPEC 005 W11-W17 (W11 board DOM, W12-W16 the New pick form, W17 same-origin calls) (the New pick form), run through fixtures/phone/dom-harness.mjs.
// Usage: node tools/phone-harness-check.mjs <root containing src/ui/{app,timeline}.js> [--json]
// Uses <root>/test/fixtures/phone/dom-harness.mjs when the root has it (a candidate worktree), else the box copy
// next to this tool (../fixtures/phone/). Exit 0 when every check passes, 1 otherwise. Zero deps. No sockets.
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const root = process.argv[2];
if (!root) { console.error("usage: phone-harness-check.mjs <root> [--json]"); process.exit(2); }
const local = join(resolve(root), "test", "fixtures", "phone", "dom-harness.mjs");
const harnessUrl = existsSync(local) ? pathToFileURL(local).href : new URL("../fixtures/phone/dom-harness.mjs", import.meta.url).href;
const { loadWarRoom, response, findAll } = await import(harnessUrl);
const asJson = process.argv.includes("--json");
const IDEA = "Show the run count in the page title";
const TEXT = {
  ok: "Queued in the inbox. Nothing launches from this page.",
  policy: "Queued in the inbox. Policy will refuse it (fixture-rule).",
  error: "target is not in targets.json",
  down: "Could not reach the War Room. Check the Big Board before trying again.",
  sending: "Sending…",
};
const results = [];
const unhandled = [];
process.on("unhandledRejection", (e) => { unhandled.push(String(e?.message ?? e)); });
const check = (id, name, ok, detail = "") => results.push({ id, name, ok: Boolean(ok), detail });

async function fresh(intake, extra = {}) { return loadWarRoom({ root, intake, ...extra }); }
function busy(btn) { return Boolean(btn && (btn.disabled || btn.getAttribute("aria-disabled") === "true")); }
async function submit(w, { focusButton = true } = {}) {
  const idea = w.control("Idea");
  if (idea) idea.value = IDEA;
  if (focusButton) w.button("Add pick")?.focus();
  w.form()?.dispatch("submit");
  await w.flush();
}

// W11 one DOM at every width: the Big Board stays one table, and no UI script reads the viewport size
{
  const board = JSON.parse(readFileSync(new URL("../fixtures/phone/board-states.json", import.meta.url), "utf8"));
  const w = await loadWarRoom({ root, intake: "ok", board });
  const tables = findAll(w.app, (n) => n.tagName === "TABLE" && findAll(n, (b) => b.getAttribute("id") === "board-body").length > 0);
  check("W11", "the Big Board region holds exactly one table with tbody#board-body", tables.length === 1, `tables=${tables.length}`);
  const heads = tables[0] ? findAll(tables[0], (n) => n.tagName === "TH").map((n) => n.textContent.trim()) : [];
  check("W11", "column headers read Pick, Idea, Stage, Status, Runs", heads.join(",") === "Pick,Idea,Stage,Status,Runs", heads.join(","));
  const body = tables[0] ? findAll(tables[0], (n) => n.getAttribute("id") === "board-body")[0] : null;
  const rows = body ? body.children.filter((n) => n.tagName === "TR") : [];
  check("W11", "one row per pick then per inbox item (10 for board-states.json)", rows.length === 10, `rows=${rows.length}`);
  check("W11", "every row has exactly five cells", rows.length > 0 && rows.every((r) => r.children.filter((c) => c.tagName === "TD").length === 5));
  const ids = rows.slice(0, 9).map((r) => r.getAttribute("data-pick-id"));
  check("W11", "pick rows keep data-pick-id in API order", ids.join(",") === board.picks.map((p) => p.id).join(","), ids.join(","));
  const hrefs = rows.slice(0, 9).map((r) => findAll(r, (n) => n.tagName === "A")[0]?.getAttribute("href"));
  check("W11", "each pick row's first link is #/picks/<id>", hrefs.every((h, i) => h === `#/picks/${board.picks[i].id}`), hrefs.join(","));
  const uiDir = join(resolve(root), "src", "ui");
  const hits = readdirSync(uiDir).filter((f) => f.endsWith(".js")).flatMap((f) => (/\b(matchMedia|innerWidth|outerWidth|innerHeight|visualViewport)\b|\bscreen\.|["']resize["']|["']orientationchange["']/.test(readFileSync(join(uiDir, f), "utf8")) ? [f] : []));
  check("W11", "no src/ui/*.js reads the viewport (matchMedia, innerWidth, screen., resize …)", hits.length === 0, hits.join(","));
}

// W12 shape
{
  const w = await fresh("ok");
  const form = w.form(), idea = w.control("Idea"), target = w.control("Target"), n = w.control("Candidates"), btn = w.button("Add pick");
  check("W12", "form named New pick with Idea, Target, Candidates, Add pick", form && idea && target && n && btn);
  check("W12", "Idea is a textarea", idea?.tagName === "TEXTAREA");
  check("W12", "Target value BoydVC/draft-day", target?.value === "BoydVC/draft-day");
  const ac = target?.getAttribute("autocapitalize");
  check("W12", "Target autocapitalize none|off, autocorrect off, spellcheck false, autocomplete off",
    (ac === "none" || ac === "off") && target?.getAttribute("autocorrect") === "off" && target?.getAttribute("spellcheck") === "false" && target?.getAttribute("autocomplete") === "off",
    `autocapitalize=${ac} autocorrect=${target?.getAttribute("autocorrect")} spellcheck=${target?.getAttribute("spellcheck")} autocomplete=${target?.getAttribute("autocomplete")}`);
  let nOk = false, nDetail = n ? n.tagName : "missing";
  if (n?.tagName === "INPUT") {
    nOk = n.getAttribute("type") === "number" && n.getAttribute("min") === "1" && n.getAttribute("max") === "5" && n.getAttribute("inputmode") === "numeric" && n.value === "3";
    nDetail = `input type=${n.getAttribute("type")} min=${n.getAttribute("min")} max=${n.getAttribute("max")} inputmode=${n.getAttribute("inputmode")} value=${n.value}`;
  } else if (n?.tagName === "SELECT") {
    const opts = findAll(n, (o) => o.tagName === "OPTION").map((o) => o.value);
    nOk = opts.join(",") === "1,2,3,4,5" && n.value === "3";
    nDetail = `select options=${opts.join(",")} value=${n.value}`;
  }
  check("W12", "Candidates is 1-5 with value 3 (number input with inputmode numeric, or select 1..5)", nOk, nDetail);
  check("W12", "Add pick is type=submit", btn?.getAttribute("type") === "submit");
  check("W12", "a role=status node sits in the New pick region", w.status() != null);
}

// W13 one submit = one same-origin POST with the exact body
{
  const w = await fresh("ok");
  const before = w.calls.length;
  await submit(w);
  const posts = w.posts();
  check("W13", "one submit makes exactly one POST /api/intake", posts.length === 1, `posts=${posts.length}`);
  const body = posts[0]?.json;
  const sorted = (o) => (o && typeof o === "object" ? JSON.stringify(Object.keys(o).sort().reduce((a, k) => ({ ...a, [k]: o[k] }), {})) : String(o));
  check("W13", "body is exactly {idea,target,n,source:warroom} (any key order)", sorted(body) === sorted({ idea: IDEA, target: "BoydVC/draft-day", n: 3, source: "warroom" }), JSON.stringify(body));
  const h = posts[0]?.headers ?? {};
  check("W13", "content-type application/json", String(h["content-type"] ?? h["Content-Type"] ?? "").startsWith("application/json"));
  const later = w.calls.slice(before).filter((c) => !(c.method === "POST" && c.url === "/api/intake"));
  check("W13", "the only other requests after submit are GET /api/board", later.every((c) => c.method === "GET" && c.url === "/api/board"), later.map((c) => `${c.method} ${c.url}`).join(", "));
  check("W13", "every request is same-origin (path starts with one /)", w.calls.every((c) => c.url.startsWith("/") && !c.url.startsWith("//")));
}

// W14 in-flight guard, across a full re-render
{
  const w = await fresh("defer");
  await submit(w);
  check("W14", "Add pick is disabled or aria-disabled while in flight", busy(w.button("Add pick")));
  check("W14", "status reads Sending… while in flight", w.status()?.textContent === TEXT.sending, w.status()?.textContent);
  w.form()?.dispatch("submit"); await w.flush();
  check("W14", "a second submit in flight makes no second POST", w.posts().length === 1, `posts=${w.posts().length}`);
  w.idle(); await w.emit();
  check("W14", "after a full re-render in flight the new Add pick is still guarded", busy(w.button("Add pick")));
  await submit(w, { focusButton: false });
  check("W14", "a submit from the re-rendered form in flight makes no second POST", w.posts().length === 1, `posts=${w.posts().length}`);
  await w.settle(response(200, { ok: true, inboxOffset: 1, policy: null }));
  check("W14", "Add pick is enabled again after the answer", !busy(w.button("Add pick")));
  check("W14", "the form on screen shows the outcome after an in-flight re-render", w.status()?.textContent === TEXT.ok, w.status()?.textContent);
}

// W15 outcomes (desktop-like: the button keeps focus)
for (const [mode, want, keepIdea] of [["ok", TEXT.ok, false], ["policy", TEXT.policy, false], ["error", TEXT.error, true], ["reject", TEXT.down, true], ["badjson", TEXT.down, true]]) {
  const w = await fresh(mode);
  await submit(w);
  check("W15", `${mode}: status text`, w.status()?.textContent === want, JSON.stringify(w.status()?.textContent));
  check("W15", `${mode}: Idea ${keepIdea ? "keeps the text" : "is cleared"}`, (w.control("Idea")?.value ?? null) === (keepIdea ? IDEA : ""), JSON.stringify(w.control("Idea")?.value));
  check("W15", `${mode}: Add pick enabled after`, !busy(w.button("Add pick")));
}

// W15 hostile server text is shown as text, never parsed
{
  const HOSTILE = '<img src=x onerror=alert(1)><script>alert(2)</script>';
  const w = await fresh("error", { errorText: HOSTILE });
  await submit(w);
  check("W15", "hostile error text: status shows it literally", w.status()?.textContent === HOSTILE, JSON.stringify(w.status()?.textContent));
  const made = findAll(w.document.documentElement, (n) => ["IMG", "SCRIPT", "IFRAME"].includes(n.tagName));
  check("W15", "hostile error text: no img, script or iframe node exists", made.length === 0, made.map((n) => n.tagName).join(","));
  const onAttr = w.document._attrLog.filter((a) => /^on/i.test(a.name));
  check("W15", "hostile error text: no on* attribute was ever set", onAttr.length === 0, onAttr.map((a) => a.name).join(","));
}

// W16 the outcome survives a full re-render (iOS Safari: nothing keeps focus after a tap)
for (const [mode, want, keepIdea] of [["ok", TEXT.ok, false], ["error", TEXT.error, true], ["reject", TEXT.down, true]]) {
  const w = await fresh(mode);
  await submit(w, { focusButton: false });
  w.idle(); await w.emit();
  check("W16", `${mode}: status survives a full re-render`, w.status()?.textContent === want, JSON.stringify(w.status()?.textContent));
  if (keepIdea) check("W16", `${mode}: Idea still holds the submitted text after a re-render`, w.control("Idea")?.value === IDEA, JSON.stringify(w.control("Idea")?.value));
}
{
  const w = await fresh("error");
  await submit(w, { focusButton: false });
  w.idle(); await w.emit();
  w.form()?.dispatch("submit"); await w.flush();
  check("W16", "a resubmit from the re-rendered form sends the kept idea (second POST carries the same idea)", w.posts().length === 2 && w.posts()[1]?.json?.idea === IDEA, `posts=${w.posts().length} idea=${JSON.stringify(w.posts()[1]?.json?.idea)}`);
}
check("W15", "no unhandled promise rejection from the page", unhandled.length === 0, unhandled.join(" | "));

// W17 every request the page makes, across every scenario above, is same-origin and only to /api/*
{
  const w = await fresh("ok");
  await submit(w);
  await w.emit();
  await w.hashchange("#/picks/p-20261017-01");
  await w.hashchange("#/");
  const bad = w.calls.filter((c) => !/^\/api\/(board|intake|picks\/p-\d{8}-\d{2}|lessons(\?[^#]*)?)$/.test(c.url));
  check("W17", "every fetch is same-origin /api/board, /api/intake, /api/picks/<id> or /api/lessons", bad.length === 0, bad.map((c) => `${c.method} ${c.url}`).join(", "));
  check("W17", "the page opens exactly one EventSource, on /api/events", w.sources.length === 1 && w.sources[0].url === "/api/events", w.sources.map((s) => s.url).join(","));
}

const failed = results.filter((r) => !r.ok);
if (asJson) console.log(JSON.stringify({ root, passed: results.length - failed.length, total: results.length, results }, null, 2));
else {
  for (const r of results) console.log(`${r.ok ? "pass" : "FAIL"} ${r.id} ${r.name}${r.ok || !r.detail ? "" : `  [${r.detail}]`}`);
  console.log(`${results.length - failed.length}/${results.length} pass`);
  const by = {}; for (const r of results) { by[r.id] ??= [0, 0]; by[r.id][1] += 1; if (r.ok) by[r.id][0] += 1; }
  console.log(Object.entries(by).map(([k, [p, t]]) => `${k} ${p}/${t}`).join("  "));
}
console.log(`harness ${harnessUrl}`);
process.exit(failed.length ? 1 : 0);
