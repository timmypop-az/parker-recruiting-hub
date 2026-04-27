import React from 'react';
import { LayoutDashboard, Mail, Send, Settings, X, Sparkles, Sun, Moon } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import { PARKER } from '../data/constants.js';
import { useTheme } from '../lib/useTheme.js';

const NAV_ITEMS = [
  { id: 'master',   label: 'Schools',         icon: LayoutDashboard, description: 'Program pipeline' },
  { id: 'email',    label: 'Email Templates', icon: Mail,            description: 'Outreach copy' },
  { id: 'gmail',    label: 'Gmail Drafts',    icon: Send,            description: 'Bulk drafting' },
  { id: 'settings', label: 'Settings',        icon: Settings,        description: 'Profile & preferences' },
];

export function Sidebar({ open, onClose }) {
  const { view, setView, allSchools, contacted, setOpenDiscovery } = useApp();
  const { theme, toggle: toggleTheme } = useTheme();

  const isActive = (id) => {
    if (id === 'master') return view === 'master' || view === 'detail';
    return view === id;
  };

  const handleNav = (id) => {
    setView(id);
    onClose?.();
  };

  const initials = PARKER.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  return (
    <>
      {/* Mobile backdrop */}
      {open && <div className="md:hidden fixed inset-0 bg-black/40 z-30" onClick={onClose} />}

      <aside
        className={`fixed md:sticky top-0 left-0 z-40 h-screen w-64 flex-shrink-0 border-r border-cc-border bg-cc-surface transform transition-transform md:transform-none ${
          open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Brand header */}
          <div className="px-5 py-5 border-b border-cc-border flex items-center gap-3">
            <img
              src="/brand/cc-monogram.png"
              alt="Campus Commit"
              className="w-10 h-10 flex-shrink-0"
            />
            <div className="min-w-0">
              <div className="font-display uppercase text-cc-accent text-base leading-tight tracking-cc-wide truncate">
                Campus Commit
              </div>
              <div className="text-[10px] text-cc-subtle font-semibold uppercase tracking-cc-widest">
                Men's Volleyball
              </div>
            </div>
            <button
              onClick={toggleTheme}
              className="ml-auto p-1.5 rounded-cc-sm hover:bg-cc-bg text-cc-muted hover:text-cc-fg transition-colors"
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="md:hidden p-1.5 rounded-cc-sm hover:bg-cc-bg text-cc-muted"
              aria-label="Close menu"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Primary CTA — Discovery Engine */}
          <div className="px-3 pt-3">
            <button
              onClick={() => { setOpenDiscovery(true); handleNav('master'); }}
              className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-cc-sm bg-cc-accent text-white text-cc-button font-display uppercase tracking-cc-widest transition-colors duration-cc-base hover:bg-cc-accent hover:opacity-90 active:translate-y-px focus:outline-none focus:ring-2 focus:ring-cc-focus focus:ring-offset-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Discover a Program</span>
            </button>
          </div>

          {/* Nav list */}
          <nav className="flex-1 overflow-y-auto px-3 pt-4 pb-3 space-y-1">
            <div className="px-3 pb-2 text-[10px] font-bold text-cc-faint uppercase tracking-cc-widest">
              Workspace
            </div>
            {NAV_ITEMS.map(item => {
              const Icon = item.icon;
              const active = isActive(item.id);
              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-cc-md text-left transition-colors duration-cc-base ${
                    active ? 'bg-cc-accent-soft' : 'hover:bg-cc-bg'
                  }`}
                >
                  <Icon className={`w-4 h-4 flex-shrink-0 ${active ? 'text-cc-accent' : 'text-cc-faint'}`} />
                  <div className="min-w-0 flex-1">
                    <div className={`font-display text-sm uppercase tracking-cc-wide leading-tight ${active ? 'text-cc-accent' : 'text-cc-fg'}`}>
                      {item.label}
                    </div>
                    <div className="text-[10px] text-cc-subtle truncate mt-0.5">{item.description}</div>
                  </div>
                </button>
              );
            })}
          </nav>

          {/* Athlete card at bottom */}
          <div className="px-3 pb-4">
            <div className="rounded-cc-lg p-3 border border-cc-border bg-cc-surface-alt">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-cc-accent flex items-center justify-center text-white font-display text-sm tracking-cc-wide flex-shrink-0">
                  {initials}
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-cc-fg leading-tight truncate">{PARKER.name}</div>
                  <div className="text-[10px] text-cc-subtle truncate">
                    {PARKER.pos} · Class of {PARKER.grad}
                  </div>
                </div>
              </div>
              <div className="mt-2.5 grid grid-cols-2 gap-1.5 text-center">
                <div className="bg-cc-surface rounded-cc-sm py-1.5 border border-cc-border">
                  <div className="display-num text-base text-cc-accent leading-none tabular">
                    {allSchools.length}
                  </div>
                  <div className="text-[9px] text-cc-subtle uppercase tracking-cc-wider mt-0.5">Tracked</div>
                </div>
                <div className="bg-cc-surface rounded-cc-sm py-1.5 border border-cc-border">
                  <div className="display-num text-base text-cc-success leading-none tabular">
                    {contacted}
                  </div>
                  <div className="text-[9px] text-cc-subtle uppercase tracking-cc-wider mt-0.5">Active</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
