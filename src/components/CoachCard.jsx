import React, { useState } from 'react';
import { Mail, Phone, Camera } from 'lucide-react';
import { COACH_PHOTOS } from '../data/coachPhotos.js';

export const CoachCard = ({ coach, schoolId }) => {
  const [imgFailed, setImgFailed] = useState(false);
  const photoUrl = COACH_PHOTOS[schoolId];
  const initials = coach.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className="p-4 bg-cc-surface-alt rounded-cc-md border border-cc-border">
      <div className="flex items-start gap-3">
        {/* Headshot */}
        <div className="flex-shrink-0 w-16 h-20 rounded-cc-md overflow-hidden bg-cc-bg border border-cc-border flex items-center justify-center">
          {photoUrl && !imgFailed ? (
            <img
              src={photoUrl}
              alt={coach.name}
              className="w-full h-full object-cover object-top"
              onError={() => setImgFailed(true)}
            />
          ) : (
            <div className="w-full h-full bg-cc-accent flex items-center justify-center">
              <span className="text-white font-display text-lg tracking-cc-wide">{initials}</span>
            </div>
          )}
        </div>
        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-1 mb-1">
            <span className="font-semibold text-cc-fg text-sm leading-tight">{coach.name}</span>
            <span className="text-[9px] bg-cc-bg text-cc-muted font-bold px-2 py-0.5 rounded-cc-sm uppercase tracking-cc-wider flex-shrink-0">{coach.role}</span>
          </div>
          {coach.email && (
            <a href={`mailto:${coach.email}`} className="flex items-center gap-1 text-xs text-cc-light-blue hover:text-cc-accent hover:underline mt-1">
              <Mail className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">{coach.email}</span>
            </a>
          )}
          {coach.phone && (
            <div className="flex items-center gap-1 text-xs text-cc-subtle mt-1">
              <Phone className="w-3 h-3 flex-shrink-0" />
              <span>{coach.phone}</span>
            </div>
          )}
          {!photoUrl && (
            <div className="flex items-center gap-1 text-[10px] text-cc-warning mt-1.5 font-medium"><Camera className="w-3 h-3" /> No photo on file</div>
          )}
        </div>
      </div>
    </div>
  );
};
