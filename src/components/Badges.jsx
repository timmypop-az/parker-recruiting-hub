import React from 'react';
import { DIV_CONFIG, STATUSES } from '../data/constants.js';

// ─── BADGE COMPONENTS ─────────────────────────────────────────────────────────
export const DivBadge = ({ divLevel, size = "sm" }) => {
  const cfg = DIV_CONFIG[divLevel] || DIV_CONFIG["NAIA"];
  return size === "lg"
    ? <span className={`inline-block px-4 py-1.5 rounded-cc-sm text-sm font-display tracking-cc-widest uppercase ${cfg.bg} ${cfg.text}`}>{cfg.label}</span>
    : <span className={`inline-block px-2.5 py-0.5 rounded-cc-sm text-[10px] font-display tracking-cc-widest uppercase ${cfg.bg} ${cfg.text}`}>{cfg.label}</span>;
};

export const PriorityBadge = ({ priority }) => {
  const map = {
    Reach:  "bg-rose-50 dark:bg-rose-500/15 text-cc-maroon border-rose-200 dark:border-rose-500/30",
    Target: "bg-sky-50 dark:bg-sky-500/15 text-cc-light-blue border-sky-200 dark:border-sky-500/30",
    Safety: "bg-emerald-50 dark:bg-emerald-500/15 text-cc-forest border-emerald-200 dark:border-emerald-500/30",
  };
  return <span className={`inline-block px-2 py-0.5 rounded-cc-sm text-[9px] font-bold uppercase tracking-cc-widest border ${map[priority] || "bg-slate-100 text-cc-subtle border-cc-border"}`}>{priority}</span>;
};

export const StatusBadge = ({ statusKey }) => {
  const s = STATUSES.find(x => x.key === statusKey) || STATUSES[0];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-cc-wider ${s.bg} ${s.text}`}>
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: s.dot }} />
      {s.label}
    </span>
  );
};

export const NeedBadge = ({ need }) => {
  const map = {
    High: "bg-rose-50 dark:bg-rose-500/15 text-cc-maroon",
    Med:  "bg-amber-50 dark:bg-amber-500/15 text-cc-warning",
    Low:  "bg-slate-100 text-cc-faint",
  };
  return <span className={`px-2 py-0.5 rounded-cc-sm text-[9px] font-bold uppercase tracking-cc-wider ${map[need] || "bg-slate-100 text-cc-faint"}`}>{need || "?"} need</span>;
};
