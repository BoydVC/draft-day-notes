// Box-only cross-check (run with bun). Computes SPEC 008's stats the way src/ must: through the START
// mirror's own reduce() and timeline() (runs/p7/start, read via gh api, never cloned), then compares the
// projection with the independent harness (fixtures/bigboard/bigboard-harness.mjs).
// usage: bun tools/bigboard-engine-ref.ts [startDir]
import { readFileSync } from "node:fs";
const root = new URL("..", import.meta.url).pathname;
const start = process.argv[2] ?? root + "runs/p7/start";
const core = await import(start + "/src/core/index.ts");
const h = await import(root + "fixtures/bigboard/bigboard-harness.mjs");
const NOW = Date.parse("2026-10-19T00:00:00.000Z");
const TERMINAL = new Set(["drafted", "failed", "cancelled"]);

function engineStats(logs: any[], window: any) {
  const w = { since: window?.since ?? null, until: window?.until ?? null };
  const skipped: any[] = []; const picks = { total: 0, drafted: 0, failed: 0, cancelled: 0, live: 0 }; const excluded = { selftest: 0 };
  const angleRows = new Map(), slotRows = new Map(); const tradeRows: any[] = [];
  const ver = { picks: 0, first: 0, final: 0, fixLoops: 0, verdicts: { VERIFIED: 0, NOT_VERIFIED: 0, INCONCLUSIVE: 0 } as any };
  const stageValues = new Map(h.STAGE_ORDER.map((s: string) => [s, [] as number[]]));
  const row = (m: Map<string, any>, key: string, name: string) => { if (!m.has(key)) m.set(key, { key, name, entries: 0, wins: 0, walkovers: 0, picks: new Set() }); return m.get(key); };
  for (const log of [...logs].sort((a, b) => (a.pickId < b.pickId ? -1 : 1))) {
    if (!core.isPickId(log.pickId)) { skipped.push({ pickId: log.pickId, reason: "bad pick id" }); continue; }
    const created = [...log.events].sort((a: any, b: any) => a.seq - b.seq).find((e: any) => e.type === "pick_created");
    if (!created) { skipped.push({ pickId: log.pickId, reason: "no pick_created" }); continue; }
    if (created.payload.id !== log.pickId) { skipped.push({ pickId: log.pickId, reason: "id mismatch" }); continue; }
    const t = Date.parse(created.ts);
    if (w.since && t < Date.parse(`${w.since}T00:00:00Z`)) continue;
    if (w.until && t >= Date.parse(`${w.until}T00:00:00Z`)) continue;
    if (created.payload.source === "selftest") { excluded.selftest += 1; continue; }
    const pick = core.reduce(log.events, NOW);
    picks.total += 1; if (TERMINAL.has(pick.status)) (picks as any)[pick.status] += 1; else picks.live += 1;
    const base = pick.judgement?.base ?? null;
    for (const c of pick.candidates) {
      if (c.status !== "finished") continue;
      for (const r of [row(angleRows, h.angleKey(c.angle), h.angleName(c.angle)), row(slotRows, c.id, c.id)]) {
        if (base) { r.entries += 1; r.picks.add(log.pickId); if (base === c.id) r.wins += 1; }
        else if (pick.walkover) { r.walkovers += 1; r.picks.add(log.pickId); }
      }
    }
    if (pick.graft?.recorded) tradeRows.push({ pickId: log.pickId, base, trades: pick.judgement?.trades.length ?? 0 });
    if (pick.verdicts.length) {
      ver.picks += 1; if (pick.verdicts[0].verdict === "VERIFIED") ver.first += 1; if (pick.verdicts.at(-1).verdict === "VERIFIED") ver.final += 1;
      ver.fixLoops += pick.fixLoops; for (const v of pick.verdicts) ver.verdicts[v.verdict] += 1;
    }
    if (TERMINAL.has(pick.status)) {
      const per = new Map<string, number>();
      for (const sp of core.timeline(log.events, NOW).stages) if (sp.to !== null && stageValues.has(sp.stage)) per.set(sp.stage, (per.get(sp.stage) ?? 0) + sp.durationMs);
      for (const [s, ms] of per) stageValues.get(s)!.push(ms);
    }
  }
  const fin = (r: any) => ({ key: r.key, name: r.name, entries: r.entries, wins: r.wins, walkovers: r.walkovers, rate: h.ratio(r.wins, r.entries).rate, picks: [...r.picks].sort() });
  const angles = [...angleRows.values()].map(fin).sort((a: any, b: any) => (a.rate === null ? 1 : 0) - (b.rate === null ? 1 : 0) || (b.rate ?? 0) - (a.rate ?? 0) || b.wins - a.wins || b.entries - a.entries || (a.key < b.key ? -1 : a.key > b.key ? 1 : 0));
  const slots = ["c1", "c2", "c3", "c4", "c5"].filter((c) => slotRows.has(c)).map((c) => fin(slotRows.get(c)));
  const total = tradeRows.reduce((s, r) => s + r.trades, 0);
  const trades = { picks: tradeRows.length, total, mean: tradeRows.length ? Math.round((total / tradeRows.length) * 100) / 100 : null, rows: tradeRows };
  const verify = { picks: ver.picks, firstTry: h.ratio(ver.first, ver.picks), final: h.ratio(ver.final, ver.picks), fixLoops: ver.fixLoops, verdicts: ver.verdicts };
  const stages = h.STAGE_ORDER.map((stage: string) => { const v = stageValues.get(stage)!; const m = h.median(v); return { stage, picks: v.length, medianMs: m, medianText: v.length ? core.formatDuration(m) : "—", totalMs: v.reduce((s, x) => s + x, 0) }; });
  return { window: w, summary: h.summaryOf(picks, verify, trades), picks, excluded, skipped, angles, slots, trades, verify, stages };
}
let bad = 0, n = 0;
const cases = JSON.parse(readFileSync(root + "fixtures/bigboard/expected.json", "utf8")).rows;
for (const c of cases) {
  const logs = h.readLogs(readFileSync(root + "fixtures/bigboard/" + c.fixture, "utf8"));
  const a = JSON.stringify(h.expectedFor(engineStats(logs, c.window)));
  const b = JSON.stringify(h.expectedFor(h.bigBoardOracle(logs, c.window, NOW)));
  n += 1;
  if (a !== b) { bad += 1; console.log("MISMATCH", c.name, "\n engine ", a, "\n harness", b); } else console.log("ok", c.name);
}
console.log(`engine vs harness ${n - bad}/${n}`);
process.exit(bad ? 1 : 0);
