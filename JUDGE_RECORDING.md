# Canon Transactions — recording runbook

Record only after the owner has reviewed the final repository. No credentials, no wallet
material, no live writes on screen.

**The claim being demonstrated:** append-only memory resolves to exactly one current
answer, and every superseded record stays readable.

## Before the camera starts

```bash
make test
make synthetic-stand
```

Open <https://canon-transactions.vercel.app> scrolled to the canon desk, with the record
set and the disposition column both in frame.

## Segments — read the ledger left to right

| Time | Screen | Spoken point |
|---|---|---|
| 0:00–0:14 | The three filed records | "A claim, a correction that names it, and a revocation that names the correction. All three are still here." |
| 0:14–0:30 | Press **Run canonical evaluation** | "The statement of canon reads REVOKED, because the current record for this entity was explicitly retired." |
| 0:30–0:46 | The registry rows and the disposition column | "Nothing was deleted or summarised. Only the disposition changed." |
| 0:46–1:00 | The audit rail, checks 01–09 | "Lifecycle resolves across the whole candidate set before scope narrows it. That ordering is the fix." |
| 1:00–1:14 | Type an instruction-shaped note, re-run | "The note is scanned as untrusted content. It changes the intake row and never the canon." |
| 1:14–1:28 | Terminal: `make demo` | "The same resolutions, printed by `cmd/resolve.mjs` — the resolver the page just called." |
| 1:28–1:40 | `replay/mainnet-receipts.json` | "Ten terminal receipts, five cold recalls, reviewed on their own." |

## Closing line, mandatory

> This resolves committed fixtures in the browser. Mainnet persistence is a separate
> claim, evidenced only by the terminal receipt rows.

## Check before publishing

- [ ] The retired rows stay visible on screen while canon is announced.
- [ ] The scope-before-lifecycle bug is explained as the reason for the ordering.
- [ ] The receipt file is never described as written during the recording.
- [ ] No key, token, private path, or personal data is on screen.
