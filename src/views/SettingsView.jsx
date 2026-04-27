import React from 'react';
import { User, Download, Shield } from 'lucide-react';
import { PARKER } from '../data/constants.js';

const SECTION_CARD = 'bg-cc-surface rounded-cc-lg border border-cc-border p-6 shadow-cc-card';

export function SettingsView() {
  return (
    <div className="px-4 sm:px-6 lg:px-10 py-6 lg:py-8 max-w-4xl">
      <div className="mb-6">
        <div className="text-[11px] font-bold text-cc-subtle uppercase tracking-cc-widest flex items-center gap-2">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-cc-gold" />
          Account
        </div>
        <h1 className="font-display text-cc-fg text-cc-h2 leading-none mt-1 uppercase tracking-cc-wide">
          Settings
        </h1>
        <p className="text-cc-muted text-cc-body mt-1">Manage your athlete profile and preferences.</p>
      </div>

      <div className="space-y-5">
        <section className={SECTION_CARD}>
          <div className="flex items-center gap-3 mb-5">
            <User className="w-5 h-5 text-cc-accent" />
            <h2 className="font-display text-cc-fg text-lg uppercase tracking-cc-wide">
              Athlete Profile
            </h2>
          </div>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-sm">
            {[
              ['Name',               PARKER.name],
              ['Position',           PARKER.pos],
              ['Graduation Year',    PARKER.grad],
              ['High School',        PARKER.hs],
              ['Club Team',          PARKER.club],
              ['Academic Interests', PARKER.interests.join(', ')],
            ].map(([label, value]) => (
              <div key={label}>
                <dt className="text-[11px] font-bold uppercase tracking-cc-widest text-cc-subtle mb-1">{label}</dt>
                <dd className="text-cc-fg font-semibold">{value}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-6 text-xs text-cc-subtle italic">
            Profile editing coming soon — values are currently set in <code className="px-1.5 py-0.5 bg-cc-bg rounded-cc-sm text-cc-fg font-mono">src/data/constants.js</code>.
          </div>
        </section>

        <section className={SECTION_CARD}>
          <div className="flex items-center gap-3 mb-3">
            <Download className="w-5 h-5 text-cc-success" />
            <h2 className="font-display text-cc-fg text-lg uppercase tracking-cc-wide">
              Data Export
            </h2>
          </div>
          <div className="text-sm text-cc-muted">
            CSV / PDF export of your school pipeline and interaction logs — coming soon.
          </div>
        </section>

        <section className={SECTION_CARD}>
          <div className="flex items-center gap-3 mb-3">
            <Shield className="w-5 h-5 text-cc-muted" />
            <h2 className="font-display text-cc-fg text-lg uppercase tracking-cc-wide">
              Privacy &amp; Data
            </h2>
          </div>
          <div className="text-sm text-cc-muted leading-relaxed">
            Your pipeline, notes, and interaction logs are stored in Netlify Blobs, linked to this workspace.
            No data is shared with third parties.
          </div>
        </section>
      </div>
    </div>
  );
}
