# Demo Runbook — Canon Transactions

```bash
make test
make demo
make synthetic-stand
```

## Recording order

1. Show the initial claim and its immutable record ID.
2. Show an explicit correction edge and the conflict case.
3. Show the final revocation, then the separate conflict fixture.
4. Run the resolver. It must report the final revoked outcome rather than selecting a row by retrieval/order.
5. Show the cross-entity regression: a shared status is never sufficient to supersede a different entity.
6. Show the bundled stand verifier: four immutable commits move one release record through claim → correction → revocation → conflict. It reports `explicit-conflict` over the committed graph.

## Evidence boundary

The resolver and replay stand run locally over a fixed, committed Git graph. `make demo` then prints a separate summary of the committed receipt manifest; it does not make a new write. It verifies lifecycle and canonical-resolution behaviour.
