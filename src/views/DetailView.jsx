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

// ── Prominent pipeline stepper ───────────────────────────────────────────────
function PipelineStepper({ schoolStatus, statusIdx, setStatuses, schoolId }) {
  return (
    <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 sm:p-6">
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          <h3
            className="font-black text-slate-800 text-base uppercase tracking-widest"
            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
          >
            Recruiting Pipeline
          </h3>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Current Stage</span>
          <StatusBadge statusKey={schoolStatus} />
        </div>
      </div>

      {/* Progress bar (visual only) */}
      <div className="relative mb-4">
        <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${Math.max(0, statusIdx) / (STATUSES.length - 1) * 100}%`,
              background: 'linear-gradient(90deg, #2563eb, #1d4ed8)',
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
              className={`relative py-3 px-2 rounded-xl text-[11px] font-bold uppercase tracking-wide transition-all border text-center ${
                active
                  ? 'border-blue-600 bg-blue-600 text-white shadow-md'
                  : complete
                  ? 'border-blue-200 bg-blue-50 text-blue-700'
                  : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:text-slate-700'
              }`}
            >
              <div className="flex flex-col items-center gap-1">
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                    active
                      ? 'bg-white text-blue-600'
                      : complete
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-400'
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
  const [verifyMsg, setVerifyMsg] = useState(null); // { kind: 'ok'|'err', text }
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

      {/* PAGE HEADER (in-content, not dark banner — AppShell provides top bar) */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
        <button
          onClick={goBack}
          className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 text-xs font-bold uppercase tracking-wide transition-colors self-start"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Schools
        </button>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleReVerify}
            disabled={verifying}
            title="Re-fetch the head coach from this school's own volleyball page"
            className="flex items-center gap-2 bg-white hover:bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl text-slate-700 text-xs font-bold uppercase tracking-wide transition-all disabled:opacity-60"
          >
            {verifying ? <Loader2 className="w-4 h-4 animate-spin text-blue-500" /> : <ShieldCheck className="w-4 h-4 text-emerald-500" />}
            Re-verify Coach
          </button>
          <button
            onClick={() => goEmail(sel)}
            className="flex items-center gap-2 bg-white hover:bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl text-slate-700 text-xs font-bold uppercase tracking-wide transition-all"
          >
            <Mail className="w-4 h-4 text-blue-500" /> Email Templates
          </button>
          <button
            onClick={goGmail}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 border border-emerald-500 px-4 py-2 rounded-xl text-white text-xs font-bold uppercase tracking-wide transition-all shadow-sm"
          >
            <Send className="w-4 h-4" /> Gmail Drafts
          </button>
          <button
            onClick={handleDelete}
            title="Remove this school from the hub"
            className="flex items-center gap-2 bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-200 px-3 py-2 rounded-xl text-slate-500 hover:text-rose-600 text-xs font-bold uppercase tracking-wide transition-all"
            aria-label="Delete school"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      {verifyMsg && (
        <div
          className={`mb-4 flex items-start gap-2 px-4 py-3 rounded-xl border text-sm ${
            verifyMsg.kind === 'ok'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border-rose-200 text-rose-700'
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
        <div className="mb-4 flex items-start gap-2 px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs">
          <ShieldCheck className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
          <span>
            Coach re-verified from <a href={overriddenCoach._sourceUrl} target="_blank" rel="noreferrer" className="underline hover:no-underline">the school's coaches page</a>
            {overriddenCoach._titleConfirmed ? ' — "Head Coach" title confirmed.' : ' — fell back to first listed coach.'}
          </span>
        </div>
      )}

      {/* EXECUTIVE SUMMARY (kept prominent — the "why") */}
      <ExecutiveSummary school={sel} />

      {/* SCHOOL IDENTITY STRIP */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 sm:p-6 mb-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <SchoolLogo school={sel} size="lg" />
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2.5 mb-1">
              <h2
                className="font-black text-slate-900 text-2xl sm:text-3xl leading-none"
                style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
              >
                {sel.name.toUpperCase()}
              </h2>
              <DivBadge divLevel={sel.divLevel} size="lg" />
              <PriorityBadge priority={sel.priority} />
              {sel.programRank && sel.programRank !== 'NR' && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-50 border border-amber-200 rounded-full text-xs font-bold text-amber-700">
                  <Trophy className="w-3 h-3" /> AVCA {sel.programRank}
                </span>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-600">
              <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {sel.city}, {sel.state}</span>
              <span className="font-semibold text-slate-700">{sel.conference} Conference</span>
              <a href={sel.url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                University Site ↗
              </a>
              {sel.vbUrl && sel.vbUrl !== '#' && (
                <a href={sel.vbUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
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
                color: trend === 'up' ? 'text-emerald-600' : trend === 'down' ? 'text-red-500' : 'text-slate-500',
              },
            ].map((item, i) => (
              <div key={i} className="text-center bg-slate-50 rounded-xl px-4 py-3 min-w-20">
                <div
                  className={`font-black text-lg leading-none ${item.color || 'text-slate-800'}`}
                  style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                >
                  {item.value}
                </div>
                <div className="text-[11px] text-slate-500 uppercase tracking-wide mt-0.5 font-semibold">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* PROMINENT PIPELINE STEPPER (now its own full card, right up top) */}
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
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <GraduationCap className="w-4 h-4 text-blue-500" />
              <h3
                className="font-black text-slate-800 text-base uppercase tracking-widest"
                style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
              >
                Academic Fit
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-slate-50 rounded-xl p-3 text-center">
                <div
                  className="font-black text-lg text-slate-800"
                  style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                >
                  {sel.academic?.avgGPA || '—'}
                </div>
                <div className="text-[11px] text-slate-500 uppercase font-semibold">Avg Team GPA</div>
              </div>
              <div className="bg-slate-50 rounded-xl p-3 text-center">
                <div
                  className="font-black text-lg text-slate-800"
                  style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                >
                  {sel.academic?.gradRate || '—'}
                </div>
                <div className="text-[11px] text-slate-500 uppercase font-semibold">Grad Rate</div>
              </div>
            </div>
            {(sel.academic?.top10?.length > 0) && (
              <div className="mb-3">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2">Top Programs</div>
                <div className="flex flex-wrap gap-1.5">
                  {sel.academic.top10.map((m, i) => (
                    <span key={i} className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full text-[11px] font-semibold">
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
                  <div key={row.label} className="flex gap-2 p-2 bg-slate-50 rounded-lg">
                    <Icon className="flex-shrink-0 w-4 h-4 text-slate-500 mt-0.5" />
                    <div>
                      <div className="font-bold text-slate-600 text-[11px] uppercase tracking-wide">{row.label}</div>
                      <div className="text-slate-700 text-xs">{row.value}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* AZ Radar */}
          {(sel.azRadar?.length > 0) && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-4 h-4 text-orange-500" />
                <h3
                  className="font-black text-slate-800 text-base uppercase tracking-widest"
                  style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                >
                  AZ Radar
                </h3>
              </div>
              <div className="space-y-2">
                {sel.azRadar.map((p, i) => (
                  <div
                    key={i}
                    className={`p-3 rounded-xl border-l-4 ${
                      p.hs?.includes('Brophy') ? 'border-blue-600 bg-blue-50' : 'border-orange-400 bg-orange-50/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-black text-slate-800 text-sm">{p.name}</span>
                      <span className="text-[11px] bg-white border border-slate-200 px-2 py-0.5 rounded font-bold text-slate-600">
                        {p.pos}
                      </span>
                    </div>
                    <span
                      className={`text-[11px] font-semibold ${
                        p.hs?.includes('Brophy') ? 'text-blue-600' : 'text-orange-600'
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
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-4 h-4 text-blue-500" />
                <h3
                  className="font-black text-slate-800 text-base uppercase tracking-widest"
                  style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                >
                  Setter Depth Chart
                </h3>
              </div>
              <div className="space-y-2">
                {sel.setters.map((s, i) => (
                  <div key={i} className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-800 text-sm">{s.name}</span>
                      <span className="ml-2 text-[11px] text-slate-500 uppercase font-semibold">{s.class || ''}</span>
                    </div>
                    <span className="text-[11px] bg-slate-200 text-slate-700 font-bold px-2.5 py-1 rounded-full">
                      Grad {s.grad}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-3 rounded-xl border border-dashed border-slate-300 bg-slate-50/50">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1">
                  Class of 2028 Opening
                </div>
                <div
                  className={`flex items-center gap-2 text-sm font-bold ${
                    sel.setterNeed === 'High'
                      ? 'text-emerald-600'
                      : sel.setterNeed === 'Med'
                      ? 'text-amber-600'
                      : 'text-rose-600'
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
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="w-4 h-4 text-slate-500" />
              <h3
                className="font-black text-slate-800 text-base uppercase tracking-widest"
                style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
              >
                My Notes
              </h3>
            </div>
            <textarea
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-700 resize-none outline-none focus:border-blue-400 h-24"
              placeholder="Add personal notes about this program…"
              value={schoolNotes}
              onChange={e => setNotes(prev => ({ ...prev, [sel.id]: e.target.value }))}
            />
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="lg:col-span-8 space-y-6">

          {/* Outreach Console */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h3
              className="font-black text-slate-800 text-base uppercase tracking-widest mb-5"
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
            >
              Outreach Console
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-3">
                {sel.questionnaireUrl && sel.questionnaireUrl !== '#' && (
                  <a
                    href={sel.questionnaireUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 py-4 rounded-xl bg-blue-600 text-white text-sm font-bold uppercase tracking-wide hover:bg-blue-500 transition-all"
                  >
                    Fill Questionnaire ↗
                  </a>
                )}
                {sel.programIG && sel.programIG !== '#' && (
                  <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-2">
                      <Instagram className="w-4 h-4 text-pink-500" />
                      <span className="text-xs font-bold text-slate-600 uppercase">Team IG</span>
                    </div>
                    <span className="text-sm font-bold text-slate-800">{sel.programIG}</span>
                  </div>
                )}
                {sel.coaches?.map((c, i) => (
                  <CoachCard key={i} coach={c} schoolId={sel.id} />
                ))}
              </div>

              {/* Interaction Log */}
              <div className="bg-slate-900 rounded-2xl p-5 text-white">
                <div className="text-[11px] font-bold text-blue-400 uppercase tracking-widest mb-4">
                  Interaction Log
                </div>
                <input
                  type="date"
                  className="w-full bg-slate-800 rounded-xl p-3 text-sm text-white mb-3 outline-none border border-slate-700 focus:border-blue-500"
                  value={logDate}
                  onChange={e => setLogDate(e.target.value)}
                />
                <select
                  className="w-full bg-slate-800 rounded-xl p-3 text-sm text-white mb-3 outline-none border border-slate-700"
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
                  className="w-full py-3 bg-blue-600 rounded-xl font-bold text-sm uppercase tracking-wide hover:bg-blue-500 transition-all"
                >
                  Log + Update Status
                </button>
                <div className="mt-4 space-y-2 max-h-40 overflow-y-auto">
                  {(logs[sel.id] || []).map((entry, i) => (
                    <div
                      key={i}
                      className="group flex items-center gap-2 text-[11px] text-slate-400 border-t border-slate-800 pt-2"
                    >
                      <span className="font-semibold text-slate-300 flex-1 min-w-0 truncate">{entry.type}</span>
                      <span className="flex-shrink-0">{entry.date}</span>
                      <button
                        onClick={() => {
                          if (window.confirm(`Remove "${entry.type}" on ${entry.date}?`)) {
                            deleteLogEntry(sel.id, i);
                          }
                        }}
                        className="flex-shrink-0 opacity-0 group-hover:opacity-100 focus:opacity-100 p-1 rounded hover:bg-slate-800 text-slate-500 hover:text-rose-400 transition-all"
                        title="Delete this log entry"
                        aria-label="Delete log entry"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  {!(logs[sel.id]?.length) && (
                    <p className="text-[11px] text-slate-500 italic">No interactions logged yet.</p>
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
                icon: <Trophy className="w-4 h-4 text-amber-500" />,
              },
              {
                label: '2025 Record',
                value: sel.winHistory?.[0] ? `${sel.winHistory[0].w}–${sel.winHistory[0].l}` : 'N/A',
                sub: sel.winHistory?.[0]?.p ? `${sel.winHistory[0].p} win%` : '',
                icon: <TrendingUp className="w-4 h-4 text-emerald-500" />,
              },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 text-center">
                <div className="flex justify-center mb-2">{item.icon}</div>
                <div
                  className="font-black text-2xl text-slate-800 leading-none"
                  style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                >
                  {item.value}
                </div>
                <div className="text-[11px] text-slate-500 uppercase tracking-wide mt-1 font-semibold">{item.label}</div>
                {item.sub && <div className="text-[11px] text-slate-400 mt-0.5">{item.sub}</div>}
              </div>
            ))}
          </div>

          {/* Season Schedule */}
          {sel.schedule26?.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-2">
                <h3
                  className="font-black text-slate-800 text-base uppercase tracking-widest"
                  style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                >
                  2026 Season Schedule
                </h3>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1.5 bg-green-50 text-green-700 border border-green-200 rounded-lg text-xs font-bold">
                    W {getRecordTally(sel.schedule26).w}
                  </span>
                  <span className="text-slate-300 font-bold">–</span>
                  <span className="px-3 py-1.5 bg-red-50 text-red-700 border border-red-200 rounded-lg text-xs font-bold">
                    L {getRecordTally(sel.schedule26).l}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-4 mb-4 text-[11px] text-slate-500 font-semibold uppercase tracking-wide">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-400 inline-block" /> Home</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-slate-300 inline-block" /> Away</span>
                <span className="flex items-center gap-1"><span className="px-1.5 py-0.5 bg-indigo-50 text-indigo-500 rounded font-bold text-[10px]">CONF</span> Conference</span>
                <span className="flex items-center gap-1"><span className="px-1.5 py-0.5 bg-amber-50 text-amber-600 rounded font-bold text-[10px]">POST</span> Postseason</span>
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
                      className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border transition-all ${
                        isUpcoming
                          ? 'bg-slate-50/70 border-slate-100 opacity-60'
                          : isWin
                          ? 'bg-green-50/40 border-green-100'
                          : isLoss
                          ? 'bg-red-50/30 border-red-100'
                          : 'bg-white border-slate-100'
                      }`}
                    >
                      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${g.home ? 'bg-blue-400' : 'bg-slate-300'}`} />
                      <span className="text-[11px] font-bold text-slate-500 w-12 flex-shrink-0">{g.d}</span>
                      <span className={`text-sm flex-1 font-semibold ${isUpcoming ? 'text-slate-500' : 'text-slate-800'}`}>
                        {g.o}
                      </span>
                      {isPost && (
                        <span className="px-1.5 py-0.5 bg-amber-50 text-amber-600 border border-amber-200 rounded text-[10px] font-bold uppercase flex-shrink-0">
                          Post
                        </span>
                      )}
                      {isConf && !isPost && (
                        <span className="px-1.5 py-0.5 bg-indigo-50 text-indigo-500 border border-indigo-200 rounded text-[10px] font-bold uppercase flex-shrink-0">
                          Conf
                        </span>
                      )}
                      <span
                        className={`text-xs font-black w-20 text-right flex-shrink-0 ${
                          isUpcoming ? 'text-slate-300' : isWin ? 'text-green-600' : isLoss ? 'text-red-500' : 'text-slate-400'
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
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h3
                className="font-black text-slate-800 text-base uppercase tracking-widest mb-4"
                style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
              >
                Historical Stability
              </h3>
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                    <th className="pb-3 pr-4">Year</th>
                    <th className="pb-3 pr-4">W</th>
                    <th className="pb-3 pr-4">L</th>
                    <th className="pb-3">Win %</th>
                    <th className="pb-3">Trend</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {sel.winHistory.map((h, i) => {
                    const prev = sel.winHistory[i + 1];
                    const t = prev
                      ? parseFloat(h.p) > parseFloat(prev.p)
                        ? '↑'
                        : parseFloat(h.p) < parseFloat(prev.p)
                        ? '↓'
                        : '→'
                      : '—';
                    const tc = t === '↑' ? 'text-emerald-500' : t === '↓' ? 'text-red-400' : 'text-slate-300';
                    return (
                      <tr key={i}>
                        <td className="py-2.5 pr-4 font-bold text-slate-700">{h.yr}</td>
                        <td className="py-2.5 pr-4 text-emerald-600 font-bold">{h.w}</td>
                        <td className="py-2.5 pr-4 text-red-500 font-bold">{h.l}</td>
                        <td className="py-2.5 font-semibold text-slate-600">{h.p}</td>
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
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h3
                className="font-black text-slate-800 text-base uppercase tracking-widest mb-4"
                style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
              >
                Program News
              </h3>
              <div className="space-y-3">
                {sel.news.map((n, i) => (
                  <a
                    key={i}
                    href={n.url}
                    target="_blank"
                    rel="noreferrer"
                    className="block p-4 bg-slate-50 rounded-xl hover:bg-blue-50 border border-transparent hover:border-blue-100 transition-all group"
                  >
                    <div className="text-[11px] font-bold text-blue-500 uppercase tracking-wide mb-1">{n.date}</div>
                    <div className="font-bold text-slate-800 text-sm group-hover:text-blue-600">{n.title}</div>
                    <div className="text-xs text-slate-600 mt-1 leading-relaxed">{n.body}</div>
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
