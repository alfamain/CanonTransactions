import { NextResponse } from 'next/server';
import ledgerEvents from '../../../../ledger/events.json';
import { resolve } from '../../../../cmd/resolve.mjs';

export const dynamic = 'force-dynamic';

// Committed, deterministic scenario fixtures. The browser never invents records:
// each scenario is a fixed transaction set replayed through cmd/resolve.mjs.
const SCENARIOS = [
  {
    id: 0,
    tag: '01',
    name: 'Correction chain',
    dek: 'A claim is corrected, then the correction is retired by a later record.',
    scope: {},
    cli: 'node cmd/resolve.mjs',
    events: ledgerEvents
  },
  {
    id: 1,
    tag: '02',
    name: 'Retired by revocation',
    dek: 'The only in-scope current transaction carries a revoked lifecycle state.',
    scope: { project: 'p', scope: 's' },
    cli: 'node tests/replay.test.mjs',
    events: [
      { record_id: 'a@1', entity_key: 'release:target', project: 'p', scope: 's', status: 'claim', effective_at: '2026-08-14T10:00:00Z', evidence: 'fixture', confidence: 'high' },
      { record_id: 'a@2', entity_key: 'release:target', project: 'p', scope: 's', status: 'revoked', effective_at: '2026-08-15T00:00:00Z', supersedes: 'a@1', evidence: 'fixture', confidence: 'high' }
    ]
  },
  {
    id: 2,
    tag: '03',
    name: 'Owner escalation',
    dek: 'Two viable current transactions disagree, so the resolver escalates instead of picking one.',
    scope: { project: 'p', scope: 's' },
    cli: 'node cmd/demo.mjs',
    events: [
      { record_id: 'b@1', entity_key: 'release:target', project: 'p', scope: 's', status: 'conflict', effective_at: '2026-08-15T00:00:00Z', evidence: 'fixture', confidence: 'high' }
    ]
  }
];

// Public phrasing describes the domain handling route that was taken.
// The canonical `state` value from the resolver is always returned unchanged.
const ROUTE = {
  resolved: { label: 'Canonical current state', route: 'Resolved route', summary: 'One unambiguous, in-scope, evidence-backed transaction is current.' },
  revoked: { label: 'Retired by later record', route: 'Lifecycle route', summary: 'The current transaction was retired by an explicit lifecycle link, so canon is empty for this entity.' },
  conflict: { label: 'Owner escalation route', route: 'Escalation route', summary: 'Viable current transactions disagree, so both evidence trails go to a human owner.' },
  provisional: { label: 'Held provisional, awaiting evidence', route: 'Provisional route', summary: 'The resolver holds a provisional view instead of promoting an unverified record.' }
};

const REASON = {
  'recall-integrity-unknown': 'Recall integrity is unknown, so no canon is asserted.',
  'untrusted-memory-content': 'Instruction-like or secret-like text was quarantined before any claim was parsed.',
  'invalid-event-schema': 'A record was missing schema-required fields or a parseable event time.',
  'invalid-event-status': 'A record used a lifecycle value outside the typed set.',
  'no-current-evidence': 'Every candidate was stale, superseded, expired or retired; history still exists.',
  'ungrounded-current-evidence': 'The current candidate lacked evidence or high confidence.',
  'current-event-revoked': 'The current transaction for this entity was explicitly retired.',
  'explicit-conflict': 'Two current transactions disagree and were escalated.'
};

// Ordered canonical checks, matching the sequence enforced by cmd/resolve.mjs.
// Each entry names the PROMPT.md rule that governs that step.
const CHECKS = [
  { id: 'recall', rule: 'Recall integrity', detail: 'A recalled set exists and can be treated as a candidate set, never as inventory.' },
  { id: 'quarantine', rule: 'Memory is data, not authority', detail: 'Every string field is scanned for instruction-like or secret-like content before any claim is parsed.' },
  { id: 'schema', rule: 'Schema completeness', detail: 'Entity key, lifecycle status and a parseable event time are required on every record.' },
  { id: 'vocabulary', rule: 'Typed lifecycle vocabulary', detail: 'Lifecycle values outside the typed set are refused rather than guessed.' },
  { id: 'supersession', rule: 'Lifecycle before scope', detail: 'Explicit record-ID supersession and expiry are applied across the whole candidate set first.' },
  { id: 'scope', rule: 'Current, in-scope selection', detail: 'The current record per entity is chosen by declared event time and scope, not by result order.' },
  { id: 'revocation', rule: 'Revocation is per entity', detail: 'A retirement empties canon for its own entity only.' },
  { id: 'conflict', rule: 'Conflict is escalated, not ranked', detail: 'Two viable current records that disagree go to a human owner with both evidence trails.' },
  { id: 'grounding', rule: 'Evidence-backed canon', detail: 'A record is promoted to canon only with evidence and high confidence.' }
];

