#!/usr/bin/env bash
# Regenerate the candidate and judge copies of every arena spec and check them for leaks.
#   candidate copy = full spec minus ARENA ANGLES and HIDDEN RUBRIC (replaced by a one-paragraph note)
#   judge copy     = full spec minus ARENA ANGLES (rubric kept)
# Leak terms come from two places: the spec's <pick>-rubric.json (criterion names, rubric rows, angle names,
# branches; derived, so they cannot drift) plus a short hand-picked regex per spec for distinctive phrases.
# It also fails when the spec's rubric table or angle table disagrees with the rubric JSON, and when a
# spec names a fixture whose sha256 does not appear in the spec text (the fixture column may list several
# paths separated by spaces).
# Usage: tools/make-copies.sh [stem ...]   (default: every spec in the registry below)
set -euo pipefail
cd "$(dirname "$0")/.."

# Registry: one row per arena spec. stem | rubric json | extra candidate leak regex | extra judge leak regex | fixture(s) (or -)
SPECS=(
  $'SPEC-002-film-room\tSPEC-002-rubric.json\tHIDDEN RUBRIC|pure reducer|table-driven rubric|war room first|weights total|"selection"\tpure reducer|table-driven rubric|war room first|dd/p1-film-room-b|dd/p1-film-room-c|ARENA ANGLES\t-'
  $'SPEC-003-pick-timeline\tSPEC-003-rubric.json\tHIDDEN RUBRIC|registry fold|spans first|snapshot story|lane strip|weights total|satisfies, so a new|interval builder\tregistry fold|spans first|snapshot story|lane strip|dd/p2-timeline-[abc]|ARENA ANGLES\tfixtures/p-20261010-07.events.jsonl'
  $'SPEC-004-lessons\tSPEC-004-rubric.json\tHIDDEN RUBRIC|kind registry|flat findings first|weekly to-do|weights total|satisfies|explicit stages|receipts table|prominent first item|KindRule\tkind registry|flat findings first|weekly to-do|explicit stages|KindRule|dd/p3-lessons-[abc]|ARENA ANGLES\tfixtures/lessons-week.jsonl'
  $'SPEC-005-phone-war-room\tSPEC-005-rubric.json\tHIDDEN RUBRIC|token ledger|intake state machine|card-stack|weights total|one paint function|pixel-close|thumb-reach|dd/p4-phone-[abc]|offOrigin. is .\\[\\] on every\ttoken ledger|intake state machine|card-stack|one paint function|pixel-close|dd/p4-phone-[abc]|ARENA ANGLES\tfixtures/phone/board-states.json fixtures/phone/dom-harness.mjs fixtures/phone/dom-harness.d.mts fixtures/phone/probe.js fixtures/phone/cdp-shot.mjs'
  $'SPEC-006-replay\tSPEC-006-rubric.json\tHIDDEN RUBRIC|frame engine|broadcast booth|chapter cuts|weights total|lower third|thumb-reach bar|stranger can say|dd/p5-replay-[abc]\tframe engine|broadcast booth|chapter cuts|lower third|thumb-reach bar|stranger can say|dd/p5-replay-[abc]|ARENA ANGLES\tfixtures/replay/p-20261017-94.events.jsonl fixtures/replay/p-20261017-93.events.jsonl fixtures/replay/p-20261017-98.events.jsonl fixtures/replay/p-20261017-99.events.jsonl fixtures/replay/p-20261017-94.pick.json fixtures/replay/p-20261017-93.pick.json fixtures/replay/p-20261017-98.pick.json fixtures/replay/p-20261017-99.pick.json fixtures/replay/p-20261010-07.pick.json fixtures/replay/replay-harness.mjs fixtures/replay/replay-harness.d.mts fixtures/replay/README.md'
  $'SPEC-007-scouting-linter\tSPEC-007-rubric.json\tHIDDEN RUBRIC|rule ledger|scout checklist|coverage matrix|weights total|satisfies|dd/p6-linter-[abc]\trule ledger|scout checklist|coverage matrix|satisfies|dd/p6-linter-[abc]|## ARENA ANGLES\tfixtures/linter/good-replay.json fixtures/linter/good-lessons.json fixtures/linter/good-markdown.md fixtures/linter/hostile-collide-angles.json fixtures/linter/hostile-missing-ears.json fixtures/linter/hostile-ungradeable.json fixtures/linter/hostile-markup.json fixtures/linter/hostile-soft.json fixtures/linter/expected.json fixtures/linter/linter-harness.mjs fixtures/linter/linter-harness.d.mts fixtures/linter/README.md'
  $'SPEC-008-big-board\tSPEC-008-rubric.json\tHIDDEN RUBRIC|stat ledger|scoreboard|box score|leader tiles|weights total|satisfies|stadium|ballpark|dd/p7-big-board-[abc]\tstat ledger|scoreboard|box score|leader tiles|satisfies|stadium|ballpark|dd/p7-big-board-[abc]|## ARENA ANGLES\tfixtures/bigboard/season.jsonl fixtures/bigboard/league.jsonl fixtures/bigboard/hostile.jsonl fixtures/bigboard/expected.json fixtures/bigboard/bigboard-harness.mjs fixtures/bigboard/bigboard-harness.d.mts fixtures/bigboard/README.md'
  $'SPEC-009-season-ledger\tSPEC-009-rubric.json\tHIDDEN RUBRIC|ledger book|merge desk|audit trail|weights total|next move|vertical rail|details>|dd/p8-season-ledger-[abc]\tledger book|merge desk|audit trail|next move|vertical rail|details>|dd/p8-season-ledger-[abc]|## ARENA ANGLES\tfixtures/ledger/picks.jsonl fixtures/ledger/pulls.json fixtures/ledger/ledger-real.jsonl fixtures/ledger/ledger-tuesday.jsonl fixtures/ledger/ledger-edges.jsonl fixtures/ledger/hostile.jsonl fixtures/ledger/hostile-picks.jsonl fixtures/ledger/expected.json fixtures/ledger/ledger-harness.mjs fixtures/ledger/ledger-harness.d.mts fixtures/ledger/README.md'
  $'SPEC-010-swap-bias\tSPEC-010-rubric.json\tHIDDEN RUBRIC|bias ledger|flip gauge|evidence trail|weights total|stranger can say|data-leader=.swap|details>|dd/p11-swap-bias-[abc]\tbias ledger|flip gauge|evidence trail|stranger can say|data-leader=.swap|details>|dd/p11-swap-bias-[abc]|## ARENA ANGLES\tfixtures/swap/models.jsonl fixtures/swap/hostile.jsonl fixtures/swap/expected.json fixtures/swap/swap-harness.mjs fixtures/swap/swap-harness.d.mts fixtures/swap/README.md'
)

