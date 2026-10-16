#!/usr/bin/env node
// Box-only mock of the War Room's read API so the base and reference UI files can be probed in Chrome
// without cloning or running repo server code. node tools/phone-mock.mjs <root with src/ui> <port> [board.json] [lessons.json]
// lessons.json (optional) is what GET /api/lessons returns, e.g. `node tools/lessons-calc.mjs fixtures/lessons-week.jsonl --json`.
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
const [root, port = "47391", boardPath = new URL("../fixtures/phone/board-states.json", import.meta.url).pathname, lessonsPath] = process.argv.slice(2);
const board = JSON.parse(await readFile(boardPath, "utf8"));
const lessons = lessonsPath ? JSON.parse(await readFile(lessonsPath, "utf8")) : { window: { since: null, until: null }, picks: 0, findings: 0, lessons: [], oneOffs: [], skipped: [], summary: "0 lessons from 0 picks · 0 findings · 0 one-offs" };
const types = { ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8", ".html": "text/html; charset=utf-8" };
createServer(async (req, res) => {
  const path = new URL(req.url, "http://x").pathname;
  if (path === "/api/events") { res.writeHead(200, { "content-type": "text/event-stream" }); res.write("retry: 1000\n\n"); return; }
  if (path === "/api/board") { res.writeHead(200, { "content-type": "application/json" }); res.end(JSON.stringify(board)); return; }
  if (path === "/api/lessons") { res.writeHead(200, { "content-type": "application/json" }); res.end(JSON.stringify(lessons)); return; }
  if (path.startsWith("/api/picks/")) {
    const id = path.slice(11); const p = board.picks.find((x) => x.id === id);
    if (!p) { res.writeHead(404); res.end("{}"); return; }
    res.writeHead(200, { "content-type": "application/json" });
    res.end(JSON.stringify({ ...p, source: "chat", n: 3, approval: "ask", failDetail: null, report: null, candidates: [], judgement: null, filmRoom: null, labels: [], graft: null, physical: null, verdicts: [], fixLoops: 0, lessons: [], timeline: null }));
    return;
  }
  if (path === "/api/intake" && req.method === "POST") { res.writeHead(200, { "content-type": "application/json" }); res.end(JSON.stringify({ ok: true, inboxOffset: 2, policy: null })); return; }
  const file = path === "/" ? "index.html" : path.slice(1);
  if (!/^[a-z]+\.(js|css|html)$/.test(file)) { res.writeHead(404); res.end(); return; }
  try { const body = await readFile(join(root, "src", "ui", file)); res.writeHead(200, { "content-type": types[file.slice(file.lastIndexOf("."))] }); res.end(body); }
  catch { res.writeHead(404); res.end(); }
}).listen(Number(port), "127.0.0.1", () => console.log(`mock on http://127.0.0.1:${port}/ serving ${root}`));
