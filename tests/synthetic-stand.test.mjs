import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
const result=spawnSync(process.execPath,['scripts/check-synthetic-stand.mjs'],{encoding:'utf8'});
assert.equal(result.status,0,result.stderr);
assert.match(result.stdout,/CT-SYN-RELEASE-01/);
console.log('synthetic stand test: PASS');
