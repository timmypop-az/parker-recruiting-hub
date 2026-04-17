import React from 'react';
import { MoreVertical, ChevronRight, ArrowUpCircle, ArrowDownCircle, EyeOff, Eye, Trash2, GripVertical } from 'lucide-react';
import { SchoolLogo } from './SchoolLogo.jsx';
import { DivBadge, PriorityBadge, StatusBadge, NeedBadge } from './Badges.jsx';
import { useApp } from '../context/AppContext.jsx';

export const SchoolRow = React.forwardRef(({ s, dragStyle, draggable, dragProps, ...rest }, ref) => {
  const {
    statuses, navigate, openMenuId, setOpenMenuId,
    getEffectiveSection, moveToSection, hideSchool, unhideSchool,
    isHidden, density, deleteSchool,
  } = useApp();
  const sStatus = statuses[s.id] || "None";
  const py = density === 'compact' ? 'py-2' : 'py-4';
  const hidden = isHidden(s.id);
  return (
    <tr
      ref={ref}
      onClick={() => navigate(s)}
      className={`hover:bg-blue-50/30 cursor-pointer transition-colors group ${draggable ? 'select-none' : ''}`}
      style={dragStyle}
      {...rest}
    >
      <td className={`px-5 ${py}`}>
        <div className="flex items-center gap-3">
          {draggable && (
            <span
              {...(dragProps || {})}
              onClick={(e) => e.stopPropagation()}
              className="flex-shrink-0 p-1 -ml-1 rounded text-slate-300 hover:text-slate-500 hover:bg-slate-100 cursor-grab active:cursor-grabbing"
              title="Drag to reorder"
              aria-label="Drag to reorder"
            >
              <GripVertical className="w-4 h-4" />
            </span>
          )}
          <SchoolLogo school={s} size={density === 'compact' ? 'sm' : 'md'} />
          <div>
            <div className="flex items-center gap-2">
              <span className={`font-bold text-slate-800 group-hover:text-blue-600 transition-colors ${density === 'compact' ? 'text-xs' : 'text-sm'}`}>{s.name}</span>
              <PriorityBadge priority={s.priority} />
            </div>
            <div className="text-[11px] text-slate-500">
              {s.mascot || "—"}
              {s.coaches?.[0]?.name && s.coaches[0].name !== "Head Coach TBD" && (
                <span className="ml-1 text-slate-400">
                  · <span className="text-slate-600 font-medium">{s.coaches[0].name}</span>
                  {s.coaches[0].email && (
                    <a
                      href={`mailto:${s.coaches[0].email}`}
                      className="ml-1 text-blue-500 hover:text-blue-700 hover:underline"
                      onClick={e => e.stopPropagation()}
                    >
                      {s.coaches[0].email}
                    </a>
                  )}
                </span>
              )}
            </div>
          </div>
        </div>
      </td>
      <td className={`px-5 ${py}`}><DivBadge divLevel={s.divLevel} /></td>
      <td className={`px-5 ${py} text-slate-600 text-xs font-semibold whitespace-nowrap`}>{s.conference || "—"}</td>
      <td className={`px-5 ${py} text-slate-500 text-xs whitespace-nowrap`}>{s.city}, {s.state}</td>
      <td className={`px-5 ${py}`}>
        <div className="text-xs font-semibold text-slate-700">{s.acceptance || "—"}</div>
        <div className="text-[11px] text-slate-500">{s.tuitionIn || "—"}</div>
      </td>
      <td className={`px-5 ${py}`}><NeedBadge need={s.setterNeed} /></td>
      <td className={`px-5 ${py}`}><StatusBadge statusKey={sStatus} /></td>
      <td className={`px-3 ${py} text-right`} data-row-menu>
        <div className="inline-flex items-center gap-1 relative">
          <button
            onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === s.id ? null : s.id); }}
            className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition-colors"
            title="More actions"
            aria-label="More actions"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
          <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500 transition-colors" />
          {openMenuId === s.id && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="absolute right-6 top-8 z-30 w-52 bg-white border border-slate-200 rounded-xl shadow-xl py-1.5 text-left"
            >
              {!hidden && getEffectiveSection(s) !== "primary" && (
                <button
                  onClick={() => { moveToSection(s.id, "primary"); setOpenMenuId(null); }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-bold uppercase tracking-wide text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                >
                  <ArrowUpCircle className="w-4 h-4 text-blue-500" />
                  Move to Primary
                </button>
              )}
              {!hidden && getEffectiveSection(s) !== "discovery" && (
                <button
                  onClick={() => { moveToSection(s.id, "discovery"); setOpenMenuId(null); }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-bold uppercase tracking-wide text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
                >
                  <ArrowDownCircle className="w-4 h-4 text-indigo-500" />
                  Move to Discovery
                </button>
              )}
              {!hidden && <div className="border-t border-slate-100 my-1" />}
              {hidden ? (
                <button
                  onClick={() => { unhideSchool(s.id); setOpenMenuId(null); }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-bold uppercase tracking-wide text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                >
                  <Eye className="w-4 h-4 text-blue-500" />
                  Restore School
                </button>
              ) : (
                <button
                  onClick={() => { hideSchool(s.id); setOpenMenuId(null); }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-bold uppercase tracking-wide text-slate-700 hover:bg-rose-50 hover:text-rose-700 transition-colors"
                >
                  <EyeOff className="w-4 h-4 text-rose-500" />
                  Hide School
                </button>
              )}
              <div className="border-t border-slate-100 my-1" />
              <button
                onClick={() => {
                  setOpenMenuId(null);
                  if (window.confirm(`Permanently remove ${s.name} from the hub?`)) {
                    deleteSchool(s.id);
                  }
                }}
                className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-bold uppercase tracking-wide text-rose-600 hover:bg-rose-50 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Delete School
              </button>
            </div>
          )}
        </div>
      </td>
    </tr>
  );
});
SchoolRow.displayName = 'SchoolRow';