make_one() {
  local stem="$1" rubric="$2" cand_re="$3" judge_re="$4" fixture="$5"
  local src="$stem.md" cand="$stem.candidate.md" judge="$stem.judge.md"
  [ -f "$src" ] || { echo "missing $src"; return 1; }
  [ -f "$rubric" ] || { echo "missing $rubric"; return 1; }
  awk '/<!-- ANGLES:BEGIN/{skip=1; print "## ARENA ANGLE\nYour angle is in your launch prompt. The judging rubric is hidden from candidates by design; build to the ACCEPTANCE lines and the VERIFY steps.\n"; next}
       /<!-- RUBRIC:END -->/{skip=0; next} !skip' "$src" > "$cand"
  awk '/<!-- ANGLES:BEGIN/{skip=1; next} /<!-- ANGLES:END -->/{skip=0; next} /<!-- RUBRIC:(BEGIN|END)/{next} !skip' "$src" > "$judge"
  if rg -n -i "$cand_re" "$cand"; then echo "LEAK in $cand"; return 1; fi
  if rg -n -i "$judge_re" "$judge"; then echo "LEAK in $judge"; return 1; fi
  rg -q 'HIDDEN RUBRIC' "$judge" || { echo "$judge lost the rubric"; return 1; }
  # Derived checks from the rubric JSON (zero deps: node only).
  node - "$src" "$cand" "$judge" "$rubric" <<'NODE'
const fs = require("fs");
const [src, cand, judge, rubricPath] = process.argv.slice(2);
const read = (p) => fs.readFileSync(p, "utf8");
const full = read(src), c = read(cand), j = read(judge), cfg = JSON.parse(read(rubricPath));
const fail = (m) => { console.log(m); process.exit(1); };
if (cfg.spec !== src) fail(`${rubricPath}: spec is ${cfg.spec}, expected ${src}`);
// 1. rubric table in the spec == rubric JSON (ids, names, weights, order)
const rows = [...full.matchAll(/^\| `([a-z0-9_-]+)` \| ([^|]+?) \| ([123]) \|/gm)].map((m) => ({ id: m[1], name: m[2].trim(), weight: Number(m[3]) }));
if (JSON.stringify(rows) !== JSON.stringify(cfg.rubric)) fail(`${src}: rubric table ${JSON.stringify(rows)} != ${rubricPath} ${JSON.stringify(cfg.rubric)}`);
const total = cfg.rubric.reduce((s, r) => s + r.weight, 0);
if (!full.includes(`weights total ${total}`)) fail(`${src}: says no "weights total ${total}"`);
// 2. angle table in the spec == candidates in the JSON (branch + bold angle name)
for (const [id, v] of Object.entries(cfg.candidates)) {
  const re = new RegExp("^\\| " + id + " \\| `" + v.branch.replace(/[/.-]/g, "\\$&") + "` \\| \\*\\*" + v.angle + "\\.\\*\\*", "m");
  if (!re.test(full)) fail(`${src}: angle row for ${id} (${v.branch}, ${v.angle}) not found`);
}
// 3. label maps: three labels, a permutation of the candidates, pass 2 = pass 1 order reversed
const ids = Object.keys(cfg.candidates).sort().join(",");
const p1 = Object.values(cfg.labels.pass1), p2 = Object.values(cfg.labels.pass2);
if ([...p1].sort().join(",") !== ids || [...p2].sort().join(",") !== ids) fail(`${rubricPath}: label maps are not permutations of ${ids}`);
if ([...p1].reverse().join(",") !== p2.join(",")) fail(`${rubricPath}: pass2 is not pass1 reversed`);
// 4. derived leak terms
const lc = (s) => s.toLowerCase();
for (const r of cfg.rubric) {
  if (c.includes(r.name)) fail(`LEAK in ${cand}: criterion name "${r.name}"`);
  if (c.includes("| `" + r.id + "` |")) fail(`LEAK in ${cand}: rubric row ${r.id}`);
  if (!j.includes(r.name)) fail(`${judge} lost criterion ${r.id}`);
}
for (const v of Object.values(cfg.candidates)) {
  if (lc(c).includes(lc(v.angle))) fail(`LEAK in ${cand}: angle "${v.angle}"`);
  if (lc(j).includes(lc(v.angle))) fail(`LEAK in ${judge}: angle "${v.angle}"`);
  // a dd-report format example line ("branch":"...") is not a label leak; SPEC 002's example names dd/p1-film-room-a
  const hit = j.split("\n").find((line) => line.includes(v.branch) && !line.includes('"branch":"' + v.branch + '"'));
  if (hit) fail(`LEAK in ${judge}: branch ${v.branch}: ${hit.slice(0, 80)}`);
}
NODE
  if [ "$fixture" != "-" ]; then
    local fx sum
    for fx in $fixture; do   # one path, or several separated by spaces
      [ -f "$fx" ] || { echo "missing fixture $fx"; return 1; }
      sum="$(sha256sum "$fx" | cut -d' ' -f1)"
      rg -q "$sum" "$src" || { echo "$src does not carry the sha256 of $fx ($sum)"; return 1; }
    done
  fi
  echo "ok: $stem candidate $(wc -l < "$cand") lines, judge $(wc -l < "$judge") lines, full $(wc -l < "$src") lines"
}

want=("$@")
done_any=0
for row in "${SPECS[@]}"; do
  IFS=$'\t' read -r stem rubric cand_re judge_re fixture <<<"$row"
  if [ ${#want[@]} -gt 0 ] && [[ ! " ${want[*]} " == *" $stem "* ]]; then continue; fi
  make_one "$stem" "$rubric" "$cand_re" "$judge_re" "$fixture"
  done_any=1
done
[ "$done_any" = 1 ] || { echo "no spec matched: ${want[*]}"; exit 1; }
echo "ok"
