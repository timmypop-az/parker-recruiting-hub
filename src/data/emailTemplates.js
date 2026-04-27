// ─── EMAIL TEMPLATES ─────────────────────────────────────────────────────────

export const buildTemplate = (id, school) => {
  const coachName = school?.coaches?.[0]?.name?.split(' ').slice(-1)[0] || "[Coach's Last Name]";
  const uName = school?.name || '[University Name]';
  const mascot = school?.mascot || '[Mascot]';

  const templates = {
    intro: {
      id: 'intro', phase: 'Phase 1', label: 'Introductory Email', icon: 'mail', color: 'blue',
      tip: 'Send to Head Coach & Assistants. Personalize the bracketed sections before sending.',
      subject: `Parker Henderson | 2028 Setter | 6'2" | 3.5 GPA | AZ Fear 17`,
      body: `Dear Coach ${coachName},\n\nMy name is Parker Henderson, and I am a class of 2028 Setter. I play for Brophy College Prep and wear #11 for AZ Fear 17. I am also proud to have been the starting setter for our U17 AZ High Performance Team.\n\nI am beginning my college search and am extremely interested in ${uName} because [INSERT SPECIFIC REASON — e.g., your program's fast-paced offense, your academic reputation in ${school?.academic?.top10?.[0] || 'your top major'}, or a recent team milestone].\n\nHere is my current athletic and academic profile:\n  • Position: Setter (Jersey #11)\n  • Height: 6'2"\n  • GPA: 3.5\n  • High School: Brophy College Prep\n  • Club Team: AZ Fear 17 / AZ High Performance\n\nPlease view this link to my highlight video from the 2025 USA All-Star Championships in Madison, WI: https://www.youtube.com/watch?v=2j6rLLkFZOU&authuser=0\n\nPlease also feel free to contact my high school coach, Tony Oldani, at toldani@brophyprep.org or 602-692-6536 for more information about my character and work ethic.\n\nThank you for your time, and I look forward to keeping you updated on my season!\n\nBest regards,\nParker Henderson\nClass of 2028 — Setter\nparkerhenderson.setter.2028@gmail.com\n480-823-1613`,
    },
    tournament: {
      id: 'tournament', phase: 'Phase 2', label: 'Pre-Tournament Invitation', icon: 'send', color: 'emerald',
      tip: 'Send 7–10 days before a major tournament. Fill in tournament details before sending.',
      subject: `Parker Henderson | 2028 Setter | [Tournament Name] Schedule`,
      body: `Dear Coach ${coachName},\n\nI hope all is well at ${uName}!\n\nI wanted to quickly reach out to let you know I will be competing at the [INSERT TOURNAMENT NAME] this upcoming weekend in [INSERT CITY, STATE]. I would be honored if you or your coaching staff had the opportunity to evaluate me in person.\n\nHere is my schedule for the weekend:\n  • Club/Team: AZ Fear 17\n  • Jersey: #11 (Colors: [INSERT JERSEY COLORS])\n  • Match 1: [DATE, TIME] — Court #[NUMBER]\n  • Match 2: [DATE, TIME] — Court #[NUMBER]\n  • Match 3: [DATE, TIME] — Court #[NUMBER]\n\nI have also attached my newly completed highlight video here for your review: Parker Henderson Highlight Video: https://www.youtube.com/watch?v=2j6rLLkFZOU&authuser=0\n\nSafe travels to the tournament, and I hope to see you there!\n\nBest,\nParker Henderson\nClass of 2028 — Setter\nparkerhenderson.setter.2028@gmail.com\n480-823-1613`,
    },
    video: {
      id: 'video', phase: 'Phase 3', label: 'New Highlight Video Follow-Up', icon: 'video', color: 'purple',
      tip: 'Send every few weeks with updated film. Coaches receive hundreds of emails — consistent follow-up is essential.',
      subject: `Parker Henderson | 2028 Setter | 6'2" | New Highlight Video`,
      body: `Dear Coach ${coachName},\n\nI hope you are having a great season so far!\n\nI am reaching out to share my updated highlight reel from my recent play with AZ Fear 17 and AZ High Performance. You can view the video here: Parker Henderson Highlight Video: https://www.youtube.com/watch?v=2j6rLLkFZOU&authuser=0\n\nI have been working hard on [MENTION A SPECIFIC SKILL — e.g., my jump setting / speeding up my footwork / out-of-system consistency], and I believe my film reflects that growth. I would greatly appreciate any feedback you might have on my play and what I need to do to potentially become a ${mascot}!\n\nIf you need any additional insights into my development, my coach, Tony Oldani, can be reached at toldani@brophyprep.org or 602-692-6536.\n\nThank you again for your time and consideration.\n\nBest,\nParker Henderson\nClass of 2028 — Setter\nparkerhenderson.setter.2028@gmail.com\n480-823-1613`,
    },
  };
  return templates[id] || templates.intro;
};

// Phase tints map to Campus Commit's tagging accents.
// Navy (workhorse) for the intro, forest for the live-eval tournament phase,
// purple for the creative/follow-up video phase.
export const COLOR_MAP = {
  blue:    { badge: 'bg-cc-accent',   light: 'bg-cc-accent-soft border-cc-border text-cc-accent', btn: 'bg-cc-accent hover:bg-cc-accent hover:opacity-90 text-white' },
  emerald: { badge: 'bg-cc-forest', light: 'bg-emerald-50 border-emerald-200 text-cc-forest', btn: 'bg-cc-forest hover:bg-emerald-700 text-white' },
  purple:  { badge: 'bg-cc-purple', light: 'bg-purple-50 border-purple-200 text-cc-purple',   btn: 'bg-cc-purple hover:bg-purple-700 text-white' },
};

