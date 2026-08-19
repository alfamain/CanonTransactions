import fs from 'node:fs';import {resolve} from './resolve.mjs';
const events=JSON.parse(fs.readFileSync('ledger/events.json','utf8'));
console.log('CANON TRANSACTIONS — READ-ONLY LOCAL POLICY DEMO');
console.log('LOCAL POLICY: record lineage is resolved; the last array row is not trusted.');
const final=resolve(events);console.log('BASELINE / LINEAGE:',events.map(x=>`${x.status}:${x.entity_key}`).join(' -> '));console.log('EVOLVED RESOLUTION:',final.status,final.reason||final.events?.map(x=>x.entity_key).join(','));
if(final.status!=='revoked')throw new Error('expected revoked final state');
const conflict=resolve([{record_id:'a@1',entity_key:'release:target',project:'p',scope:'s',status:'conflict',effective_at:'2026-08-15T00:00:00Z',evidence:'fixture',confidence:'high'}],{project:'p',scope:'s'});console.log('CONFLICT FIXTURE:',conflict.status,conflict.reason);if(conflict.status!=='conflict')throw new Error('conflict must escalate');
const m=JSON.parse(fs.readFileSync('replay/mainnet-receipts.json','utf8'));const rows=m.receipts||m;const cold=rows.filter(x=>x.cold_recall?.status==='found'||x.cold_recall_result==='found').length;
console.log(`COMMITTED MAINNET MANIFEST: ${rows.length} terminal receipt rows; ${cold} fresh-client cold recalls.`);console.log('PROVIDER BEHAVIOR: INCOMPLETE — not asserted by this local demo.');console.log('ASSERTION: PASS — revocation and conflict were resolved deterministically.');
