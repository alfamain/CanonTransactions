test: evidence-check
	node tests/replay.test.mjs
	node cmd/resolve.mjs

demo:
	node cmd/demo.mjs

evidence-check:
	node scripts/check-evidence.mjs replay/mainnet-receipts.json replay/checkpoints.json
