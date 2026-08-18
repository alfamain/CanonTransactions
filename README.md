# Canon Transactions

> **Append-only memory needs a deterministic way to answer: what is true now?**

An evolution of [Continuity Keeper](https://github.com/yukitran03/continuity-keeper). Canon Transactions resolves current truth from claims, corrections, revocations, and human decisions without treating semantic retrieval rank as chronology.

![Canon transaction flow](./diagrams/canon-flow.svg)

## Local proof

`make test` replays a ledger: an initial claim is corrected, a conflicting correction is escalated, a human resolution is recorded, and a later revocation removes the fact from canon. The fixture is synthetic; it does not claim a production record or Mainnet write.

## Evidence standard

[`replay/checkpoints.json`](./replay/checkpoints.json) has ten distinct stages: claim, provisional canon, correction, cold resolution, conflict/escalation, human resolution, canonical recall, revocation, cold verification, replay invariants. The committed [`replay/mainnet-receipts.json`](./replay/mainnet-receipts.json) records **10/10 terminal Mainnet receipts** and fresh-client cold recalls for stages 02, 04, 06, 08, and 10. The local replay remains a separate deterministic proof.

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
| lifecycle | revoked/expired event usable | remove from canon | `tests/replay.test.mjs` | pass |
| injection | recalled directive becomes evidence | provisional; do not execute/write | `tests/replay.test.mjs` | pass |
| retrieval | partial top-K is inventory | provisional + diagnostic retry | live fixture | pending |
