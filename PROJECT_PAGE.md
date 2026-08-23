# Canon Transactions — project page copy

### Statement

Append-only memory that can still answer what is true right now.

Every change to memory is filed as a typed transaction naming its predecessor. History never shrinks, and exactly one line is canon.

| Field | Value |
|---|---|
| Owner | `alfamain` |
| Evolved from | Continuity Keeper — https://github.com/yukitran03/continuity-keeper (rev 522694d) |
| Topics | Walrus Memory · Prompt evolution · Append-only state · Auditability |
| Demo | https://canon-transactions.vercel.app |
| Repository | https://github.com/alfamain/CanonTransactions |

### Entry one — the note that was still current

An agent kept continuity notes about releases. In one session it recalled one and quoted it back with complete confidence: the release target was the branch named in the note.

That was a real note. The underlying decision had been made and written down. It was also wrong, because two days later the target changed, and the day after that the plan was withdrawn entirely.

All three statements were in memory. Nothing was corrupted. Recall returned the entry most similar to the question — which happened to be the oldest and most quotable, because it was written while the plan was still exciting. Later entries were hedged and shorter, so they ranked lower.

Append-only memory is very good at keeping everything. It has no opinion about which of the things it kept is currently true.

### Entry two — the correction

Two obvious fixes failed first, and both are worth naming.

Sorting by timestamp and taking the newest looks reasonable for about an hour. Then you notice a timestamp records when someone typed a sentence, not when the fact became true. A late retrospective summary silently retires a fresh correction.

Periodic re-summarisation is worse. Consolidation destroys the corrections: once intermediate notes are folded into a paragraph, no reviewer can see that the target changed twice or which statement retired which. When the summary is wrong there is nothing to audit, only prose disagreeing with prose.

Both attempts ranked text. What was needed was a record with a lifecycle. A change is now written as one atomic transaction — immutable `record_id`, `entity_key`, typed status from a closed set, parseable `effective_at`, scope, evidence, and `supersedes` pointing at exactly one prior `record_id`. A correction never edits the earlier record; it appends a new one naming its predecessor.

Two ordering decisions took the longest to get right. Lifecycle resolves across the whole candidate set **before** scope narrows it — filtering by scope first drops an out-of-scope successor, lets the record it retired survive, and serves a fact that was superseded days ago. And `supersedes` must name one record ID, never a status value: identity governs the transition, not vocabulary.

### Entry three — reading it as a judge

Open the canon desk and run the record set. Three records stay readable; one is canon. Then `make demo` prints the same resolution from `cmd/resolve.mjs`.

### Disposition of every claim

The tests and the canon desk prove policy behaviour over committed code and fixtures. The desk performs no storage write, holds no wallet and asserts no receipt.

Mainnet persistence is a separate claim evidenced only by terminal receipt rows with blob IDs, five fresh-client cold recalls, and one independently opened Walruscan link. The source comparison is a static contract comparison against a pinned revision.

### Filed alongside

`PROMPT.md` · `ARTICLE.md` · `docs/RECEIPTS.md` · `brand/article-banner.png` (1200x630) · `brand/logo.png` (512x512)

Gallery order: cover, then the retired-canon screenshot, then the record-lifecycle graph.

### Not yet filed by the owner

`TEAM_HANDLES` · `ARTICLE_URL` · `SOURCE_ISSUE_URL` · `VIDEO_URL` · `SESSIONS_WALLET_ADDRESS`
