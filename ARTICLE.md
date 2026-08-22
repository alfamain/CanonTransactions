# Canon Transactions: Making Agent Memory Answer “What Is True Now?”

> **Publication status: owner-review draft.** First-person voice and factual
> claims require adoption and approval by Alfa Main before publication.

I evolved Continuity Keeper after encountering a deceptively simple failure mode: an agent retrieved a relevant-looking memory but had no reliable way to decide whether that memory was still true. A correction, revocation, expiry, or unresolved disagreement could exist beside the original claim. Selecting the most recent-looking semantic result is not history management; it is a guess made from a partial candidate set.

**Canon Transactions** changes the representation. Instead of treating a fact as one mutable note, it records an append-only transaction with an immutable `record_id`, entity key, scope, provenance, lifecycle, effective time, confidence, and explicit ID-based correction edge. A correction names the record it supersedes. A revocation has a visible lifecycle. A conflict remains a conflict until a resolution transaction supplies the evidence required to close it.

The ordering was the important design decision. The resolver evaluates lifecycle and supersession across the candidate set before scope filtering. Otherwise, an out-of-scope successor can be discarded too early and an old in-scope predecessor can appear valid again. It also refuses to let a generic status value make one entity retire another. Identity and explicit links—not similarity, row order, or a shared label—govern the state transition.

I built a deterministic ledger replay around that model. The main fixture begins with a claim, records a correction, and then revokes the result; a separate conflict fixture exercises the escalation path. The test checks that the output is not simply “last row wins.” It returns a canonical answer only when active, evidence-backed state permits one. Otherwise it returns an explicit provisional, conflict, revoked, or no-current-evidence result.

The before/after difference is useful for operators. Before, a recalled claim could look authoritative even when its lifecycle was unknown. After, the agent explains why it can or cannot use a remembered statement. That gives a reviewer a place to intervene and keeps recalled directive-shaped content from becoming a command or evidence merely because it was present in memory.

The repository includes the evolved prompt, typed event ledger, resolver CLI, regression tests, flow diagram, ten-stage evidence plan, and a concise demo runbook. The local replay is intentionally deterministic and synthetic. It proves that the resolver enforces the chosen contract; it does not prove a complete Mainnet write sequence or a production truth service.

The committed Mainnet evidence meets that higher bar with ten terminal receipt rows and fresh-client cold-recall observations. [`docs/RECEIPTS.md`](./docs/RECEIPTS.md) gives the complete inventory and an independently opened Mainnet explorer link. An accepted write request, timeout, or local hash is not a receipt. The result is modest but important: memory can preserve context, while canonical state remains explainable, reviewable, and safe to withhold when the evidence is incomplete.
