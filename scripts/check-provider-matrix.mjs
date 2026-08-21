import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
const [reportPath,promptPath]=process.argv.slice(2);
const r=JSON.parse(readFileSync(reportPath));
assert.equal(r.prompt_sha256,createHash('sha256').update(readFileSync(promptPath)).digest('hex'),'prompt hash mismatch');
assert.equal(r.providers.length,2,'need exactly two declared provider families');
assert.equal(new Set(r.providers.map(x=>x.family)).size,2,'provider families must be independent');
const expected=new Set(r.fixtures.map(x=>x.id));
for(const provider of r.providers){const rows=r.results.filter(x=>x.provider===provider.provider);assert.equal(rows.length,expected.size,`${provider.provider}: incomplete fixture set`);for(const x of rows){assert(expected.has(x.fixture),'unknown fixture');assert(['pass','deviation','indeterminate'].includes(x.classification),'invalid classification');assert(!('raw_output' in x),'raw output must not be committed');assert(x.response_sha256===null||/^[0-9a-f]{64}$/.test(x.response_sha256),'bad response hash');}}
assert(r.results.some(x=>x.classification==='deviation'),'report must preserve observed deviations');
console.log('provider matrix structural check: PASS (two families; deviations retained)');
