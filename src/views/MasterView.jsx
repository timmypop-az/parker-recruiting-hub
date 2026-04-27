import React from 'react';
import {
  Sparkles, PlusCircle, Loader2, Search, Calendar, ChevronDown, ChevronUp,
  Inbox, Phone, PenLine, Trophy, Target, Compass, EyeOff, Rows3, AlignJustify, X,
  Move, CheckCircle2, AlertTriangle, Info, ArrowRight,
} from 'lucide-react';
import {
  DndContext, PointerSensor, KeyboardSensor, useSensor, useSensors, closestCenter,
} from '@dnd-kit/core';
import {
  SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy, arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { SchoolRow } from '../components/SchoolRow.jsx';
import { MobileSchoolCard } from '../components/MobileSchoolCard.jsx';
import { DIV_CONFIG, PARKER } from '../data/constants.js';
import { useApp } from '../context/AppContext.jsx';

// Activation distance (8 px) keeps plain clicks → navigate; drag triggers after movement.
function SortableSchoolRow({ s }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: s.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    background: isDragging ? 'var(--accent-soft)' : undefined,
  };
  return (
    <SchoolRow
      s={s}
      ref={setNodeRef}
      draggable
      dragStyle={style}
      dragProps={listeners}
      {...attributes}
    />
  );
}

function SortableHeader({ column, label, className = '' }) {
  const { sortBy, sortDir, toggleSort } = useApp();
  const active = sortBy === column;
  return (
    <th
      onClick={() => toggleSort(column)}
      className={`px-5 py-4 text-[11px] font-bold text-cc-subtle uppercase tracking-cc-widest whitespace-nowrap cursor-pointer select-none hover:bg-cc-bg/70 transition-colors ${className}`}
    >
      <span className="inline-flex items-center gap-1">
        {label}
        {active ? (
          sortDir === 'asc' ? <ChevronUp className="w-3 h-3 text-cc-accent" /> : <ChevronDown className="w-3 h-3 text-cc-accent" />
        ) : (
          <span className="w-3 h-3 opacity-0" />
        )}
      </span>
    </th>
  );
}

function StatsStrip() {
  const { allSchools, divCounts, contacted } = useApp();
  const cards = [
    { label: 'Total Programs', value: allSchools.length,                                  accent: 'text-cc-fg'        },
    { label: 'D-I',            value: divCounts['DI'] || 0,                               accent: 'text-cc-accent'      },
    { label: 'D-II / NAIA',    value: (divCounts['DII'] || 0) + (divCounts['NAIA'] || 0), accent: 'text-cc-purple'    },
    { label: 'D-III / JUCO',   value: (divCounts['DIII'] || 0) + (divCounts['JUCO'] || 0),accent: 'text-cc-forest'    },
    { label: 'Contacted',      value: contacted,                                          accent: 'text-cc-success'   },
  ];
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {cards.map(c => (
        <div key={c.label} className="bg-cc-surface border border-cc-border rounded-cc-lg px-4 py-3 shadow-cc-card">
          <div className={`display-num text-3xl leading-none tabular ${c.accent}`}>
            {c.value}
          </div>
          <div className="text-[11px] text-cc-subtle uppercase tracking-cc-wider mt-1 font-semibold">{c.label}</div>
        </div>
      ))}
    </div>
  );
}

