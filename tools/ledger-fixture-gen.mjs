// Box-only. Builds fixtures/ledger/* for SPEC 009 (Pick 8, Season Ledger) from real artifacts:
//   picks.jsonl          = fixtures/bigboard/season.jsonl (Picks 3-6, real) + runs/p8/real/p7/out (Pick 7, real, rebuilt with the repo's own commitPick @93dca59)
//   pulls.json           = runs/p8/real/gh/pulls-raw.json (gh api pulls?state=all, Mon Oct 19 2026 ~9:47 AM ET), trimmed to the fields the import reads
//   ledger-real.jsonl    = 9 pr lines (import of pulls.json at AT) + the 9 real physical/re-run verdicts not already in pick logs + 4 real drift compares
//   ledger-tuesday.jsonl = ledger-real + a PROJECTED #1 physical and #4 closed (labelled projection, not a real run)
//   ledger-edges.jsonl, hostile.jsonl, hostile-picks.jsonl = synthetic edge and hostile cases
//   expected.json        = ledgerOracle over each case
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { createHash } from "node:crypto";
import * as H from "../fixtures/ledger/ledger-harness.mjs";

const root = new URL("../", import.meta.url).pathname;
const out = root + "fixtures/ledger/";
const read = (p) => readFileSync(root + p, "utf8");
const REPO = "BoydVC/draft-day";
const AT = "2026-10-19T13:45:00.000Z";
const sha = (label) => createHash("sha1").update(label).digest("hex");
const line = (o) => JSON.stringify(o);

// ---- picks.jsonl ----
const season = read("fixtures/bigboard/season.jsonl").trimEnd().split("\n");
const p7 = read("runs/p8/real/p7/out/picks/p-20261018-97/events.jsonl").trimEnd().split("\n").map((l) => line({ pickId: "p-20261018-97", event: JSON.parse(l) }));
writeFileSync(out + "picks.jsonl", [...season, ...p7].join("\n") + "\n");

// ---- pulls.json ----
const raw = JSON.parse(read("runs/p8/real/gh/pulls-raw.json"));
const pulls = raw.map((p) => ({
  number: p.number, title: p.title, state: p.state, draft: p.draft, merged_at: p.merged_at,
  head: { ref: p.head.ref, sha: p.head.sha, repo: { full_name: p.head.repo.full_name } },
  base: { ref: p.base.ref, sha: p.base.sha, repo: { full_name: p.base.repo.full_name } },
}));
writeFileSync(out + "pulls.json", JSON.stringify(pulls, null, 2) + "\n");
const imported = H.prEntriesFromPulls(pulls, AT, [REPO]);
if (!imported.ok) throw new Error(imported.reason);
const head = Object.fromEntries(imported.entries.map((e) => [e.number, e.headSha]));

// ---- ledger-real.jsonl ----
const V = (at, number, headSha, certainty, agentId, note, ledger = "live-ui-verified") =>
  ({ kind: "verdict", at, repo: REPO, number, headSha, verdict: "VERIFIED", ledger, certainty, agentId, note });
