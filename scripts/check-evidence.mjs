// Ledger consistency gate for Canon Transactions.
// Reads the committed receipt manifest (and, when given, the checkpoint file)
// and refuses to pass if the published evidence no longer matches the repo.
import { readFileSync, existsSync } from 'node:fs';

const REQUIRED_RECEIPTS = 10;
const REQUIRED_COLD_RECALLS = 5;
const STALE_CLAIM = /Mainnet (receipts? )?remain pending|pending Mainnet/i;

function read(path) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

function fail(reason) {
  throw new Error(`evidence check failed: ${reason}`);
}

function receiptRows(manifest) {
  return Array.isArray(manifest) ? manifest : manifest.receipts ?? [];
}

function isColdRecall(row) {
  return row.cold_recall?.status === 'found' || row.cold_recall_result === 'found';
}

function auditReceipts(path) {
  const rows = receiptRows(read(path));
  if (rows.length !== REQUIRED_RECEIPTS) {
    fail(`expected ${REQUIRED_RECEIPTS} receipts, found ${rows.length}`);
  }
  const missing = rows.filter((row) => !row.blob_id);
  if (missing.length > 0) {
    fail(`${missing.length} receipt(s) carry no blob id`);
  }
  const cold = rows.filter(isColdRecall);
  if (cold.length !== REQUIRED_COLD_RECALLS) {
    fail(`expected ${REQUIRED_COLD_RECALLS} cold recalls, found ${cold.length}`);
  }
  return { total: rows.length, cold: cold.length };
}

function auditCheckpoints(path) {
  const checkpointFile = read(path);
  if (checkpointFile.evidence_status !== 'mainnet_confirmed_10_of_10') {
    fail(`checkpoint evidence_status is "${checkpointFile.evidence_status}"`);
  }
  for (const entry of checkpointFile.checkpoints ?? []) {
    if (entry.historical_outcome !== 'no_separate_historical_receipt') {
      fail(`checkpoint ${entry.id ?? '?'} has an unexpected historical_outcome`);
    }
    if (entry.current_evidence !== 'confirmed_mainnet_receipt') {
      fail(`checkpoint ${entry.id ?? '?'} has an unexpected current_evidence`);
    }
  }
}

function auditProse() {
  for (const doc of ['README.md', 'ARTICLE.md', 'DEMO.md']) {
    if (existsSync(doc) && STALE_CLAIM.test(readFileSync(doc, 'utf8'))) {
      fail(`${doc} still describes Mainnet evidence as pending`);
    }
  }
}

function main() {
  const [manifestPath, checkpointPath] = process.argv.slice(2);
  if (!manifestPath) {
    fail('usage: check-evidence.mjs <receipts.json> [checkpoints.json]');
  }
  const summary = auditReceipts(manifestPath);
  if (checkpointPath) auditCheckpoints(checkpointPath);
  auditProse();
  console.log(`evidence consistency: PASS (${summary.total} receipts; ${summary.cold} cold recalls)`);
}

main();