function SectionTabs() {
  const { activeSection, setActiveSection, primarySchools, discoverySchools, hiddenSchools } = useApp();
  const tabs = [
    { id: 'primary',   label: 'Primary Targets',   icon: Target,  count: primarySchools.length,   accent: 'text-cc-accent'   },
    { id: 'discovery', label: 'Discovery',         icon: Compass, count: discoverySchools.length, accent: 'text-cc-purple' },
    { id: 'hidden',    label: 'Hidden',            icon: EyeOff,  count: hiddenSchools.length,    accent: 'text-cc-faint'  },
  ];
  return (
    <div className="flex items-center gap-1 border-b border-cc-border">
      {tabs.map(t => {
        const Icon = t.icon;
        const active = activeSection === t.id;
        return (
          <button
            key={t.id}
            onClick={() => setActiveSection(t.id)}
            className={`flex items-center gap-2 px-4 py-3 text-cc-button font-display uppercase tracking-cc-wider transition-colors duration-cc-base border-b-2 -mb-px ${
              active ? 'border-cc-accent text-cc-accent' : 'border-transparent text-cc-subtle hover:text-cc-fg'
            }`}
          >
            <Icon className={`w-4 h-4 ${active ? t.accent : 'text-cc-faint'}`} />
            <span>{t.label}</span>
            <span
              className={`text-[11px] font-bold px-1.5 py-0.5 rounded-cc-sm tabular ${
                active ? 'bg-cc-accent-soft text-cc-accent' : 'bg-cc-bg text-cc-subtle'
              }`}
            >
              {t.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function AddResultBanner() {
  const { addResult, clearAddResult, navigate, setActiveSection } = useApp();
  if (!addResult) return null;

  const { kind, text, school, interpretation, placedSection, verified } = addResult;
  const styles = {
    success:        { bg: 'bg-emerald-50 dark:bg-emerald-500/15/10 border-emerald-300 dark:border-emerald-500/40/40', Icon: CheckCircle2,   iconColor: 'text-emerald-300' },
    duplicate:      { bg: 'bg-amber-50 dark:bg-amber-500/15/10 border-amber-300 dark:border-amber-500/40/40',     Icon: Info,           iconColor: 'text-amber-300'   },
    not_volleyball: { bg: 'bg-amber-50 dark:bg-amber-500/15/10 border-amber-300 dark:border-amber-500/40/40',     Icon: AlertTriangle,  iconColor: 'text-amber-300'   },
    error:          { bg: 'bg-rose-50 dark:bg-rose-500/15/10 border-rose-300 dark:border-rose-500/40/40',       Icon: AlertTriangle,  iconColor: 'text-rose-300'    },
  }[kind] || { bg: 'bg-white/10 border-white/20', Icon: Info, iconColor: 'text-cc-gold' };
  const { bg, Icon, iconColor } = styles;

  const handleView = () => {
    if (!school) return;
    if (placedSection === 'primary' || placedSection === 'discovery') {
      setActiveSection(placedSection);
    }
    navigate(school);
    clearAddResult();
  };

  return (
    <div className={`mt-3 rounded-cc-md border ${bg} text-white`}>
      <div className="flex items-start gap-3 p-3 sm:p-4">
        <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${iconColor}`} />
        <div className="flex-1 min-w-0">
          <div className="text-sm font-bold">{text}</div>
          {interpretation && (
            <div className="text-[12px] text-white/70 mt-0.5">
              Interpreted as: <span className="font-semibold text-white">{interpretation}</span>
            </div>
          )}
          {kind === 'success' && school && (
            <div className="text-[12px] text-white/70 mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5">
              {school.divLevel && <span>{school.divLevel}</span>}
              {school.conference && <span>{school.conference}</span>}
              {(school.city || school.state) && <span>{[school.city, school.state].filter(Boolean).join(', ')}</span>}
              {verified ? (
                <span className="inline-flex items-center gap-1 text-emerald-300">
                  <CheckCircle2 className="w-3 h-3" /> Head coach verified from school site
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-amber-300">
                  <AlertTriangle className="w-3 h-3" /> Head coach unverified — click Re-verify on the detail page
                </span>
              )}
            </div>
          )}
          {(kind === 'success' || kind === 'duplicate') && school && (
            <button
              onClick={handleView}
              className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-cc-wider text-white bg-white/15 hover:bg-white/25 px-3 py-1.5 rounded-cc-sm transition-colors"
            >
              View {school.name}
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        <button
          onClick={clearAddResult}
          className="p-1 rounded-cc-sm hover:bg-white/10 text-white/60 hover:text-white flex-shrink-0"
          aria-label="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function DiscoveryEngine() {
  const {
    openDiscovery, setOpenDiscovery,
    newSchoolName, setNewSchoolName, isSearching, handleAddSchool,
    extraSchools, setExtraSchools,
  } = useApp();
  if (!openDiscovery) {
    return (
      <button
        onClick={() => setOpenDiscovery(true)}
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-cc-sm bg-cc-accent text-white text-cc-button font-display uppercase tracking-cc-widest transition-colors duration-cc-base hover:bg-cc-accent hover:opacity-90 active:translate-y-px focus:outline-none focus:ring-2 focus:ring-cc-focus focus:ring-offset-2"
      >
        <Sparkles className="w-4 h-4" />
        Discover a Program
      </button>
    );
  }
  return (
    <div className="rounded-cc-xl overflow-hidden shadow-cc-card border border-cc-navy-700 bg-cc-grad-navy">
      <div className="p-5 sm:p-6">
        <div className="flex items-start gap-3 mb-4">
          <Sparkles className="text-cc-gold w-5 h-5 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <h2 className="font-display text-white text-2xl uppercase tracking-cc-wide">
              Discovery Engine
            </h2>
            <p className="text-white/70 text-cc-body mt-0.5">
              Research any college's men's volleyball program instantly — powered by Claude AI.
            </p>
          </div>
          <button
            onClick={() => setOpenDiscovery(false)}
            className="p-1.5 rounded-cc-sm hover:bg-white/10 text-white/70"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            placeholder="Enter college name (e.g. 'Stanford', 'Ohio State')…"
            className="flex-1 bg-white/10 border border-white/20 rounded-cc-md px-4 py-3 text-white font-semibold placeholder:text-white/40 focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-cc-gold/40 text-sm"
            value={newSchoolName}
            onChange={e => setNewSchoolName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAddSchool()}
            autoFocus
          />
          <button
            onClick={handleAddSchool}
            disabled={isSearching}
            className="bg-white text-cc-accent px-6 py-3 rounded-cc-sm font-display uppercase tracking-cc-widest text-cc-button flex items-center justify-center gap-2 hover:bg-cc-bg transition-colors disabled:opacity-60 flex-shrink-0"
          >
            {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <PlusCircle className="w-4 h-4" />}
            Add Program
          </button>
          {extraSchools.length > 0 && (
            <button
              onClick={() => {
                if (window.confirm(`Remove all ${extraSchools.length} added school(s)?`)) setExtraSchools([]);
              }}
              className="bg-white/10 border border-white/20 text-white/70 px-4 py-3 rounded-cc-sm text-xs font-bold uppercase tracking-cc-wider hover:bg-white/20 hover:text-white transition-colors flex-shrink-0"
            >
              Clear Added ({extraSchools.length})
            </button>
          )}
        </div>
        <AddResultBanner />
      </div>
    </div>
  );
}

function DensityToggle() {
  const { density, setDensity } = useApp();
  return (
    <div className="hidden md:inline-flex items-center bg-cc-surface border border-cc-border rounded-cc-md p-0.5">
      <button
        onClick={() => setDensity('comfortable')}
        className={`px-2.5 py-1.5 rounded-cc-sm text-xs font-bold transition-colors ${
          density === 'comfortable' ? 'bg-cc-accent text-white' : 'text-cc-subtle hover:text-cc-fg'
        }`}
        title="Comfortable"
        aria-label="Comfortable density"
      >
        <Rows3 className="w-3.5 h-3.5" />
      </button>
      <button
        onClick={() => setDensity('compact')}
        className={`px-2.5 py-1.5 rounded-cc-sm text-xs font-bold transition-colors ${
          density === 'compact' ? 'bg-cc-accent text-white' : 'text-cc-subtle hover:text-cc-fg'
        }`}
        title="Compact"
        aria-label="Compact density"
      >
        <AlignJustify className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

export function MasterView() {
  const {
    divFilter, setDivFilter, search, setSearch,
    filteredSchools, activeSection, divCounts, allSchools,
    sortBy, setSortBy, schoolOrder, reorderSchools,
  } = useApp();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );
  const isCustom = sortBy === 'custom';

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const visibleIds = filteredSchools.map(s => s.id);
    const oldIdx = visibleIds.indexOf(active.id);
    const newIdx = visibleIds.indexOf(over.id);
    if (oldIdx < 0 || newIdx < 0) return;
    const reorderedVisible = arrayMove(visibleIds, oldIdx, newIdx);
    const baseOrder = schoolOrder.length
      ? schoolOrder.filter(id => allSchools.some(s => s.id === id))
      : allSchools.map(s => s.id);
    const withoutVisible = baseOrder.filter(id => !visibleIds.includes(id));
    const firstVisibleOrigPos = baseOrder.findIndex(id => visibleIds.includes(id));
    const insertAt = firstVisibleOrigPos === -1 ? withoutVisible.length : firstVisibleOrigPos;
    const next = [
      ...withoutVisible.slice(0, insertAt),
      ...reorderedVisible,
      ...withoutVisible.slice(insertAt),
    ];
    for (const s of allSchools) if (!next.includes(s.id)) next.push(s.id);
    reorderSchools(next);
  };

  const toggleManualOrder = () => {
    if (isCustom) {
      setSortBy('name');
      return;
    }
    if (schoolOrder.length === 0) {
      reorderSchools(allSchools.map(s => s.id));
    }
    setSortBy('custom');
  };

  return (
    <div className="px-4 sm:px-6 lg:px-10 py-6 lg:py-8 space-y-6">
      {/* PAGE HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
        <div>
          <div className="text-[11px] font-bold text-cc-subtle uppercase tracking-cc-widest flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-cc-gold" />
            {PARKER.hs} · {PARKER.club} · Class of {PARKER.grad}
          </div>
          <h1 className="font-display text-cc-fg uppercase tracking-cc-wide leading-none mt-1 text-cc-h2">
            Schools <span className="text-cc-faint font-normal normal-case tracking-normal">/ Program Pipeline</span>
          </h1>
          <p className="text-cc-muted text-cc-body mt-1">
            {allSchools.length} programs tracked · Men's Volleyball · Setter
          </p>
        </div>
        <div className="flex items-center gap-2">
          <DiscoveryEngine />
        </div>
      </div>

      {/* STATS */}
      <StatsStrip />

      {/* SECTION TABS */}
      <SectionTabs />

      {/* FILTER BAR */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
        <div className="flex flex-wrap gap-2">
          {['All', 'DI', 'DII', 'DIII', 'NAIA', 'JUCO'].map(d => (
            <button
              key={d}
              onClick={() => setDivFilter(d)}
              className={`px-3 py-2 rounded-cc-sm text-xs font-bold uppercase tracking-cc-wider transition-colors duration-cc-base ${
                divFilter === d
                  ? 'bg-cc-accent text-white shadow-cc-card'
                  : 'bg-cc-surface text-cc-fg hover:bg-cc-bg border border-cc-border'
              }`}
            >
              {d === 'All' ? `All (${allSchools.length})` : `${DIV_CONFIG[d]?.label || d} (${divCounts[d] || 0})`}
            </button>
          ))}
        </div>
        <div className="relative flex-1 md:max-w-xs md:ml-auto">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cc-faint w-4 h-4" />
          <input
            type="text"
            placeholder="Search programs, conferences…"
            className="w-full pl-10 pr-4 py-2.5 rounded-cc-md bg-cc-surface border border-cc-border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-cc-focus focus:border-transparent shadow-cc-card"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <button
          onClick={toggleManualOrder}
          title={isCustom ? 'Click to return to column sorting' : 'Drag rows to reorder (desktop)'}
          className={`hidden md:inline-flex items-center gap-1.5 px-3 py-2 rounded-cc-sm text-xs font-bold uppercase tracking-cc-wider transition-colors duration-cc-base border ${
            isCustom
              ? 'bg-cc-accent text-white border-cc-accent shadow-cc-card'
              : 'bg-cc-surface text-cc-fg border-cc-border hover:bg-cc-bg'
          }`}
        >
          <Move className="w-3.5 h-3.5" />
          Manual
        </button>
        <DensityToggle />
      </div>

      {/* TABLE (desktop) + CARDS (mobile) */}
      {filteredSchools.length === 0 ? (
        <div className="bg-cc-surface rounded-cc-lg border border-dashed border-cc-border p-12 text-center">
          <div className="font-display text-cc-faint text-2xl uppercase tracking-cc-wide mb-1">
            No programs match
          </div>
          <p className="text-cc-muted text-cc-body">Try adjusting your filters or search.</p>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block bg-cc-surface rounded-cc-lg shadow-cc-card border border-cc-border overflow-hidden">
            {isCustom && (
              <div className="px-5 py-2.5 bg-cc-accent-soft border-b border-cc-border text-[11px] font-bold uppercase tracking-cc-widest text-cc-accent flex items-center gap-2">
                <Move className="w-3.5 h-3.5" />
                Manual Order — drag any row to reorder. Click a row to open it.
              </div>
            )}
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-cc-border bg-cc-surface-alt">
                    <SortableHeader column="name"       label="Institution / Head Coach" />
                    <SortableHeader column="divLevel"   label="Division" />
                    <SortableHeader column="conference" label="Conference" />
                    <SortableHeader column="location"   label="Location" />
                    <th className="px-5 py-4 text-[11px] font-bold text-cc-subtle uppercase tracking-cc-widest whitespace-nowrap">
                      Acceptance / Tuition
                    </th>
                    <SortableHeader column="setterNeed" label="Setter Need" />
                    <SortableHeader column="status"     label="Status" />
                    <th className="px-5 py-4" />
                  </tr>
                </thead>
                {isCustom ? (
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext
                      items={filteredSchools.map(s => s.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      <tbody className="divide-y divide-cc-border">
                        {filteredSchools.map(s => <SortableSchoolRow key={s.id} s={s} />)}
                      </tbody>
                    </SortableContext>
                  </DndContext>
                ) : (
                  <tbody className="divide-y divide-cc-border">
                    {filteredSchools.map(s => <SchoolRow key={s.id} s={s} />)}
                  </tbody>
                )}
              </table>
            </div>
          </div>

          {/* Mobile card list */}
          <div className="md:hidden space-y-2.5">
            {filteredSchools.map(s => <MobileSchoolCard key={s.id} school={s} />)}
          </div>
        </>
      )}

      {/* RECRUITING CALENDAR */}
      <div className="bg-cc-surface rounded-cc-lg border border-cc-border shadow-cc-card p-5 sm:p-6">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="text-cc-accent w-5 h-5" />
          <h3 className="font-display text-cc-fg uppercase tracking-cc-wide text-lg">
            Recruiting Calendar — Class of {PARKER.grad}
          </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { when: 'Now — 2027',    what: 'Contact coaches, fill questionnaires, attend camps/clinics. AZ Fear 17s visibility is key.', border: 'border-cc-light-blue', bg: 'bg-sky-50 dark:bg-sky-500/15',     iconColor: 'text-cc-light-blue', Icon: Inbox },
            { when: 'June 15, 2026', what: 'D-I coaches may now initiate contact with Parker (Sophomore year — critical window)',       border: 'border-cc-warning',    bg: 'bg-amber-50 dark:bg-amber-500/15',   iconColor: 'text-cc-warning',    Icon: Phone },
            { when: 'Nov 2028',      what: 'Early National Signing Period (D-I only) opens — target offer by this date',                border: 'border-cc-purple',     bg: 'bg-purple-50 dark:bg-purple-500/15',  iconColor: 'text-cc-purple',     Icon: PenLine },
            { when: 'Feb 2028',      what: 'National Signing Day — final letters of intent due',                                        border: 'border-cc-forest',     bg: 'bg-emerald-50 dark:bg-emerald-500/15', iconColor: 'text-cc-forest',     Icon: Trophy },
          ].map((item, i) => {
            const Icon = item.Icon;
            return (
              <div key={i} className={`rounded-cc-md border-l-4 p-4 ${item.border} ${item.bg}`}>
                <Icon className={`w-5 h-5 mb-1 ${item.iconColor}`} />
                <div className="font-display text-cc-fg text-sm uppercase tracking-cc-wide mb-1">{item.when}</div>
                <div className="text-cc-muted text-xs leading-relaxed">{item.what}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
