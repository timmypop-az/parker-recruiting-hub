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
      className={`hover:bg-cc-bg cursor-pointer transition-colors duration-cc-base group ${draggable ? 'select-none' : ''}`}
      style={dragStyle}
      {...rest}
    >
      <td className={`px-5 ${py}`}>
        <div className="flex items-center gap-3">
          {draggable && (
            <span
              {...(dragProps || {})}
              onClick={(e) => e.stopPropagation()}
              className="flex-shrink-0 p-1 -ml-1 rounded text-cc-faint hover:text-cc-muted hover:bg-cc-bg cursor-grab active:cursor-grabbing"
              title="Drag to reorder"
              aria-label="Drag to reorder"
            >
              <GripVertical className="w-4 h-4" />
            </span>
          )}
          <SchoolLogo school={s} size={density === 'compact' ? 'sm' : 'md'} />
          <div>
            <div className="flex items-center gap-2">
              <span className={`font-display uppercase tracking-cc-wide text-cc-fg group-hover:text-cc-accent transition-colors ${density === 'compact' ? 'text-xs' : 'text-sm'}`}>{s.name}</span>
              <PriorityBadge priority={s.priority} />
            </div>
            <div className="text-[11px] text-cc-subtle">
              {s.mascot || "—"}
              {s.coaches?.[0]?.name && s.coaches[0].name !== "Head Coach TBD" && (
                <span className="ml-1 text-cc-faint">
                  · <span className="text-cc-fg font-medium">{s.coaches[0].name}</span>
                  {s.coaches[0].email && (
                    <a
                      href={`mailto:${s.coaches[0].email}`}
                      className="ml-1 text-cc-light-blue hover:text-cc-accent hover:underline"
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
      <td className={`px-5 ${py} text-cc-fg text-xs font-semibold whitespace-nowrap`}>{s.conference || "—"}</td>
      <td className={`px-5 ${py} text-cc-muted text-xs whitespace-nowrap`}>{s.city}, {s.state}</td>
      <td className={`px-5 ${py}`}>
        <div className="text-xs font-semibold text-cc-fg">{s.acceptance || "—"}</div>
        <div className="text-[11px] text-cc-subtle">{s.tuitionIn || "—"}</div>
      </td>
      <td className={`px-5 ${py}`}><NeedBadge need={s.setterNeed} /></td>
      <td className={`px-5 ${py}`}><StatusBadge statusKey={sStatus} /></td>
      <td className={`px-3 ${py} text-right`} data-row-menu>
        <div className="inline-flex items-center gap-1 relative">
          <button
            onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === s.id ? null : s.id); }}
            className="p-1.5 rounded-cc-sm hover:bg-cc-bg text-cc-faint hover:text-cc-fg transition-colors"
            title="More actions"
            aria-label="More actions"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
          <ChevronRight className="w-4 h-4 text-cc-faint group-hover:text-cc-accent transition-colors" />
          {openMenuId === s.id && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="absolute right-6 top-8 z-30 w-52 bg-cc-surface border border-cc-border rounded-cc-md shadow-cc-popover py-1.5 text-left"
            >
              {!hidden && getEffectiveSection(s) !== "primary" && (
                <button
                  onClick={() => { moveToSection(s.id, "primary"); setOpenMenuId(null); }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-bold uppercase tracking-cc-wider text-cc-fg hover:bg-cc-accent-soft hover:text-cc-accent transition-colors"
                >
                  <ArrowUpCircle className="w-4 h-4 text-cc-accent" />
                  Move to Primary
                </button>
              )}
              {!hidden && getEffectiveSection(s) !== "discovery" && (
                <button
                  onClick={() => { moveToSection(s.id, "discovery"); setOpenMenuId(null); }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-bold uppercase tracking-cc-wider text-cc-fg hover:bg-purple-50 hover:text-cc-purple transition-colors"
                >
                  <ArrowDownCircle className="w-4 h-4 text-cc-purple" />
                  Move to Discovery
                </button>
              )}
              {!hidden && <div className="border-t border-cc-border my-1" />}
              {hidden ? (
                <button
                  onClick={() => { unhideSchool(s.id); setOpenMenuId(null); }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-bold uppercase tracking-cc-wider text-cc-fg hover:bg-cc-accent-soft hover:text-cc-accent transition-colors"
                >
                  <Eye className="w-4 h-4 text-cc-accent" />
                  Restore School
                </button>
              ) : (
                <button
                  onClick={() => { hideSchool(s.id); setOpenMenuId(null); }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-bold uppercase tracking-cc-wider text-cc-fg hover:bg-rose-50 hover:text-cc-maroon transition-colors"
                >
                  <EyeOff className="w-4 h-4 text-cc-maroon" />
                  Hide School
                </button>
              )}
              <div className="border-t border-cc-border my-1" />
              <button
                onClick={() => {
                  setOpenMenuId(null);
                  if (window.confirm(`Permanently remove ${s.name} from the hub?`)) {
                    deleteSchool(s.id);
                  }
                }}
                className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-bold uppercase tracking-cc-wider text-cc-danger hover:bg-rose-50 transition-colors"
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
