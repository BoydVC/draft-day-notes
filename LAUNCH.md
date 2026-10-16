# Ready-to-run launch for the scaffold agent (SPEC 001)

Use only after BOTH are true:
1. `BoydVC/draft-day` exists as a private repo with a README (so `main` exists).
2. Cursor's GitHub App can see it (https://github.com/apps/cursor/installations/new → BoydVC → add `draft-day` if the install is "Only select repositories"). Check: cursor-github `get_repository` owner=BoydVC repo=draft-day returns the repo instead of `scm_repo_not_accessible` (it returned that error on Fri Oct 16).

CloudAgent call (one agent, no arena):
- action: `launch`
- repo: `https://github.com/BoydVC/draft-day`
- starting_ref: `main`
- title: `Draft Day: SPEC 001 scaffold`
- files: `file:///workspace/tokenmax/poteto-pipeline/SPEC.md`, `file:///workspace/tokenmax/poteto-pipeline/ARCHITECTURE.md`, `file:///workspace/tokenmax/poteto-pipeline/PLAN.md`, `file:///workspace/tokenmax/poteto-pipeline/research/BRIEF.md`
- model: omit (Boyd has not named one)
- prompt:

```
Build SPEC 001 (uploads/SPEC.md) in this repo on a new branch named dd/scaffold.
Read uploads/ARCHITECTURE.md first; SPEC.md wins where they differ.
Also commit the four uploaded docs under docs/ (docs/SPEC-001.md, docs/ARCHITECTURE.md, docs/PLAN.md, docs/research/BRIEF.md) so the repo carries its own design.
Open a DRAFT pull request into main when done. Never mark it ready for review, never merge, never enable auto-merge, never deploy.
Touch only this repository. Nothing related to KPD/kpdlawgroup or debt collection.
Run every VERIFY step in the spec and attach the War Room screenshots to the PR.
End your final message with the dd-report block described in the spec.
```

After it finishes: cursor-github `get_pull_request` → confirm `draft: true` (else `set_pull_request_draft` draft=true), then append a LOG.tsv row with the agent id, PR number, head SHA and verdict.
