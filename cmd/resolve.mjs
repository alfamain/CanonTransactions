import fs from 'node:fs';

const UNTRUSTED=/(ignore (all )?(prior|policy|instructions)|curl\b|api[_ -]?key|private key|password|seed phrase|ghp_[a-z0-9]{20,}|\bsk-[a-z0-9]{8,}|token\s*[=:]|run (this )?command|override .*instruction)/i;
function strings(value,out=[]){
  if(typeof value==='string')out.push(value);
  else if(Array.isArray(value))for(const item of value)strings(item,out);
  else if(value&&typeof value==='object')for(const item of Object.values(value))strings(item,out);
  return out;
}
const untrusted=e=>UNTRUSTED.test(strings(e).join(' '));

export function resolve(events,scope={}){
  if(!Array.isArray(events)||!events.length)return {status:'provisional',reason:'recall-integrity-unknown'};
  // Untrusted content is checked across every string field, not one field.
  if(events.some(untrusted))return {status:'provisional',reason:'untrusted-memory-content'};
  if(events.some(e=>!e.entity_key||!e.status||!e.effective_at||!Number.isFinite(Date.parse(e.effective_at))))
    return {status:'provisional',reason:'invalid-event-schema'};
  if(events.some(e=>!['claim','corrected','revoked','resolved','conflict'].includes(e.status)))
    return {status:'provisional',reason:'invalid-event-status'};

  // Resolve explicit supersession and lifecycle BEFORE scope filtering, so an
  // out-of-scope successor can never leave an older claim standing as current.
  // `supersedes` names one immutable record ID. Never use a generic lifecycle
  // label such as `claim`: that can retire unrelated entities sharing a status.
  const superseded=new Set(events.map(e=>e.supersedes).filter(Boolean));
  const legacyId=e=>`${e.entity_key}#${e.status}`;
  const live=events.filter(e=>!superseded.has(e.record_id||legacyId(e))&&
    (!e.expires_at||Date.parse(e.expires_at)>Date.now()));

  const byKey=new Map();
  for(const e of live){
    if(!byKey.has(e.entity_key))byKey.set(e.entity_key,[]);
    byKey.get(e.entity_key).push(e);
  }
  const current=[...byKey.values()].map(rows=>
    rows.slice().sort((a,b)=>Date.parse(b.effective_at)-Date.parse(a.effective_at))[0]);

  const inScope=current.filter(e=>(!scope.project||e.project===scope.project)&&(!scope.scope||e.scope===scope.scope));
  if(!inScope.length)return {status:'provisional',reason:'no-current-evidence'};
  const revoked=inScope.filter(e=>e.status==='revoked');
  const usable=inScope.filter(e=>e.status!=='revoked');
  // A recalled top-K can include several entities. A revocation applies to
  // its own entity only; it may not erase another entity's current canon.
  if(!usable.length&&revoked.length)
    return {status:'revoked',reason:'current-event-revoked',events:revoked};
  if(usable.some(e=>e.status==='conflict'))return {status:'conflict',reason:'explicit-conflict'};
  if(usable.some(e=>!e.evidence||e.confidence!=='high'))return {status:'provisional',reason:'ungrounded-current-evidence'};
  return {status:'resolved',events:usable,revoked};
}

if(process.argv[1]&&process.argv[1].endsWith('resolve.mjs')){
  const events=JSON.parse(fs.readFileSync('ledger/events.json','utf8'));
  const out=resolve(events);
  const key=out.events?.map(e=>e.entity_key).join(', ');
  console.log(key?`CANON: ${out.status} — ${key}`:`CANON: ${out.status} — ${out.reason}`);
}
