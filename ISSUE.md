# Proposed issue — Prevent semantic recall from masquerading as canonical state

## Limitation

Continuity prompts are useful for carrying work across sessions, but semantic
recall is not a canonical, time-ordered state ledger. An older plausible claim
may be returned after it was corrected or revoked, and two current-looking
claims can conflict. A continuation agent needs a way to distinguish a relevant
memory from the current claim it may rely on.

## Suggested optional extension

- stable entity key plus immutable record/transaction ID;
- scope, `effective_at`, provenance/evidence and lifecycle state;
- explicit ID-based `supersedes` and revocation edges;
- lifecycle and conflict resolution across the candidate set before scope
  filtering;
- visible `provisional`, `revoked`, `conflict`, or `no-current-evidence`
  outcome instead of choosing semantic rank;
- independent current check before consequential action.

This keeps continuity lightweight while preventing server arrival order, generic
status, or relevance rank from being treated as truth. A reference replay with
correction, revocation, stale-only, cross-scope successor and conflict cases
would make the behavior testable.