const verdicts = [
  V("2026-10-17T17:44:00.000Z", 2, "ecec54cd11a08d2b5ddb7b318db37237e76d3c99", 5, "bc-4050efce-cfa2-5769-9689-d4920abc22b5", "Pick 1 physical (hand-run before dd logged picks)"),
  V("2026-10-17T17:49:00.000Z", 3, "60b1625518f61de576205c73318afd54c3384798", 5, "bc-ba3dfa73-de7f-5acd-9301-c9a8906240a0", "Pick 2 physical (hand-run before dd logged picks)"),
  V("2026-10-18T18:03:23.000Z", 2, "ecec54cd11a08d2b5ddb7b318db37237e76d3c99", 4, "bc-ed8c70e5-f451-55fc-8ee6-87c93c1a5803", "Sunday ledger re-run"),
  V("2026-10-18T18:03:24.000Z", 3, "60b1625518f61de576205c73318afd54c3384798", 5, "bc-3de20732-f23f-56df-9b31-ba65c8d29789", "Sunday ledger re-run"),
  V("2026-10-18T18:03:25.000Z", 5, "e242a533d04d68a5a4472bce283eb06866e79d96", 5, "bc-52d5eb5f-bd26-5ed7-9ae5-821c2846073a", "Sunday ledger re-run"),
  V("2026-10-18T18:03:26.000Z", 6, "c6cfad415576c2c14653955aff972a6d8c613ab1", 5, "bc-688f01d0-4318-59fc-8c3e-a80bd06d9c14", "Sunday ledger re-run"),
  V("2026-10-18T18:03:27.000Z", 7, "d1bd73c075173336f2d3a15b3a2ee288163b7b32", 5, "bc-75405ae4-c8c3-5b38-9296-ba1e2f2f8e0f", "Sunday ledger re-run; the verifier wrote its evidence into the ledger field, recorded as live-ui-verified"),
  V("2026-10-18T18:03:28.000Z", 8, "dc38660f2f3fdaadcfd2e879693e24cb21a05eba", 5, "bc-7d27d10b-9bb7-585a-a5cf-bdf82a945610", "Sunday ledger re-run"),
];
const drifts = [2, 3, 5, 6].map((n, i) => {
  const c = JSON.parse(read(`runs/p8/real/gh/compare-${n}.json`));
  return { kind: "drift", at: `2026-10-19T13:45:0${i + 1}.000Z`, repo: REPO, number: n, fromSha: c.merge_base_commit.sha, toSha: c.commits.at(-1).sha, files: c.files.map((f) => f.filename) };
});
for (const d of drifts) if (head[d.number] !== d.toSha) throw new Error(`drift ${d.number} toSha ${d.toSha} != head ${head[d.number]}`);
const realLines = [...imported.entries, ...verdicts, ...drifts].map((e) => {
  const p = H.parseLedgerEntry(e, [REPO]);
  if (!p.ok) throw new Error(`real entry ${e.number}: ${p.reason}`);
  return H.ledgerLine(p.entry);
});
writeFileSync(out + "ledger-real.jsonl", realLines.join("\n") + "\n");

// ---- ledger-tuesday.jsonl (projection) ----
const pr4 = imported.entries.find((e) => e.number === 4);
const tuesday = [
  ...realLines,
  H.ledgerLine({ kind: "verdict", at: "2026-10-20T14:00:00.000Z", repo: REPO, number: 1, headSha: head[1], verdict: "VERIFIED", ledger: "live-ui-verified", certainty: 5, note: "PROJECTION: the scaffold physical the ledger asks for (not a real run)" }),
  H.ledgerLine({ ...pr4, at: "2026-10-20T14:05:00.000Z", state: "closed", merged: false }),
];
writeFileSync(out + "ledger-tuesday.jsonl", tuesday.join("\n") + "\n");

// ---- ledger-edges.jsonl (synthetic) ----
const E = (o) => H.ledgerLine({ repo: REPO, ...o });
const PR = (number, headRef, baseRef, headSha, at = "2026-10-19T12:00:00.000Z", extra = {}) =>
  ({ kind: "pr", at, repo: REPO, number, title: `Edge #${number} ${headRef}`, headRef, headSha, baseRef, draft: true, state: "open", merged: false, ...extra });
