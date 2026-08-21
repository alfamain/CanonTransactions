.PHONY: provider-matrix  evidence-check secret-scan synthetic-stand test demo
provider-matrix:
	node scripts/check-provider-matrix.mjs replay/provider-matrix-2026-08-21.json PROMPT.md

test: evidence-check secret-scan
	node tests/replay.test.mjs
	node tests/synthetic-stand.test.mjs
	node cmd/resolve.mjs

demo:
	node cmd/demo.mjs

evidence-check:
	node scripts/check-evidence.mjs replay/mainnet-receipts.json replay/checkpoints.json
secret-scan:
	node scripts/secret-scan.mjs

synthetic-stand:
	node scripts/check-synthetic-stand.mjs
