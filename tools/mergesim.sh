#!/usr/bin/env bash
# Box-side merge probe for sibling picks (no clone): overlay two sets of remotely-read files on a base set
# in a scratch git repo and merge them in both orders. Prints the conflicted paths per order.
# usage: tools/mergesim.sh <base dir> <side A dir> <side B dir>
#   Each dir mirrors repo paths (src/ui/app.js, docs/DECISIONS.tsv, ...). A side dir holds only files that
#   side changed or added. Exit 0 when both orders conflict in at most docs/DECISIONS.tsv, 1 otherwise.
set -euo pipefail
base="$(realpath "$1")"; a="$(realpath "$2")"; b="$(realpath "$3")"
tmp="$(mktemp -d /tmp/mergesim-XXXX)"
cd "$tmp"
git init -q -b base && git config user.email sim@box && git config user.name sim
cp -r "$base/." . && git add -A && git commit -qm base
git checkout -qb A && cp -r "$a/." . && git add -A && git commit -qm A
git checkout -q base && git checkout -qb B && cp -r "$b/." . && git add -A && git commit -qm B
bad=0
for order in "A B" "B A"; do
  set -- $order
  git checkout -q -B "try-$1-$2" "$1"
  git merge -q --no-edit "$2" >/dev/null 2>&1 || true
  conflicts="$(git diff --name-only --diff-filter=U | tr '\n' ' ')"
  echo "order $1 then $2: conflicts: ${conflicts:-none}"
  for f in $conflicts; do [ "$f" = "docs/DECISIONS.tsv" ] || bad=1; done
  git merge --abort 2>/dev/null || git reset -q --hard
done
echo "A changed: $(git diff --name-only base A | tr '\n' ' ')"
echo "B changed: $(git diff --name-only base B | tr '\n' ' ')"
echo "shared: $(comm -12 <(git diff --name-only base A | sort) <(git diff --name-only base B | sort) | tr '\n' ' ')"
rm -rf "$tmp"
[ "$bad" = 0 ] && echo "mergesim: ok (DECISIONS.tsv at most)" || echo "mergesim: CONFLICT outside DECISIONS.tsv"
exit "$bad"
