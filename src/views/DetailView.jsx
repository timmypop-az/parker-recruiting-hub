import React, { useState } from 'react';
import {
  Send, Mail, ArrowLeft, Trophy, MapPin, TrendingUp,
  GraduationCap, Briefcase, Plane, Church, Zap, Users, Circle,
  BookOpen, Instagram, Check, ShieldCheck, Loader2, Trash2, AlertTriangle,
} from 'lucide-react';
import { SchoolLogo } from '../components/SchoolLogo.jsx';
import { CoachCard } from '../components/CoachCard.jsx';
import { ExecutiveSummary } from '../components/ExecutiveSummary.jsx';
import { DivBadge, PriorityBadge, StatusBadge } from '../components/Badges.jsx';
import { STATUSES } from '../data/constants.js';
import { getTrend, getRecordTally } from '../lib/helpers.js';
import { useApp } from '../context/AppContext.jsx';

const SECTION_CARD = 'bg-cc-surface rounded-cc-lg shadow-cc-card border border-cc-border';
const SECTION_HEADING = 'font-display text-cc-fg text-lg uppercase tracking-cc-wide';

function PipelineStepper({ schoolStatus, statusIdx, setStatuses, schoolId }) {
  return (
    <section className={`${SECTION_CARD} p-5 sm:p-6`}>
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-cc-accent" />
          <h3 className={SECTION_HEADING}>Recruiting Pipeline</h3>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-[11px] font-bold uppercase tracking-cc-widest text-cc-faint">Current Stage</span>
          <StatusBadge statusKey={schoolStatus} />
        </div>
      </div>

      {/* Progress bar (visual only) */}
      <div className="relative mb-4">
        <div className="h-1.5 rounded-full bg-cc-bg overflow-hidden">
          <div
            className="h-full rounded-full bg-cc-accent transition-all duration-cc-base"
            style={{
              width: `${Math.max(0, statusIdx) / (STATUSES.length - 1) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Stage buttons */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
        {STATUSES.map((s, i) => {
          const active   = i === statusIdx;
          const complete = i < statusIdx;
          return (
            <button
              key={s.key}
              onClick={() => setStatuses(prev => ({ ...prev, [schoolId]: s.key }))}
              className={`relative py-3 px-2 rounded-cc-md text-[11px] font-bold uppercase tracking-cc-wider transition-colors duration-cc-base border text-center ${
                active
                  ? 'border-cc-accent bg-cc-accent text-white shadow-cc-card'
                  : complete
                  ? 'border-cc-accent-soft bg-cc-accent-soft text-cc-accent'
                  : 'border-cc-border bg-cc-surface text-cc-subtle hover:border-cc-border-strong hover:text-cc-fg'
              }`}
            >
              <div className="flex flex-col items-center gap-1">
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-display tracking-cc-wide ${
                    active
                      ? 'bg-white text-cc-accent'
                      : complete
                      ? 'bg-cc-accent text-white'
                      : 'bg-cc-bg text-cc-faint'
                  }`}
                >
                  {complete ? <Check className="w-3 h-3" /> : i + 1}
                </span>
                <span className="leading-tight">{s.label}</span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}

export function DetailView() {
  const {
    sel, statuses, setStatuses, notes, setNotes, logs,
    logDate, setLogDate, logType, setLogType,
    addLog, deleteLogEntry, goBack, goEmail, goGmail,
    reVerifyCoach, deleteSchool, coachOverrides,
  } = useApp();
  const [verifying, setVerifying] = useState(false);
  const [verifyMsg, setVerifyMsg] = useState(null);
  if (!sel) return null;

  const schoolStatus = statuses[sel.id] || 'None';
  const statusIdx = STATUSES.findIndex(s => s.key === schoolStatus);
  const trend = getTrend(sel.winHistory);
  const schoolNotes = notes[sel.id] || sel.notes || '';
  const overriddenCoach = coachOverrides?.[sel.id];

  const handleReVerify = async () => {
    if (!sel.vbUrl || sel.vbUrl === '#') {
      setVerifyMsg({ kind: 'err', text: 'No volleyball URL set for this school.' });
      return;
    }
    setVerifying(true);
    setVerifyMsg(null);
    try {
      const rec = await reVerifyCoach(sel.id, sel.vbUrl);
      setVerifyMsg({
        kind: 'ok',
        text: rec._titleConfirmed
          ? `Verified: ${rec.name || rec.email} (Head Coach confirmed on page).`
          : `Updated to first listed coach: ${rec.name || rec.email} (no explicit "Head Coach" label found).`,
      });
    } catch (err) {
      setVerifyMsg({ kind: 'err', text: err.message || 'Verification failed.' });
    } finally {
      setVerifying(false);
    }
  };

  const handleDelete = () => {
    if (!window.confirm(`Permanently remove ${sel.name} from the hub?\n\nYour notes, logs, and status for this school will remain saved — if you re-add the school later, they'll reconnect by id. To just hide it instead, use the ⋯ menu on the schools list.`)) return;
    const id = sel.id;
    deleteSchool(id);
    goBack();
  };

  return (
    <div className="px-4 sm:px-6 lg:px-10 py-6 lg:py-8">

      {/* PAGE HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
        <button
          onClick={goBack}
          className="inline-flex items-center gap-2 text-cc-subtle hover:text-cc-fg text-xs font-bold uppercase tracking-cc-wider transition-colors self-start"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Schools
        </button>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleReVerify}
            disabled={verifying}
            title="Re-fetch the head coach from this school's own volleyball page"
            className="flex items-center gap-2 bg-cc-surface hover:bg-cc-bg border border-cc-border px-4 py-2 rounded-cc-sm text-cc-fg text-xs font-bold uppercase tracking-cc-wider transition-colors disabled:opacity-60"
          >
            {verifying ? <Loader2 className="w-4 h-4 animate-spin text-cc-accent" /> : <ShieldCheck className="w-4 h-4 text-cc-success" />}
            Re-verify Coach
          </button>
          <button
            onClick={() => goEmail(sel)}
            className="flex items-center gap-2 bg-cc-surface hover:bg-cc-bg border border-cc-border px-4 py-2 rounded-cc-sm text-cc-fg text-xs font-bold uppercase tracking-cc-wider transition-colors"
          >
            <Mail className="w-4 h-4 text-cc-light-blue" /> Email Templates
          </button>
          <button
            onClick={goGmail}
            className="flex items-center gap-2 bg-cc-accent hover:bg-cc-accent hover:opacity-90 px-4 py-2 rounded-cc-sm text-white text-xs font-bold uppercase tracking-cc-wider transition-colors shadow-cc-card"
          >
            <Send className="w-4 h-4" /> Gmail Drafts
          </button>
          <button
            onClick={handleDelete}
            title="Remove this school from the hub"
            className="flex items-center gap-2 bg-cc-surface hover:bg-rose-50 border border-cc-border hover:border-rose-200 px-3 py-2 rounded-cc-sm text-cc-subtle hover:text-cc-danger text-xs font-bold uppercase tracking-cc-wider transition-colors"
            aria-label="Delete school"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      {verifyMsg && (
        <div
          className={`mb-4 flex items-start gap-2 px-4 py-3 rounded-cc-md border text-sm ${
            verifyMsg.kind === 'ok'
              ? 'bg-emerald-50 border-emerald-200 text-cc-forest'
              : 'bg-rose-50 border-rose-200 text-cc-maroon'
          }`}
        >
          {verifyMsg.kind === 'ok' ? (
            <ShieldCheck className="w-4 h-4 flex-shrink-0 mt-0.5" />
          ) : (
            <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          )}
          <span className="leading-snug">{verifyMsg.text}</span>
        </div>
      )}
      {overriddenCoach?._verified && !verifyMsg && (
        <div className="mb-4 flex items-start gap-2 px-4 py-2 rounded-cc-md bg-emerald-50 border border-emerald-200 text-cc-forest text-xs">
          <ShieldCheck className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
          <span>
            Coach re-verified from <a href={overriddenCoach._sourceUrl} target="_blank" rel="noreferrer" className="underline hover:no-underline">the school's coaches page</a>
            {overriddenCoach._titleConfirmed ? ' — "Head Coach" title confirmed.' : ' — fell back to first listed coach.'}
          </span>
        </div>
      )}

      {/* EXECUTIVE SUMMARY */}
      <ExecutiveSummary school={sel} />

      {/* SCHOOL IDENTITY STRIP */}
      <div className={`${SECTION_CARD} p-5 sm:p-6 mb-6`}>
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <SchoolLogo school={sel} size="lg" />
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2.5 mb-1">
              <h2 className="font-display text-cc-fg text-3xl sm:text-4xl uppercase tracking-cc-wide leading-none">
                {sel.name}
              </h2>
              <DivBadge divLevel={sel.divLevel} size="lg" />
              <PriorityBadge priority={sel.priority} />
              {sel.programRank && sel.programRank !== 'NR' && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-50 border border-amber-200 rounded-full text-xs font-bold text-cc-warning">
                  <Trophy className="w-3 h-3 text-cc-gold" /> AVCA {sel.programRank}
                </span>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-cc-muted">
              <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {sel.city}, {sel.state}</span>
              <span className="font-semibold text-cc-fg">{sel.conference} Conference</span>
              <a href={sel.url} target="_blank" rel="noreferrer" className="text-cc-light-blue hover:text-cc-accent hover:underline">
                University Site ↗
              </a>
              {sel.vbUrl && sel.vbUrl !== '#' && (
                <a href={sel.vbUrl} target="_blank" rel="noreferrer" className="text-cc-light-blue hover:text-cc-accent hover:underline">
                  VB Program ↗
                </a>
              )}
            </div>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            {[
              { label: 'Acceptance', value: sel.acceptance || '—' },
              { label: 'Setter Need', value: sel.setterNeed || '—' },
              {
                label: 'Trend',
                value: trend === 'up' ? '↑ Up' : trend === 'down' ? '↓ Down' : '→ Flat',
                color: trend === 'up' ? 'text-cc-success' : trend === 'down' ? 'text-cc-danger' : 'text-cc-subtle',
              },
            ].map((item, i) => (
              <div key={i} className="text-center bg-cc-surface-alt rounded-cc-md px-4 py-3 min-w-20">
                <div className={`display-num text-xl leading-none tabular ${item.color || 'text-cc-fg'}`}>
                  {item.value}
                </div>
                <div className="text-[11px] text-cc-subtle uppercase tracking-cc-wider mt-0.5 font-semibold">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* PIPELINE STEPPER */}
      <div className="mb-6">
        <PipelineStepper
          schoolStatus={schoolStatus}
          statusIdx={statusIdx}
          setStatuses={setStatuses}
          schoolId={sel.id}
        />
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* LEFT COLUMN */}
        <div className="lg:col-span-4 space-y-6">

          {/* Academic Profile */}
          <div className={`${SECTION_CARD} p-6`}>
            <div className="flex items-center gap-2 mb-4">
              <GraduationCap className="w-4 h-4 text-cc-accent" />
              <h3 className={SECTION_HEADING}>Academic Fit</h3>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-cc-surface-alt rounded-cc-md p-3 text-center">
                <div className="display-num text-xl text-cc-fg tabular">
                  {sel.academic?.avgGPA || '—'}
                </div>
                <div className="text-[11px] text-cc-subtle uppercase tracking-cc-wider font-semibold">Avg Team GPA</div>
              </div>
              <div className="bg-cc-surface-alt rounded-cc-md p-3 text-center">
                <div className="display-num text-xl text-cc-fg tabular">
                  {sel.academic?.gradRate || '—'}
                </div>
                <div className="text-[11px] text-cc-subtle uppercase tracking-cc-wider font-semibold">Grad Rate</div>
              </div>
            </div>
            {(sel.academic?.top10?.length > 0) && (
              <div className="mb-3">
                <div className="text-[11px] font-bold text-cc-subtle uppercase tracking-cc-widest mb-2">Top Programs</div>
                <div className="flex flex-wrap gap-1.5">
                  {sel.academic.top10.map((m, i) => (
                    <span key={i} className="px-2.5 py-1 bg-cc-accent-soft text-cc-accent rounded-full text-[11px] font-semibold">
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <div className="space-y-2 text-xs">
              {[
                { label: 'Business', value: sel.academic?.business, Icon: Briefcase },
                { label: 'Aviation', value: sel.academic?.aviation, Icon: Plane },
                { label: 'Faith/Theology', value: sel.academic?.theology, Icon: Church },
              ].map(row => {
                if (!row.value || row.value === '—' || row.value === 'N/A') return null;
                const Icon = row.Icon;
                return (
                  <div key={row.label} className="flex gap-2 p-2 bg-cc-surface-alt rounded-cc-sm">
                    <Icon className="flex-shrink-0 w-4 h-4 text-cc-subtle mt-0.5" />
                    <div>
                      <div className="font-bold text-cc-muted text-[11px] uppercase tracking-cc-wider">{row.label}</div>
                      <div className="text-cc-fg text-xs">{row.value}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* AZ Radar */}
          {(sel.azRadar?.length > 0) && (
            <div className={`${SECTION_CARD} p-6`}>
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-4 h-4 text-cc-orange" />
                <h3 className={SECTION_HEADING}>AZ Radar</h3>
              </div>
              <div className="space-y-2">
                {sel.azRadar.map((p, i) => (
                  <div
                    key={i}
                    className={`p-3 rounded-cc-md border-l-4 ${
                      p.hs?.includes('Brophy') ? 'border-cc-accent bg-cc-accent-soft' : 'border-cc-orange bg-orange-50/60'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-display text-cc-fg text-sm uppercase tracking-cc-wide">{p.name}</span>
                      <span className="text-[11px] bg-cc-surface border border-cc-border px-2 py-0.5 rounded-cc-sm font-bold text-cc-muted">
                        {p.pos}
                      </span>
                    </div>
                    <span
                      className={`text-[11px] font-semibold ${
                        p.hs?.includes('Brophy') ? 'text-cc-accent' : 'text-cc-orange'
                      }`}
                    >
                      {p.hs}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Setter Depth */}
          {(sel.setters?.length > 0) && (
            <div className={`${SECTION_CARD} p-6`}>
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-4 h-4 text-cc-accent" />
                <h3 className={SECTION_HEADING}>Setter Depth Chart</h3>
              </div>
              <div className="space-y-2">
                {sel.setters.map((s, i) => (
                  <div key={i} className="p-3 bg-cc-surface-alt rounded-cc-md flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-cc-fg text-sm">{s.name}</span>
                      <span className="ml-2 text-[11px] text-cc-subtle uppercase tracking-cc-wider font-semibold">{s.class || ''}</span>
                    </div>
                    <span className="text-[11px] bg-cc-bg text-cc-muted font-bold px-2.5 py-1 rounded-full">
                      Grad {s.grad}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-3 rounded-cc-md border border-dashed border-cc-border bg-cc-surface-alt/60">
                <div className="text-[11px] font-bold text-cc-subtle uppercase tracking-cc-wider mb-1">
                  Class of 2028 Opening
                </div>
                <div
                  className={`flex items-center gap-2 text-sm font-bold ${
                    sel.setterNeed === 'High'
                      ? 'text-cc-success'
                      : sel.setterNeed === 'Med'
                      ? 'text-cc-warning'
                      : 'text-cc-danger'
                  }`}
                >
                  <Circle
                    className={`w-2.5 h-2.5 flex-shrink-0 ${
                      sel.setterNeed === 'High'
                        ? 'fill-emerald-500 text-emerald-500'
                        : sel.setterNeed === 'Med'
                        ? 'fill-amber-500 text-amber-500'
                        : 'fill-rose-500 text-rose-500'
                    }`}
                  />
                  {sel.setterNeed === 'High'
                    ? 'Strong — multiple roster spots likely open'
                    : sel.setterNeed === 'Med'
                    ? 'Moderate — 1 spot likely available'
                    : 'Limited — roster appears full through 2028'}
                </div>
              </div>
            </div>
          )}

          {/* Personal Notes */}
          <div className={`${SECTION_CARD} p-6`}>
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="w-4 h-4 text-cc-subtle" />
              <h3 className={SECTION_HEADING}>My Notes</h3>
            </div>
            <textarea
              className="w-full bg-cc-surface-alt border border-cc-border rounded-cc-md p-3 text-sm text-cc-fg resize-none focus:outline-none focus:ring-2 focus:ring-cc-focus focus:border-transparent h-24"
              placeholder="Add personal notes about this program…"
              value={schoolNotes}
              onChange={e => setNotes(prev => ({ ...prev, [sel.id]: e.target.value }))}
            />
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="lg:col-span-8 space-y-6">

          {/* Outreach Console */}
          <div className={`${SECTION_CARD} p-6`}>
            <h3 className={`${SECTION_HEADING} mb-5`}>Outreach Console</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-3">
                {sel.questionnaireUrl && sel.questionnaireUrl !== '#' && (
                  <a
                    href={sel.questionnaireUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 py-4 rounded-cc-sm bg-cc-accent text-white text-sm font-display uppercase tracking-cc-widest hover:bg-cc-accent hover:opacity-90 transition-colors duration-cc-base"
                  >
                    Fill Questionnaire ↗
                  </a>
                )}
                {sel.programIG && sel.programIG !== '#' && (
                  <div className="flex items-center justify-between p-3.5 bg-cc-surface-alt rounded-cc-md border border-cc-border">
                    <div className="flex items-center gap-2">
                      <Instagram className="w-4 h-4 text-cc-orange" />
                      <span className="text-xs font-bold text-cc-muted uppercase tracking-cc-wider">Team IG</span>
                    </div>
                    <span className="text-sm font-semibold text-cc-fg">{sel.programIG}</span>
                  </div>
                )}
                {sel.coaches?.map((c, i) => (
                  <CoachCard key={i} coach={c} schoolId={sel.id} />
                ))}
              </div>

              {/* Interaction Log — dark navy panel */}
              <div className="bg-cc-grad-navy rounded-cc-lg p-5 text-white border border-cc-navy-700">
                <div className="text-[11px] font-bold text-cc-gold uppercase tracking-cc-widest mb-4">
                  Interaction Log
                </div>
                <input
                  type="date"
                  className="w-full bg-white/10 rounded-cc-md p-3 text-sm text-white mb-3 border border-white/20 focus:outline-none focus:ring-2 focus:ring-cc-gold/40 focus:bg-white/20"
                  value={logDate}
                  onChange={e => setLogDate(e.target.value)}
                />
                <select
                  className="w-full bg-white/10 rounded-cc-md p-3 text-sm text-white mb-3 border border-white/20 focus:outline-none focus:ring-2 focus:ring-cc-gold/40"
                  value={logType}
                  onChange={e => setLogType(e.target.value)}
                >
                  <option>Submitted Questionnaire</option>
                  <option>Email / DM Sent</option>
                  <option>Coach Responded</option>
                  <option>Phone / Video Call</option>
                  <option>Campus Visit</option>
                  <option>Verbal Offer</option>
                  <option>Tournament — Coach Watched</option>
                  <option>Camp / Clinic Attended</option>
                </select>
                <button
                  onClick={addLog}
                  className="w-full py-3 bg-white text-cc-accent rounded-cc-sm font-display text-sm uppercase tracking-cc-widest hover:bg-cc-bg transition-colors duration-cc-base"
                >
                  Log + Update Status
                </button>
                <div className="mt-4 space-y-2 max-h-40 overflow-y-auto">
                  {(logs[sel.id] || []).map((entry, i) => (
                    <div
                      key={i}
                      className="group flex items-center gap-2 text-[11px] text-white/60 border-t border-white/10 pt-2"
                    >
                      <span className="font-semibold text-white/85 flex-1 min-w-0 truncate">{entry.type}</span>
                      <span className="flex-shrink-0">{entry.date}</span>
                      <button
                        onClick={() => {
                          if (window.confirm(`Remove "${entry.type}" on ${entry.date}?`)) {
                            deleteLogEntry(sel.id, i);
                          }
                        }}
                        className="flex-shrink-0 opacity-0 group-hover:opacity-100 focus:opacity-100 p-1 rounded-cc-sm hover:bg-white/10 text-white/60 hover:text-rose-300 transition-all"
                        title="Delete this log entry"
                        aria-label="Delete log entry"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  {!(logs[sel.id]?.length) && (
                    <p className="text-[11px] text-white/50 italic">No interactions logged yet.</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Program Stats */}
          <div className="grid grid-cols-2 gap-4">
            {[
              {
                label: 'Program Ranking',
                value: sel.programRank || 'NR',
                sub: 'AVCA Preseason',
                icon: <Trophy className="w-4 h-4 text-cc-gold" />,
              },
              {
                label: '2025 Record',
                value: sel.winHistory?.[0] ? `${sel.winHistory[0].w}–${sel.winHistory[0].l}` : 'N/A',
                sub: sel.winHistory?.[0]?.p ? `${sel.winHistory[0].p} win%` : '',
                icon: <TrendingUp className="w-4 h-4 text-cc-success" />,
              },
            ].map((item, i) => (
              <div key={i} className={`${SECTION_CARD} p-4 text-center`}>
                <div className="flex justify-center mb-2">{item.icon}</div>
                <div className="display-num text-3xl text-cc-fg leading-none tabular">
                  {item.value}
                </div>
                <div className="text-[11px] text-cc-subtle uppercase tracking-cc-wider mt-1 font-semibold">{item.label}</div>
                {item.sub && <div className="text-[11px] text-cc-faint mt-0.5">{item.sub}</div>}
              </div>
            ))}
          </div>

          {/* Season Schedule */}
          {sel.schedule26?.length > 0 && (
            <div className={`${SECTION_CARD} p-6`}>
              <div className="flex items-center justify-between mb-2">
                <h3 className={SECTION_HEADING}>2026 Season Schedule</h3>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1.5 bg-emerald-50 text-cc-forest border border-emerald-200 rounded-cc-sm text-xs font-bold tabular">
                    W {getRecordTally(sel.schedule26).w}
                  </span>
                  <span className="text-cc-faint font-bold">–</span>
                  <span className="px-3 py-1.5 bg-rose-50 text-cc-maroon border border-rose-200 rounded-cc-sm text-xs font-bold tabular">
                    L {getRecordTally(sel.schedule26).l}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-4 mb-4 text-[11px] text-cc-subtle font-semibold uppercase tracking-cc-wider">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-cc-light-blue inline-block" /> Home</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-cc-faint inline-block" /> Away</span>
                <span className="flex items-center gap-1"><span className="px-1.5 py-0.5 bg-purple-50 text-cc-purple rounded-cc-sm font-bold text-[10px]">CONF</span> Conference</span>
                <span className="flex items-center gap-1"><span className="px-1.5 py-0.5 bg-amber-50 text-cc-warning rounded-cc-sm font-bold text-[10px]">POST</span> Postseason</span>
              </div>
              <div className="space-y-1.5 max-h-[32rem] overflow-y-auto pr-1">
                {sel.schedule26.map((g, i) => {
                  const isUpcoming = g.r === 'Upcoming';
                  const isWin = g.r?.startsWith('W');
                  const isLoss = g.r?.startsWith('L');
                  const isConf = /MPSF|MIVA|PacWest|Big West|EIVA|GSAC|GLVC|PCAC|Cal Pac/i.test(g.o);
                  const isPost = /tournament|championship|ncaa|final/i.test(g.o);
                  return (
                    <div
                      key={i}
                      className={`flex items-center gap-3 px-4 py-2.5 rounded-cc-md border transition-all ${
                        isUpcoming
                          ? 'bg-cc-surface-alt/70 border-cc-border opacity-60'
                          : isWin
                          ? 'bg-emerald-50/40 border-emerald-100'
                          : isLoss
                          ? 'bg-rose-50/30 border-rose-100'
                          : 'bg-cc-surface border-cc-border'
                      }`}
                    >
                      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${g.home ? 'bg-cc-light-blue' : 'bg-cc-faint'}`} />
                      <span className="text-[11px] font-bold text-cc-subtle w-12 flex-shrink-0">{g.d}</span>
                      <span className={`text-sm flex-1 font-semibold ${isUpcoming ? 'text-cc-subtle' : 'text-cc-fg'}`}>
                        {g.o}
                      </span>
                      {isPost && (
                        <span className="px-1.5 py-0.5 bg-amber-50 text-cc-warning border border-amber-200 rounded-cc-sm text-[10px] font-bold uppercase flex-shrink-0">
                          Post
                        </span>
                      )}
                      {isConf && !isPost && (
                        <span className="px-1.5 py-0.5 bg-purple-50 text-cc-purple border border-purple-200 rounded-cc-sm text-[10px] font-bold uppercase flex-shrink-0">
                          Conf
                        </span>
                      )}
                      <span
                        className={`text-xs font-bold w-20 text-right flex-shrink-0 tabular ${
                          isUpcoming ? 'text-cc-faint' : isWin ? 'text-cc-success' : isLoss ? 'text-cc-danger' : 'text-cc-faint'
                        }`}
                      >
                        {g.r}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Historical Stability */}
          {sel.winHistory?.length > 0 && (
            <div className={`${SECTION_CARD} p-6`}>
              <h3 className={`${SECTION_HEADING} mb-4`}>Historical Stability</h3>
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-cc-border text-[11px] font-bold text-cc-subtle uppercase tracking-cc-widest">
                    <th className="pb-3 pr-4">Year</th>
                    <th className="pb-3 pr-4">W</th>
                    <th className="pb-3 pr-4">L</th>
                    <th className="pb-3">Win %</th>
                    <th className="pb-3">Trend</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cc-border">
                  {sel.winHistory.map((h, i) => {
                    const prev = sel.winHistory[i + 1];
                    const t = prev
                      ? parseFloat(h.p) > parseFloat(prev.p)
                        ? '↑'
                        : parseFloat(h.p) < parseFloat(prev.p)
                        ? '↓'
                        : '→'
                      : '—';
                    const tc = t === '↑' ? 'text-cc-success' : t === '↓' ? 'text-cc-danger' : 'text-cc-faint';
                    return (
                      <tr key={i}>
                        <td className="py-2.5 pr-4 font-bold text-cc-fg tabular">{h.yr}</td>
                        <td className="py-2.5 pr-4 text-cc-success font-bold tabular">{h.w}</td>
                        <td className="py-2.5 pr-4 text-cc-danger font-bold tabular">{h.l}</td>
                        <td className="py-2.5 font-semibold text-cc-muted tabular">{h.p}</td>
                        <td className={`py-2.5 font-bold text-lg ${tc}`}>{t}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* News */}
          {(sel.news?.length > 0) && (
            <div className={`${SECTION_CARD} p-6`}>
              <h3 className={`${SECTION_HEADING} mb-4`}>Program News</h3>
              <div className="space-y-3">
                {sel.news.map((n, i) => (
                  <a
                    key={i}
                    href={n.url}
                    target="_blank"
                    rel="noreferrer"
                    className="block p-4 bg-cc-surface-alt rounded-cc-md hover:bg-cc-accent-soft border border-transparent hover:border-cc-border transition-colors duration-cc-base group"
                  >
                    <div className="text-[11px] font-bold text-cc-light-blue uppercase tracking-cc-wider mb-1">{n.date}</div>
                    <div className="font-display text-cc-fg text-sm uppercase tracking-cc-wide group-hover:text-cc-accent">{n.title}</div>
                    <div className="text-xs text-cc-muted mt-1 leading-relaxed">{n.body}</div>
                  </a>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
