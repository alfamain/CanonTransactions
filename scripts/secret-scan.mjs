import fs from 'node:fs';import path from 'node:path';
let checked=0;
function walk(dir){for(const entry of fs.readdirSync(dir,{withFileTypes:true})){if(entry.name==='.git')continue;const file=path.join(dir,entry.name);if(entry.isDirectory())walk(file);else{checked++;const text=fs.readFileSync(file,'utf8');if(/ghp_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]+|MEMWAL_PRIVATE_KEY\s*=\s*[^'"\s]/.test(text))throw Error(`secret-like content: ${file}`);}}}
walk('.');console.log(`secret scan: PASS (${checked} files checked)`);
