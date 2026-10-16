#!/usr/bin/env bun
// Box-side oracle for SPEC 006 (Replay). Usage: bun tools/replay-check.mjs <root with src/ui + src/core> [--json]
// Drives <root>/src/ui through fixtures/replay/replay-harness.mjs (box copy) with the box fixtures, and builds
// live prefixes with <root>/src/core/index.ts. Prints one line per check id: pass/total and the first problems.
import { readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { compareFrame, frameAt, loadReplay, readPicks, REPLAY_STEP_MS, find, findAll, text, byName, accessibleName } from "../fixtures/replay/replay-harness.mjs";

const args = process.argv.slice(2);
const root = resolve(args.find((a) => !a.startsWith("--")) ?? ".");
const FIX = resolve(import.meta.dir, "../fixtures/replay");
const picks = readPicks(FIX);
const IDS = Object.keys(picks).sort();
const results = new Map();
function check(id, ok, problem) {
  if (!results.has(id)) results.set(id, { pass: 0, total: 0, problems: [] });
  const r = results.get(id);
  r.total += 1;
  if (ok) r.pass += 1; else if (r.problems.length < 4) r.problems.push(problem);
}
const open = (hash, extra = {}) => loadReplay({ root, fixtures: FIX, hash, ...extra });
const replayHash = (id, at) => `#/picks/${id}/replay${at === undefined ? "" : `?at=${at}`}`;
const safe = async (id, fn) => { try { await fn(); } catch (e) { check(id, false, `threw: ${String(e && e.message || e).slice(0, 160)}`); } };

// R1 + R3: open each fixture at frame 1, then step with Next through every frame.
for (const id of IDS) {
  await safe("R3", async () => {
    const room = await open(replayHash(id));
    const view = picks[id].timeline;
    const p1 = compareFrame(room.snapshot(), frameAt(view, 0));
    check("R1", p1.length === 0, `${id} frame 1: ${p1[0]}`);
    for (let k = 0; k < view.entries.length; k += 1) {
      if (k > 0) await room.press("Next event");
      const p = compareFrame(room.snapshot(), frameAt(view, k));
      check("R3", p.length === 0, `${id} frame ${k + 1}: ${p[0]}`);
    }
  });
}
// R2 deep links.
await safe("R2", async () => {
  const view = picks["p-20261017-94"].timeline;
  for (const [at, want] of [[11, 10], [20, 19], [1, 0], [999, 0], ["x", 0]]) {
    const room = await open(replayHash("p-20261017-94", at));
    const p = compareFrame(room.snapshot(), frameAt(view, want));
    check("R2", p.length === 0, `at=${at}: ${p[0]}`);
  }
});
// R2 autoplay for recording: ?play=1 behaves like pressing Play once after the page opens.
await safe("R2", async () => {
  const room = await open("#/picks/p-20261017-94/replay?at=1&play=1");
  check("R2", room.snapshot()?.seq === 1 && byName(room.app, "Pause", ["BUTTON"]) !== null && room.clock.pending() === 1, `play=1 opens playing: pending ${room.clock.pending()}`);
  await room.clock.tick(REPLAY_STEP_MS * 19);
  check("R2", room.snapshot()?.seq === 20 && room.clock.pending() === 0 && byName(room.app, "Play", ["BUTTON"]) !== null, `play=1 ends on the last frame: seq ${room.snapshot()?.seq}`);
  const r2 = await open("#/picks/p-20261017-94/replay?play=0");
  check("R2", r2.clock.pending() === 0 && byName(r2.app, "Play", ["BUTTON"]) !== null, "play=0 does not play");
});
// R4 controls.
await safe("R4", async () => {
  const id = "p-20261017-93";
  const view = picks[id].timeline;
  const n = view.entries.length;
  const room = await open(replayHash(id));
  const dis = (name) => byName(room.app, name, ["BUTTON"])?.disabled;
  check("R4", dis("First event") === true && dis("Previous event") === true && dis("Next event") === false && dis("Last event") === false, "frame 1 disabled set");
  const names = findAll(find(room.app, (x) => x.getAttribute("role") === "group" && x.getAttribute("aria-label") === "Replay controls"), (x) => x.tagName === "BUTTON").map((b) => accessibleName(room.app, b));
  check("R4", JSON.stringify(names) === JSON.stringify(["First event", "Previous event", "Play", "Next event", "Last event"]), `button order ${JSON.stringify(names)}`);
  await room.press("Last event");
  check("R4", compareFrame(room.snapshot(), frameAt(view, n - 1)).length === 0, "Last event");
  check("R4", dis("Next event") === true && dis("Last event") === true && dis("First event") === false, "last frame disabled set");
  await room.press("Previous event");
  check("R4", compareFrame(room.snapshot(), frameAt(view, n - 2)).length === 0, "Previous event");
  await room.press("First event");
  check("R4", compareFrame(room.snapshot(), frameAt(view, 0)).length === 0, "First event");
  await room.scrub(17);
  check("R4", compareFrame(room.snapshot(), frameAt(view, 16)).length === 0, "scrub 17");
});
// R5 play.
await safe("R5", async () => {
  const id = "p-20261017-94";
  const view = picks[id].timeline;
  const n = view.entries.length;
  const room = await open(replayHash(id, 18));
  await room.press("Play");
  check("R5", text(byName(room.app, "Pause", ["BUTTON"])) === "Pause", "Play turns into Pause");
  await room.clock.tick(REPLAY_STEP_MS - 1);
  check("R5", room.snapshot()?.seq === 18, `before step seq ${room.snapshot()?.seq}`);
  await room.clock.tick(1);
  check("R5", room.snapshot()?.seq === 19, `after one step seq ${room.snapshot()?.seq}`);
  await room.clock.tick(REPLAY_STEP_MS);
  check("R5", room.snapshot()?.seq === 20 && byName(room.app, "Play", ["BUTTON"]) !== null && room.clock.pending() === 0, `end: seq ${room.snapshot()?.seq} pending ${room.clock.pending()}`);
  await room.press("Play");
  check("R5", room.snapshot()?.seq === 1 && byName(room.app, "Pause", ["BUTTON"]) !== null, `restart seq ${room.snapshot()?.seq}`);
  await room.clock.tick(REPLAY_STEP_MS * (n - 1));
  check("R5", room.snapshot()?.seq === 20 && room.clock.pending() === 0, `full play seq ${room.snapshot()?.seq}`);
});
// R6 manual moves pause.
await safe("R6", async () => {
  const room = await open(replayHash("p-20261017-94"));
  await room.press("Play");
  await room.clock.tick(REPLAY_STEP_MS * 2);
  await room.press("Next event");
  check("R6", room.snapshot()?.seq === 4 && byName(room.app, "Play", ["BUTTON"]) !== null && room.clock.pending() === 0, `next pauses: seq ${room.snapshot()?.seq} pending ${room.clock.pending()}`);
  await room.press("Play");
  await room.scrub(9);
  check("R6", room.snapshot()?.seq === 9 && room.clock.pending() === 0 && byName(room.app, "Play", ["BUTTON"]) !== null, `scrub pauses: pending ${room.clock.pending()}`);
});
// R7 redraws keep the place and the play state; one timer.
await safe("R7", async () => {
  const room = await open(replayHash("p-20261017-93", 5));
  await room.press("Play");
  await room.clock.tick(500);
  await room.emit(); await room.emit(); await room.emit();
  check("R7", room.snapshot()?.seq === 5 && byName(room.app, "Pause", ["BUTTON"]) !== null && room.clock.pending() === 1, `after 3 updates: seq ${room.snapshot()?.seq} pending ${room.clock.pending()}`);
  await room.clock.tick(500);
  check("R7", room.snapshot()?.seq === 6, `step lands on time: seq ${room.snapshot()?.seq}`);
  await room.press("Pause");
  await room.emit();
  check("R7", room.snapshot()?.seq === 6 && byName(room.app, "Play", ["BUTTON"]) !== null && room.clock.pending() === 0, "paused survives update");
});
// R8 same nodes, focus kept.
await safe("R8", async () => {
  const room = await open(replayHash("p-20261017-94", 3));
  const cap = () => find(room.app, (x) => x.getAttribute("data-replay") === "caption");
  const nextBtn = () => byName(room.app, "Next event", ["BUTTON"]);
  const c0 = cap(); const b0 = nextBtn();
  await room.press("Next event");
  check("R8", cap() === c0 && nextBtn() === b0 && room.app.contains(c0), "caption/Next node replaced by Next");
  check("R8", room.active() === "Next event", `focus after Next: ${room.active()}`);
  await room.emit();
  check("R8", cap() === c0 && room.active() === "Next event", `after update: same caption ${cap() === c0}, focus ${room.active()}`);
  await room.press("Play");
  check("R8", room.active() === "Pause", `focus after Play: ${room.active()}`);
  await room.clock.tick(REPLAY_STEP_MS);
  check("R8", cap() === c0 && room.active() === "Pause", `after a step: focus ${room.active()}`);
  await room.press("Last event");
  check("R8", room.active() === "Event", `focus when Last disables itself: ${room.active()}`);
});
// R9 live picks extend the film (prefix bodies built with the root's own core).
await safe("R9", async () => {
  const core = await import(join(root, "src/core/index.ts"));
  const events = readFileSync(join(FIX, "p-20261017-94.events.jsonl"), "utf8").split("\n").filter(Boolean).map((l) => JSON.parse(l));
  const base = picks["p-20261017-94"];
  const body = (n, now) => { const t = core.timeline(events.slice(0, n), Date.parse(now)); return { ...base, status: t.status, stage: t.stage, timeline: t }; };
  const b12 = body(12, "2026-10-17T21:10:00Z");
  const b13 = body(13, "2026-10-17T21:21:00Z");
  const room = await open(replayHash("p-20261017-94", 12), { picks: { ...picks, "p-20261017-94": b12 } });
  check("R9", compareFrame(room.snapshot(), frameAt(b12.timeline, 11)).length === 0, `live frame 12: ${compareFrame(room.snapshot(), frameAt(b12.timeline, 11))[0]}`);
  check("R9", room.snapshot()?.runs.at(-1)?.state === "running", "judge pass 2 running");
  room.setPick("p-20261017-94", b13);
  await room.emit();
  check("R9", compareFrame(room.snapshot(), frameAt(b13.timeline, 11)).length === 0 && room.snapshot()?.counter === "Event 12 of 13", `extended: ${room.snapshot()?.counter}`);
  await room.press("Next event");
  check("R9", compareFrame(room.snapshot(), frameAt(b13.timeline, 12)).length === 0, "new frame 13");
  const cancelled = body(2, "2026-10-20T00:00:00Z");
  const r2 = await open(replayHash("p-20261017-94", 2), { picks: { ...picks, "p-20261017-94": cancelled } });
  const st = r2.snapshot()?.stages.map((s) => s.text);
  check("R9", JSON.stringify(st) === JSON.stringify(["Intake 37m", "Scouting Report 2d 0h", "Cancelled"]), `synthetic stage ${JSON.stringify(st)}`);
  await r2.press("Previous event");
  const st1 = r2.snapshot()?.stages.map((s) => s.text);
  check("R9", JSON.stringify(st1) === JSON.stringify(["Intake"]), `frame 1 stages ${JSON.stringify(st1)}`);
});
// R10 requests.
await safe("R10", async () => {
  const room = await open(replayHash("p-20261017-94"));
  const after = (from) => room.calls.slice(from).map((c) => `${c.method} ${c.url}`);
  const opened = room.calls.findIndex((c) => c.url.startsWith("/api/picks/"));
  check("R10", JSON.stringify(after(opened)) === JSON.stringify(["GET /api/picks/p-20261017-94"]), `open: ${JSON.stringify(after(opened))}`);
  const mark = room.calls.length;
  await room.press("Next event"); await room.press("Play"); await room.clock.tick(REPLAY_STEP_MS * 3); await room.scrub(15); await room.press("Last event");
  check("R10", room.calls.length === mark, `controls made requests: ${JSON.stringify(after(mark))}`);
  await room.emit();
  check("R10", JSON.stringify(after(mark)) === JSON.stringify(["GET /api/picks/p-20261017-94"]), `update: ${JSON.stringify(after(mark))}`);
  check("R10", room.sources.length === 1 && room.sources[0].url === "/api/events", "one EventSource");
});
// R11 leaving stops play.
await safe("R11", async () => {
  const room = await open(replayHash("p-20261017-94"));
  await room.press("Play");
  await room.hashchange("#/");
  check("R11", room.clock.pending() === 0 && room.snapshot() === null, `left board: pending ${room.clock.pending()}`);
  const mark = room.calls.length;
  await room.clock.tick(REPLAY_STEP_MS * 5);
  check("R11", room.calls.length === mark, "no requests after leaving");
  await room.hashchange(replayHash("p-20261017-94"));
  await room.press("Play");
  await room.hashchange("#/picks/p-20261017-94");
  check("R11", room.clock.pending() === 0, `left to pick page: pending ${room.clock.pending()}`);
});
// R12 links.
await safe("R12", async () => {
  const room = await open("#/picks/p-20261017-93");
  const link = byName(room.app, "Replay", ["A"]);
  check("R12", link?.getAttribute("href") === "#/picks/p-20261017-93/replay", `pick page Replay link ${link?.getAttribute("href")}`);
  await room.hashchange(replayHash("p-20261017-93"));
  check("R12", byName(room.app, "Pick page", ["A"])?.getAttribute("href") === "#/picks/p-20261017-93", "Pick page link");
  check("R12", byName(room.app, "Big Board", ["A"])?.getAttribute("href") === "#/", "Big Board link");
});
// R13 unknown pick.
await safe("R13", async () => {
  const room = await open(replayHash("p-20261017-55"));
  check("R13", text(room.app).includes("That pick is not on the board.") && byName(room.app, "Big Board", ["A"])?.getAttribute("href") === "#/" && room.snapshot() === null && room.clock.pending() === 0, `unknown: ${text(room.app).slice(0, 80)}`);
});
// R14 hostile text stays text.
await safe("R14", async () => {
  const id = "p-20261017-99";
  const view = picks[id].timeline;
  const room = await open(replayHash(id));
  const okHref = /^(#\/|https:\/\/cursor\.com\/agents\/bc-[0-9a-f-]+$|https:\/\/github\.com\/BoydVC\/draft-day\/(pull|commit)\/)/;
  for (let k = 0; k < view.entries.length; k += 1) {
    if (k > 0) await room.press("Next event");
    const bad = findAll(room.app, (x) => ["IMG", "SCRIPT", "IFRAME"].includes(x.tagName) || [...x.attributes.keys()].some((a) => a.startsWith("on")));
    const hrefs = findAll(room.app, (x) => x.tagName === "A").map((a) => a.getAttribute("href"));
    check("R14", bad.length === 0 && hrefs.every((h) => okHref.test(h)), `frame ${k + 1}: ${bad.length} bad nodes, hrefs ${hrefs.filter((h) => !okHref.test(h)).join(",")}`);
  }
  check("R14", text(room.app).includes(picks[id].idea), "idea shown as text");
  await room.scrub(18);
  check("R14", room.snapshot()?.caption.includes('<img src=x onerror="alert(4)">'), "lesson markup shown as text");
});
// R15 wiring.
{
  const http = readFileSync(join(root, "src/server/http.ts"), "utf8");
  const html = readFileSync(join(root, "src/ui/index.html"), "utf8");
  const list = /const files = \[([^\]]*)\]/.exec(http)?.[1] ?? "";
  check("R15", /"\/replay\.js"/.test(list) && /"\/replay\.css"/.test(list), "http.ts files list lacks /replay.js or /replay.css");
  const links = [...html.matchAll(/<link rel="stylesheet" href="\/([a-z]+\.css)">/g)].map((m) => m[1]);
  const scripts = [...html.matchAll(/<script src="\/([a-z]+\.js)"><\/script>/g)].map((m) => m[1]);
  check("R15", JSON.stringify(links) === JSON.stringify(["styles.css", "timeline.css", "lessons.css", "replay.css"]), `links ${JSON.stringify(links)}`);
  check("R15", JSON.stringify(scripts) === JSON.stringify(["timeline.js", "lessons.js", "replay.js", "app.js"]), `scripts ${JSON.stringify(scripts)}`);
}
// R16 replay.js source rules.
{
  let src = "";
  try { src = readFileSync(join(root, "src/ui/replay.js"), "utf8"); } catch { src = null; }
  check("R16", src !== null, "no src/ui/replay.js");
  if (src !== null) {
    const banned = [/\bfetch\s*\(/, /\bDate\b/, /\brequestAnimationFrame\b/, /localStorage|sessionStorage|document\.cookie|XMLHttpRequest|WebSocket|sendBeacon/, /\/test\//, /\bhistory\s*\./, /location\s*\.\s*hash\s*=/];
    for (const re of banned) check("R16", !re.test(src), `replay.js matches ${re}`);
    check("R16", /globalThis\.draftDayReplay\s*=/.test(src), "replay.js does not set globalThis.draftDayReplay");
  }
}
// R17 replay.css rules.
{
  let css = null;
  try { css = readFileSync(join(root, "src/ui/replay.css"), "utf8"); } catch { css = null; }
  check("R17", css !== null, "no src/ui/replay.css");
  if (css !== null) {
    const clean = css.replace(/\/\*[\s\S]*?\*\//g, "");
    check("R17", !/#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\b/.test(clean) && !/(?:rgba?|hsla?|hwb|lab|lch|oklab|oklch|color)\(/i.test(clean), "replay.css has a color literal");
    const stripped = stripMotionBlocks(clean);
    check("R17", !/\b(transition|animation)\b/.test(stripped), "transition/animation outside @media (prefers-reduced-motion: no-preference)");
    check("R17", !/@import\b/i.test(clean) && !/url\(\s*['"]?(?:https?:|\/\/)/i.test(clean), "replay.css off-origin");
  }
}
// R18 (server half): the fixtures are honest. Serving each events.jsonl through the root's http.ts gives the
// fixture body's timeline, and the two new static files are served.
await safe("R18", async () => {
  const { mkdtemp, mkdir, writeFile } = await import("node:fs/promises");
  const { tmpdir } = await import("node:os");
  const { startServer } = await import(join(root, "src/server/http.ts"));
  const data = await mkdtemp(join(tmpdir(), "dd-replay-check-"));
  for (const id of IDS) {
    await mkdir(join(data, "picks", id), { recursive: true });
    await writeFile(join(data, "picks", id, "events.jsonl"), readFileSync(id === "p-20261010-07" ? join(root, "test/fixtures/timeline/p-20261010-07.events.jsonl") : join(FIX, `${id}.events.jsonl`)));
  }
  const server = await startServer({ host: "127.0.0.1", port: 0, dataDir: data, configPath: join(root, "draftday.config.json"), targetsPath: join(root, "targets.json") });
  try {
    for (const id of IDS) {
      const body = await (await fetch(`${server.url}/api/picks/${id}`)).json();
      check("R18", JSON.stringify(body.timeline) === JSON.stringify(picks[id].timeline), `${id} served timeline differs from ${id}.pick.json`);
    }
    for (const [file, type] of [["/replay.js", "text/javascript"], ["/replay.css", "text/css"]]) {
      const res = await fetch(`${server.url}${file}`);
      check("R18", res.status === 200 && String(res.headers.get("content-type")).startsWith(type), `${file} ${res.status} ${res.headers.get("content-type")}`);
    }
  } finally { await server.close(); }
});
function stripMotionBlocks(css) {
  let out = "";
  let i = 0;
  const re = /@media\s*\(\s*prefers-reduced-motion\s*:\s*no-preference\s*\)\s*\{/g;
  for (let m = re.exec(css); m; m = re.exec(css)) {
    out += css.slice(i, m.index);
    let depth = 1; let j = m.index + m[0].length;
    while (j < css.length && depth > 0) { if (css[j] === "{") depth += 1; else if (css[j] === "}") depth -= 1; j += 1; }
    i = j; re.lastIndex = j;
  }
  return out + css.slice(i);
}

let all = 0, passed = 0;
const lines = [];
for (const [id, r] of [...results.entries()].sort((a, b) => Number(a[0].slice(1)) - Number(b[0].slice(1)))) {
  all += r.total; passed += r.pass;
  lines.push(`${id} ${r.pass}/${r.total}${r.problems.length ? "  " + r.problems.join(" | ") : ""}`);
}
if (args.includes("--json")) console.log(JSON.stringify(Object.fromEntries(results)));
else { console.log(lines.join("\n")); console.log(`TOTAL ${passed}/${all}`); }
process.exit(passed === all ? 0 : 1);
