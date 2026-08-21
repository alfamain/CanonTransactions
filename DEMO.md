# Demo Runbook — Canon Transactions

```bash
make test
make demo
git clone replay/stands/release-canon-ledger.bundle /tmp/release-canon-ledger
make synthetic-stand ALFA_SYNTHETIC_STAND=/tmp/release-canon-ledger
```

## Recording order

1. Show the initial claim and its immutable record ID.
2. Show an explicit correction edge and the conflict case.
3. Show the final revocation, then the separate conflict fixture.
4. Run the resolver. It must report the final revoked outcome rather than selecting a row by retrieval/order.
5. Show the cross-entity regression: a shared status is never sufficient to supersede a different entity.
6. Show the synthetic stand verifier: four immutable commits move one release record through claim → correction → revocation → conflict. It must report `explicit-conflict`; this is deliberately labelled synthetic.

## Evidence boundary

The fixture is synthetic and the resolver is local. The separate purpose-built stand is a fixed synthetic Git graph, not owner-project history. `make demo` then prints a separate summary of the committed receipt manifest; it does not make a new write. It proves lifecycle/canonical-resolution behavior only. Queued writes and local digests are not receipts.
