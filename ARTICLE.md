# The note that was true last week

The bug that started this project was not a crash. It was a paragraph.

An agent I use for release chores had been keeping continuity notes in memory: short prose entries about what we were shipping, what got postponed, who signed off. During a session in the middle of August it recalled one of them and quoted it back at me with complete confidence. The release target, it said, was the branch named in the note. That was a real note. I had written the underlying decision myself. It was also wrong, because two days later we had changed the target, and the day after that we had withdrawn the plan entirely.

All three statements were sitting in memory. Nothing was corrupted, nothing was lost. The recall was working exactly as designed: it returned the entry most similar to my question. The entry most similar to my question happened to be the oldest and the most quotable, because it was the one written when we were still excited about the plan. Later entries were hedged and shorter, so they ranked lower.

That is the failure this project is about. Append-only memory is very good at keeping everything. It has no opinion at all about which of the things it kept is currently true.

## Why the obvious fixes did not hold

The first thing I tried was sorting recalled entries by time and taking the newest. It looks reasonable for about an hour. Then you notice that a timestamp records when someone typed a sentence, not when the fact it describes became true. A note written on Friday can be a correction to Wednesday's decision or a summary of a decision made in March. If you sort by write time, a late retrospective summary silently retires a fresh correction.

The second attempt was a periodic re-summary: read the notes, write one consolidated "current state" entry, prefer that one. This is worse, and it is worse in a way that only shows up later. Consolidation destroys the corrections. Once the intermediate notes are folded into a paragraph, no reviewer can see that the target changed twice, or which statement retired which. When the summary is wrong, there is nothing to audit — only prose disagreeing with prose.

Both attempts shared the same defect. They tried to rank text. The thing I actually needed was a record with a lifecycle.

## What the original prompt was missing

