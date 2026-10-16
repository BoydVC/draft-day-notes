// Draft Day Pick 5 (box reference build for SPEC 006, not a candidate): Replay mode.
const REPLAY_STEP_MS = 1000;
const REPLAY_TERMINAL = ["drafted", "failed", "cancelled"];
const replay = { id: null, pick: null, index: 0, playing: false, timer: null, root: null, nodes: null, el: null };

function replayFrame(view, index) {
  const entries = view.entries;
  const entry = entries[index];
  const last = index === entries.length - 1;
  const over = REPLAY_TERMINAL.includes(entry.status) || (last && !view.live);
  const runs = view.runs.filter((run) => run.startSeq !== null && run.startSeq <= entry.seq).map((run) => {
    let state = "running";
    if (run.endSeq !== null && run.endSeq <= entry.seq) state = run.outcome;
    else if (run.outcome === "abandoned" && over) state = "abandoned";
    return { run, state };
  });
  const shown = view.stages.filter((span) => (span.firstSeq !== null ? span.firstSeq <= entry.seq : last && !view.live));
  return { entry, runs, shown };
}

function replayStopTimer() {
  if (replay.timer !== null) clearTimeout(replay.timer);
  replay.timer = null;
}

function replaySchedule() {
  if (!replay.playing || replay.timer !== null) return;
  replay.timer = setTimeout(() => {
    replay.timer = null;
    if (!replay.playing || !replay.pick) return;
    const n = replay.pick.timeline.entries.length;
    if (replay.index < n - 1) replay.index += 1;
    if (replay.index >= n - 1) replay.playing = false;
    replayPaint();
    replaySchedule();
  }, REPLAY_STEP_MS);
}

function replayGo(index) {
  const n = replay.pick.timeline.entries.length;
  replay.index = Math.max(0, Math.min(n - 1, index));
  replay.playing = false;
  replayStopTimer();
  replayPaint();
}

function replayToggle() {
  const n = replay.pick.timeline.entries.length;
  if (replay.playing) {
    replay.playing = false;
    replayStopTimer();
  } else {
    if (replay.index >= n - 1) replay.index = 0;
    replay.playing = n > 1;
  }
  replayPaint();
  replaySchedule();
}

function replayBuild(el) {
  const button = (control, label, action) => {
    const node = el("button", { type: "button", "data-control": control, class: "dd-replay-btn" }, [label]);
    node.addEventListener("click", action);
    return node;
  };
  const nodes = {
    title: el("h2", { class: "dd-replay-title" }, []),
    idea: el("p", { class: "dd-replay-idea" }, []),
    clock: el("p", { class: "dd-replay-clock", "data-replay": "clock" }, []),
    status: el("p", { class: "dd-replay-status", "data-replay": "status" }, []),
    stage: el("p", { class: "dd-replay-stage", "data-replay": "stage" }, []),
    counter: el("p", { class: "dd-replay-counter", "data-replay": "counter" }, []),
    caption: el("p", { class: "dd-replay-caption", "data-replay": "caption", "aria-live": "polite" }, []),
    first: button("first", "First event", () => replayGo(0)),
    prev: button("prev", "Previous event", () => replayGo(replay.index - 1)),
    play: button("play", "Play", () => replayToggle()),
    next: button("next", "Next event", () => replayGo(replay.index + 1)),
    lastBtn: button("last", "Last event", () => replayGo(replay.pick.timeline.entries.length - 1)),
    slider: el("input", { type: "range", min: "1", step: "1", "aria-label": "Event", class: "dd-replay-slider", "data-control": "slider" }, []),
    runs: el("ul", { class: "dd-replay-runs", "aria-label": "Runs so far" }, []),
    stages: el("ol", { class: "dd-replay-stages", "aria-label": "Stages so far" }, []),
    plays: el("ol", { class: "dd-replay-plays", "aria-label": "Play by play" }, []),
    pickLink: el("a", { href: "#/" }, ["Pick page"]),
  };
  nodes.slider.addEventListener("input", () => replayGo(Number(nodes.slider.value) - 1));
  const root = el("article", { class: "dd-replay", "aria-label": "Replay" }, [
    el("nav", { class: "dd-replay-nav", "aria-label": "Replay links" }, [nodes.pickLink, el("a", { href: "#/" }, ["Big Board"])]),
    nodes.title,
    nodes.idea,
    el("section", { class: "panel dd-replay-film", "aria-label": "Film" }, [
      el("div", { class: "dd-replay-board" }, [nodes.clock, nodes.status, nodes.stage, nodes.counter]),
      nodes.caption,
      el("div", { class: "dd-replay-controls", role: "group", "aria-label": "Replay controls" }, [
        nodes.slider,
        el("div", { class: "dd-replay-buttons" }, [nodes.first, nodes.prev, nodes.play, nodes.next, nodes.lastBtn]),
      ]),
    ]),
    el("div", { class: "dd-replay-side" }, [
      el("section", { class: "panel" }, [el("h3", {}, ["Runs"]), nodes.runs]),
      el("section", { class: "panel" }, [el("h3", {}, ["Stages"]), nodes.stages]),
    ]),
    el("section", { class: "panel dd-replay-log" }, [el("h3", {}, ["Play by play"]), nodes.plays]),
  ]);
  return { root, nodes };
}

