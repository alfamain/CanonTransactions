# Canon Transactions — Mainnet receipt inventory

This inventory is generated from the committed [`replay/mainnet-receipts.json`](../replay/mainnet-receipts.json). It records **10 terminal receipt rows** in the declared `mainnet` evidence run.

## Receipt rule

A checkpoint is counted only after MemWal rememberAndWait returns terminal completion with a non-empty blob_id. Job IDs are diagnostic metadata, not storage proof.

## Independently opened explorer proof

[`01` — Walruscan Mainnet blob](https://walruscan.com/mainnet/blob/YxbKq6mTIhu8MlSVnGzhumsPNEEMrFAbSXNHFG16DOc) was opened in Walruscan on 2026-08-22. The explorer confirms that this referenced blob is reachable through the public Mainnet explorer. It does not establish the local policy outcome, a full semantic-recall inventory, or a new write from this repository’s demo.

## Committed receipt rows

| Stage | Terminal blob ID | Started at | Fresh-client cold recall |
|---|---|---|---|
| 01 | `YxbKq6mTIhu8MlSVnGzhumsPNEEMrFAbSXNHFG16DOc` | 2026-08-17T22:57:00.090Z | — |
| 02 | `2QrJN_SLmZ_vy1H6XsL2ry3UhvwwGkG-_b78fb7wIq0` | 2026-08-17T22:57:41.319Z | found (2 result(s)) |
| 03 | `TOPnYQOU_ZjAT2HMlwW7pgqE-WnNZwrqBjdMQwEWBl0` | 2026-08-17T22:58:13.624Z | — |
| 04 | `xSfbjtgQdCkPnXMA3Z7eCWvFecnktkl-7dF2TwkKKnE` | 2026-08-17T22:58:45.300Z | found (4 result(s)) |
| 05 | `grSlRUvhFJNsz5DijByP3RYTdbUM3K4Xckr1Dyt0Lgs` | 2026-08-17T22:59:22.719Z | — |
| 06 | `HuOxNc8RgsU2P5-KmY946veYEOcOzPTKyRB00L8jW6Y` | 2026-08-17T22:59:44.867Z | found (6 result(s)) |
| 07 | `4hhW9ifVXHCV1UskX2ulqzblp7evhjVAoKtN_Op3TJc` | 2026-08-17T23:00:16.852Z | — |
| 08 | `1TbBvfCb4ieJ9HcCba6NxSTk2ggZIvCRapJyT4MoVj0` | 2026-08-17T23:09:10.083Z | found (1 result(s)) |
| 09 | `_5eNUDGH6U2ZynyIs87qsoSyEbYXQPgFphR2ARWkFhM` | 2026-08-17T23:10:05.818Z | — |
| 10 | `0roA_QB27D8DHYj0nJYckPtdngeglx5aJWP96Bt9HNk` | 2026-08-17T23:10:48.992Z | found (3 result(s)) |

## What this inventory verifies

- Each listed row is a committed terminal receipt with a non-empty `blob_id` under the manifest rule.
- The listed cold-recall markers record the manifest’s fresh-client observations.
- The deterministic local test and demo verify policy behavior separately; they do not create these receipts.