const VV = (number, headSha, verdict, at, certainty = 5) => ({ kind: "verdict", at, repo: REPO, number, headSha, verdict, ledger: "live-ui-verified", certainty });
const edges = [
  PR(1, "dd/scaffold", "main", sha("e1"), "2026-10-19T12:00:00.000Z", { state: "closed", merged: true }),
  PR(2, "dd/p1", "dd/scaffold", sha("e2")),
  PR(3, "dd/p2", "dd/p1", sha("e3")),
  PR(4, "dd/p2-judge", "dd/p2", sha("e4")),
  PR(5, "dd/p3", "dd/p2", sha("e5")),
  PR(6, "dd/p4", "dd/p3", sha("e6"), "2026-10-19T12:00:00.000Z", { draft: false }),
  PR(7, "dd/p5", "dd/p4", sha("e7-old"), "2026-10-19T11:00:00.000Z"),
  PR(7, "dd/p5", "dd/p4", sha("e7-mid"), "2026-10-19T12:30:00.000Z"),
  PR(7, "dd/p5", "dd/p4", sha("e7"), "2026-10-19T12:30:00.000Z"),
  PR(8, "dd/p6", "dd/p5", sha("e8")),
  PR(9, "dd/p7", "dd/p6", sha("e9")),
  PR(14, "dd/p7-alt", "dd/p6", sha("e14")),
  PR(10, "dd/other", "main", sha("e10")),
  PR(11, "dd/other-2", "dd/other", sha("e11")),
  PR(12, "dd/abandoned", "dd/p1", sha("e12"), "2026-10-19T12:00:00.000Z", { state: "closed" }),
  PR(15, "dd/loop-a", "dd/loop-b", sha("e15")),
  PR(16, "dd/loop-b", "dd/loop-a", sha("e16")),
  VV(2, sha("e2"), "VERIFIED", "2026-10-19T10:00:00.000Z"),
  VV(3, sha("e3-old"), "VERIFIED", "2026-10-19T09:00:00.000Z"),
  VV(3, sha("e3"), "NOT_VERIFIED", "2026-10-19T12:00:00.000Z"),
  VV(3, sha("e3"), "VERIFIED", "2026-10-19T11:00:00.000Z"),
  VV(5, sha("e5-old"), "VERIFIED", "2026-10-19T09:00:00.000Z", 4),
  { kind: "drift", at: "2026-10-19T12:10:00.000Z", repo: REPO, number: 5, fromSha: sha("e5-old"), toSha: sha("e5"), files: ["docs/screens/p3/a.png", "src/ui/app.js"] },
  { kind: "drift", at: "2026-10-19T12:05:00.000Z", repo: REPO, number: 5, fromSha: sha("e5-old"), toSha: sha("e5"), files: ["docs/screens/p3/a.png"] },
  VV(6, sha("e6-old"), "VERIFIED", "2026-10-19T09:00:00.000Z"),
  VV(7, sha("e7"), "VERIFIED", "2026-10-19T12:40:00.000Z"),
  VV(8, sha("e8-old"), "NOT_VERIFIED", "2026-10-19T09:00:00.000Z"),
  VV(9, sha("e9"), "INCONCLUSIVE", "2026-10-19T12:40:00.000Z", 2),
  VV(99, sha("e99"), "VERIFIED", "2026-10-19T12:40:00.000Z"),
  { kind: "pr", at: "2026-10-19T12:00:00.000Z", repo: "BoydVC/bot-island", number: 1, title: "Other repo PR", headRef: "main-2", headSha: sha("bi1"), baseRef: "main", draft: true, state: "open", merged: false },
].map((o) => { const p = H.parseLedgerEntry(o, [REPO, "BoydVC/bot-island"]); if (!p.ok) throw new Error(`edge ${o.number}: ${p.reason}`); return H.ledgerLine(p.entry); });
writeFileSync(out + "ledger-edges.jsonl", edges.join("\n") + "\n");

