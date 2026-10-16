#!/usr/bin/env bash
# usage: log.sh <phase> <decision> <why> <evidence> <result>
f="$(dirname "$0")/LOG.tsv"
[ -f "$f" ] || printf 'ts\tphase\tdecision\twhy\tevidence\tresult\n' > "$f"
clean(){ local s="${1//$'\t'/ }"; s="${s//$'\n'/ }"; case "$s" in [=+\-@]*) s="'$s";; esac; printf '%s' "$s"; }
printf '%s\t%s\t%s\t%s\t%s\t%s\n' "$(date -Iseconds)" "$(clean "$1")" "$(clean "$2")" "$(clean "$3")" "$(clean "$4")" "$(clean "$5")" >> "$f"
