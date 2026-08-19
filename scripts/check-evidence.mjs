import fs from 'node:fs';
const [manifestPath, checkpointPath=''] = process.argv.slice(2);
const manifest=JSON.parse(fs.readFileSync(manifestPath,'utf8'));const rows=manifest.receipts||manifest;
const cold=rows.filter(r=>r.cold_recall?.status==='found'||r.cold_recall_result==='found');
if(rows.length!==10||rows.some(r=>!r.blob_id)||cold.length!==5)throw new Error('receipt manifest must contain 10 non-empty IDs and 5 cold recalls');
if(checkpointPath){const c=JSON.parse(fs.readFileSync(checkpointPath,'utf8'));if(c.evidence_status!=='mainnet_confirmed_10_of_10')throw new Error('checkpoint evidence status mismatch');for(const row of c.checkpoints)if(row.historical_outcome!=='pending_live_receipt'||row.current_evidence!=='confirmed_mainnet_receipt')throw new Error('checkpoint historical/current evidence fields mismatch');}
for(const doc of ['README.md','ARTICLE.md','DEMO.md'])if(fs.existsSync(doc)&&/Mainnet (receipts? )?remain pending|pending Mainnet/i.test(fs.readFileSync(doc,'utf8')))throw new Error(`stale Mainnet claim in ${doc}`);
console.log(`evidence consistency: PASS (${rows.length} receipts; ${cold.length} cold recalls)`);
