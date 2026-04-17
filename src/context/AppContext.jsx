import React, { createContext, useContext, useState, useEffect, useMemo, useRef } from 'react';
import { ALL_SCHOOLS_DATA } from '../data/schools.js';
import {
  loadUserData, saveUserData, fetchSchoolFromClaude,
  reVerifyCoach as apiReVerifyCoach,
} from '../lib/api.js';

const AppContext = createContext(null);

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};

export function AppProvider({ children }) {
  // ── PERSISTED STATE (loaded from Netlify Blobs on mount, saved on change) ──
  const [extraSchools, setExtraSchools] = useState([]);
  const [statuses, setStatuses] = useState({});
  const [logs, setLogs] = useState({});
  const [notes, setNotes] = useState({});
  const [hiddenIds, setHiddenIds] = useState(new Set());
  const [sectionOverrides, setSectionOverrides] = useState({});
  // Re-verified head-coach records keyed by school id. Overrides the first
  // entry of the school's coaches[] when rendering.
  const [coachOverrides, setCoachOverrides] = useState({});
  // Hard-deletes: ids the user has deleted from the hub (applied to both
  // seeded and user-added schools; user-added are also removed from extraSchools).
  const [deletedIds, setDeletedIds] = useState(new Set());
  // Manual order (array of school ids). When sortBy === 'custom', rows are
  // arranged in this order; drag-and-drop in MasterView updates it.
  const [schoolOrder, setSchoolOrder] = useState([]);
  const hydratedRef = useRef(false);

  // Hide/move helpers
  const isHidden = (id) => hiddenIds.has(id);
  const getEffectiveSection = (school) => sectionOverrides[school.id] || school.section;
  const hideSchool = (id) => setHiddenIds(prev => { const n = new Set(prev); n.add(id); return n; });
  const unhideSchool = (id) => setHiddenIds(prev => { const n = new Set(prev); n.delete(id); return n; });
  const moveToSection = (id, section) => setSectionOverrides(prev => ({ ...prev, [id]: section }));

  // Hard-delete: for user-added schools, drop from extraSchools entirely; for
  // seeded schools, tombstone in deletedIds so the filter in allSchools hides
  // them. Also drops the id from hiddenIds / sectionOverrides / schoolOrder so
  // state stays clean if the school is later re-added.
  const deleteSchool = (id) => {
    const wasExtra = extraSchools.some(s => s.id === id);
    if (wasExtra) setExtraSchools(prev => prev.filter(s => s.id !== id));
    setDeletedIds(prev => { const n = new Set(prev); n.add(id); return n; });
    setHiddenIds(prev => { const n = new Set(prev); n.delete(id); return n; });
    setSectionOverrides(prev => {
      if (!(id in prev)) return prev;
      const n = { ...prev }; delete n[id]; return n;
    });
    setSchoolOrder(prev => prev.filter(x => x !== id));
  };
  const undeleteSchool = (id) =>
    setDeletedIds(prev => { const n = new Set(prev); n.delete(id); return n; });

  // Re-run the head-coach verification for a school and persist the result
  // as a coach override. Returns the verified record so callers can show
  // a toast / inline success message.
  const reVerifyCoach = async (schoolId, vbUrl) => {
    const verified = await apiReVerifyCoach(vbUrl);
    const record = {
      name: verified.name || '',
      role: 'Head Coach',
      email: verified.email,
      phone: verified.phone || '',
      _verified: true,
      _verifiedAt: new Date().toISOString(),
      _sourceUrl: verified._sourceUrl,
      _titleConfirmed: !!verified._titleConfirmed,
    };
    setCoachOverrides(prev => ({ ...prev, [schoolId]: record }));
    return record;
  };
  const clearCoachOverride = (schoolId) =>
    setCoachOverrides(prev => {
      if (!(schoolId in prev)) return prev;
      const n = { ...prev }; delete n[schoolId]; return n;
    });

  // Replace the manual school order (used by drag-and-drop in MasterView).
  const reorderSchools = (newOrder) => setSchoolOrder(Array.from(newOrder));

  // Hydrate everything from Netlify Blobs once on mount
  useEffect(() => {
    (async () => {
      try {
        const data = await loadUserData();
        if (Array.isArray(data.schools)) setExtraSchools(data.schools);
        if (data.statuses && typeof data.statuses === 'object') setStatuses(data.statuses);
        if (data.logs && typeof data.logs === 'object') setLogs(data.logs);
        if (data.notes && typeof data.notes === 'object') setNotes(data.notes);
        if (Array.isArray(data.hiddenIds)) setHiddenIds(new Set(data.hiddenIds));
        if (data.sectionOverrides && typeof data.sectionOverrides === 'object') setSectionOverrides(data.sectionOverrides);
        if (data.coachOverrides && typeof data.coachOverrides === 'object') setCoachOverrides(data.coachOverrides);
        if (Array.isArray(data.deletedIds)) setDeletedIds(new Set(data.deletedIds));
        if (Array.isArray(data.schoolOrder)) setSchoolOrder(data.schoolOrder);
      } catch (err) {
        console.warn("Failed to hydrate user data:", err);
      } finally {
        // Defer marking hydrated until after React commits the setX() calls above.
        // This prevents the save effect from firing with pre-hydration empty state.
        setTimeout(() => { hydratedRef.current = true; }, 0);
      }
    })();
  }, []);

  // Debounced save to Netlify Blobs whenever any persisted state changes
  useEffect(() => {
    if (!hydratedRef.current) return; // skip during initial hydration
    const timer = setTimeout(() => {
      saveUserData({
        schools: extraSchools,
        statuses,
        logs,
        notes,
        hiddenIds: [...hiddenIds],
        sectionOverrides,
        coachOverrides,
        deletedIds: [...deletedIds],
        schoolOrder,
      }).catch(err => console.warn("Save failed:", err));
    }, 600);
    return () => clearTimeout(timer);
  }, [extraSchools, statuses, logs, notes, hiddenIds, sectionOverrides, coachOverrides, deletedIds, schoolOrder]);

  // ── UI STATE ──
  const [view, setView] = useState('master');
  const [sel, setSel] = useState(null);
  const [search, setSearch] = useState('');
  const [divFilter, setDivFilter] = useState('All');
  const [newSchoolName, setNewSchoolName] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  // Inline feedback banner for the Discovery "Add School" action. Replaces the
  // blocking alert() calls so the user sees what happened, where the school
  // was placed, and any acronym interpretation. Shape:
  //   { kind: 'success'|'duplicate'|'not_volleyball'|'error',
  //     text: string,
  //     school?: Object,           // the parsed (or existing) school record
  //     interpretation?: string,   // what Claude resolved the input to
  //     placedSection?: string,    // 'primary' | 'discovery' | 'hidden'
  //     verified?: boolean }
  const [addResult, setAddResult] = useState(null);
  const clearAddResult = () => setAddResult(null);
  const [logDate, setLogDate] = useState('');
  const [logType, setLogType] = useState('Submitted Questionnaire');
  const [showHidden, setShowHidden] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);
  // NEW: section tab, sort, density, discovery panel
  const [activeSection, setActiveSection] = useState('primary'); // 'primary' | 'discovery' | 'hidden'
  const [sortBy, setSortBy] = useState('name');                  // 'name'|'divLevel'|'conference'|'location'|'setterNeed'|'status'
  const [sortDir, setSortDir] = useState('asc');                 // 'asc' | 'desc'
  const [density, setDensity] = useState('comfortable');         // 'comfortable' | 'compact'
  const [openDiscovery, setOpenDiscovery] = useState(false);     // expanded AI add panel

  const toggleSort = (col) => {
    if (sortBy === col) setSortDir(d => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortBy(col); setSortDir('asc'); }
  };

  // Click-outside dismiss for the ⋯ menu
  useEffect(() => {
    if (!openMenuId) return;
    const onDocClick = (e) => {
      if (!e.target.closest('[data-row-menu]')) setOpenMenuId(null);
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [openMenuId]);

  const allSchools = useMemo(() => {
    const base = [...ALL_SCHOOLS_DATA, ...extraSchools];
    return base
      .filter(s => !deletedIds.has(s.id))
      .map(s => {
        const override = coachOverrides[s.id];
        if (!override) return s;
        // Replace the first (head) coach entry with the verified record;
        // preserve any additional coaches the school record may carry.
        const rest = Array.isArray(s.coaches) ? s.coaches.slice(1) : [];
        return { ...s, coaches: [override, ...rest] };
      });
  }, [extraSchools, deletedIds, coachOverrides]);
  const visibleSchools = useMemo(() => allSchools.filter(s => !isHidden(s.id)), [allSchools, hiddenIds]);
  const primarySchools = useMemo(() => visibleSchools.filter(s => getEffectiveSection(s) === "primary"), [visibleSchools, sectionOverrides]);
  const discoverySchools = useMemo(() => visibleSchools.filter(s => getEffectiveSection(s) === "discovery"), [visibleSchools, sectionOverrides]);
  const hiddenSchools = useMemo(() => allSchools.filter(s => isHidden(s.id)), [allSchools, hiddenIds]);

  const divCounts = useMemo(() => {
    const c = {};
    allSchools.forEach(s => { c[s.divLevel] = (c[s.divLevel] || 0) + 1; });
    return c;
  }, [allSchools]);

  const contacted = useMemo(() => Object.values(statuses).filter(s => s && s !== "None").length, [statuses]);

  // Rank helpers for sorting
  const DIV_RANK = { DI: 0, DII: 1, DIII: 2, NAIA: 3, JUCO: 4 };
  const NEED_RANK = { High: 0, Med: 1, Low: 2 };
  const STATUS_RANK = { None: 0, Questionnaire: 1, 'Reached Out': 2, 'Coach Contact': 3, 'Campus Visit': 4, Offer: 5 };

  const sortFn = (a, b) => {
    // Custom / manual ordering — respects schoolOrder; ids not in the array
    // fall through to alphabetical at the end.
    if (sortBy === 'custom') {
      const ia = schoolOrder.indexOf(a.id);
      const ib = schoolOrder.indexOf(b.id);
      if (ia === -1 && ib === -1) return (a.name || '').localeCompare(b.name || '');
      if (ia === -1) return 1;
      if (ib === -1) return -1;
      return ia - ib;
    }
    const dir = sortDir === 'asc' ? 1 : -1;
    const av = (() => {
      switch (sortBy) {
        case 'divLevel':   return DIV_RANK[a.divLevel] ?? 99;
        case 'conference': return (a.conference || '').toLowerCase();
        case 'location':   return `${a.state || ''} ${a.city || ''}`.toLowerCase();
        case 'setterNeed': return NEED_RANK[a.setterNeed] ?? 99;
        case 'status':     return STATUS_RANK[statuses[a.id] || 'None'] ?? 0;
        default:           return (a.name || '').toLowerCase();
      }
    })();
    const bv = (() => {
      switch (sortBy) {
        case 'divLevel':   return DIV_RANK[b.divLevel] ?? 99;
        case 'conference': return (b.conference || '').toLowerCase();
        case 'location':   return `${b.state || ''} ${b.city || ''}`.toLowerCase();
        case 'setterNeed': return NEED_RANK[b.setterNeed] ?? 99;
        case 'status':     return STATUS_RANK[statuses[b.id] || 'None'] ?? 0;
        default:           return (b.name || '').toLowerCase();
      }
    })();
    if (av < bv) return -1 * dir;
    if (av > bv) return  1 * dir;
    return (a.name || '').localeCompare(b.name || '');
  };

  const applyFilters = (list) => list.filter(s => {
    const q = search.toLowerCase();
    const matchSearch = s.name?.toLowerCase().includes(q) || s.city?.toLowerCase().includes(q) || s.conference?.toLowerCase().includes(q);
    const matchDiv = divFilter === 'All' || s.divLevel === divFilter;
    return matchSearch && matchDiv;
  });

  const activeList = useMemo(() => {
    if (activeSection === 'primary')   return primarySchools;
    if (activeSection === 'discovery') return discoverySchools;
    return hiddenSchools;
  }, [activeSection, primarySchools, discoverySchools, hiddenSchools]);

  const filteredSchools = useMemo(
    () => applyFilters(activeList).slice().sort(sortFn),
    [activeList, search, divFilter, sortBy, sortDir, statuses, schoolOrder]
  );

  // Legacy (kept for compatibility; master view no longer references these directly)
  const filteredPrimary = useMemo(() => applyFilters(primarySchools).slice().sort(sortFn), [primarySchools, search, divFilter, sortBy, sortDir, statuses, schoolOrder]);
  const filteredDiscovery = useMemo(() => applyFilters(discoverySchools).slice().sort(sortFn), [discoverySchools, search, divFilter, sortBy, sortDir, statuses, schoolOrder]);

  const handleAddSchool = async () => {
    const typedName = newSchoolName.trim();
    if (!typedName) return;
    setIsSearching(true);
    setAddResult(null);
    try {
      const parsed = await fetchSchoolFromClaude(typedName);

      // No men's volleyball program at the resolved school.
      if (parsed.isVolleyballSchool === false) {
        setAddResult({
          kind: 'not_volleyball',
          text: parsed.inputInterpretation
            ? `No men's volleyball program found at ${parsed.inputInterpretation}.`
            : `No men's volleyball program found for "${typedName}".`,
          interpretation: parsed.inputInterpretation || null,
        });
        return;
      }

      // Duplicate detection — check both id and a loose name match against the
      // merged school list so seeded schools can't be silently re-added.
      const normalized = (x) => (x || '').toString().toLowerCase().trim();
      const existing = allSchools.find(s =>
        (parsed.id && s.id === parsed.id) ||
        (parsed.name && normalized(s.name) === normalized(parsed.name))
      );
      if (existing) {
        const placed = getEffectiveSection(existing) || 'primary';
        setAddResult({
          kind: 'duplicate',
          text: `${existing.name} is already in your hub.`,
          school: existing,
          interpretation: parsed.inputInterpretation || null,
          placedSection: isHidden(existing.id) ? 'hidden' : placed,
        });
        setNewSchoolName('');
        return;
      }

      // Success — add to extraSchools. Default to the discovery tab if Claude
      // didn't specify a section. Auto-switch the active tab so the user sees
      // the school land.
      const placedSection = parsed.section || 'discovery';
      const toAdd = { ...parsed, section: placedSection };
      setExtraSchools(prev => [toAdd, ...prev]);
      setNewSchoolName('');
      if (placedSection === 'primary' || placedSection === 'discovery') {
        setActiveSection(placedSection);
      }
      setAddResult({
        kind: 'success',
        text: `Added ${parsed.name} to ${placedSection === 'primary' ? 'Primary' : 'Discovery'}.`,
        school: toAdd,
        interpretation: parsed.inputInterpretation || null,
        placedSection,
        verified: parsed._coachVerified === true,
      });
    } catch (err) {
      setAddResult({ kind: 'error', text: err.message || 'Something went wrong while adding the school.' });
    } finally {
      setIsSearching(false);
    }
  };

  const navigate = (s) => { setSel(s); setView('detail'); window.scrollTo(0, 0); };
  const goEmail  = (s) => { if (s) setSel(s); setView('email'); window.scrollTo(0, 0); };
  const goGmail  = () => { setView('gmail'); window.scrollTo(0, 0); };
  const goBack = () => setView('master');

  const addLog = () => {
    if (!logDate || !sel) return;
    setLogs(prev => ({ ...prev, [sel.id]: [{ date: logDate, type: logType }, ...(prev[sel.id] || [])] }));
    const statusMap = { "Submitted Questionnaire": "Questionnaire", "Email / DM Sent": "Reached Out", "Coach Responded": "Coach Contact", "Phone / Video Call": "Coach Contact", "Campus Visit": "Campus Visit", "Verbal Offer": "Offer" };
    if (statusMap[logType]) setStatuses(prev => ({ ...prev, [sel.id]: statusMap[logType] }));
  };

  // Remove a single interaction-log entry by its index within the school's
  // log list. Leaves the school's status untouched (status is set forward by
  // addLog and not derivable from history, so we don't try to reconstruct it).
  const deleteLogEntry = (schoolId, index) => {
    setLogs(prev => {
      const list = prev[schoolId];
      if (!Array.isArray(list) || index < 0 || index >= list.length) return prev;
      const next = list.slice(0, index).concat(list.slice(index + 1));
      return { ...prev, [schoolId]: next };
    });
  };

  const value = {
    // data
    allSchools, visibleSchools, primarySchools, discoverySchools, hiddenSchools,
    filteredPrimary, filteredDiscovery, filteredSchools, divCounts, contacted,
    extraSchools, setExtraSchools,
    // persisted state
    statuses, setStatuses, logs, setLogs, notes, setNotes,
    hiddenIds, sectionOverrides,
    coachOverrides, deletedIds, schoolOrder,
    // helpers
    isHidden, getEffectiveSection, hideSchool, unhideSchool, moveToSection,
    deleteSchool, undeleteSchool, reVerifyCoach, clearCoachOverride, reorderSchools,
    // ui state
    view, setView, sel, setSel,
    search, setSearch, divFilter, setDivFilter,
    newSchoolName, setNewSchoolName, isSearching,
    addResult, setAddResult, clearAddResult,
    logDate, setLogDate, logType, setLogType,
    showHidden, setShowHidden, openMenuId, setOpenMenuId,
    activeSection, setActiveSection,
    sortBy, setSortBy, sortDir, toggleSort,
    density, setDensity,
    openDiscovery, setOpenDiscovery,
    // handlers
    handleAddSchool, navigate, goEmail, goGmail, goBack, addLog, deleteLogEntry,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
