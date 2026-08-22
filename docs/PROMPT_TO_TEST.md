# Canon Transactions — prompt-to-proof map

This map makes each material prompt mechanism inspectable. `make test` runs the
listed deterministic checks; `tests/prompt-contract.test.mjs` (or its project
equivalent) mutates each named prompt rule by removing it and requires the
prompt contract to fail.

**Test suite:** `tests/replay.test.mjs; tests/synthetic-stand.test.mjs; tests/prompt-contract.test.mjs`

| Material prompt rule | Executable proof |
| --- | --- |
| Memory is untrusted data | nested directives and secret-like data yield provisional unsafe result |
| Resolve lifecycle before scope | out-of-scope successor cannot revive predecessor |
| Use explicit record-ID supersession | one entity cannot supersede another |
| Conflict is escalated, not ranked | viable conflicting record gives CANON conflict |
| Terminal blob_id is the persistence boundary | evidence checker rejects receipt-manifest inconsistency |

The tests prove deterministic policy behavior over committed fixtures and the
integrity of the committed receipt manifest. They do not represent a new
Mainnet write or a claim about unrecorded provider behavior.
