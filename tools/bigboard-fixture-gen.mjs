#!/usr/bin/env node
// Box-only. Builds fixtures/bigboard/{season,league,hostile}.jsonl for SPEC 008 (Pick 7, Big Board stats).
// Every line is {"pickId": ..., "event": <a dd event>} like test/fixtures/lessons/lessons-week.jsonl.
// Sources: real Pick 3-6 logs (P3/P4 from fixtures/replay, already in the repo; P5/P6 rebuilt by
// tools/real-pick-gen.ts from the agents' own report blocks), the lessons week, the timeline fixture,
// the failed Pick 4 copy, plus three derived logs (live, cancelled, hostile) and two skip/exclude cases.
import { readFileSync, writeFileSync } from "node:fs";
const root = new URL("..", import.meta.url).pathname;
const read = (p) => readFileSync(root + p, "utf8");
const events = (p) => read(p).trim().split("\n").map((l) => JSON.parse(l));
const clone = (x) => JSON.parse(JSON.stringify(x));
const rows = (pickId, evs) => evs.map((event) => ({ pickId, event }));

const p3 = events("fixtures/replay/p-20261017-93.events.jsonl");
const p4 = events("fixtures/replay/p-20261017-94.events.jsonl");
const p5 = events("runs/p7/real/p5/out/picks/p-20261017-95/events.jsonl");
const p6 = events("runs/p7/real/p6/out/picks/p-20261018-96/events.jsonl");
const failed = events("fixtures/replay/p-20261017-98.events.jsonl");
const timelineFx = events("fixtures/p-20261010-07.events.jsonl");
const week = read("fixtures/lessons-week.jsonl").trim().split("\n").map((l) => JSON.parse(l));

function renamed(evs, id, edit = () => {}) {
  const out = clone(evs);
  for (const e of out) if (e.type === "pick_created") e.payload.id = id;
  edit(out);
  return out;
}
// Live: Pick 4 cut right after Film Room pass 1 launched (status judging, nothing scored yet).
const live = renamed(p4.filter((e) => e.seq <= 10), "p-20261017-97", (out) => {
  out[0].payload.idea = "Phone War Room (live copy cut at Film Room pass 1; fixture)";
});
// Cancelled: report written, Boyd passed, never approved.
const cancelled = renamed([clone(p4[0]), clone(p4[1]), { seq: 3, ts: "2026-10-16T20:00:00.000Z", type: "pick_cancelled", by: "dd", key: "cancelled", payload: { detail: "Boyd passed on this idea" } }], "p-20261016-71", (out) => {
  out[0].ts = "2026-10-16T14:00:00.000Z";
  out[0].payload.idea = "Sports Desk: Ravens and Orioles box scores on the Big Board (cancelled; fixture)";
  out[0].payload.source = "chat";
  out[1].ts = "2026-10-16T14:20:00.000Z";
});

const season = [...rows("p-20261017-93", p3), ...rows("p-20261017-94", p4), ...rows("p-20261017-95", p5), ...rows("p-20261018-96", p6)];
const league = [
  ...rows("p-20261010-07", timelineFx),
  ...week,
  ...rows("p-20261016-71", cancelled),
  ...season.slice(0, p3.length + p4.length),
  ...rows("p-20261017-95", p5),
  ...rows("p-20261017-97", live),
  ...rows("p-20261017-98", failed),
  ...rows("p-20261018-96", p6),
];

// Hostile: Pick 6's real log with markup in the idea, every angle, a lesson and the graft summary.
const hostile = renamed(p6, "p-20261018-73", (out) => {
  out[0].payload.idea = '<img src=x onerror=alert(1)>Linter <b>again</b>';
  const report = out.find((e) => e.type === "scouting_report_written").payload.report;
  report.angles = [
    "<img src=x onerror=alert(1)>Rule ledger: start from the registry",
    "javascript:alert(2)",
    '</li><script>alert(3)</script><a href="javascript:alert(4)">Coverage matrix</a> and a very long tail that runs well past the forty-eight character cap',
  ];
  const lesson = out.find((e) => e.type === "lesson_recorded");
  lesson.payload.text = '<iframe src="https://example.invalid/"></iframe>closed lists';
  lesson.key = `lesson:${lesson.payload.topic}:${lesson.payload.text}`;
  out.find((e) => e.type === "graft_recorded").payload.summary = '<svg onload=alert(5)>grafted';
});
// Excluded: a selftest pick (source "selftest") and a log whose pick_created id does not match its folder.
const selftest = renamed(week.filter((r) => r.pickId === "p-20261011-01").map((r) => r.event), "p-20261018-74", (out) => { out[0].payload.source = "selftest"; out.forEach((e) => (e.ts = e.ts.replace("2026-10-11", "2026-10-18"))); });
const mismatch = renamed(cancelled, "p-20261018-76", (out) => out.forEach((e) => (e.ts = e.ts.replace("2026-10-16", "2026-10-18"))));
const hostileRows = [...rows("p-20261018-73", hostile), ...rows("p-20261018-74", selftest), ...rows("p-20261018-75", mismatch)];

const write = (name, list) => writeFileSync(root + "fixtures/bigboard/" + name, list.map((r) => JSON.stringify(r)).join("\n") + "\n");
write("season.jsonl", season);
write("league.jsonl", league);
write("hostile.jsonl", hostileRows);
const ids = (list) => [...new Set(list.map((r) => r.pickId))];
console.log("season", ids(season).length, "picks", season.length, "events");
console.log("league", ids(league).length, "picks", league.length, "events", ids(league).join(" "));
console.log("hostile", ids(hostileRows).length, "picks", hostileRows.length, "events");
