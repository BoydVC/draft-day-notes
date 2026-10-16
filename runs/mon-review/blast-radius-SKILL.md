# Blast radius (pstack skill, copied for reference)

Find what a change breaks somewhere else, before it ships. Listing the callers is not the job. The job is the breakage grep won't show you.

## Don't trust your own writeup
Find the one or two facts the whole thing depends on and prove them by running code.

### How sure are you
For each fact the change's safety depends on, get it as far down this list as is cheap, and say where it stopped.
1. You said so. Worthless on its own.
2. You pointed at the line. A real file:line, or the library's own source.
3. You showed the bad case can't happen. You walked the failure step by step and it doesn't reach.
4. You ran it. A script or test that calls the real code and fails loud if you're wrong.
5. You reproduced it in the running app.

## Steps
1. Read the change: the diff, the symbols it adds, changes, and deletes, and what it now does differently, including the part the diff doesn't spell out.
2. Find the one fact it's safe because of. Spend your time here, not on a long list of maybes.
3. Look where grep stops: runtime versions, when things run (microtasks, teardown, file locks, concurrent writers), JSON an API returns, on-disk formats, another reader of the same bytes, code three hops downstream.
4. Be honest about each risk: real chance, real cost. Keep confirmed risks; list checked-and-cleared separately. Cite real file:line; never make up a caller or an API.
5. Prove the one fact: write a script or test that runs the real code, run it, paste what happened.

## What to hand back
- What it does. What changed, including the part that isn't obvious.
- The one fact it's safe because of. State it, say which step you got it to, show the proof, or write unproven.
- Risks. Each names how it breaks, file:line, how likely and how bad, how to check. Paste proof for the ones that matter.
- Cleared. What you checked and why it's fine.
- Before you merge. The cheapest test or repro that catches the real bug, including the script you wrote.
