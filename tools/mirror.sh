#!/usr/bin/env bash
# Read-only mirror of every non-PNG file of BoydVC/draft-day at a SHA (GitHub contents API; never clones).
# Usage: tools/mirror.sh <sha> <dir>
set -euo pipefail
SHA="$1"; DIR="$2"; rm -rf "$DIR"; mkdir -p "$DIR"
gh api "repos/BoydVC/draft-day/git/trees/$SHA?recursive=1" --jq '.tree[] | select(.type=="blob") | .path' > "$DIR.tree.txt"
rg -v '\.png$' "$DIR.tree.txt" | xargs -P 8 -I{} sh -c 'mkdir -p "$(dirname "$0/$1")"; gh api "repos/BoydVC/draft-day/contents/$1?ref=$2" -H "Accept: application/vnd.github.raw" > "$0/$1"' "$DIR" {} "$SHA"
echo "mirrored $(rg -vc '\.png$' "$DIR.tree.txt") files of $SHA into $DIR ($(rg -c '\.png$' "$DIR.tree.txt" || echo 0) png listed in $DIR.tree.txt)"
