#!/usr/bin/env bash
# usage: runs/p8/spotcheck.sh <N 1|2|3> <headSha>   (read-only gh api; never clones)
set -uo pipefail
cd "$(dirname "$0")/../.."
N=$1; H=$2; D=runs/p8/c$N; R=repos/BoydVC/draft-day
raw() { gh api "$R/contents/$1?ref=$H" -H 'Accept: application/vnd.github.raw'; }
rm -rf $D && mkdir -p $D/test/fixtures/ledger $D/screens $D/src/ui $D/src/core $D/src/store $D/src/server $D/src/cli $D/src/report $D/src/briefs
for f in src/ui/app.js src/ui/index.html src/ui/ledger.js src/ui/ledger.css src/server/http.ts src/cli/dd.ts src/store/ledger.ts src/store/eventlog.ts src/store/inbox.ts; do raw $f > "$D/$f" 2>/dev/null || rm -f "$D/$f"; done
for dir in src/core src/report src/briefs; do for f in $(gh api "$R/contents/$dir?ref=$H" --jq '.[] | select(.type=="file") | .name'); do raw $dir/$f > "$D/$dir/$f"; done; done
for f in $(gh api "$R/contents/test/fixtures/ledger?ref=$H" --jq '.[].name'); do raw test/fixtures/ledger/$f > "$D/test/fixtures/ledger/$f"; done
for f in $(gh api "$R/contents/docs/screens/p8-season-ledger?ref=$H" --jq '.[].name' 2>/dev/null); do raw docs/screens/p8-season-ledger/$f > "$D/screens/$f"; done
echo "== oracle"; node tools/ledger-calc.mjs "$D" | tail -1
echo "== engine"; bun tools/ledger-calc.mjs "$D" --engine 2>&1 | tail -1
echo "== sha256 vs uploads"; for f in fixtures/ledger/*; do b=$(basename $f); [ "$(sha256sum < $f)" = "$(sha256sum < $D/test/fixtures/ledger/$b 2>/dev/null)" ] && echo "ok $b" || echo "DIFF $b"; done | sort | uniq -c | awk '{print}' | tail -12
echo "== screens $(ls $D/screens | wc -l)"; ls $D/screens
echo "== closed-list"
for f in test/replay.test.ts test/replay.pooled.test.ts test/linter.test.ts test/linter.pooled.test.ts test/bigboard.test.ts test/bigboard.pooled.test.ts test/phone.test.ts; do
  mkdir -p "$D/$(dirname $f)"; raw $f > "$D/$f"; diff -u runs/p8/start/$f "$D/$f" --label a/$f --label b/$f
done > "$D/closed-list.diff"
diff <(rg '^[+-][^+-]' runs/p8/sanctioned-test-edits.diff) <(rg '^[+-][^+-]' "$D/closed-list.diff") && echo "closed-list exact" || echo "closed-list DIFFERS (read $D/closed-list.diff; phone W5 naming may differ)"
echo "== touch map"; gh api "$R/compare/93dca59db747e8306ab460e38d7ddf978031987e...$H" --jq '.files[] | "\(.status) +\(.additions) -\(.deletions) \(.filename)"' > "$D/files.txt"; cat "$D/files.txt"
awk '{a+=substr($2,2); r+=substr($3,2)} END {print "files", NR, "added", a, "removed", r}' "$D/files.txt"
