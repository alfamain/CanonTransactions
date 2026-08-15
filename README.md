# Canon Transactions

> **Append-only memory needs a deterministic way to answer: what is true now?**

An evolution of [Continuity Keeper](https://github.com/yukitran03/continuity-keeper). Canon Transactions resolves current truth from claims, corrections, revocations, and human decisions without treating semantic retrieval rank as chronology.

![Canon transaction flow](./diagrams/canon-flow.svg)

## Local proof

`make test` replays a ledger: an initial claim is corrected, a conflicting correction is escalated, a human resolution is recorded, and a later revocation removes the fact from canon. The fixture is synthetic; it does not claim a production record or Mainnet write.

## Evidence standard

[`replay/checkpoints.json`](./replay/checkpoints.json) has ten distinct stages: claim, provisional canon, correction, cold resolution, conflict/escalation, human resolution, canonical recall, revocation, cold verification, replay invariants. Mainnet receipts remain pending until confirmed live writes.

## Structure

```text
cmd/ resolver CLI · ledger/ typed events · replay/ evidence plan · diagrams/ rendered visual
PROMPT.md · ARTICLE.md · ISSUE.md · tests
```
