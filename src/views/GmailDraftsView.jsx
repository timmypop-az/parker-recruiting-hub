import React, { useEffect, useState } from 'react';
import { ArrowLeft, Check, Loader2, Mail, PartyPopper, X } from 'lucide-react';
import { SchoolLogo } from '../components/SchoolLogo.jsx';
import { buildTemplate } from '../data/emailTemplates.js';
import { gmailAuthStatus, gmailDisconnect, createGmailDrafts } from '../lib/api.js';

const SECTION_CARD = 'bg-cc-surface rounded-cc-lg shadow-cc-card border border-cc-border';

const readAuthResultFromUrl = () => {
  const params = new URLSearchParams(window.location.search);
  const result = params.get('gmail_auth');
  if (!result) return null;
  const reason = params.get('reason');
  params.delete('gmail_auth');
  params.delete('reason');
  const newSearch = params.toString();
  const url = window.location.pathname + (newSearch ? `?${newSearch}` : '') + window.location.hash;
  window.history.replaceState({}, '', url);
  return { result, reason };
};

export const GmailDraftsView = ({ allSchools, onBack }) => {
  const [status, setStatus] = useState({ loading: true, connected: false, connectedAt: null });
  const [draftPhase, setDraftPhase] = useState('intro');
  const [results, setResults] = useState({});
  const [isRunning, setIsRunning] = useState(false);
  const [authMessage, setAuthMessage] = useState(null);

  const schoolsWithEmail = allSchools.filter(
    s => (s.coaches?.[0]?.email && s.coaches[0].email !== 'recruit@jessup.edu') || s.coaches?.[0]?.email
  );

  useEffect(() => {
    const authResult = readAuthResultFromUrl();
    if (authResult?.result === 'success') {
      setAuthMessage({ kind: 'success', text: 'Gmail connected. You won\'t need to do this again.' });
    } else if (authResult?.result === 'error') {
      setAuthMessage({ kind: 'error', text: `Couldn't connect Gmail (${authResult.reason || 'unknown'}). Try again.` });
    }
    (async () => {
      const s = await gmailAuthStatus();
      setStatus({ loading: false, connected: !!s.connected, connectedAt: s.connectedAt || null });
    })();
  }, []);

  const connect = () => { window.location.href = '/.netlify/functions/gmail-auth-start'; };
  const disconnect = async () => {
    if (!confirm('Disconnect Gmail? You\'ll have to reconnect next time.')) return;
    await gmailDisconnect();
    setStatus({ loading: false, connected: false, connectedAt: null });
    setResults({});
  };

  const buildDraft = (school) => {
    const tpl = buildTemplate(draftPhase, school);
    return { schoolId: school.id, to: school.coaches?.[0]?.email || '', subject: tpl.subject, body: tpl.body };
  };

  const runAllDrafts = async () => {
    setIsRunning(true);
    const pending = Object.fromEntries(schoolsWithEmail.map(s => [s.id, 'pending']));
    setResults(pending);
    try {
      const payload = schoolsWithEmail.map(buildDraft);
      const { results: serverResults } = await createGmailDrafts(payload);
      const next = {};
      for (const r of serverResults) next[r.schoolId] = r.status;
      setResults(next);
    } catch (e) {
      if (e.code === 'not_connected' || e.code === 'invalid_grant') {
        setStatus({ loading: false, connected: false, connectedAt: null });
        setAuthMessage({ kind: 'error', text: 'Gmail connection expired. Please reconnect.' });
      } else {
        setAuthMessage({ kind: 'error', text: `Error creating drafts: ${e.message}` });
      }
      setResults({});
    }
    setIsRunning(false);
  };

  const doneCount = Object.values(results).filter(v => v === 'done').length;
  const errorCount = Object.values(results).filter(v => v === 'error').length;
  const phaseLabels = { intro: 'Phase 1 — Introductory', tournament: 'Phase 2 — Tournament Invite', video: 'Phase 3 — Highlight Video' };
  const phaseColors = { intro: 'bg-cc-accent', tournament: 'bg-cc-forest', video: 'bg-cc-purple' };

  return (
    <div className="px-4 sm:px-6 lg:px-10 py-6 lg:py-8 max-w-4xl">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-6">
        <div>
          <div className="text-[11px] font-bold text-cc-subtle uppercase tracking-cc-widest flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-cc-gold" />
            Outreach Automation
          </div>
          <h1 className="font-display text-cc-fg text-cc-h2 leading-none mt-1 uppercase tracking-cc-wide">
            Gmail <span className="text-cc-accent">Draft Creator</span>
          </h1>
          <p className="text-cc-muted text-cc-body mt-1">Create personalized drafts for every coach on your list in one click.</p>
        </div>
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 bg-cc-surface hover:bg-cc-bg border border-cc-border px-4 py-2 rounded-cc-sm text-cc-fg text-xs font-bold uppercase tracking-cc-wider transition-colors self-start"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
      </div>

      {/* AUTH MESSAGE BANNER */}
      {authMessage && (
        <div className={`mb-4 px-5 py-3 rounded-cc-md border text-sm font-semibold flex items-center gap-2 ${
          authMessage.kind === 'success'
            ? 'bg-emerald-50 border-emerald-200 text-cc-forest'
            : 'bg-rose-50 border-rose-200 text-cc-maroon'
        }`}>
          {authMessage.kind === 'success' ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
          <span>{authMessage.text}</span>
          <button onClick={() => setAuthMessage(null)} className="ml-auto text-xs uppercase tracking-cc-wider opacity-60 hover:opacity-100">Dismiss</button>
        </div>
      )}

      <div className="space-y-6">
        {/* LOADING */}
        {status.loading && (
          <div className={`${SECTION_CARD} p-6 flex items-center gap-3 text-cc-muted`}>
            <Loader2 className="w-4 h-4 animate-spin" /> Checking Gmail connection…
          </div>
        )}

        {/* NOT CONNECTED */}
        {!status.loading && !status.connected && (
          <div className={`${SECTION_CARD} p-6`}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-cc-accent text-white flex items-center justify-center font-display text-sm tracking-cc-wide">1</div>
              <h2 className="font-display text-cc-fg text-lg uppercase tracking-cc-wide">Connect Gmail</h2>
            </div>
            <p className="text-sm text-cc-muted mb-5 leading-relaxed">
              One click to link your Gmail account. Google will ask you to grant permission to create drafts — you only need to do this once.
            </p>
            <button
              onClick={connect}
              className="flex items-center gap-2 px-6 py-3 bg-cc-accent hover:bg-cc-accent hover:opacity-90 text-white rounded-cc-sm font-display text-sm uppercase tracking-cc-widest transition-colors duration-cc-base"
            >
              <Mail className="w-4 h-4" /> Connect Gmail Account
            </button>
          </div>
        )}

        {/* CONNECTED */}
        {!status.loading && status.connected && (
          <>
            <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-cc-md px-5 py-3">
              <Check className="w-5 h-5 text-cc-success flex-shrink-0" />
              <span className="text-cc-forest font-bold text-sm">
                Gmail connected{status.connectedAt ? ` · ${new Date(status.connectedAt).toLocaleDateString()}` : ''}
              </span>
              <button onClick={disconnect} className="ml-auto text-xs text-cc-subtle hover:text-cc-fg font-bold uppercase tracking-cc-wider">
                Disconnect
              </button>
            </div>

            {/* PHASE SELECTOR */}
            <div className={`${SECTION_CARD} p-6`}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-cc-accent text-white flex items-center justify-center font-display text-sm tracking-cc-wide">1</div>
                <h2 className="font-display text-cc-fg text-lg uppercase tracking-cc-wide">Choose Email Phase</h2>
              </div>
              <div className="flex gap-3">
                {Object.entries(phaseLabels).map(([id, label]) => (
                  <button
                    key={id}
                    onClick={() => setDraftPhase(id)}
                    className={`flex-1 py-3 px-4 rounded-cc-sm font-display text-sm uppercase tracking-cc-widest transition-colors duration-cc-base border ${
                      draftPhase === id
                        ? `${phaseColors[id]} text-white border-transparent shadow-cc-card`
                        : 'bg-cc-surface text-cc-fg border-cc-border hover:bg-cc-bg'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* SCHOOL LIST + LAUNCH */}
            <div className={`${SECTION_CARD} p-6`}>
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-cc-accent text-white flex items-center justify-center font-display text-sm tracking-cc-wide">2</div>
                  <div>
                    <h2 className="font-display text-cc-fg text-lg uppercase tracking-cc-wide">Create Drafts</h2>
                    <p className="text-xs text-cc-subtle mt-0.5">{schoolsWithEmail.length} schools with coach emails · {phaseLabels[draftPhase]}</p>
                  </div>
                </div>
                <button
                  onClick={runAllDrafts}
                  disabled={isRunning}
                  className="flex items-center gap-2 px-6 py-3 bg-cc-accent hover:bg-cc-accent hover:opacity-90 disabled:opacity-50 text-white rounded-cc-sm font-display text-sm uppercase tracking-cc-widest transition-colors duration-cc-base"
                >
                  {isRunning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
                  {isRunning ? 'Creating drafts…' : `Create All ${schoolsWithEmail.length} Drafts`}
                </button>
              </div>

              {Object.keys(results).length > 0 && (
                <div className="flex gap-3 mb-4 p-3 bg-cc-surface-alt rounded-cc-md">
                  <span className="inline-flex items-center gap-1.5 text-cc-success font-bold text-sm tabular"><Check className="w-4 h-4" /> {doneCount} created</span>
                  {errorCount > 0 && <span className="inline-flex items-center gap-1.5 text-cc-danger font-bold text-sm tabular"><X className="w-4 h-4" /> {errorCount} failed</span>}
                  <span className="text-cc-subtle text-sm tabular">{Object.keys(results).length} / {schoolsWithEmail.length} processed</span>
                  {!isRunning && doneCount > 0 && (
                    <a href="https://mail.google.com/mail/u/0/#drafts" target="_blank" rel="noreferrer"
                      className="ml-auto text-cc-accent font-bold text-xs hover:underline uppercase tracking-cc-wider">
                      Open Gmail Drafts ↗
                    </a>
                  )}
                </div>
              )}

              <div className="space-y-2">
                {schoolsWithEmail.map(school => {
                  const s = results[school.id];
                  const to = school.coaches?.[0]?.email || '';
                  return (
                    <div key={school.id} className={`flex items-center gap-3 px-4 py-3 rounded-cc-md border transition-all ${
                      s === 'done'    ? 'bg-emerald-50 border-emerald-200' :
                      s === 'error'   ? 'bg-rose-50 border-rose-200' :
                      s === 'pending' ? 'bg-cc-accent-soft border-cc-border' :
                      s === 'skipped' ? 'bg-cc-surface-alt border-cc-border opacity-50' :
                      'bg-cc-surface border-cc-border'
                    }`}>
                      <SchoolLogo school={school} size="sm" />
                      <div className="flex-1 min-w-0">
                        <div className="font-display text-cc-fg text-sm uppercase tracking-cc-wide">{school.name}</div>
                        <div className="text-[11px] text-cc-subtle truncate">To: {to || 'No email on file'}</div>
                      </div>
                      <div className="text-[11px] font-bold flex-shrink-0 uppercase tracking-cc-wider">
                        {s === 'done'    && <span className="inline-flex items-center gap-1 text-cc-forest bg-emerald-100 px-2 py-1 rounded-full"><Check className="w-3 h-3" /> Draft Created</span>}
                        {s === 'error'   && <span className="inline-flex items-center gap-1 text-cc-maroon bg-rose-100 px-2 py-1 rounded-full"><X className="w-3 h-3" /> Error — Retry</span>}
                        {s === 'pending' && <span className="text-cc-accent bg-cc-accent-soft px-2 py-1 rounded-full flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin inline" /> Creating…</span>}
                        {s === 'skipped' && <span className="text-cc-subtle bg-cc-bg px-2 py-1 rounded-full">No Email</span>}
                        {!s && <span className="text-cc-subtle bg-cc-surface-alt px-2 py-1 rounded-full border border-cc-border">Queued</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {!isRunning && doneCount === schoolsWithEmail.length && doneCount > 0 && (
              <div className="bg-cc-grad-navy rounded-cc-lg p-6 text-white text-center border border-cc-navy-700">
                <div className="flex justify-center mb-2"><PartyPopper className="w-10 h-10 text-cc-gold" /></div>
                <div className="font-display text-3xl uppercase tracking-cc-wide mb-1">All {doneCount} drafts created</div>
                <p className="text-white/70 text-sm mb-4">Head to Gmail Drafts, personalize the [INSERT] fields in each email, then send when ready.</p>
                <a href="https://mail.google.com/mail/u/0/#drafts" target="_blank" rel="noreferrer"
                  className="inline-flex items-center gap-2 bg-white text-cc-accent px-6 py-3 rounded-cc-sm font-display text-sm uppercase tracking-cc-widest hover:bg-cc-bg transition-colors duration-cc-base">
                  <Mail className="w-4 h-4" /> Open Gmail Drafts ↗
                </a>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
