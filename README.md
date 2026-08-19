# Canon Transactions

> **Append-only memory needs a deterministic way to answer: what is true now?**

An evolution of [Continuity Keeper](https://github.com/yukitran03/continuity-keeper). Canon Transactions resolves current truth from claims, corrections, revocations, and human decisions without treating semantic retrieval rank as chronology.

![Canon transaction flow](./diagrams/canon-flow.svg)

## Local proof

`make test` replays a ledger: an initial claim is corrected, a conflicting correction is escalated, a human resolution is recorded, and a later revocation removes the fact from canon. `make demo` is the read-only judge path: it shows lineage resolution, explicit conflict, named no-current-evidence and invalid-schema branches, and a separate committed-receipt-board summary. The fixture is synthetic; it does not claim a production record or a new Mainnet write.

## Evidence standard

[`replay/checkpoints.json`](./replay/checkpoints.json) has ten distinct stages: claim, provisional canon, correction, cold resolution, conflict/escalation, human resolution, canonical recall, revocation, cold verification, replay invariants. The committed [`replay/mainnet-receipts.json`](./replay/mainnet-receipts.json) records **10/10 terminal Mainnet receipts** and fresh-client cold recalls for stages 02, 04, 06, 08, and 10. The local replay remains a separate deterministic proof.

The unchanged-source comparison is pinned in [`replay/source-locked-baseline.json`](./replay/source-locked-baseline.json): Continuity Keeper revision `522694d…`, source file SHA-256 `cff58abe…`. Its fiction-canon workflow can recall and supersede facts, but does not define typed multi-event arbitration. This is a static contract comparison, not an assertion about a live model's behavior.

## Structure

```text
cmd/ resolver CLI · ledger/ typed events · replay/ evidence plan · diagrams/ rendered visual
PROMPT.md · ARTICLE.md · ISSUE.md · tests
```

## Validation matrix

| Domain | Failure mode | Final resolver behavior | Fixture | Status |
|---|---|---|---|---|
| canon selection | last JSON row treated as truth | evidence-backed active resolver | `tests/replay.test.mjs` | pass |
| conflict | incompatible corrections | `CANON: conflict`, escalate | `tests/replay.test.mjs` | pass |
| evidence | unsupported claim | provisional, not resolved | `tests/replay.test.mjs` | pass |
| reason precision | expiry/schema/recall gaps collapsed into vague failure states | named `no-current-evidence`, `invalid-event-schema`, and `recall-integrity-unknown` reasons | `tests/replay.test.mjs` | pass |
| lifecycle | revoked/expired event usable | remove from canon | `tests/replay.test.mjs` | pass |
| revocation isolation | unrelated entity revocation poisoned the recalled set | apply revocation per entity, not globally | `tests/replay.test.mjs` | pass |
| injection | recalled directive becomes evidence | provisional; do not execute/write | `tests/replay.test.mjs` | pass |
| retrieval | partial top-K is inventory | provisional + diagnostic retry | live fixture | pending |
| repository hygiene | credential-shaped file content | fail the local suite before release | `make secret-scan` | pass |
