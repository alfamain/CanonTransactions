# Canon Transactions — replay receipt

## What is replayed

Fixed release-canon replay graph: a claim is corrected, disputed, resolved, and revoked through explicit record lineage.

## Reproduce

1. Run `make test`.
2. Run `make synthetic-stand`.
3. Inspect [`replay/synthetic-release-canon-ledger.json`](../replay/synthetic-release-canon-ledger.json) for the pinned provenance and outcome fields.

## Ground truth and policy result

`make synthetic-stand` clones the committed graph in isolation and validates the declared resolver outcome.

## Boundary

This is a purpose-built fixed replay graph; it is not presented as owner-history or a provider run.
