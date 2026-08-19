# Demo Runbook — Canon Transactions

```bash
make test
make demo
```

## Recording order

1. Show the initial claim and its immutable record ID.
2. Show an explicit correction edge and the conflict case.
3. Show the human resolution transaction, then the final revocation.
4. Run the resolver. It must report the final revoked outcome rather than selecting a row by retrieval/order.
5. Show the cross-entity regression: a shared status is never sufficient to supersede a different entity.

## Evidence boundary

The fixture is synthetic and the resolver is local. `make demo` then prints a separate summary of the committed receipt manifest; it does not make a new write. It proves lifecycle/canonical-resolution behavior only. Queued writes and local digests are not receipts.
