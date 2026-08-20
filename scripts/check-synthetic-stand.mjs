import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {resolve} from '../cmd/resolve.mjs';
import {execFileSync} from 'node:child_process';

const repo=process.env.ALFA_SYNTHETIC_STAND;
if(!repo){
  console.log('synthetic stand: SKIP (set ALFA_SYNTHETIC_STAND to a clone of replay/stands/release-canon-ledger.bundle)');
  process.exit(0);
}
const manifest=JSON.parse(readFileSync(new URL('../replay/synthetic-release-canon-ledger.json',import.meta.url)));
const git=(...args)=>execFileSync('git',['-C',repo,...args],{encoding:'utf8'}).trim();
const author=manifest.author;

assert.equal(createHash('sha256').update(readFileSync(new URL('../PROMPT.md',import.meta.url))).digest('hex'),manifest.prompt_sha256,'prompt revision changed');
for(const [index,row] of manifest.chain.entries()){
  assert.equal(git('rev-parse',row.commit),row.commit,`missing chain commit ${index + 1}`);
  assert.equal(git('show','-s','--format=%an <%ae>',row.commit),author,`unexpected author at commit ${index + 1}`);
  assert.equal(git('show','-s','--format=%cn <%ce>',row.commit),author,`unexpected committer at commit ${index + 1}`);
  assert.equal(git('show','-s','--format=%s',row.commit),row.subject,`unexpected subject at commit ${index + 1}`);
  const parent=git('show','-s','--format=%P',row.commit);
  assert.equal(parent,row.parent ?? '',`non-linear synthetic chain at commit ${index + 1}`);
  const events=JSON.parse(git('show',`${row.commit}:${manifest.policy_application.input_path}`));
  assert.equal(events.length,index + 1,`unexpected event count at commit ${index + 1}`);
  const event=events.at(-1);
  assert.equal(event.record_id,row.event_id,`unexpected immutable ID at commit ${index + 1}`);
  assert.equal(event.status,row.expected_status,`unexpected lifecycle status at commit ${index + 1}`);
  if(index) assert.equal(event.supersedes,manifest.chain[index - 1].event_id,`missing explicit supersession at commit ${index + 1}`);
}
const final=manifest.chain.at(-1).commit;
const events=JSON.parse(git('show',`${final}:${manifest.policy_application.input_path}`));
const outcome=resolve(events,manifest.policy_application.scope);
assert.equal(outcome.status,manifest.policy_application.expected_outcome.status);
assert.equal(outcome.reason,manifest.policy_application.expected_outcome.reason);
console.log(JSON.stringify({replay_id:manifest.replay_id,classification:manifest.classification,commits:manifest.chain.length,outcome,evidence_boundary:manifest.evidence_boundary},null,2));
