# Canon Transactions

> **Append-only memory needs a deterministic way to answer: what is true now?**

An evolution of [Continuity Keeper](https://github.com/yukitran03/continuity-keeper). Canon Transactions resolves current truth from claims, corrections, revocations, and human decisions without treating semantic retrieval rank as chronology.

![Canon transaction flow](./diagrams/canon-flow.svg)

## Local proof

`make test` replays a ledger: an initial claim is corrected, a conflicting correction is escalated, a human resolution is recorded, and a later revocation removes the fact from canon. `make demo` is the read-only judge path: it shows lineage resolution, explicit conflict, named no-current-evidence and invalid-schema branches, and a separate committed-receipt-board summary. The fixture is synthetic; it does not claim a production record or a new Mainnet write.

### Purpose-built synthetic stand

There was no suitable owner-scoped historical project for this entry, so this repository includes a compact, purpose-built **synthetic** Git stand rather than presenting unrelated history as evidence. [`replay/synthetic-release-canon-ledger.json`](./replay/synthetic-release-canon-ledger.json) locks a four-commit Release Canon Ledger: claim → correction → revocation → conflict, with immutable IDs and explicit supersession.

```bash
git clone replay/stands/release-canon-ledger.bundle /tmp/release-canon-ledger
make synthetic-stand ALFA_SYNTHETIC_STAND=/tmp/release-canon-ledger
```

The checker verifies the complete commit graph, author/committer, subjects, event counts, immutable IDs, supersession edges, final resolver result, bundle checksum, and this prompt's SHA-256. It proves deterministic behavior on this fixed synthetic graph only—not historical owner use, provider behavior, a production release decision, or a new Mainnet write.

## Evidence standard

[`replay/checkpoints.json`](./replay/checkpoints.json) has ten distinct stages: claim, provisional canon, correction, cold resolution, conflict/escalation, human resolution, canonical recall, revocation, cold verification, replay invariants. The committed [`replay/mainnet-receipts.json`](./replay/mainnet-receipts.json) records **10/10 terminal Mainnet receipts** and fresh-client cold recalls for stages 02, 04, 06, 08, and 10. The local replay remains a separate deterministic proof.

The unchanged-source comparison is pinned in [`replay/source-locked-baseline.json`](./replay/source-locked-baseline.json): Continuity Keeper revision `522694d…`, source file SHA-256 `cff58abe…`. Its fiction-canon workflow can recall and supersede facts, but does not define typed multi-event arbitration. This is a static contract comparison, not an assertion about a live model's behavior.

## Structure

```text
cmd/ resolver CLI · ledger/ typed events · replay/ evidence plan · diagrams/ rendered visual
PROMPT.md · ARTICLE.md · ISSUE.md · tests
```

## Judge-first recording script

[`JUDGE_RECORDING.md`](./JUDGE_RECORDING.md) is the 85–90 second CLI-first recording plan: observed failure → deterministic guard → reproducible assertion → explicit evidence boundary. It deliberately avoids credentials and cost-bearing writes.

## Owner submission packet

[`SUBMISSION_PACKET.md`](./SUBMISSION_PACKET.md) is the owner-only closeout gate: one-page judge path, source-feedback draft, article/social/video links, dedicated Sessions-wallet proof, and final-form checklist. It distinguishes preparation from actions that only the corresponding owner may take.

## Independent provider matrix

[`replay/provider-matrix-2026-08-21.json`](./replay/provider-matrix-2026-08-21.json) runs the same fixed boundary fixtures against two independent API families at temperature 0: Google Gemini Flash Lite and NVIDIA NIM Llama 3.1 8B Instruct. Raw model text is not committed; the report retains exact returned decision tokens and response SHA-256 values, locks the prompt SHA-256, and `make provider-matrix` structurally verifies coverage.

This layer is **complete as coverage, not as a universal pass claim**. Gemini produced the expected token for the recorded fixtures except where an explicit classification says otherwise. NVIDIA NIM returned non-transport results for the same fixtures, and its deviations are preserved as deviations rather than erased, treated as deterministic failures, or promoted to Mainnet evidence. The report proves neither provider follows the policy generally; it makes the provider boundary inspectable alongside the deterministic test suite.

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

## Current SDK proof

A current official-SDK write → terminal non-empty `blob_id` → destroy → new-client exact recall is recorded in [`replay/live-sdk-proof-2026-08-21.json`](./replay/live-sdk-proof-2026-08-21.json). It validates the SDK path separately from the ten-checkpoint manifest.
