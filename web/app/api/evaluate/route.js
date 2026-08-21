import { NextResponse } from 'next/server';
import events from '../../../../ledger/events.json';
import { resolve } from '../../../../cmd/resolve.mjs';
export const dynamic = 'force-dynamic';
export async function GET(request) {
 const n=new URL(request.url).searchParams.get('scenario')||'0';
 const input=n==='1'?[{record_id:'a@1',entity_key:'release:target',project:'p',scope:'s',status:'revoked',effective_at:'2026-08-15T00:00:00Z',evidence:'fixture',confidence:'high'}]:n==='2'?[{record_id:'a@1',entity_key:'release:target',project:'p',scope:'s',status:'conflict',effective_at:'2026-08-15T00:00:00Z',evidence:'fixture',confidence:'high'}]:events;
 const out=resolve(input,n==='0'?{}:{project:'p',scope:'s'}); return NextResponse.json({outcome:out.status,reason:out.reason||'current canonical state',source:'cmd/resolve.mjs'});
}