// ---- hostile.jsonl ----
const p9 = imported.entries.find((e) => e.number === 9);
const p8 = imported.entries.find((e) => e.number === 8);
const good = (o) => H.ledgerLine(o);
const hostile = [
  "{not json",
  "[1,2,3]",
  line({ kind: "comment", at: AT, repo: REPO, number: 1 }),
  line({ ...p9, extra: "<img src=x onerror=alert(1)>" }),
  line({ ...p9, repo: "kpdlawgroup/kpd-dash" }),
  line({ ...p9, repo: "BoydVC/not-in-targets" }),
  line({ ...p9, at: "2026-10-19 13:45" }),
  line({ ...p9, number: 0 }),
  line({ ...p9, number: "9" }),
  line({ ...p9, title: "   " }),
  line({ ...p9, headRef: "javascript:alert(1)" }),
  line({ ...p9, headRef: "dd/../../etc" }),
  line({ ...p9, headSha: "93dca59" }),
  line({ ...p9, baseRef: "-rf" }),
  line({ ...p9, draft: "true" }),
  line({ ...p9, state: "merged" }),
  line({ ...p9, state: "open", merged: true }),
  line({ kind: "verdict", at: AT, repo: REPO, number: 7, headSha: head[7], verdict: "PASS", ledger: "live-ui-verified", certainty: 5 }),
  line({ kind: "verdict", at: AT, repo: REPO, number: 7, headSha: head[7], verdict: "VERIFIED", ledger: "npm test 256 pass/0 fail/0 skip; tsc 0; selftest 0; doctor pass", certainty: 5 }),
  line({ kind: "verdict", at: AT, repo: REPO, number: 7, headSha: head[7], verdict: "VERIFIED", ledger: "live-ui-verified", certainty: 6 }),
  line({ kind: "verdict", at: AT, repo: REPO, number: 7, headSha: head[7], verdict: "VERIFIED", ledger: "live-ui-verified", certainty: 5, agentId: "bc-38791de6" }),
  line({ kind: "verdict", at: AT, repo: REPO, number: 7, headSha: head[7], verdict: "VERIFIED", ledger: "live-ui-verified", certainty: 5, note: "x".repeat(301) }),
  line({ kind: "drift", at: AT, repo: REPO, number: 2, fromSha: head[2], toSha: head[2], files: ["docs/a.png"] }),
  line({ kind: "drift", at: AT, repo: REPO, number: 2, fromSha: "ecec54cd11a08d2b5ddb7b318db37237e76d3c99", toSha: head[2], files: ["docs/../src/core/reducer.ts"] }),
  line({ kind: "drift", at: AT, repo: REPO, number: 2, fromSha: "ecec54cd11a08d2b5ddb7b318db37237e76d3c99", toSha: head[2], files: [] }),
  line({ kind: "drift", at: AT, repo: REPO, number: 2, fromSha: "ecec54cd11a08d2b5ddb7b318db37237e76d3c99", toSha: head[2], files: ["/etc/passwd"] }),
  // valid lines below: hostile text must stay text
  good({ ...p9, title: "Draft Day Pick 7 <img src=x onerror=alert(1)> \u007f\u009f\u2028 <script>alert(2)</script>" }),
  good({ ...p8, title: "javascript:alert(3) \"><svg onload=alert(4)>" }) + "\r",
  good({ kind: "verdict", at: "2026-10-19T13:50:00.000Z", repo: REPO, number: 8, headSha: head[8], verdict: "VERIFIED", ledger: "live-ui-verified", certainty: 5, agentId: "bc-7d27d10b-9bb7-585a-a5cf-bdf82a945610", note: "<iframe src=//evil.example></iframe> \u0085 note" }),
  good({ ...p9, title: "Draft Day Pick 7 <img src=x onerror=alert(1)> \u007f\u009f\u2028 <script>alert(2)</script>" }),
  "",
  "   ",
];
writeFileSync(out + "hostile.jsonl", hostile.join("\n") + "\n");

