// ─── PARKER PROFILE ──────────────────────────────────────────────────────────
export const PARKER = {
  name: "Parker Henderson",
  dob: "2009-05-10",
  grad: 2028,
  hs: "Brophy College Prep",
  pos: "Setter",
  club: "AZ Fear 17s",
  interests: ["Business", "Aviation", "Theology/Faith"],
};

// ─── CONSTANTS ───────────────────────────────────────────────────────────────
// Status + division colors use Campus Commit's "tagging accent" palette
// (forest / maroon / purple / orange / light-blue + neutrals). Never the
// primary navy or achievement-only gold.
export const STATUSES = [
  { key: "None",          label: "Not Started",   dot: "#94A3B8", bg: "bg-slate-100",      text: "text-cc-subtle" },
  { key: "Questionnaire", label: "Submitted Q",   dot: "#D97706", bg: "bg-amber-50",       text: "text-cc-warning" },
  { key: "Reached Out",   label: "Reached Out",   dot: "#F07216", bg: "bg-orange-50",      text: "text-cc-orange" },
  { key: "Coach Contact", label: "Coach Contact", dot: "#2E92F5", bg: "bg-sky-50",         text: "text-cc-light-blue" },
  { key: "Campus Visit",  label: "Campus Visit",  dot: "#5E33A1", bg: "bg-purple-50",      text: "text-cc-purple" },
  { key: "Offer",         label: "Offer",         dot: "#167A4E", bg: "bg-emerald-50",     text: "text-cc-forest" },
];

export const DIV_CONFIG = {
  "DI":   { label: "D-I",   bg: "bg-cc-accent",       text: "text-white" },
  "DII":  { label: "D-II",  bg: "bg-cc-purple",     text: "text-white" },
  "DIII": { label: "D-III", bg: "bg-cc-forest",     text: "text-white" },
  "NAIA": { label: "NAIA",  bg: "bg-cc-orange",     text: "text-white" },
  "JUCO": { label: "JUCO",  bg: "bg-cc-maroon",     text: "text-white" },
};
