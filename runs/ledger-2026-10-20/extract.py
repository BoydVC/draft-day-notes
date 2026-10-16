import json, sys, re, os
T = "/workspace/cloud-agent-transcripts"
rows = [l.rstrip("\n").split("\t") for l in open("agents.tsv")][1:]
for purpose, agent, branch, sha in rows:
    f = f"{T}/{agent}.jsonl"
    if not os.path.exists(f): continue
    last = json.loads(open(f).read().splitlines()[-1])
    text = last.get("text") if isinstance(last.get("text"), str) else json.dumps(last)
    name = purpose.replace(" ", "-").lower()
    open(f"{name}-final.md", "w").write(text)
    m = re.search(r"```dd-verdict\s*(\{.*?\})\s*```", text, re.S)
    v = None
    if m:
        try: v = json.loads(m.group(1))
        except Exception as e: v = {"parseError": str(e)}
    notes = re.search(r"SKILL-NOTES:(.*)", text)
    if v and "parseError" not in v:
        ev = v.get("evidence"); ev = ev if isinstance(ev, str) else json.dumps(ev)
        print(f"{purpose}\t{agent[:11]}\t{v.get('headSha','')[:7]}\texpected {sha[:7]}\t{v.get('verdict')}\t{v.get('ledger')}\tc{v.get('certainty')}\t{ev[:260]}")
    else:
        print(f"{purpose}\t{agent[:11]}\tNO-VERDICT-BLOCK {v}\t{text[-300:]!r}")
    if notes: print("   SKILL-NOTES:", notes.group(1).strip()[:900])
