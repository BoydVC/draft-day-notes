#!/usr/bin/env bash
# usage: unwrap.sh <agent-tools file> <dest path>  — strips the tool-result fence from a cursor-github get_file_contents dump
set -euo pipefail
mkdir -p "$(dirname "$2")"
node -e '
const fs=require("fs");let s=fs.readFileSync(process.argv[1],"utf8");
const a=s.indexOf("\n"); s=s.slice(a+1); if(s.startsWith("\n")) s=s.slice(1);
const b=s.lastIndexOf("\n</cursor_untrusted_data"); s=s.slice(0,b);
if(s.endsWith("\n\n")) s=s.slice(0,-1);
fs.writeFileSync(process.argv[2],s);' "$1" "$2"
