// Cross-check: the swap rule computed from START's own reduce() + filmRoom() (src read remotely into a mirror, never cloned)
// must equal fixtures/swap/swap-harness.mjs on every expected.json input. Usage: bun tools/swap-engine-ref.ts <mirror> [fixturesDir]
import { readFileSync } from "node:fs";
const mirror = process.argv[2] ?? "runs/p9/start";
const fx = process.argv[3] ?? "fixtures/swap";
const core: any = await import(`${process.cwd()}/${mirror}/src/core/index.ts`);
const H: any = await import(`${process.cwd()}/${fx}/swap-harness.mjs`);
const NOW = Date.parse("2026-10-20T00:00:00.000Z");
function engineSwap(logs: any[], window: any) {
  const w = { since: window?.since ?? null, until: window?.until ?? null };
  const rows: any[] = [];
  for (const log of [...logs].sort((a, b) => (a.pickId < b.pickId ? -1 : 1))) {
    if (!core.isPickId(log.pickId) || !Array.isArray(log.events)) continue;
    const created = [...log.events].sort((a, b) => a.seq - b.seq).find((e: any) => e?.type === "pick_created");
    if (!created || created.payload?.id !== log.pickId) continue;
    const t = Date.parse(created.ts);
    if (w.since && !(t >= Date.parse(`${w.since}T00:00:00Z`))) continue;
    if (w.until && !(t < Date.parse(`${w.until}T00:00:00Z`))) continue;
    if (created.payload?.source === "selftest") continue;
    const pick = core.reduce(log.events, NOW);
    const room = pick ? core.filmRoom(pick) : null;
    if (!room || !room.base) continue;
    const passes = [...pick.judgement.passes].sort((a: any, b: any) => a.pass - b.pass);
    rows.push({ pickId: log.pickId, swap: room.swap, base: room.base, tieRule: room.tieRule !== null,
      winners: room.passes.map((v: any) => v.winner), views: room.passes, rawModels: passes.map((p: any) => p.judgeModel) });
  }
  const two = rows.filter((r) => r.swap !== "single"), fl = two.filter((r) => r.swap === "flipped");
  const lab = new Map<string, { wins: number; passes: number }>();
  for (const r of rows) for (const v of r.views) {
    if (!v.winner) continue;
    for (const line of v.lines) { const a = lab.get(line.label) ?? { wins: 0, passes: 0 }; a.passes += 1; lab.set(line.label, a); }
    const wl = v.lines.find((l: any) => l.cand === v.winner).label; lab.get(wl)!.wins += 1;
  }
  const mod = new Map<string, any>();
  for (const r of two) { const p = H.pairOf(r.rawModels[0], r.rawModels[1]); const a = mod.get(p.key) ?? { key: p.key, name: p.name, picks: 0, flipped: 0 }; a.picks++; if (r.swap === "flipped") a.flipped++; mod.set(p.key, a); }
  return {
    judged: rows.length, single: rows.length - two.length, twoPass: two.length, consistent: two.length - fl.length, flipped: fl.length,
    rate: H.ratio(fl.length, two.length).rate, tieRule: fl.filter((r) => r.tieRule).length, strict: fl.map((r) => r.pickId),
    labels: ["A", "B", "C", "D", "E"].filter((l) => lab.has(l)).map((l) => [l, lab.get(l)!.wins, lab.get(l)!.passes]),
    models: [...mod.values()].sort((a, b) => b.picks - a.picks || (a.key < b.key ? -1 : a.key > b.key ? 1 : 0)).map((a) => [a.key, a.name, a.picks, a.flipped]),
    rows: rows.map((r) => [r.pickId, r.swap, r.winners, r.base, passesNames(r.rawModels)]),
  };
}
function resolve(f: string) { return f.startsWith("test/fixtures/swap/") ? `${fx}/${f.slice(19)}` : `${mirror}/${f}`; }
function passesNames(models: any[]) { return models.map((m) => H.judgeModelName(m)); }
const expected = JSON.parse(readFileSync(`${fx}/expected.json`, "utf8"));
let ok = 0, total = 0;
for (const row of expected.rows) {
  const text = row.fixtures.map((f: string) => readFileSync(resolve(f), "utf8")).join("");
  total++;
  const logs = H.readLogs(text);
  const eng = engineSwap(logs, row.window);
  const har = H.swapFor(H.swapOracle(logs, row.window, NOW));
  const same = JSON.stringify(eng) === JSON.stringify(har) && JSON.stringify(har) === JSON.stringify(row.expect);
  if (same) ok++; else console.log("MISMATCH", row.name, "\n eng", JSON.stringify(eng), "\n har", JSON.stringify(har), "\n exp", JSON.stringify(row.expect));
}
console.log(`engine vs harness vs expected.json ${ok}/${total}`);
// The three J6 mutations of the real season: engine and harness must agree on each.
{
  const src = readFileSync(`${mirror}/test/fixtures/ledger/picks.jsonl`, "utf8").split("\n").filter(Boolean).map((l) => JSON.parse(l));
  const isJ = (r: any, id: string, pass: number) => r.pickId === id && r.event.type === "judgement_recorded" && r.event.payload.pass === pass;
  const muts: Record<string, any[]> = {
    "drop P3 pass 2": src.filter((r) => !isJ(r, "p-20261017-93", 2)),
    "P4 pass-2 judgeModel grok-4": src.map((r) => isJ(r, "p-20261017-94", 2) ? { ...r, event: { ...r.event, payload: { ...r.event.payload, judgeModel: "grok-4" } } } : r),
    "P6 pass-2 card C (c1, the pass-1 winner) tests gate fail": src.map((r) => isJ(r, "p-20261018-96", 2) ? { ...r, event: { ...r.event, payload: { ...r.event.payload, cards: r.event.payload.cards.map((c: any) => c.label === "C" ? { ...c, gates: { ...c.gates, tests: "fail" } } : c) } } } : r),
  };
  let mok = 0;
  for (const [name, rows] of Object.entries(muts)) {
    const logs = H.readLogs(rows.map((r) => JSON.stringify(r)).join("\n") + "\n");
    const eng = engineSwap(logs, null), har = H.swapFor(H.swapOracle(logs, null, NOW));
    if (JSON.stringify(eng) === JSON.stringify(har)) mok++; else console.log("MUT MISMATCH", name, JSON.stringify(eng), JSON.stringify(har));
  }
  console.log(`mutations engine vs harness ${mok}/3`);
}