function replayPaint() {
  const el = replay.el;
  const view = replay.pick.timeline;
  const nodes = replay.nodes;
  const n = view.entries.length;
  const { entry, runs, shown } = replayFrame(view, replay.index);
  const focused = document.activeElement;
  replay.root.setAttribute("data-pick-id", replay.pick.id);
  replay.root.setAttribute("data-seq", entry.seq);
  nodes.title.textContent = `Replay · ${replay.pick.id}`;
  nodes.idea.textContent = replay.pick.idea;
  nodes.pickLink.setAttribute("href", `#/picks/${replay.pick.id}`);
  nodes.clock.textContent = `+${entry.sinceStartText}`;
  nodes.status.replaceChildren(chip(entry.status));
  nodes.stage.textContent = entry.stage;
  nodes.counter.textContent = `Event ${replay.index + 1} of ${n}`;
  const links = (entry.links || []).map((link) => el("a", { href: link.href, target: "_blank", rel: "noopener noreferrer" }, [link.label]));
  const parts = [entry.title];
  for (const link of links) parts.push(" ", link);
  nodes.caption.replaceChildren(...parts);
  nodes.slider.setAttribute("max", n);
  nodes.slider.setAttribute("value", replay.index + 1);
  nodes.slider.value = String(replay.index + 1);
  nodes.slider.setAttribute("aria-valuetext", `Event ${replay.index + 1} of ${n} · +${entry.sinceStartText} · ${entry.title}`);
  nodes.play.textContent = replay.playing ? "Pause" : "Play";
  nodes.first.disabled = replay.index === 0;
  nodes.prev.disabled = replay.index === 0;
  nodes.next.disabled = replay.index === n - 1;
  nodes.lastBtn.disabled = replay.index === n - 1;
  nodes.runs.replaceChildren(...runs.map(({ run, state }) => el("li", { "data-run": run.id, "data-state": state }, [
    state === "running" ? `${run.label} · running` : `${run.label} · ${state} · ${run.durationText}`,
  ])));
  nodes.stages.replaceChildren(...shown.map((span, i) => {
    const current = i === shown.length - 1;
    return el("li", { "data-stage": span.stage, "aria-current": current ? "step" : null }, [current ? span.stage : `${span.stage} ${span.durationText}`]);
  }));
  nodes.plays.replaceChildren(...view.entries.slice(0, replay.index + 1).reverse().map((item) => {
    const kids = [el("span", { class: "dd-when" }, [`+${item.sinceStartText}`]), ` ${item.title}`];
    for (const link of item.links || []) kids.push(" ", el("a", { href: link.href, target: "_blank", rel: "noopener noreferrer" }, [link.label]));
    return el("li", { class: "dd-event", "data-seq": item.seq, "aria-current": item.seq === entry.seq ? "true" : null }, kids);
  }));
  if (focused && replay.root.contains(focused) && focused.disabled) nodes.slider.focus();
}

function draftDayReplay(pick, el, options) {
  const fresh = !options || !options.soft || replay.id !== pick.id || !replay.root;
  replay.el = el;
  replay.pick = pick;
  const n = pick.timeline && pick.timeline.entries ? pick.timeline.entries.length : 0;
  if (n === 0) {
    draftDayReplayStop();
    return el("article", { "aria-label": "Replay", "data-pick-id": pick.id }, [el("p", { class: "empty" }, ["No events."])]);
  }
  if (fresh) {
    replayStopTimer();
    replay.id = pick.id;
    replay.playing = false;
    const at = options && options.at !== null && options.at !== undefined ? pick.timeline.entries.findIndex((entry) => entry.seq === options.at) : -1;
    replay.index = at >= 0 ? at : 0;
    const built = replayBuild(el);
    replay.root = built.root;
    replay.nodes = built.nodes;
    if (options && options.play && n > 1) {
      if (replay.index >= n - 1) replay.index = 0;
      replay.playing = true;
    }
  } else if (replay.index > n - 1) {
    replay.index = n - 1;
  }
  replayPaint();
  replaySchedule();
  return replay.root;
}

function draftDayReplayStop() {
  replayStopTimer();
  replay.playing = false;
  replay.id = null;
  replay.root = null;
  replay.nodes = null;
}

globalThis.draftDayReplay = draftDayReplay;
globalThis.draftDayReplayStop = draftDayReplayStop;
