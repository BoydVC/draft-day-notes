import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { test } from "node:test";
import { timeline } from "../src/core/index.ts";
import { compareFrame, frameAt, loadReplay, readPicks, REPLAY_STEP_MS, byName } from "./fixtures/replay/replay-harness.mjs";
import type { PickBody, TimelineView } from "./fixtures/replay/replay-harness.mjs";

const root = process.cwd();
const picks = readPicks(join(root, "test/fixtures/replay"));

test("R3 every frame of every fixture", async () => {
  for (const [id, body] of Object.entries(picks)) {
    const room = await loadReplay({ hash: `#/picks/${id}/replay` });
    for (let k = 0; k < body.timeline.entries.length; k += 1) {
      if (k > 0) await room.press("Next event");
      assert.deepEqual(compareFrame(room.snapshot(), frameAt(body.timeline, k)), [], `${id} ${k + 1}`);
    }
  }
});

test("R5 play steps once per REPLAY_STEP_MS", async () => {
  const room = await loadReplay({ hash: "#/picks/p-20261017-94/replay?at=19" });
  await room.press("Play");
  await room.clock.tick(REPLAY_STEP_MS);
  assert.equal(room.snapshot()?.seq, 20);
  assert.ok(byName(room.app, "Play", ["BUTTON"]));
});

test("R9 live prefix", async () => {
  const events = (await readFile(join(root, "test/fixtures/replay/p-20261017-94.events.jsonl"), "utf8")).split("\n").filter(Boolean).map((line) => JSON.parse(line));
  const view = timeline(events.slice(0, 12), Date.parse("2026-10-17T21:10:00Z")) as unknown as TimelineView;
  const body: PickBody = { ...picks["p-20261017-94"]!, timeline: view };
  const room = await loadReplay({ hash: "#/picks/p-20261017-94/replay?at=12", picks: { "p-20261017-94": body } });
  assert.deepEqual(compareFrame(room.snapshot(), frameAt(view, 11)), []);
});
