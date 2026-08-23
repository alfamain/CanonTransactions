# Canon Transactions — hackathon project page

Copy for the Walrus Sessions 7 project listing. Every claim here is reproducible
from this repository. Owner review is required before publication.

- **Project name:** Canon Transactions
- **Tagline:** Append-only memory that can still answer what is true right now.
- **Tags:** Walrus Memory · Prompt evolution · Append-only state · Auditability
- **Owner:** `alfamain`
- **Logo:** [`brand/logo.png`](./brand/logo.png) — 512x512
- **Cover image:** [`brand/article-banner.png`](./brand/article-banner.png) — 1200x630

## Short description

Every change to memory is filed as a typed transaction naming its predecessor. History never shrinks, and exactly one line is canon.

## About

### The failure this came from

An agent kept continuity notes about releases. In one session it recalled one and quoted it back with complete confidence: the release target was the branch named in the note.

That was a real note. The underlying decision had been made and written down. It was also wrong, because two days later the target changed, and the day after that the plan was withdrawn entirely.

All three statements were in memory. Nothing was corrupted. Recall returned the entry most similar to the question — which happened to be the oldest and most quotable, because it was written while the plan was still exciting. Later entries were hedged and shorter, so they ranked lower.

Append-only memory is very good at keeping everything. It has no opinion about which of the things it kept is currently true.

### What the evolved prompt changes

Two obvious fixes failed first, and both are worth naming.

Sorting by timestamp and taking the newest looks reasonable for about an hour. Then you notice a timestamp records when someone typed a sentence, not when the fact became true. A late retrospective summary silently retires a fresh correction.

Periodic re-summarisation is worse. Consolidation destroys the corrections: once intermediate notes are folded into a paragraph, no reviewer can see that the target changed twice or which statement retired which. When the summary is wrong there is nothing to audit, only prose disagreeing with prose.

Both attempts ranked text. What was needed was a record with a lifecycle. A change is now written as one atomic transaction — immutable `record_id`, `entity_key`, typed status from a closed set, parseable `effective_at`, scope, evidence, and `supersedes` pointing at exactly one prior `record_id`. A correction never edits the earlier record; it appends a new one naming its predecessor.

Two ordering decisions took the longest to get right. Lifecycle resolves across the whole candidate set **before** scope narrows it — filtering by scope first drops an out-of-scope successor, lets the record it retired survive, and serves a fact that was superseded days ago. And `supersedes` must name one record ID, never a status value: identity governs the transition, not vocabulary.

### For judges

Open the canon desk and run the record set. Three records stay readable; one is canon. Then `make demo` prints the same resolution from `cmd/resolve.mjs`.

## Evidence boundary

The tests and the canon desk prove policy behaviour over committed code and fixtures. The desk performs no storage write, holds no wallet and asserts no receipt.

Mainnet persistence is a separate claim evidenced only by terminal receipt rows with blob IDs, five fresh-client cold recalls, and one independently opened Walruscan link. The source comparison is a static contract comparison against a pinned revision.

## Links

| Label | URL |
|---|---|
| Live demo | https://canon-transactions.vercel.app |
| Repository | https://github.com/alfamain/CanonTransactions |
| Evolved prompt | https://github.com/alfamain/CanonTransactions/blob/main/PROMPT.md |
| Source prompt | Continuity Keeper — https://github.com/yukitran03/continuity-keeper (rev 522694d) |
| Write-up | https://github.com/alfamain/CanonTransactions/blob/main/ARTICLE.md |
| Receipts | https://github.com/alfamain/CanonTransactions/blob/main/docs/RECEIPTS.md |

## Media gallery captions

1. `brand/article-banner.png` — cover: the failure and the changed behaviour in one frame.
2. The demo screenshot committed in this repository — the named scenario with its verdict and the rule that produced it.
3. The architecture diagram committed in this repository — how a recalled record reaches, or fails to reach, the agent.

## Owner fields to complete before submitting

- Team members and handles: `TEAM_HANDLES`
- Published article URL: `ARTICLE_URL`
- Source-repository feedback issue URL: `SOURCE_ISSUE_URL`
- Demo video URL: `VIDEO_URL`
- Sessions wallet public address: `SESSIONS_WALLET_ADDRESS`
