import React, { useState } from 'react';
import { ArrowLeft, Calendar, Check, CheckCircle2, ClipboardList, Copy, FileText, Inbox, Mail, Phone, Target, Trophy, Video } from 'lucide-react';
import { buildTemplate, COLOR_MAP } from '../data/emailTemplates.js';

export const EmailTemplatesView = ({ school, onBack }) => {
  const [activeTab, setActiveTab] = useState('intro');
  const [copied, setCopied] = useState('');
  const [editedSubjects, setEditedSubjects] = useState({});
  const [editedBodies, setEditedBodies] = useState({});
  const tIds = ['intro', 'tournament', 'video'];

  const getSubject = (id) => editedSubjects[id] ?? buildTemplate(id, school).subject;
  const getBody    = (id) => editedBodies[id]   ?? buildTemplate(id, school).body;

  const copy = (text, key) => {
    navigator.clipboard.writeText(text).then(() => { setCopied(key); setTimeout(() => setCopied(''), 2000); });
  };

  const tpl = buildTemplate(activeTab, school);
  const colors = COLOR_MAP[tpl.color];

  return (
    <div className="px-4 sm:px-6 lg:px-10 py-6 lg:py-8 max-w-5xl">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-6">
        <div>
          <div className="text-[11px] font-bold text-cc-subtle uppercase tracking-cc-widest flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-cc-gold" />
            Outreach Templates{school ? ` · ${school.name}` : ''}
          </div>
          <h1 className="font-display text-cc-fg text-cc-h2 leading-none mt-1 uppercase tracking-cc-wide">
            Coach Outreach <span className="text-cc-accent">Email Templates</span>
          </h1>
          <p className="text-cc-muted text-cc-body mt-1">Pre-filled, personalized, copy-ready — three phases of coach outreach.</p>
        </div>
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 bg-cc-surface hover:bg-cc-bg border border-cc-border px-4 py-2 rounded-cc-sm text-cc-fg text-xs font-bold uppercase tracking-cc-wider transition-colors self-start"
        >
          <ArrowLeft className="w-4 h-4" /> {school ? school.name : 'Schools'}
        </button>
      </div>

      {/* STRATEGY BANNER */}
      <div className="rounded-cc-lg mb-6 p-6 border border-cc-border bg-cc-accent-soft">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-cc-md bg-cc-accent flex items-center justify-center flex-shrink-0">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-display text-cc-accent text-xl uppercase tracking-cc-wide mb-1">3-Phase Outreach Strategy</div>
            <p className="text-cc-fg text-sm leading-relaxed mb-3">
              Coaches receive hundreds of emails. Consistent, personalized outreach across all three phases dramatically increases visibility.
              {school ? ` These templates are pre-filled for ${school.name}${school.coaches?.[0]?.name ? ` — Coach ${school.coaches[0].name.split(' ').slice(-1)[0]}` : ''}.` : ' Select a school from the dashboard to auto-fill coach names.'}
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                { Icon: Mail,   text: 'Phase 1: Introduce → get on radar' },
                { Icon: Trophy, text: 'Phase 2: Tournament invite → live eval' },
                { Icon: Video,  text: 'Phase 3: New video → show growth' },
              ].map(({ Icon, text }, i) => (
                <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1 bg-cc-surface text-cc-accent text-xs font-semibold rounded-full border border-cc-border"><Icon className="w-3.5 h-3.5" /> {text}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* TAB SWITCHER */}
      <div className="flex gap-3 mb-6">
        {tIds.map(id => {
          const t = buildTemplate(id, school);
          const c = COLOR_MAP[t.color];
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex-1 py-3 px-4 rounded-cc-sm font-display text-sm uppercase tracking-cc-widest transition-colors duration-cc-base border ${
                isActive
                  ? `${c.badge} text-white border-transparent shadow-cc-card`
                  : 'bg-cc-surface text-cc-fg border-cc-border hover:bg-cc-bg'
              }`}
            >
              <div className="text-[11px] opacity-80 mb-0.5">{t.phase}</div>
              {t.label}
            </button>
          );
        })}
      </div>

      {/* ACTIVE TEMPLATE CARD */}
      <div className="bg-cc-surface rounded-cc-lg shadow-cc-card border border-cc-border overflow-hidden">
        <div className={`px-6 py-3 flex items-center gap-2 text-sm font-semibold border-b border-cc-border ${colors.light}`}>
          <span className="inline-flex items-center">{tpl.icon === 'mail' ? <Mail className="w-5 h-5" /> : tpl.icon === 'send' ? <Trophy className="w-5 h-5" /> : <Video className="w-5 h-5" />}</span>
          <span>{tpl.tip}</span>
          {school?.coaches?.[0]?.email && (
            <span className="ml-auto text-xs font-normal opacity-75">Send to: <strong>{school.coaches[0].email}</strong></span>
          )}
        </div>
        <div className="p-6 space-y-5">
          {/* SUBJECT */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[11px] font-bold text-cc-subtle uppercase tracking-cc-widest">Subject Line</label>
              <button
                onClick={() => copy(getSubject(activeTab), `subj-${activeTab}`)}
                className="flex items-center gap-1.5 text-[11px] font-bold text-cc-muted hover:text-cc-accent px-2 py-1 rounded-cc-sm hover:bg-cc-accent-soft transition-colors"
              >
                {copied === `subj-${activeTab}` ? <Check className="w-3 h-3 text-cc-success" /> : <Copy className="w-3 h-3" />}
                {copied === `subj-${activeTab}` ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <input
              className="w-full bg-cc-surface-alt border border-cc-border rounded-cc-md px-4 py-3 text-sm font-semibold text-cc-fg focus:outline-none focus:ring-2 focus:ring-cc-focus focus:border-transparent focus:bg-cc-surface transition-all"
              value={getSubject(activeTab)}
              onChange={e => setEditedSubjects(prev => ({ ...prev, [activeTab]: e.target.value }))}
            />
          </div>
          {/* BODY */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[11px] font-bold text-cc-subtle uppercase tracking-cc-widest">Email Body</label>
              <button
                onClick={() => copy(getBody(activeTab), `body-${activeTab}`)}
                className="flex items-center gap-1.5 text-[11px] font-bold text-cc-muted hover:text-cc-accent px-2 py-1 rounded-cc-sm hover:bg-cc-accent-soft transition-colors"
              >
                {copied === `body-${activeTab}` ? <Check className="w-3 h-3 text-cc-success" /> : <Copy className="w-3 h-3" />}
                {copied === `body-${activeTab}` ? 'Copied!' : 'Copy Body'}
              </button>
            </div>
            <textarea
              className="w-full bg-cc-surface-alt border border-cc-border rounded-cc-md px-4 py-4 text-sm text-cc-fg focus:outline-none focus:ring-2 focus:ring-cc-focus focus:border-transparent focus:bg-cc-surface transition-all resize-none leading-relaxed font-mono"
              style={{ minHeight: '420px' }}
              value={getBody(activeTab)}
              onChange={e => setEditedBodies(prev => ({ ...prev, [activeTab]: e.target.value }))}
            />
          </div>
          {/* ACTIONS */}
          <div className="flex flex-wrap gap-3 pt-2 border-t border-cc-border">
            <button
              onClick={() => copy(`Subject: ${getSubject(activeTab)}\n\n${getBody(activeTab)}`, `all-${activeTab}`)}
              className={`flex items-center gap-2 px-6 py-3 rounded-cc-sm font-display text-sm uppercase tracking-cc-widest transition-colors duration-cc-base ${colors.btn}`}
            >
              {copied === `all-${activeTab}` ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied === `all-${activeTab}` ? 'Copied!' : 'Copy Full Email'}
            </button>
            {school?.coaches?.[0]?.email && (
              <a
                href={`mailto:${school.coaches[0].email}?subject=${encodeURIComponent(getSubject(activeTab))}&body=${encodeURIComponent(getBody(activeTab))}`}
                className="flex items-center gap-2 px-6 py-3 rounded-cc-sm font-display text-sm uppercase tracking-cc-widest bg-cc-fg hover:bg-cc-accent text-white transition-colors duration-cc-base"
              >
                <Mail className="w-4 h-4" /> Open in Mail App
              </a>
            )}
            <button
              onClick={() => {
                setEditedSubjects(p => { const n = { ...p }; delete n[activeTab]; return n; });
                setEditedBodies(p => { const n = { ...p }; delete n[activeTab]; return n; });
              }}
              className="flex items-center gap-2 px-4 py-3 rounded-cc-sm font-bold text-sm text-cc-muted hover:text-cc-fg hover:bg-cc-bg transition-colors"
            >
              Reset to Default
            </button>
          </div>
        </div>
      </div>

      {/* QUICK REF */}
      <div className="mt-8">
        <h3 className="font-display text-cc-fg text-lg uppercase tracking-cc-wide mb-4">Quick Reference — All 3 Phases</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {tIds.map(id => {
            const t = buildTemplate(id, school);
            const c = COLOR_MAP[t.color];
            return (
              <div key={id} className={`rounded-cc-lg border p-5 ${c.light}`}>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full text-white ${c.badge} inline-block mb-2 uppercase tracking-cc-wider`}>{t.phase}</span>
                <div className="font-display text-cc-fg text-base uppercase tracking-cc-wide mb-2">{t.label}</div>
                <div className="text-xs text-cc-muted leading-relaxed mb-3">{t.tip}</div>
                <button
                  onClick={() => setActiveTab(id)}
                  className={`w-full py-2 rounded-cc-sm text-xs font-bold uppercase tracking-cc-wider border transition-colors ${
                    activeTab === id ? `${c.badge} text-white border-transparent` : 'bg-cc-surface text-cc-fg border-cc-border hover:bg-cc-bg'
                  }`}
                >
                  {activeTab === id ? (<span className="inline-flex items-center gap-1.5"><Check className="w-3.5 h-3.5" /> Currently Viewing</span>) : 'View Template'}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* PRO TIPS — dark navy panel */}
      <div className="mt-8 bg-cc-grad-navy rounded-cc-lg p-6 text-white border border-cc-navy-700">
        <div className="flex items-center gap-2 font-display text-white text-xl mb-4 uppercase tracking-cc-wide">
          <ClipboardList className="w-5 h-5 text-cc-gold" /> Outreach Pro Tips
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-white/80 leading-relaxed">
          {[
            { Icon: Inbox,        tip: 'Always fill in ALL bracketed fields before sending. Sending a template with "[INSERT]" still in it is worse than not sending at all.' },
            { Icon: Target,       tip: "Personalize Phase 1 with one specific fact about the program — a recent win, a coach's style, or a specific major you researched." },
            { Icon: Calendar,     tip: 'Send Phase 2 exactly 7–10 days before the tournament, not the night before. Coaches plan travel in advance.' },
            { Icon: Video,        tip: 'For Phase 3, mention one specific skill you have improved. Vague follow-ups get ignored. Specific growth stories get responses.' },
            { Icon: CheckCircle2, tip: 'Log every email in the Interaction Log on each school detail page to keep your pipeline status current.' },
            { Icon: Phone,        tip: 'If a coach responds, move immediately to a phone/video call. Rapid responsiveness signals high character.' },
          ].map(({ Icon, tip }, i) => (
            <div key={i} className="flex gap-3 p-3 bg-white/5 rounded-cc-md border border-white/10">
              <Icon className="w-5 h-5 flex-shrink-0 text-cc-gold mt-0.5" />
              <span>{tip}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