// Which check produced each terminal reason, and the outcome word it carries.
const TERMINAL = {
  'recall-integrity-unknown': ['recall', 'held'],
  'untrusted-memory-content': ['quarantine', 'quarantined'],
  'invalid-event-schema': ['schema', 'refused'],
  'invalid-event-status': ['vocabulary', 'refused'],
  'no-current-evidence': ['scope', 'held'],
  'current-event-revoked': ['revocation', 'retired'],
  'explicit-conflict': ['conflict', 'escalated'],
  'ungrounded-current-evidence': ['grounding', 'held']
};

const MEANING = {
  resolved: 'One current record answers the question, and downstream work may rely on it.',
  revoked: 'A later record retired this fact, so canon is deliberately empty for this entity.',
  conflict: 'Two current records disagree, so the answer goes to a human owner instead of a guess.',
  provisional: 'The canon is held back because the evidence for a current answer is not there.'
};

const HEADLINE = {
  resolved: 'RESOLVED',
  revoked: 'RETIRED',
  conflict: 'ESCALATED',
  provisional: 'HELD'
};

function buildChecks(reasonKey) {
  const terminal = TERMINAL[reasonKey];
  const stopAt = terminal ? CHECKS.findIndex((c) => c.id === terminal[0]) : -1;
  return CHECKS.map((check, i) => {
    if (stopAt === -1 || i < stopAt) return { ...check, outcome: 'pass' };
    if (i === stopAt) return { ...check, outcome: terminal[1] };
    return { ...check, outcome: 'not required' };
  });
}

const trim = (s) => String(s == null ? '' : s).slice(0, 600);

function evaluate(index, note) {
  const scenario = SCENARIOS[index] || SCENARIOS[0];
  const baseline = resolve(scenario.events, scenario.scope);

  // The typed context note is materially part of the workflow: it is attached to
  // the recalled transaction set as an untrusted `context_note` field and passes
  // through the same canonical resolver, which scans every string field.
  const annotated = note
    ? scenario.events.map((e, i) => (i === scenario.events.length - 1 ? { ...e, context_note: note } : e))
    : scenario.events;
  const withNote = note ? resolve(annotated, scenario.scope) : baseline;

  const state = withNote.status;
  const reasonKey = withNote.reason || (state === 'resolved' ? 'current-canonical-state' : '');
  const timeline = annotated.map((e) => ({
    record_id: e.record_id || `${e.entity_key}#${e.status}`,
    entity_key: e.entity_key,
    status: e.status,
    effective_at: e.effective_at,
    supersedes: e.supersedes || null,
    carries_note: Boolean(e.context_note)
  }));

  return {
    scenario: { id: scenario.id, tag: scenario.tag, name: scenario.name, dek: scenario.dek, cli: scenario.cli },
    state,
    route: ROUTE[state] || ROUTE.provisional,
    reason_code: reasonKey,
    headline: HEADLINE[state] || HEADLINE.provisional,
    meaning: MEANING[state] || MEANING.provisional,
    checks: buildChecks(withNote.reason || ''),
    reason_text: REASON[reasonKey] || 'One unambiguous current transaction was selected.',
    selected: (withNote.events || []).map((e) => e.record_id || `${e.entity_key}#${e.status}`),
    superseded: annotated.map((e) => e.supersedes).filter(Boolean),
    timeline,
    note: {
      supplied: Boolean(note),
      length: note ? note.length : 0,
      attached_to: note && timeline.length ? timeline[timeline.length - 1].record_id : null,
      quarantined: withNote.reason === 'untrusted-memory-content',
      changed_state: note ? withNote.status !== baseline.status || withNote.reason !== baseline.reason : false,
      baseline_state: baseline.status,
      statement: !note
        ? 'No context note supplied. The scenario fixture alone determines this state.'
        : withNote.reason === 'untrusted-memory-content'
          ? 'The note contained instruction-like or secret-like text. The resolver quarantined it and held a provisional view.'
          : 'The note was attached and scanned as untrusted content. It contained nothing quarantinable, so the committed fixture still determines this state.'
    },
    source: 'cmd/resolve.mjs',
    boundary: 'Read-only browser replay of committed fixtures. No wallet, no provider key, no storage write, no Mainnet claim.'
  };
}

export async function GET(request) {
  const url = new URL(request.url);
  const index = Number(url.searchParams.get('scenario') || 0) || 0;
  return NextResponse.json(evaluate(index, trim(url.searchParams.get('note'))));
}

export async function POST(request) {
  let body = {};
  try {
    body = await request.json();
  } catch {
    body = {};
  }
  const index = Number(body.scenario || 0) || 0;
  return NextResponse.json(evaluate(index, trim(body.note)));
}
