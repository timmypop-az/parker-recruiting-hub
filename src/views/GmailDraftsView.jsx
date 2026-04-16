import React, { useState } from 'react';
import { ArrowLeft, Check, Loader2, Mail, PartyPopper, ShieldCheck } from 'lucide-react';
import { FontStyle } from '../components/FontStyle.jsx';
import { SchoolLogo } from '../components/SchoolLogo.jsx';
import { buildTemplate } from '../data/emailTemplates.js';

// ─── GMAIL DRAFTS VIEW ───────────────────────────────────────────────────────

const GMAIL_CLIENT_ID = ''; // User will paste their Client ID here — see instructions

export const GmailDraftsView = ({ allSchools, onBack }) => {
  const [authToken, setAuthToken] = useState(null);
  const [clientId, setClientId] = useState('');
  const [draftPhase, setDraftPhase] = useState('intro');
  const [results, setResults] = useState({}); // schoolId -> 'pending'|'done'|'error'|'skipped'
  const [isRunning, setIsRunning] = useState(false);
  const [currentSchool, setCurrentSchool] = useState('');
  const [showSetup, setShowSetup] = useState(true);

  const schoolsWithEmail = allSchools.filter(s => s.coaches?.[0]?.email && s.coaches[0].email !== 'recruit@jessup.edu' || s.coaches?.[0]?.email);

  // Gmail OAuth via Google Identity Services (GIS)
  const signIn = () => {
    if (!clientId.trim()) { alert('Please enter your Google OAuth Client ID first.'); return; }
    const scope = 'https://www.googleapis.com/auth/gmail.compose';
    const tokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: clientId.trim(),
      scope,
      callback: (resp) => {
        if (resp.error) { alert('Auth error: ' + resp.error); return; }
        setAuthToken(resp.access_token);
        setShowSetup(false);
      },
    });
    tokenClient.requestAccessToken();
  };

  const signOut = () => { setAuthToken(null); setShowSetup(true); setResults({}); };

  const buildDraftBody = (school) => {
    const tpl = buildTemplate(draftPhase, school);
    return { subject: tpl.subject, body: tpl.body, to: school.coaches?.[0]?.email || '' };
  };

  const createDraft = async (school) => {
    const { subject, body, to } = buildDraftBody(school);
    if (!to) return 'skipped';
    // RFC 2822 message
    const message = [
      `To: ${to}`,
      `Subject: ${subject}`,
      `MIME-Version: 1.0`,
      `Content-Type: text/html; charset=utf-8`,
      ``,
      body,
    ].join('\r\n');
    const encoded = btoa(unescape(encodeURIComponent(message)))
      .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    const res = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/drafts', {
      method: 'POST',
      headers: { Authorization: `Bearer ${authToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: { raw: encoded } }),
    });
    return res.ok ? 'done' : 'error';
  };

  const runAllDrafts = async () => {
    setIsRunning(true);
    setResults({});
    for (const school of schoolsWithEmail) {
      setCurrentSchool(school.name);
      setResults(prev => ({ ...prev, [school.id]: 'pending' }));
      try {
        const status = await createDraft(school);
        setResults(prev => ({ ...prev, [school.id]: status }));
      } catch {
        setResults(prev => ({ ...prev, [school.id]: 'error' }));
      }
      await new Promise(r => setTimeout(r, 400)); // gentle rate limiting
    }
    setCurrentSchool('');
    setIsRunning(false);
  };

  const doneCount  = Object.values(results).filter(v => v === 'done').length;
  const errorCount = Object.values(results).filter(v => v === 'error').length;
  const phaseLabels = { intro: 'Phase 1 — Introductory', tournament: 'Phase 2 — Tournament Invite', video: 'Phase 3 — Highlight Video' };
  const phaseColors = { intro: 'bg-blue-600', tournament: 'bg-emerald-600', video: 'bg-purple-600' };

  return (
    <div className="min-h-screen" style={{ background: "#f1f4f9" }}>
      <FontStyle />

      {/* Load Google Identity Services */}
      <script src="https://accounts.google.com/gsi/client" async></script>

      {/* HEADER */}
      <div style={{ background: "linear-gradient(135deg, #0f172a, #1e3a5f)" }} className="px-8 py-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-8">
          <div>
            <div className="flex items-center gap-3 mb-0.5">
              <ShieldCheck className="text-blue-400 w-4 h-4" />
              <span className="text-blue-300 text-xs font-bold uppercase tracking-widest">Parker Henderson · Gmail Draft Creator</span>
            </div>
            <h1 className="font-black text-white text-3xl tracking-tight" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
              GMAIL <span className="text-blue-400">DRAFT CREATOR</span>
            </h1>
          </div>
          <button onClick={onBack} className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 px-5 py-2.5 rounded-xl text-white text-xs font-bold uppercase tracking-wide transition-all">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 pb-20 pt-8 space-y-6">

        {/* SETUP PANEL */}
        {showSetup && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-black text-sm">1</div>
              <h2 className="font-black text-slate-800 text-lg uppercase tracking-widest" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Connect Your Gmail Account</h2>
            </div>

            {/* INSTRUCTIONS */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-5 text-sm text-amber-900 leading-relaxed">
              <div className="font-black mb-2 uppercase tracking-wide text-xs">One-Time Setup Required</div>
              <ol className="space-y-1.5 list-decimal list-inside">
                <li>Go to <a href="https://console.cloud.google.com/" target="_blank" rel="noreferrer" className="text-blue-600 underline font-semibold">console.cloud.google.com</a> and sign in with <strong>parkerhenderson.setter.2028@gmail.com</strong></li>
                <li>Create a new project (call it "Recruiting Hub")</li>
                <li>Go to <strong>APIs & Services → Enable APIs</strong> → enable <strong>Gmail API</strong></li>
                <li>Go to <strong>OAuth consent screen</strong> → External → fill in app name → add your email as test user</li>
                <li>Go to <strong>Credentials → Create Credentials → OAuth 2.0 Client ID</strong></li>
                <li>Choose <strong>Web application</strong> → add <code className="bg-white px-1 rounded border border-amber-300">http://localhost</code> AND the current page URL as Authorized JavaScript Origins</li>
                <li>Copy the <strong>Client ID</strong> and paste it below</li>
              </ol>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Google OAuth Client ID</label>
                <input
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-mono text-slate-800 outline-none focus:border-blue-400 focus:bg-white transition-all"
                  placeholder="XXXXXXXXXX-xxxxxxxxxxxxxxxxxx.apps.googleusercontent.com"
                  value={clientId}
                  onChange={e => setClientId(e.target.value)}
                />
              </div>
              <button onClick={signIn}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-sm uppercase tracking-wide transition-all">
                <Mail className="w-4 h-4" /> Connect Gmail Account
              </button>
            </div>
          </div>
        )}

        {/* CONNECTED STATE */}
        {!showSetup && (
          <>
            {/* SUCCESS BANNER */}
            <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-2xl px-5 py-3">
              <Check className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <span className="text-emerald-800 font-bold text-sm">Connected to parkerhenderson.setter.2028@gmail.com</span>
              <button onClick={signOut} className="ml-auto text-xs text-slate-400 hover:text-slate-600 font-bold uppercase tracking-wide">Disconnect</button>
            </div>

            {/* PHASE SELECTOR */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-black text-sm">2</div>
                <h2 className="font-black text-slate-800 text-lg uppercase tracking-widest" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Choose Email Phase</h2>
              </div>
              <div className="flex gap-3">
                {Object.entries(phaseLabels).map(([id, label]) => (
                  <button key={id} onClick={() => setDraftPhase(id)}
                    className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm uppercase tracking-wide transition-all border ${draftPhase === id ? `${phaseColors[id]} text-white border-transparent shadow-lg` : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'}`}>
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* SCHOOL LIST + LAUNCH */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-black text-sm">3</div>
                  <div>
                    <h2 className="font-black text-slate-800 text-lg uppercase tracking-widest" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Create Drafts</h2>
                    <p className="text-xs text-slate-400 mt-0.5">{schoolsWithEmail.length} schools with coach emails · {phaseLabels[draftPhase]}</p>
                  </div>
                </div>
                <button onClick={runAllDrafts} disabled={isRunning}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl font-bold text-sm uppercase tracking-wide transition-all">
                  {isRunning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
                  {isRunning ? `Drafting ${currentSchool}…` : `Create All ${schoolsWithEmail.length} Drafts`}
                </button>
              </div>

              {/* PROGRESS SUMMARY */}
              {Object.keys(results).length > 0 && (
                <div className="flex gap-3 mb-4 p-3 bg-slate-50 rounded-xl">
                  <span className="inline-flex items-center gap-1.5 text-emerald-600 font-bold text-sm"><Check className="w-4 h-4" /> {doneCount} created</span>
                  {errorCount > 0 && <span className="inline-flex items-center gap-1.5 text-red-500 font-bold text-sm"><X className="w-4 h-4" /> {errorCount} failed</span>}
                  <span className="text-slate-400 text-sm">{Object.keys(results).length} / {schoolsWithEmail.length} processed</span>
                  {!isRunning && doneCount > 0 && (
                    <a href="https://mail.google.com/mail/u/0/#drafts" target="_blank" rel="noreferrer"
                      className="ml-auto text-blue-600 font-bold text-xs hover:underline">
                      Open Gmail Drafts ↗
                    </a>
                  )}
                </div>
              )}

              {/* SCHOOL ROWS */}
              <div className="space-y-2">
                {schoolsWithEmail.map(school => {
                  const status = results[school.id];
                  const { subject, to } = buildDraftBody(school);
                  return (
                    <div key={school.id} className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${
                      status === 'done'    ? 'bg-emerald-50 border-emerald-200' :
                      status === 'error'   ? 'bg-red-50 border-red-200' :
                      status === 'pending' ? 'bg-blue-50 border-blue-200' :
                      status === 'skipped' ? 'bg-slate-50 border-slate-200 opacity-50' :
                      'bg-white border-slate-100'
                    }`}>
                      <SchoolLogo school={school} size="sm" />
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-slate-800 text-sm">{school.name}</div>
                        <div className="text-[11px] text-slate-400 truncate">To: {to || 'No email on file'}</div>
                      </div>
                      <div className="text-[10px] font-bold px-2 py-1 rounded-full flex-shrink-0 uppercase tracking-wide">
                        {status === 'done'    && <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-100 px-2 py-1 rounded-full"><Check className="w-3 h-3" /> Draft Created</span>}
                        {status === 'error'   && <span className="inline-flex items-center gap-1 text-red-600 bg-red-100 px-2 py-1 rounded-full"><X className="w-3 h-3" /> Error — Retry</span>}
                        {status === 'pending' && <span className="text-blue-600 bg-blue-100 px-2 py-1 rounded-full flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin inline" /> Creating…</span>}
                        {status === 'skipped' && <span className="text-slate-500 bg-slate-100 px-2 py-1 rounded-full">No Email</span>}
                        {!status && <span className="text-slate-300 bg-slate-50 px-2 py-1 rounded-full border border-slate-200">Queued</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* DONE STATE */}
            {!isRunning && doneCount === schoolsWithEmail.length && doneCount > 0 && (
              <div className="bg-emerald-600 rounded-2xl p-6 text-white text-center">
                <div className="flex justify-center mb-2"><PartyPopper className="w-10 h-10" /></div>
                <div className="font-black text-2xl mb-1" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>ALL {doneCount} DRAFTS CREATED!</div>
                <p className="text-emerald-100 text-sm mb-4">Head to Gmail Drafts, personalize the [INSERT] fields in each email, then send when ready.</p>
                <a href="https://mail.google.com/mail/u/0/#drafts" target="_blank" rel="noreferrer"
                  className="inline-flex items-center gap-2 bg-white text-emerald-700 px-6 py-3 rounded-xl font-bold text-sm uppercase tracking-wide hover:bg-emerald-50 transition-all">
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
