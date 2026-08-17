# Canon Transactions: Making Agent Memory Answer “What Is True Now?”

I evolved Continuity Keeper after running into a deceptively simple failure
mode: an agent could retrieve a relevant-looking memory but had no reliable
way to decide whether that memory was still true. A newer correction, a
revocation, or an unresolved disagreement could all exist beside the original
claim. Ranking the newest-looking retrieval is not a safe substitute for
reasoning about history.

Canon Transactions treats memory as an append-only event ledger rather than a
single mutable note. Each event has a stable `record_id`, entity and scope,
provenance, lifecycle state, and explicit `supersedes` links. The resolver
first evaluates lifecycle and supersession, then applies scope and evidence
rules. This order matters: an out-of-scope successor must still be able to
prevent an older local record from being revived accidentally.

The key change is the output contract. Instead of pretending every lookup has
one answer, the prompt returns a canonical result only for active,
evidence-backed records. It returns `CANON: conflict` when competing claims
cannot be reconciled, `revoked` when a current event invalidates a fact, and a
provisional result when recall is incomplete or an expected terminal receipt
is missing. Instruction-shaped or secret-like content remains untrusted data;
it is never treated as evidence or executed as an instruction.

I built a small deterministic ledger replay to test the policy. It starts with
a claim, adds a correction, introduces a conflicting correction, records a
human decision, and finally revokes the result. The replay also checks that
one entity cannot supersede another merely because they share a status field.
That exposed why “last row wins” is inadequate: row order is not a decision
rule, and a demo that prints the last row does not prove canonical resolution.

The repository includes the prompt, resolver, event fixture, regression tests,
ten-stage evidence plan, and a rendered flow diagram. `make test` replays the
entire sequence and verifies the final revoked outcome. This is deliberately
local, deterministic evidence—not a claim of a completed Mainnet sequence.
Live storage evidence will be added only when each stage has a terminal
`blob_id` and the required cold recall, rather than treating an accepted job
or timeout as success.