// ---- hostile-picks.jsonl ----
const ev = (pickId, seq, type, key, payload, ts) => line({ pickId, event: { seq, ts, type, by: "grok-bot", key, payload } });
const phys = (prNumber, headSha, verdict, certainty = 5) => ({ attempt: 1, headSha, physical: { prNumber, headSha, verdict, ledger: "live-ui-verified", certainty, evidence: ["<img src=x onerror=alert(5)>"], fixLoops: 0 } });
const created = (id, source, target, idea) => ({ id, idea, source, target, n: 3, approval: "ask" });
const hp = [
  ev("p-20261019-70", 1, "pick_created", "pick", created("p-20261019-70", "selftest", REPO, "selftest pick that claims PR #9"), "2026-10-19T12:00:00.000Z"),
  ev("p-20261019-70", 2, "graft_recorded", "graft", { prNumber: 9, headSha: head[9], summary: "selftest graft" }, "2026-10-19T12:00:01.000Z"),
  ev("p-20261019-70", 3, "verdict_recorded", "verdict:1", phys(9, head[9], "NOT_VERIFIED"), "2026-10-19T12:00:02.000Z"),
  ev("p-20261019-71", 1, "pick_created", "pick", created("p-20261019-71", "chat", "BoydVC/bot-island", "other target pick that claims PR #8"), "2026-10-19T12:01:00.000Z"),
  ev("p-20261019-71", 2, "graft_recorded", "graft", { prNumber: 8, headSha: head[8], summary: "other target" }, "2026-10-19T12:01:01.000Z"),
  ev("p-20261019-71", 3, "verdict_recorded", "verdict:1", phys(8, head[8], "NOT_VERIFIED"), "2026-10-19T12:01:02.000Z"),
  ev("p-20261019-72", 1, "pick_created", "pick", created("p-20261019-72", "chat", REPO, "<img src=x onerror=alert(6)> pick with a broken verdict"), "2026-10-19T12:02:00.000Z"),
  ev("p-20261019-72", 2, "graft_recorded", "graft", { prNumber: 1, headSha: head[1], summary: "<script>alert(7)</script>" }, "2026-10-19T12:02:01.000Z"),
  ev("p-20261019-72", 3, "verdict_recorded", "verdict:1", phys(1, "f51dae8", "VERIFIED"), "2026-10-19T12:02:02.000Z"),
  ev("p-20261019-73", 1, "pick_created", "pick", created("p-20261019-74", "chat", REPO, "id mismatch"), "2026-10-19T12:03:00.000Z"),
  ev("p-20261019-73", 2, "verdict_recorded", "verdict:1", phys(9, head[9], "NOT_VERIFIED"), "2026-10-19T12:03:01.000Z"),
];
writeFileSync(out + "hostile-picks.jsonl", hp.join("\n") + "\n");

// ---- expected.json ----
const NOW = "2026-10-19T14:00:00.000Z";
const cases = [
  { case: "real", logs: ["picks.jsonl"], ledger: "ledger-real.jsonl", allowlist: [REPO], repo: REPO, now: NOW },
  { case: "tuesday", logs: ["picks.jsonl"], ledger: "ledger-tuesday.jsonl", allowlist: [REPO], repo: REPO, now: "2026-10-20T15:00:00.000Z" },
  { case: "edges", logs: [], ledger: "ledger-edges.jsonl", allowlist: [REPO, "BoydVC/bot-island"], repo: REPO, now: NOW },
  { case: "hostile", logs: ["picks.jsonl", "hostile-picks.jsonl"], ledger: "hostile.jsonl", allowlist: [REPO], repo: REPO, now: NOW },
  { case: "picks-only", logs: ["picks.jsonl"], ledger: null, allowlist: [REPO], repo: REPO, now: NOW },
  { case: "empty", logs: [], ledger: null, allowlist: [REPO], repo: REPO, now: NOW },
];
const rows = cases.map((c) => {
  const logs = H.readLogs(c.logs.map((f) => readFileSync(out + f, "utf8")).join(""));
  const book = H.readLedger(c.ledger ? readFileSync(out + c.ledger, "utf8") : "", c.allowlist);
  return { ...c, expected: H.expectedFor(H.ledgerOracle(logs, book, c.repo)) };
});
const expected = { spec: "SPEC-009", import: { pulls: "pulls.json", at: AT, allowlist: [REPO], equalsLines: { file: "ledger-real.jsonl", from: 1, to: imported.entries.length } }, rows };
writeFileSync(out + "expected.json", JSON.stringify(expected, null, 1) + "\n");
for (const r of rows) console.log(r.case.padEnd(10), r.expected.summary);
console.log(readdirSync(out).join(" "));