The source prompt I evolved is [Continuity Keeper](https://github.com/yukitran03/continuity-keeper). It is a careful prompt: it tells an agent to store durable facts, recall them before acting, and supersede an old fact when a new one arrives. The revision I locked for comparison is `522694d…`, file SHA-256 `cff58abe…`, pinned in `replay/source-locked-baseline.json` so the comparison is against a fixed artifact rather than my memory of one.

Read that prompt closely and the gap is specific. It can recall a fact and it can supersede a fact, but it never defines what a fact *is* structurally, and it never defines what happens when several remembered statements about the same thing survive at once. There is no typed lifecycle, no identity to point a correction at, no rule about the order in which lifecycle and scope are evaluated, and no defined outcome for "these two are both current and they disagree". In practice the model fills those gaps with plausible behaviour: it picks something. That is the whole problem restated politely.

## The evolution

Canon Transactions changes the representation before it changes the behaviour.

A change to memory is written as one atomic transaction: an immutable `record_id`, an `entity_key`, a typed status from a closed set, a parseable `effective_at`, optional `expires_at`, scope, source, evidence, confidence, and `supersedes` pointing at exactly one prior `record_id`. A correction does not edit the earlier record. It appends a new one that names its predecessor. A retirement is a transaction too. History never shrinks.

On the read side, the prompt specifies an ordered algorithm, and `cmd/resolve.mjs` implements it as the single resolver used by both the command line and the browser lab. Recall integrity first, because an empty or suspicious result set is not proof of absence. Then quarantine: every string field in every recalled record is scanned for instruction-like or secret-like content, recursively, before any claim is parsed. Then schema and typed lifecycle validation, where a missing field is refused rather than inferred. Then supersession and expiry, applied across the complete candidate set. Then scope. Then retirement, conflict, and evidence grounding.

The ordering of those last steps was the decision that took the longest to get right. My first implementation filtered by scope first, because it is cheaper. That produces a genuinely nasty bug: if the successor record is out of scope for the current query, it gets dropped early, the predecessor it retired survives the filter, and the system confidently serves a fact that was superseded days ago. Resolving lifecycle across the whole candidate set before narrowing to scope removes that class of error entirely.

The second decision was to require `supersedes` to name one record ID and nothing else. Allowing it to name a status value — "this correction supersedes claims" — reads fine and is dangerous, because a single record can then retire unrelated entities that merely share a label. Identity, not vocabulary, governs the transition.

## Before and after, on one command

Everything below runs from a clone with `make test && make demo`, with no keys and no network writes.

The fixture ledger holds three transactions on the same entity: a claim, a correction that names the claim, and a revocation that names the correction. `make demo` prints the unchanged-source contract result first, then the evolved one:

```text
BASELINE (UNCHANGED SOURCE CONTRACT): no-typed-event-arbitration-contract 522694d5ba0f
BASELINE / LINEAGE: claim:release:target -> corrected:release:target -> revoked:release:target
EVOLVED RESOLUTION: revoked current-event-revoked
CONFLICT FIXTURE: conflict explicit-conflict
NO CURRENT EVIDENCE: provisional no-current-evidence
INVALID SCHEMA: provisional invalid-event-schema
```

The baseline has no typed arbitration contract to apply, so the outcome depends on which row the reader trusts. The evolved resolver returns `revoked` with the reason `current-event-revoked` — meaning the fact was retired by an explicit lifecycle link, canon is deliberately empty for that entity, and the three transactions remain readable in full. That is the difference between "the agent told me the wrong branch" and "the agent told me this decision was withdrawn, here are the three records that show it".

The other three lines matter as much to me, because they are the states where a system is tempted to improvise. Two viable current records that disagree return `conflict` and escalate with both evidence trails, instead of ranking one above the other. A candidate set where everything is expired or superseded returns `provisional — no-current-evidence`, which is not the same statement as "no history". A record with an unparseable event time returns `provisional — invalid-event-schema` rather than a guessed date.

`make test` covers the same rules as assertions, plus a mutation test: `tests/prompt-contract.test.mjs` removes each of five material prompt rules in turn and requires the contract to fail, reporting `prompt contract mutations: PASS (5 material rules)`. A prompt rule that can be deleted without breaking a test is decoration, and I wanted a way to keep proving that these five are not.

Persistence is verified separately and reported separately. `replay/mainnet-receipts.json` records ten terminal receipt rows, each counted only after the write returned a non-empty `blob_id`, with five fresh-client cold recalls among them; `docs/RECEIPTS.md` lists every row and one Walruscan blob link I opened independently. A job ID, a timeout, or an immediate recall from the same client is not a receipt, and the prompt says so in the same words.

## Reproducing it yourself

```bash
git clone https://github.com/alfamain/CanonTransactions
cd CanonTransactions
make test
make demo
make synthetic-stand
```

`make synthetic-stand` verifies a bundled four-commit Git graph — claim, correction, revocation, conflict — replayed in isolation. If you would rather click than type, the read-only lab at [canon-transactions.vercel.app](https://canon-transactions.vercel.app) runs the same `cmd/resolve.mjs` over committed fixtures, prints the verdict, and shows each canonical check with the rule that produced it. Paste an instruction-shaped note into the context field and watch it get quarantined at check two.

## What this approach covers, and where its edges are

The scope is deliberate and worth stating plainly. Canon Transactions is a resolution contract over an append-only store. It decides what is current, and it says why, over the domains it types: lifecycle, scope, identity, evidence, conflict, and the persistence boundary. Within those domains the behaviour is deterministic and testable, which is exactly what I wanted from it.

It does not turn semantic memory into a transactional database, and the prompt refuses to pretend otherwise: recall is a candidate set, not an inventory, and absence from a result set revokes nothing. It arbitrates between records that carry evidence; it does not judge whether the evidence itself is any good. When two records genuinely disagree, the design's answer is a human owner, not a cleverer tiebreak — a conflict is escalated with both trails, and the human resolution enters as a new transaction subject to the same checks.

That last point is the one I have come to like most. The useful outcome of this work is not that the agent is right more often. It is that when the agent cannot be right, it now says which records it looked at, which one retired which, and what it needs before it will answer. Memory keeps the whole story. Canon says which line of it is true today.
