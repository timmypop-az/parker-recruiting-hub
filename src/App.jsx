import React, { useState, useMemo, useEffect } from 'react';
import {
  Search, Target, PlusCircle, ArrowLeft, ShieldCheck, Compass,
  ChevronRight, Instagram, Sparkles, Loader2, Trophy,
  MapPin, TrendingUp, GraduationCap,
  Mail, Calendar, Zap, BookOpen, Users, Star, Plane, Church,
  Copy, Check, FileText, Send,
  MoreVertical, EyeOff, Eye, ArrowUpCircle, ArrowDownCircle, ChevronDown,
  Phone, Camera, BarChart3, Video, ClipboardList, PartyPopper,
  PenLine, Briefcase, Circle, X, Inbox, CheckCircle2
} from 'lucide-react';

const FontStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800;900&family=Barlow:wght@400;500;600;700&display=swap');
    * { font-family: 'Barlow', sans-serif; }
    .font-display { font-family: 'Barlow Condensed', sans-serif; }
  `}</style>
);

// ─── PARKER PROFILE ──────────────────────────────────────────────────────────
const PARKER = {
  name: "Parker Henderson",
  dob: "2009-05-10",
  grad: 2028,
  hs: "Brophy College Prep",
  pos: "Setter",
  club: "AZ Fear 17s",
  interests: ["Business", "Aviation", "Theology/Faith"],
};

// ─── CONSTANTS ───────────────────────────────────────────────────────────────
const STATUSES = [
  { key: "None",          label: "Not Started",   dot: "#94a3b8", bg: "bg-slate-100",   text: "text-slate-500"  },
  { key: "Questionnaire", label: "Submitted Q",   dot: "#eab308", bg: "bg-yellow-50",  text: "text-yellow-700" },
  { key: "Reached Out",   label: "Reached Out",   dot: "#f97316", bg: "bg-orange-50",  text: "text-orange-700" },
  { key: "Coach Contact", label: "Coach Contact", dot: "#3b82f6", bg: "bg-blue-50",    text: "text-blue-700"   },
  { key: "Campus Visit",  label: "Campus Visit",  dot: "#8b5cf6", bg: "bg-purple-50",  text: "text-purple-700" },
  { key: "Offer",         label: "Offer",         dot: "#10b981", bg: "bg-emerald-50", text: "text-emerald-700"},
];

const DIV_CONFIG = {
  "DI":   { label: "D-I",   bg: "bg-blue-600",    text: "text-white" },
  "DII":  { label: "D-II",  bg: "bg-violet-600",  text: "text-white" },
  "DIII": { label: "D-III", bg: "bg-emerald-600", text: "text-white" },
  "NAIA": { label: "NAIA",  bg: "bg-orange-500",  text: "text-white" },
  "JUCO": { label: "JUCO",  bg: "bg-slate-500",   text: "text-white" },
};

// ─── COACH PHOTO URLs ─────────────────────────────────────────────────────────
// Direct Sidearm CDN URLs, verified from official athletic roster pages.
// Falls back to initials avatar when photo fails to load.
const COACH_PHOTOS = {
  usc:   "https://images.sidearmdev.com/crop?url=https%3A%2F%2Fdxbhsrqyrr690.cloudfront.net%2Fsidearm.nextgen.sites%2Fusctrojans.com%2Fimages%2F2025%2F12%2F15%2F26MVB_C_NYGAARD__Jeff.jpg&width=180&height=270&type=webp",
  pep:   "https://images.sidearmdev.com/crop?url=https%3A%2F%2Fdxbhsrqyrr690.cloudfront.net%2Fsidearm.nextgen.sites%2Fpepperdinewaves.com%2Fimages%2F2022%2F8%2F9%2FWinder_Jonathan.jpg&width=180&height=270&type=webp",
  luc:   "https://images.sidearmdev.com/crop?url=https%3A%2F%2Fdxbhsrqyrr690.cloudfront.net%2Fsidearm.nextgen.sites%2Floyolaramblers.com%2Fimages%2F2024%2F11%2F6%2FDavis_Shane_2024-2.jpg&width=180&height=270&type=webp",
  bsu:   "https://images.sidearmdev.com/crop?url=https%3A%2F%2Fdxbhsrqyrr690.cloudfront.net%2Fsidearm.nextgen.sites%2Fballstatesports.com%2Fimages%2F2020%2F6%2F5%2FCruz_Donan.jpg&width=180&height=270&type=webp",
  cui:   "https://images.sidearmdev.com/crop?url=https%3A%2F%2Fdxbhsrqyrr690.cloudfront.net%2Fsidearm.nextgen.sites%2Fcuigoldeneagles.com%2Fimages%2F2023%2F8%2F1%2FGirten_Jonathan.jpg&width=180&height=270&type=webp",
  lbsu:  "https://images.sidearmdev.com/crop?url=https%3A%2F%2Fdxbhsrqyrr690.cloudfront.net%2Fsidearm.nextgen.sites%2Flongbeachstate.com%2Fimages%2F2025%2F12%2F2%2FMacRae_Nick_HeadCoach.jpg&width=180&height=270&type=webp",
  uh:    "https://images.sidearmdev.com/crop?url=https%3A%2F%2Fdxbhsrqyrr690.cloudfront.net%2Fsidearm.nextgen.sites%2Fhawaiiathletics.com%2Fimages%2F2019%2F9%2F13%2FWade_Charlie.jpg&width=180&height=270&type=webp",
  gm:    "https://images.sidearmdev.com/crop?url=https%3A%2F%2Fdxbhsrqyrr690.cloudfront.net%2Fsidearm.nextgen.sites%2Fgomason.com%2Fimages%2F2023%2F8%2F10%2FHosack_Jay.jpg&width=180&height=270&type=webp",
  lewis: "https://images.sidearmdev.com/crop?url=https%3A%2F%2Fdxbhsrqyrr690.cloudfront.net%2Fsidearm.nextgen.sites%2Flewisflyers.com%2Fimages%2F2022%2F8%2F3%2FFriend_Dan.jpg&width=180&height=270&type=webp",
  psu:   "https://images.sidearmdev.com/crop?url=https%3A%2F%2Fdxbhsrqyrr690.cloudfront.net%2Fsidearm.nextgen.sites%2Fgopsusports.com%2Fimages%2F2022%2F9%2F27%2FPavlik_Mark.jpg&width=180&height=270&type=webp",
  ucsb:  "https://images.sidearmdev.com/crop?url=https%3A%2F%2Fdxbhsrqyrr690.cloudfront.net%2Fsidearm.nextgen.sites%2Fucsbgauchos.com%2Fimages%2F2022%2F8%2F15%2FMcLaughlin_Rick.jpg&width=180&height=270&type=webp",
  uci:   "https://images.sidearmdev.com/crop?url=https%3A%2F%2Fdxbhsrqyrr690.cloudfront.net%2Fsidearm.nextgen.sites%2Fucirvinesports.com%2Fimages%2F2022%2F8%2F19%2FKniffin_David.jpg&width=180&height=270&type=webp",
  csun:  "https://images.sidearmdev.com/crop?url=https%3A%2F%2Fdxbhsrqyrr690.cloudfront.net%2Fsidearm.nextgen.sites%2Fgomatadors.com%2Fimages%2F2023%2F2%2F6%2FEdwards_Theo.jpg&width=180&height=270&type=webp",
  pf:    "https://images.sidearmdev.com/crop?url=https%3A%2F%2Fdxbhsrqyrr690.cloudfront.net%2Fsidearm.nextgen.sites%2Fgomastodons.com%2Fimages%2F2024%2F6%2F20%2FGleason_Donny.jpg&width=180&height=270&type=webp",
  menlo: "https://images.sidearmdev.com/crop?url=https%3A%2F%2Fdxbhsrqyrr690.cloudfront.net%2Fsidearm.nextgen.sites%2Fmenloathletics.com%2Fimages%2F2025%2F10%2F1%2FKeohohou_Alii.jpg&width=180&height=270&type=webp",
};


// ─── FULL SCHOOL DATA ────────────────────────────────────────────────────────
const ALL_SCHOOLS_DATA = [
  // ── PRIMARY TARGETS ──
  {
    id: "jessup", name: "Jessup University", city: "Rocklin", state: "CA", mascot: "Warriors",
    divLevel: "DII", conference: "PacWest", priority: "Target", section: "primary",
    acceptance: "65%", tuitionIn: "$37,000", tuitionOut: "$37,000",
    programRank: "NR", setterNeed: "Med",
    url: "https://www.jessup.edu", logoUrl: "https://www.jessup.edu",
    vbUrl: "https://jessupathletics.com/sports/mens-volleyball",
    programIG: "@jessup_mvb", questionnaireUrl: "https://jessupathletics.com/sb_output.aspx?form=3",
    academic: { top10: ["Business","Psychology","Kinesiology","Education","Biology","Criminal Justice","Comm","Music"], business: "School of Business — Leadership Focus", theology: "Center for Bible & Theology (CCCU affiliate)", aviation: "Partner hubs near Sacramento (SMF)", avgGPA: "3.4", gradRate: "62%" },
    parkerFit: { business: true, aviation: false, theology: true, notes: "Strong faith-integrated education at a CCCU-affiliated school aligns with Parker's values. Business leadership track is well-regarded. Setter need is moderate with 2027 graduation opening on the roster. Rocklin campus offers a tight-knit Christian community." },
    coaches: [{ name: "Kyle Steele", role: "Head Coach", email: "klsteele@jessup.edu", phone: "" }],
    setters: [{ name: "Sophomore Setter", grad: "2027", class: "SO" }],
    azRadar: [],
    winHistory: [{ yr: '2026', w: 8, l: 15, p: '.348' }, { yr: '2025', w: 10, l: 12, p: '.454' }, { yr: '2024', w: 8, l: 15, p: '.347' }],
    news: [{ date: "Feb 2026", title: "Jessup Transitions to Full DII PacWest Membership", body: "Warriors begin full membership cycle in the PacWest Conference.", url: "https://jessupathletics.com" }],
    schedule26: [
      { d: "Jan 16", o: "vs Vanguard", r: "W 3-1", home: true }, { d: "Jan 17", o: "vs Cal Baptist", r: "L 1-3", home: true },
      { d: "Jan 23", o: "@ Point Loma Nazarene", r: "W 3-2", home: false }, { d: "Jan 24", o: "@ Biola", r: "L 0-3", home: false },
      { d: "Jan 30", o: "vs Holy Names", r: "W 3-0", home: true }, { d: "Feb 06", o: "@ Concordia Irvine", r: "L 0-3", home: false },
      { d: "Feb 07", o: "@ Vanguard", r: "W 3-1", home: false }, { d: "Feb 13", o: "vs Biola", r: "W 3-2", home: true },
      { d: "Feb 14", o: "vs Point Loma Nazarene", r: "L 2-3", home: true }, { d: "Feb 20", o: "@ Cal Baptist", r: "L 1-3", home: false },
      { d: "Feb 21", o: "@ Hope International", r: "W 3-0", home: false }, { d: "Feb 27", o: "vs Concordia Irvine", r: "L 0-3", home: true },
      { d: "Feb 28", o: "vs AZ Christian", r: "W 3-1", home: true }, { d: "Mar 06", o: "@ Holy Names", r: "W 3-0", home: false },
      { d: "Mar 07", o: "@ Dominican", r: "L 2-3", home: false }, { d: "Mar 13", o: "vs Vanguard — PacWest", r: "Upcoming", home: true },
      { d: "Mar 14", o: "vs Biola — PacWest", r: "Upcoming", home: true }, { d: "Mar 20", o: "@ Point Loma — PacWest", r: "Upcoming", home: false },
      { d: "Mar 21", o: "@ Cal Baptist — PacWest", r: "Upcoming", home: false }, { d: "Mar 27", o: "vs Hope Intl — PacWest", r: "Upcoming", home: true },
      { d: "Mar 28", o: "vs Concordia Irvine — PacWest", r: "Upcoming", home: true }, { d: "Apr 03", o: "@ AZ Christian — PacWest", r: "Upcoming", home: false },
      { d: "Apr 10", o: "PacWest Tournament — Quarterfinal", r: "Upcoming", home: false }, { d: "Apr 17", o: "PacWest Tournament — Semifinal", r: "Upcoming", home: false },
      { d: "Apr 24", o: "PacWest Championship", r: "Upcoming", home: false },
    ], notes: ""
  },
  {
    id: "cui", name: "Concordia Irvine", city: "Irvine", state: "CA", mascot: "Golden Eagles",
    divLevel: "DI", conference: "MPSF", priority: "Target", section: "primary",
    acceptance: "78%", tuitionIn: "$41,200", tuitionOut: "$41,200",
    programRank: "NR", setterNeed: "High",
    url: "https://www.cui.edu", logoUrl: "https://www.cui.edu",
    vbUrl: "https://www.cuigoldeneagles.com/sports/mens-volleyball",
    programIG: "@cuimvb", questionnaireUrl: "https://www.cuigoldeneagles.com/sb_output.aspx?form=3",
    academic: { top10: ["Business Admin","Psychology","Kinesiology","Biology","Nursing","Exercise Science","Elementary Ed","Liberal Arts","Communication","Marketing"], business: "AACSB Accredited School of Business", theology: "Christ College — LCMS Lutheran affiliation, strong theology dept", aviation: "Near SNA/LAX, partnerships with Viterbi aviation programs", avgGPA: "3.5", gradRate: "76%" },
    parkerFit: { business: true, aviation: false, theology: true, notes: "CUI checks multiple boxes: AACSB business, Lutheran Christ College theology, and HIGH setter need heading into 2028. Program ranked #18 nationally at D-I — real competitive volleyball. Irvine location is attractive and the faith-integrated environment fits Parker's values." },
    coaches: [{ name: "Jon Girten", role: "Head Coach", email: "jonathan.girten@cui.edu", phone: "" }],
    setters: [{ name: "Yotam Briger", grad: "2027", class: "SO" }, { name: "McLain Mott", grad: "2026", class: "SR" }, { name: "Tijmen Doornstra", grad: "2028", class: "FR" }],
    azRadar: [],
    winHistory: [{ yr: '2026', w: 7, l: 15, p: '.318' }, { yr: '2025', w: 12, l: 15, p: '.444' }, { yr: '2024', w: 6, l: 19, p: '.240' }, { yr: '2023', w: 8, l: 19, p: '.296' }, { yr: '2022', w: 10, l: 16, p: '.385' }],
    news: [
      { date: "Feb 26, 2026", title: "Briger Named MPSF Offensive Player of the Week", body: "Sophomore setter Yotam Briger recognized for elite distribution in win over Princeton.", url: "https://mpsports.org" },
      { date: "Jan 12, 2026", title: "New Training Facility Phase 1 Complete", body: "CUI unveils renovated weight room designed for explosive vertical training.", url: "https://www.cuigoldeneagles.com" }
    ],
    schedule26: [
      { d: "Jan 09", o: "vs Grand Canyon", r: "W 3-1", home: true }, { d: "Jan 10", o: "vs Concordia Chicago", r: "W 3-0", home: true },
      { d: "Jan 16", o: "@ Princeton", r: "W 3-1", home: false }, { d: "Jan 17", o: "@ Harvard", r: "W 3-2", home: false },
      { d: "Jan 20", o: "@ Princeton (rematch)", r: "W 3-0", home: false }, { d: "Jan 23", o: "vs UC San Diego — MPSF", r: "L 1-3", home: true },
      { d: "Jan 24", o: "vs Stanford — MPSF", r: "L 0-3", home: true }, { d: "Jan 30", o: "@ Pepperdine — MPSF", r: "L 1-3", home: false },
      { d: "Jan 31", o: "@ Cal Baptist — MPSF", r: "W 3-2", home: false }, { d: "Feb 06", o: "vs UC Irvine — MPSF", r: "L 1-3", home: true },
      { d: "Feb 07", o: "vs Jessup", r: "W 3-0", home: true }, { d: "Feb 13", o: "@ Long Beach State — MPSF", r: "L 2-3", home: false },
      { d: "Feb 14", o: "@ UC San Diego — MPSF", r: "L 0-3", home: false }, { d: "Feb 20", o: "vs USC — MPSF", r: "W 3-2", home: true },
      { d: "Feb 21", o: "vs Stanford — MPSF", r: "L 1-3", home: true }, { d: "Feb 26", o: "@ Hawaii — MPSF", r: "L 0-3", home: false },
      { d: "Feb 27", o: "vs Pepperdine — MPSF", r: "W 3-1", home: true }, { d: "Mar 06", o: "vs Cal Baptist — MPSF", r: "W 3-2", home: true },
      { d: "Mar 07", o: "@ UC Irvine — MPSF", r: "L 2-3", home: false },
      { d: "Mar 13", o: "vs Long Beach State — MPSF", r: "Upcoming", home: true }, { d: "Mar 14", o: "vs UC San Diego — MPSF", r: "Upcoming", home: true },
      { d: "Mar 20", o: "@ USC — MPSF", r: "Upcoming", home: false }, { d: "Mar 21", o: "@ Stanford — MPSF", r: "Upcoming", home: false },
      { d: "Mar 27", o: "vs Hawaii — MPSF", r: "Upcoming", home: true }, { d: "Mar 28", o: "@ Pepperdine — MPSF", r: "Upcoming", home: false },
      { d: "Apr 03", o: "@ Cal Baptist — MPSF", r: "Upcoming", home: false }, { d: "Apr 04", o: "vs UC Irvine — MPSF", r: "Upcoming", home: true },
      { d: "Apr 10", o: "vs Long Beach State — MPSF", r: "Upcoming", home: true }, { d: "Apr 17", o: "MPSF Tournament — Quarterfinal", r: "Upcoming", home: false },
      { d: "Apr 23", o: "MPSF Tournament — Semifinal", r: "Upcoming", home: false }, { d: "Apr 24", o: "MPSF Championship", r: "Upcoming", home: false },
    ], notes: ""
  },
  {
    id: "bsu", name: "Ball State", city: "Muncie", state: "IN", mascot: "Cardinals",
    divLevel: "DI", conference: "MIVA", priority: "Reach", section: "primary",
    acceptance: "69%", tuitionIn: "$10,500", tuitionOut: "$28,400",
    programRank: "#7", setterNeed: "Med",
    url: "https://www.bsu.edu", logoUrl: "https://www.bsu.edu",
    vbUrl: "https://ballstatesports.com/sports/mens-volleyball",
    programIG: "@ballstatemvb", questionnaireUrl: "https://ballstatesports.com/sb_output.aspx?form=10",
    academic: { top10: ["Architecture","Nursing","Business Admin","Education","Marketing","Aviation","Journalism","Criminal Justice","Actuarial Science","Psychology"], business: "Miller College of Business — strong marketing & entrepreneurship", theology: "Philosophy & Religious Studies department", aviation: "★★★ Elite Flight Technology Program — top 5 nationally, own airport (KMUN)", avgGPA: "3.3", gradRate: "70%" },
    parkerFit: { business: true, aviation: true, theology: false, notes: "Ball State is a TOP match for Parker's aviation interest — ranked elite nationally with its own campus airport. Miller College of Business is strong. At #5 nationally this is a Reach but worth pursuing. AZ Fear playing at high level nationally will get noticed by Coach Cruz." },
    coaches: [{ name: "Mike Iandolo", role: "Head Coach", email: "miandolo@bsu.edu", phone: "" }],
    setters: [{ name: "Peter Zurawski", grad: "2027", class: "JR" }, { name: "Lucas Machado", grad: "2026", class: "SR" }],
    azRadar: [{ name: "Ryan Louis", pos: "OPP", hs: "Shadow Ridge (Surprise)" }],
    winHistory: [{ yr: '2026', w: 21, l: 4, p: '.840' }, { yr: '2025', w: 22, l: 8, p: '.733' }, { yr: '2024', w: 21, l: 10, p: '.677' }, { yr: '2023', w: 20, l: 9, p: '.690' }, { yr: '2022', w: 23, l: 4, p: '.852' }],
    news: [{ date: "Feb 18, 2026", title: "Cruz Reaches 100 Career Wins", body: "HC secures milestone win against Illinois.", url: "https://ballstatesports.com" }],
    schedule26: [
      { d: "Jan 09", o: "vs Lindenwood", r: "W 3-0", home: true }, { d: "Jan 10", o: "vs McKendree", r: "W 3-1", home: true },
      { d: "Jan 16", o: "@ Ohio State — MIVA", r: "W 3-2", home: false }, { d: "Jan 17", o: "@ Ohio State — MIVA", r: "W 3-1", home: false },
      { d: "Jan 22", o: "vs Ohio State — MIVA", r: "W 3-1", home: true }, { d: "Jan 23", o: "vs Purdue Fort Wayne — MIVA", r: "W 3-0", home: true },
      { d: "Jan 30", o: "@ Lewis — MIVA", r: "W 3-2", home: false }, { d: "Jan 31", o: "@ McKendree — MIVA", r: "W 3-0", home: false },
      { d: "Feb 06", o: "vs Loyola Chicago — MIVA", r: "W 3-1", home: true }, { d: "Feb 07", o: "vs Lindenwood — MIVA", r: "W 3-0", home: true },
      { d: "Feb 13", o: "@ George Mason — MIVA", r: "L 2-3", home: false }, { d: "Feb 14", o: "@ George Mason — MIVA", r: "W 3-1", home: false },
      { d: "Feb 18", o: "vs Purdue Fort Wayne — MIVA", r: "W 3-0", home: true }, { d: "Feb 20", o: "vs Lewis — MIVA", r: "W 3-2", home: true },
      { d: "Feb 21", o: "vs McKendree — MIVA", r: "W 3-0", home: true }, { d: "Feb 27", o: "@ Loyola Chicago — MIVA", r: "L 1-3", home: false },
      { d: "Feb 28", o: "@ Lindenwood — MIVA", r: "W 3-1", home: false }, { d: "Mar 06", o: "vs George Mason — MIVA", r: "W 3-0", home: true },
      { d: "Mar 07", o: "vs Ohio State — MIVA", r: "W 3-2", home: true },
      { d: "Mar 13", o: "@ Purdue Fort Wayne — MIVA", r: "Upcoming", home: false }, { d: "Mar 14", o: "@ Lewis — MIVA", r: "Upcoming", home: false },
      { d: "Mar 20", o: "vs Loyola Chicago — MIVA", r: "Upcoming", home: true }, { d: "Mar 21", o: "vs Lindenwood — MIVA", r: "Upcoming", home: true },
      { d: "Mar 27", o: "@ George Mason — MIVA", r: "Upcoming", home: false }, { d: "Mar 28", o: "@ McKendree — MIVA", r: "Upcoming", home: false },
      { d: "Apr 03", o: "vs Purdue Fort Wayne — MIVA", r: "Upcoming", home: true }, { d: "Apr 04", o: "vs Lewis — MIVA", r: "Upcoming", home: true },
      { d: "Apr 10", o: "MIVA Tournament — Quarterfinal", r: "Upcoming", home: false }, { d: "Apr 16", o: "MIVA Tournament — Semifinal", r: "Upcoming", home: false },
      { d: "Apr 17", o: "MIVA Championship (Columbus, OH)", r: "Upcoming", home: false },
    ], notes: ""
  },
  {
    id: "usc", name: "USC", city: "Los Angeles", state: "CA", mascot: "Trojans",
    divLevel: "DI", conference: "MPSF", priority: "Reach", section: "primary",
    acceptance: "12%", tuitionIn: "$66,600", tuitionOut: "$66,600",
    programRank: "#4", setterNeed: "Low",
    url: "https://www.usc.edu", logoUrl: "https://www.usc.edu",
    vbUrl: "https://usctrojans.com/sports/mens-volleyball",
    programIG: "@uscmvb", questionnaireUrl: "https://usctrojans.com/sb_output.aspx?form=15",
    academic: { top10: ["Business","Comp Sci","Finance","Cinema/TV","Comm","Engineering","Int'l Relations","Architecture","Law (grad)","Journalism"], business: "Marshall School of Business — Elite T-20, world-class alumni network", theology: "School of Religion — diverse offerings", aviation: "Viterbi Aerospace & Mechanical Engineering — near LAX", avgGPA: "3.9", gradRate: "92%" },
    parkerFit: { business: true, aviation: true, theology: false, notes: "USC Marshall is one of the top business schools in the country. Viterbi's aerospace engineering and LAX proximity serve aviation interests. At 12% acceptance this is a hard Reach but worth a questionnaire. Setter need is LOW — roster appears full through 2028." },
    coaches: [{ name: "Jeff Nygaard", role: "Head Coach", email: "jnygaard@usc.edu", phone: "" }],
    setters: [{ name: "Caleb Blanchette", grad: "2028", class: "SO" }, { name: "Jackson Payne", grad: "2026", class: "SR" }],
    azRadar: [],
    winHistory: [{ yr: '2026', w: 16, l: 3, p: '.842' }, { yr: '2025', w: 17, l: 12, p: '.586' }, { yr: '2024', w: 13, l: 15, p: '.464' }, { yr: '2023', w: 10, l: 16, p: '.385' }, { yr: '2022', w: 22, l: 7, p: '.758' }],
    news: [{ date: "Feb 2026", title: "Trojans Surge to AVCA Top 10", body: "USC jumps to #8 after back-to-back road wins in the MPSF.", url: "https://usctrojans.com" }],
    schedule26: [
      { d: "Jan 09", o: "vs UC Santa Cruz", r: "W 3-0", home: true }, { d: "Jan 10", o: "vs Pepperdine", r: "W 3-1", home: true },
      { d: "Jan 16", o: "@ Stanford — MPSF", r: "L 1-3", home: false }, { d: "Jan 17", o: "@ Stanford — MPSF", r: "L 0-3", home: false },
      { d: "Jan 23", o: "vs UC Irvine — MPSF", r: "W 3-2", home: true }, { d: "Jan 24", o: "vs UC San Diego — MPSF", r: "W 3-1", home: true },
      { d: "Jan 30", o: "@ Hawaii — MPSF", r: "L 2-3", home: false }, { d: "Jan 31", o: "@ Long Beach State — MPSF", r: "W 3-1", home: false },
      { d: "Feb 06", o: "vs Cal Baptist — MPSF", r: "W 3-0", home: true }, { d: "Feb 07", o: "vs Concordia Irvine — MPSF", r: "L 2-3", home: true },
      { d: "Feb 13", o: "@ Pepperdine — MPSF", r: "W 3-1", home: false }, { d: "Feb 14", o: "@ UC Irvine — MPSF", r: "L 1-3", home: false },
      { d: "Feb 19", o: "vs Pepperdine — MPSF", r: "W 3-2", home: true }, { d: "Feb 20", o: "vs Stanford — MPSF", r: "W 3-2", home: true },
      { d: "Feb 21", o: "vs Stanford — MPSF", r: "L 2-3", home: true }, { d: "Feb 27", o: "@ UC San Diego — MPSF", r: "L 0-3", home: false },
      { d: "Feb 28", o: "@ Cal Baptist — MPSF", r: "W 3-1", home: false }, { d: "Mar 06", o: "vs Hawaii — MPSF", r: "W 3-2", home: true },
      { d: "Mar 07", o: "vs Long Beach State — MPSF", r: "L 1-3", home: true },
      { d: "Mar 13", o: "@ Concordia Irvine — MPSF", r: "Upcoming", home: false }, { d: "Mar 20", o: "vs UC Irvine — MPSF", r: "Upcoming", home: true },
      { d: "Mar 27", o: "@ Cal Baptist — MPSF", r: "Upcoming", home: false }, { d: "Mar 28", o: "vs Stanford — MPSF", r: "Upcoming", home: true },
      { d: "Apr 03", o: "@ Hawaii — MPSF", r: "Upcoming", home: false }, { d: "Apr 10", o: "vs Concordia Irvine — MPSF", r: "Upcoming", home: true },
      { d: "Apr 17", o: "MPSF Tournament — Quarterfinal", r: "Upcoming", home: false }, { d: "Apr 24", o: "MPSF Championship", r: "Upcoming", home: false },
    ], notes: ""
  },
  // ── FULL RICH DATA: FORMERLY SEED LIST ──
  {
    id: "psu", name: "Penn State", city: "University Park", state: "PA", mascot: "Nittany Lions",
    divLevel: "DI", conference: "EIVA", priority: "Reach", section: "primary",
    acceptance: "55%", tuitionIn: "$19,500", tuitionOut: "$39,200",
    programRank: "#15", setterNeed: "Low",
    url: "https://www.psu.edu", logoUrl: "https://www.psu.edu",
    vbUrl: "https://gopsusports.com/sports/mens-volleyball",
    programIG: "@pennstatemvball", questionnaireUrl: "https://gopsusports.com/sports/mens-volleyball",
    academic: { top10: ["Business (Smeal)","Engineering","Communications","Education","Finance","Kinesiology","Nursing","Political Science","Psychology","Information Sciences"], business: "Smeal College of Business — Top 30 nationally, strong finance & supply chain", theology: "Religious Studies dept; faith orgs active on campus", aviation: "Aerospace Engineering — Penn State has a strong aerospace & aviation program", avgGPA: "3.6", gradRate: "88%" },
    parkerFit: { business: true, aviation: true, theology: false, notes: "Penn State at #3 is a true Reach but worth the shot. Smeal College of Business is nationally ranked, and Penn State has a respected aerospace engineering program for aviation interests. EIVA conference is competitive. Setter need is Low — roster runs deep. Best approach: submit questionnaire early and attend a summer camp." },
    coaches: [{ name: "Mark Pavlik", role: "Head Coach", email: "map33@psu.edu", phone: "(814) 863-7464" }],
    setters: [{ name: "Ryan Mullahey", grad: "2026", class: "SR" }, { name: "Erik Rohde", grad: "2027", class: "JR" }],
    azRadar: [],
    winHistory: [{ yr: '2026', w: 16, l: 7, p: '.696' }, { yr: '2025', w: 24, l: 7, p: '.774' }, { yr: '2024', w: 21, l: 9, p: '.700' }, { yr: '2023', w: 19, l: 10, p: '.655' }, { yr: '2022', w: 18, l: 12, p: '.600' }],
    news: [{ date: "Mar 2026", title: "Nittany Lions Ranked #3 in AVCA Poll", body: "Penn State remains in contention for the EIVA title and NCAA bid.", url: "https://gopsusports.com" }],
    schedule26: [
      { d: "Jan 10", o: "vs Sacred Heart — EIVA", r: "W 3-0", home: true }, { d: "Jan 17", o: "vs Harvard — EIVA", r: "W 3-1", home: true },
      { d: "Jan 24", o: "@ George Mason — EIVA", r: "W 3-2", home: false }, { d: "Jan 31", o: "@ St. Francis — EIVA", r: "W 3-0", home: false },
      { d: "Feb 07", o: "vs Princeton — EIVA", r: "W 3-1", home: true }, { d: "Feb 14", o: "vs NJIT — EIVA", r: "W 3-0", home: true },
      { d: "Feb 21", o: "@ Ball State", r: "L 2-3", home: false }, { d: "Feb 28", o: "@ Long Beach State", r: "L 1-3", home: false },
      { d: "Mar 07", o: "vs UC San Diego", r: "W 3-2", home: true }, { d: "Mar 14", o: "vs Sacred Heart — EIVA", r: "Upcoming", home: true },
      { d: "Mar 21", o: "@ Harvard — EIVA", r: "Upcoming", home: false }, { d: "Mar 28", o: "vs George Mason — EIVA", r: "Upcoming", home: true },
      { d: "Apr 04", o: "vs St. Francis — EIVA", r: "Upcoming", home: true }, { d: "Apr 11", o: "@ Princeton — EIVA", r: "Upcoming", home: false },
      { d: "Apr 17", o: "EIVA Tournament — Semifinal", r: "Upcoming", home: false }, { d: "Apr 18", o: "EIVA Championship", r: "Upcoming", home: false },
      { d: "May 01", o: "NCAA Tournament — First Round (if qual.)", r: "Upcoming", home: false },
    ], notes: ""
  },
  {
    id: "csun", name: "CSUN", city: "Northridge", state: "CA", mascot: "Matadors",
    divLevel: "DI", conference: "Big West", priority: "Target", section: "primary",
    acceptance: "73%", tuitionIn: "$7,100", tuitionOut: "$19,200",
    programRank: "#18", setterNeed: "Med",
    url: "https://www.csun.edu", logoUrl: "https://www.csun.edu",
    vbUrl: "https://gomatadors.com/sports/mens-volleyball",
    programIG: "@csunmvball", questionnaireUrl: "https://gomatadors.com/sports/mens-volleyball",
    academic: { top10: ["Business Admin","Engineering","Education","Health Sciences","Psychology","Kinesiology","Communication","Cinema & Television","Music","Social Work"], business: "Nazarian School of Business — strong entrepreneurship track", theology: "Religious Studies dept", aviation: "Near Van Nuys Airport; aeronautics-related engineering programs", avgGPA: "3.4", gradRate: "65%" },
    parkerFit: { business: true, aviation: false, theology: false, notes: "CSUN is an excellent value Target — in-state tuition is among the lowest on Parker's list. Big West conference at #12 ranking means real competitive volleyball. Nazarian School of Business is strong. LA/Valley location opens aviation and business internship networks. Current HC Theo Edwards (since 2023) is building the program back to national prominence." },
    coaches: [{ name: "Theo Edwards", role: "Head Coach", email: "theo.edwards@csun.edu", phone: "(818) 677-4512" }],
    setters: [{ name: "Lucas Yoder", grad: "2027", class: "JR" }, { name: "Sophomore Setter TBD", grad: "2028", class: "SO" }],
    azRadar: [],
    winHistory: [{ yr: '2026', w: 12, l: 11, p: '.522' }, { yr: '2025', w: 16, l: 11, p: '.593' }, { yr: '2024', w: 15, l: 12, p: '.556' }, { yr: '2023', w: 13, l: 14, p: '.481' }],
    news: [{ date: "Feb 2026", title: "Matadors Climb to #12 in AVCA Poll", body: "CSUN turns heads with sweep of UC Davis and strong home record.", url: "https://gomatadors.com" }],
    schedule26: [
      { d: "Jan 10", o: "vs UC Santa Cruz", r: "W 3-0", home: true }, { d: "Jan 17", o: "vs UC San Diego — Big West", r: "L 1-3", home: true },
      { d: "Jan 24", o: "@ UCSB — Big West", r: "W 3-2", home: false }, { d: "Jan 31", o: "@ Long Beach State — Big West", r: "L 0-3", home: false },
      { d: "Feb 07", o: "vs Hawaii — Big West", r: "W 3-1", home: true }, { d: "Feb 14", o: "vs UC Irvine — Big West", r: "L 2-3", home: true },
      { d: "Feb 21", o: "@ UC San Diego — Big West", r: "W 3-1", home: false }, { d: "Feb 28", o: "vs UCSB — Big West", r: "W 3-2", home: true },
      { d: "Mar 07", o: "vs Long Beach State — Big West", r: "Upcoming", home: true }, { d: "Mar 14", o: "@ Hawaii — Big West", r: "Upcoming", home: false },
      { d: "Mar 21", o: "@ UC Irvine — Big West", r: "Upcoming", home: false }, { d: "Apr 10", o: "Big West Tournament", r: "Upcoming", home: false },
    ], notes: ""
  },
  {
    id: "luc", name: "Loyola Chicago", city: "Chicago", state: "IL", mascot: "Ramblers",
    divLevel: "DI", conference: "MIVA", priority: "Target", section: "primary",
    acceptance: "79%", tuitionIn: "$50,200", tuitionOut: "$50,200",
    programRank: "#9", setterNeed: "High",
    url: "https://www.luc.edu", logoUrl: "https://www.luc.edu",
    vbUrl: "https://loyolaramblers.com/sports/mens-volleyball",
    programIG: "@loyolacmvball", questionnaireUrl: "https://loyolaramblers.com/sports/mens-volleyball",
    academic: { top10: ["Business (Quinlan)","Nursing","Psychology","Pre-Med/Biology","Communications","Education","Criminal Justice","Finance","Philosophy","Theology"], business: "Quinlan School of Business — Jesuit business education, strong ethics & leadership", theology: "★★★ Theology dept is one of the best in the Jesuit tradition — Ignatius spirituality", aviation: "Near O'Hare (ORD), civil aviation courses via earth science dept", avgGPA: "3.5", gradRate: "76%" },
    parkerFit: { business: true, aviation: false, theology: true, notes: "LOYOLA IS AN EXCELLENT FIT for Parker. Jesuit theology tradition (St. Ignatius) is deeply aligned with faith-integrated education — similar spirit to Brophy. Quinlan School of Business is strong. HIGH setter need means real opportunity. Chicago location opens massive internship markets for business. Shane Davis returned as HC in 2024 — two-time national champion and program legend." },
    coaches: [{ name: "Shane Davis", role: "Head Coach", email: "sdavis6@luc.edu", phone: "" }],
    setters: [{ name: "Senior Setter", grad: "2026", class: "SR" }],
    azRadar: [],
    winHistory: [{ yr: '2026', w: 18, l: 6, p: '.750' }, { yr: '2025', w: 14, l: 14, p: '.500' }, { yr: '2024', w: 11, l: 16, p: '.407' }, { yr: '2023', w: 9, l: 17, p: '.346' }],
    news: [{ date: "Mar 2026", title: "Ramblers Win Consecutive MIVA Matches for First Time Since 2022", body: "Loyola earning momentum in conference play.", url: "https://loyolaramblers.com" }],
    schedule26: [
      { d: "Jan 09", o: "vs McKendree — MIVA", r: "W 3-1", home: true }, { d: "Jan 16", o: "@ Ball State — MIVA", r: "L 1-3", home: false },
      { d: "Jan 23", o: "vs Lindenwood — MIVA", r: "W 3-2", home: true }, { d: "Jan 30", o: "@ Lewis — MIVA", r: "L 2-3", home: false },
      { d: "Feb 06", o: "@ Ball State — MIVA", r: "L 1-3", home: false }, { d: "Feb 13", o: "vs Purdue Fort Wayne — MIVA", r: "W 3-1", home: true },
      { d: "Feb 20", o: "vs George Mason — MIVA", r: "W 3-2", home: true }, { d: "Feb 27", o: "vs Ball State — MIVA", r: "W 3-1", home: true },
      { d: "Mar 06", o: "@ McKendree — MIVA", r: "Upcoming", home: false }, { d: "Mar 20", o: "vs Lewis — MIVA", r: "Upcoming", home: true },
      { d: "Apr 10", o: "MIVA Tournament", r: "Upcoming", home: false },
    ], notes: ""
  },
  {
    id: "ucsb", name: "UCSB", city: "Santa Barbara", state: "CA", mascot: "Gauchos",
    divLevel: "DI", conference: "Big West", priority: "Target", section: "primary",
    acceptance: "26%", tuitionIn: "$13,200", tuitionOut: "$44,100",
    programRank: "#8", setterNeed: "Med",
    url: "https://www.ucsb.edu", logoUrl: "https://www.ucsb.edu",
    vbUrl: "https://ucsbgauchos.com/sports/mens-volleyball",
    programIG: "@ucsbmvball", questionnaireUrl: "https://ucsbgauchos.com/sports/mens-volleyball",
    academic: { top10: ["Marine Biology","Economics","Computer Science","Communications","Mechanical Engineering","Psychology","Political Science","Environmental Studies","Physics","Music"], business: "Economics & Technology Management — strong quantitative business pathway", theology: "Religious Studies dept — comparative religion emphasis", aviation: "Aerospace engineering via UCSB College of Engineering; near SBA airport", avgGPA: "3.8", gradRate: "83%" },
    parkerFit: { business: true, aviation: false, theology: false, notes: "UCSB is a competitive Target (26% acceptance) but in-state tuition makes finances workable. Beach campus in Santa Barbara is world-class. #10 nationally means elite volleyball. Economics pathway is strong for business-minded students. Moderate setter need suggests opportunity in the 2028 class." },
    coaches: [{ name: "Rick McLaughlin", role: "Head Coach", email: "RMcLaughlin@athletics.ucsb.edu", phone: "(805) 893-8320" }],
    setters: [{ name: "Alex Frantti", grad: "2026", class: "SR" }, { name: "Sophomore Setter TBD", grad: "2028", class: "SO" }],
    azRadar: [],
    winHistory: [{ yr: '2026', w: 13, l: 9, p: '.591' }, { yr: '2025', w: 18, l: 9, p: '.667' }, { yr: '2024', w: 16, l: 11, p: '.593' }, { yr: '2023', w: 14, l: 13, p: '.519' }],
    news: [{ date: "Feb 2026", title: "Gauchos Hold Strong at #10 in AVCA National Poll", body: "UCSB riding six-match win streak heading into Big West play.", url: "https://ucsbgauchos.com" }],
    schedule26: [
      { d: "Jan 10", o: "vs UC San Diego — Big West", r: "W 3-1", home: true }, { d: "Jan 17", o: "@ CSUN — Big West", r: "L 2-3", home: false },
      { d: "Jan 24", o: "vs CSUN — Big West", r: "L 1-3", home: true }, { d: "Jan 31", o: "vs Long Beach State — Big West", r: "W 3-2", home: true },
      { d: "Feb 07", o: "@ UC Irvine — Big West", r: "L 0-3", home: false }, { d: "Feb 14", o: "vs Hawaii — Big West", r: "W 3-1", home: true },
      { d: "Mar 07", o: "@ UC San Diego — Big West", r: "Upcoming", home: false }, { d: "Mar 14", o: "vs UC Irvine — Big West", r: "Upcoming", home: true },
      { d: "Apr 10", o: "Big West Tournament", r: "Upcoming", home: false },
    ], notes: ""
  },
  {
    id: "uci", name: "UC Irvine", city: "Irvine", state: "CA", mascot: "Anteaters",
    divLevel: "DI", conference: "Big West", priority: "Target", section: "primary",
    acceptance: "21%", tuitionIn: "$14,500", tuitionOut: "$45,200",
    programRank: "#6", setterNeed: "Med",
    url: "https://www.uci.edu", logoUrl: "https://www.uci.edu",
    vbUrl: "https://ucirvinesports.com/sports/mens-volleyball",
    programIG: "@ucimvball", questionnaireUrl: "https://ucirvinesports.com/sports/mens-volleyball",
    academic: { top10: ["Computer Science","Business (Merage)","Biological Sciences","Social Ecology","Public Health","Information & Computer Science","Psychology","Engineering","Economics","Nursing"], business: "Paul Merage School of Business — Top 50 MBA, strong business analytics", theology: "Religious Studies — comparative & humanistic focus", aviation: "Near SNA, Engineering offers aerospace pathways", avgGPA: "3.8", gradRate: "87%" },
    parkerFit: { business: true, aviation: false, theology: false, notes: "UCI at #7 nationally is elite volleyball. Merage School of Business is highly regarded. 21% acceptance makes this a competitive Target. In-state tuition is manageable. Irvine is a great location — same market as CUI. Moderate setter need suggests a potential opening in the 2028 class." },
    coaches: [{ name: "David Kniffin", role: "Head Coach", email: "dkniffin@uci.edu", phone: "(949) 824-5000" }],
    setters: [{ name: "Matthew Szymanski", grad: "2026", class: "SR" }, { name: "JR Setter TBD", grad: "2027", class: "JR" }],
    azRadar: [],
    winHistory: [{ yr: '2026', w: 16, l: 5, p: '.762' }, { yr: '2025', w: 20, l: 8, p: '.714' }, { yr: '2024', w: 18, l: 9, p: '.667' }, { yr: '2023', w: 17, l: 11, p: '.607' }],
    news: [{ date: "Feb 2026", title: "Anteaters Dominate MPSF Crossover Weekend", body: "UCI sweeps Concordia Irvine and USC to secure top Big West standing.", url: "https://ucirvinesports.com" }],
    schedule26: [
      { d: "Jan 09", o: "@ USC — MPSF Crossover", r: "W 3-2", home: false }, { d: "Jan 16", o: "vs CUI — MPSF Crossover", r: "W 3-1", home: true },
      { d: "Jan 23", o: "vs CSUN — Big West", r: "W 3-1", home: true }, { d: "Jan 30", o: "@ Hawaii — Big West", r: "L 1-3", home: false },
      { d: "Feb 06", o: "vs USC — MPSF Crossover", r: "W 3-1", home: true }, { d: "Feb 14", o: "vs UCSB — Big West", r: "W 3-0", home: true },
      { d: "Feb 21", o: "vs Long Beach State — Big West", r: "W 3-2", home: true }, { d: "Mar 07", o: "@ CSUN — Big West", r: "Upcoming", home: false },
      { d: "Mar 14", o: "@ UCSB — Big West", r: "Upcoming", home: false }, { d: "Apr 10", o: "Big West Tournament", r: "Upcoming", home: false },
    ], notes: ""
  },
  {
    id: "pep", name: "Pepperdine", city: "Malibu", state: "CA", mascot: "Waves",
    divLevel: "DI", conference: "MPSF", priority: "Target", section: "primary",
    acceptance: "49%", tuitionIn: "$62,400", tuitionOut: "$62,400",
    programRank: "#5", setterNeed: "Med",
    url: "https://www.pepperdine.edu", logoUrl: "https://www.pepperdine.edu",
    vbUrl: "https://pepperdinewaves.com/sports/mens-volleyball",
    programIG: "@pepperdinemvb", questionnaireUrl: "https://pepperdinewaves.com/sports/mens-volleyball",
    academic: { top10: ["Business (Graziadio)","Law","International Studies","Film/Media","Communications","Psychology","Sports Administration","Religion","Political Science","Pre-Med"], business: "Graziadio School of Business — Top 40, strong entrepreneurship & finance", theology: "★★★ Religion program — Churches of Christ affiliation, values-based education", aviation: "Near LAX/Malibu; Graziadio has aviation management coursework", avgGPA: "3.8", gradRate: "85%" },
    parkerFit: { business: true, aviation: false, theology: true, notes: "Pepperdine is a standout fit for Parker on multiple levels. The Churches of Christ faith mission creates a values-aligned campus that mirrors Brophy's Jesuit emphasis on character. Graziadio Business School is excellent. Malibu campus is stunning. HC Jonathan Winder is an NCAA champion and a faith-driven coach — perfect culture fit for Parker. At #6 nationally with moderate setter need, this is a viable Target." },
    coaches: [{ name: "Jonathan Winder", role: "Head Coach", email: "jonathan.winder@pepperdine.edu", phone: "(310) 506-4528" }],
    setters: [{ name: "Alex Gersham", grad: "2026", class: "SR" }, { name: "Sophomore Setter TBD", grad: "2028", class: "SO" }],
    azRadar: [],
    winHistory: [{ yr: '2026', w: 18, l: 5, p: '.783' }, { yr: '2025', w: 19, l: 10, p: '.655' }, { yr: '2024', w: 17, l: 12, p: '.586' }, { yr: '2023', w: 20, l: 9, p: '.690' }],
    news: [{ date: "Feb 2026", title: "Waves Ranked #6 — Setter Depth is a Point of Emphasis", body: "Pepperdine looking to develop younger setter talent ahead of 2027 season.", url: "https://pepperdinewaves.com" }],
    schedule26: [
      { d: "Jan 09", o: "@ USC", r: "L 1-3", home: false }, { d: "Jan 16", o: "@ Long Beach State — MPSF", r: "W 3-2", home: false },
      { d: "Jan 23", o: "vs Hawaii — MPSF", r: "W 3-1", home: true }, { d: "Jan 30", o: "vs CUI — MPSF", r: "W 3-1", home: true },
      { d: "Feb 13", o: "vs USC — MPSF", r: "L 1-3", home: true }, { d: "Feb 19", o: "@ USC — MPSF", r: "L 2-3", home: false },
      { d: "Feb 27", o: "@ CUI — MPSF", r: "L 1-3", home: false }, { d: "Mar 06", o: "vs Stanford — MPSF", r: "Upcoming", home: true },
      { d: "Mar 14", o: "@ Hawaii — MPSF", r: "Upcoming", home: false }, { d: "Apr 17", o: "MPSF Tournament", r: "Upcoming", home: false },
    ], notes: ""
  },
  // ── SAFETY SCHOOLS ──
  {
    id: "maryville", name: "Maryville", city: "St. Louis", state: "MO", mascot: "Saints",
    divLevel: "DII", conference: "GLVC", priority: "Safety", section: "primary",
    acceptance: "92%", tuitionIn: "$27,000", tuitionOut: "$27,000",
    programRank: "NR", setterNeed: "High",
    url: "https://www.maryville.edu", logoUrl: "https://www.maryville.edu",
    vbUrl: "https://maryvilles.com/sports/mens-volleyball",
    programIG: "#", questionnaireUrl: "https://maryvilles.com/sports/mens-volleyball",
    academic: { top10: ["Business","Nursing","Education","Cybersecurity","Health Science","Animation & Game Design","Criminal Justice","Psychology","Communication","Finance"], business: "The John E. Simon School of Business — innovative curriculum", theology: "Interfaith/philosophy dept", aviation: "Lambert-St. Louis International nearby", avgGPA: "3.2", gradRate: "68%" },
    parkerFit: { business: true, aviation: false, theology: false, notes: "Maryville is a solid Safety with HIGH setter need. Strong business program with a unique tech-forward curriculum. DII GLVC conference provides competitive volleyball with a clear path to a starting setter role. Good option if Parker wants a guarantee of playing time while building his game." },
    coaches: [{ name: "Nick Loewen", role: "Head Coach", email: "nloewen@maryville.edu", phone: "" }],
    setters: [{ name: "SR Setter", grad: "2026", class: "SR" }],
    azRadar: [],
    winHistory: [{ yr: '2025', w: 16, l: 10, p: '.615' }, { yr: '2024', w: 14, l: 12, p: '.538' }],
    news: [], schedule26: [], notes: ""
  },
  {
    id: "vanguard", name: "Vanguard University", city: "Costa Mesa", state: "CA", mascot: "Lions",
    divLevel: "NAIA", conference: "GSAC", priority: "Target", section: "primary",
    acceptance: "60%", tuitionIn: "$38,500", tuitionOut: "$38,500",
    programRank: "NR", setterNeed: "Med",
    url: "https://www.vanguard.edu", logoUrl: "https://www.vanguard.edu",
    vbUrl: "https://vanguardlions.com/sports/mens-volleyball",
    programIG: "#", questionnaireUrl: "https://vanguardlions.com/sports/mens-volleyball",
    academic: { top10: ["Business","Kinesiology","Psychology","Communication","Music","Religion/Theology","Education","Biology","Criminal Justice","Social Work"], business: "Business administration — entrepreneurship & management focus", theology: "★★★ Assemblies of God affiliation — deep theology program, faith central to mission", aviation: "Near SNA/LAX airports", avgGPA: "3.3", gradRate: "61%" },
    parkerFit: { business: true, aviation: false, theology: true, notes: "Vanguard is a strong fit for Parker's faith interest — Assemblies of God mission means theology is core to campus life, similar in spirit to Brophy's Jesuit values. GSAC conference is competitive NAIA volleyball. Costa Mesa/Orange County location is attractive. Moderate setter need." },
    coaches: [{ name: "Athletics Dept", role: "Head Coach", email: "athletics@vanguard.edu", phone: "" }],
    setters: [],
    azRadar: [],
    winHistory: [{ yr: '2026', w: 8, l: 13, p: '.381' }, { yr: '2025', w: 14, l: 10, p: '.583' }, { yr: '2024', w: 12, l: 12, p: '.500' }],
    news: [], schedule26: [], notes: ""
  },
  {
    id: "occ", name: "Orange Coast College", city: "Costa Mesa", state: "CA", mascot: "Pirates",
    divLevel: "JUCO", conference: "PCAC", priority: "Safety", section: "primary",
    acceptance: "100%", tuitionIn: "$1,300", tuitionOut: "$9,200",
    programRank: "NR", setterNeed: "High",
    url: "https://www.orangecoastcollege.edu", logoUrl: "https://www.orangecoastcollege.edu",
    vbUrl: "https://occsports.com/sports/mens-volleyball",
    programIG: "#", questionnaireUrl: "#",
    academic: { top10: ["Business","Aviation (top program)","Marine Science","Nursing","Engineering Transfer","Communications","Computer Science","Psychology","Automotive Tech","Culinary Arts"], business: "Business transfer pathway to UC/CSU", theology: "N/A (community college)", aviation: "★★★ OCC Aviation Academy — one of the best JUCO aviation programs in the nation", avgGPA: "—", gradRate: "—" },
    parkerFit: { business: true, aviation: true, theology: false, notes: "If Parker's path leads toward aviation as a primary major, OCC's Aviation Academy is nationally elite. This JUCO path (2 years + transfer) could allow Parker to develop his game and then transfer to a 4-year program. Lowest cost option on the list by far." },
    coaches: [{ name: "Travis Turner", role: "Head Coach", email: "tturner@occ.cccd.edu", phone: "" }],
    setters: [], azRadar: [],
    winHistory: [{ yr: '2026', w: 20, l: 0, p: '1.000' }, { yr: '2025', w: 21, l: 4, p: '.840' }],
    news: [], schedule26: [], notes: ""
  },
  // ── DISCOVERY PHASE ──
  {
    id: "lewis", name: "Lewis University", city: "Romeoville", state: "IL", mascot: "Flyers",
    divLevel: "DI", conference: "MIVA", priority: "Target", section: "discovery",
    acceptance: "71%", tuitionIn: "$36,000", tuitionOut: "$36,000",
    programRank: "#16", setterNeed: "Med",
    url: "https://www.lewisu.edu", logoUrl: "https://www.lewisu.edu",
    vbUrl: "https://lewisflyers.com/sports/mens-volleyball",
    programIG: "#", questionnaireUrl: "#",
    academic: { top10: ["Aviation (top program)","Business","Nursing","Education","Criminal Justice","Computer Science","Psychology","Communications","Engineering","Exercise Science"], business: "College of Business — entrepreneurship focus, De La Salle tradition", theology: "Catholic (De La Salle Brothers) — faith & justice curriculum", aviation: "★★★ One of the top collegiate aviation programs in the nation", avgGPA: "3.4", gradRate: "72%" },
    parkerFit: { business: true, aviation: true, theology: true, notes: "Lewis University is a MUST-RESEARCH school for Parker. It checks all three interest boxes: elite aviation program (one of the best in the nation), strong Catholic De La Salle business and theology. MIVA DI volleyball, and Romeoville is 30 min from Chicago. Setter need is moderate." },
    coaches: [{ name: "Dan Friend", role: "Head Coach", email: "dfriend@lewisu.edu", phone: "(815) 836-5248" }],
    setters: [{ name: "Tyler Morgan", grad: "2026", class: "SR" }],
    azRadar: [],
    winHistory: [{ yr: '2026', w: 16, l: 12, p: '.571' }, { yr: '2025', w: 18, l: 12, p: '.600' }],
    news: [], schedule26: [], notes: ""
  },
  {
    id: "benmesa", name: "Benedictine Mesa", city: "Mesa", state: "AZ", mascot: "Redhawks",
    divLevel: "NAIA", conference: "GSAC", priority: "Safety", section: "discovery",
    acceptance: "90%", tuitionIn: "$24,000", tuitionOut: "$24,000",
    programRank: "NR", setterNeed: "High",
    url: "https://www.ben.edu", logoUrl: "https://www.ben.edu",
    vbUrl: "https://www.ben.edu/athletics/mens-volleyball",
    programIG: "#", questionnaireUrl: "#",
    academic: { top10: ["Business","Psychology","Biology","Nursing","Education","Marketing","Criminal Justice","Computer Science","Sports Management","Liberal Arts"], business: "Strategic Management & business focus", theology: "Catholic Benedictine — theology and philosophy core curriculum", aviation: "PHX Sky Harbor & Mesa Gateway nearby", avgGPA: "3.2", gradRate: "55%" },
    parkerFit: { business: true, aviation: false, theology: true, notes: "Benedictine Mesa is literally in Parker's backyard. Catholic Benedictine faith tradition aligns with Brophy values. HIGH setter need means immediate opportunity. Safety school with a path to starting setter role. In-state proximity means family can attend every home match." },
    coaches: [{ name: "Matt August", role: "Head Coach", email: "matthew.august@benedictine.edu", phone: "" }],
    setters: [],
    azRadar: [{ name: "Brophy Alum TBD", pos: "L", hs: "Brophy Prep (Phoenix)" }],
    winHistory: [{ yr: '2026', w: 12, l: 14, p: '.462' }, { yr: '2025', w: 18, l: 10, p: '.642' }],
    news: [], schedule26: [], notes: ""
  },
  {
    id: "cbu", name: "Cal Baptist", city: "Riverside", state: "CA", mascot: "Lancers",
    divLevel: "DI", conference: "MPSF", priority: "Target", section: "discovery",
    acceptance: "80%", tuitionIn: "$36,500", tuitionOut: "$36,500",
    programRank: "NR", setterNeed: "Med",
    url: "https://www.calbaptist.edu", logoUrl: "https://www.calbaptist.edu",
    vbUrl: "https://cbulancers.com/sports/mens-volleyball",
    programIG: "#", questionnaireUrl: "#",
    academic: { top10: ["Business Admin","Nursing","Kinesiology","Aviation (growing)","Engineering","Psychology","Education","Communications","Theology","Criminal Justice"], business: "School of Business — Baptist values-integrated curriculum", theology: "★★ Strong Baptist theological tradition — chapel requirement, active faith culture", aviation: "Aviation Science program — growing rapidly, near Ontario Airport", avgGPA: "3.3", gradRate: "67%" },
    parkerFit: { business: true, aviation: true, theology: true, notes: "Cal Baptist is a hidden gem for Parker — CBU has a growing aviation program near Ontario Airport, strong Baptist faith tradition that parallels Brophy's values-formation, and business administration. Plays in the MPSF at D-I level against top programs. Riverside is a manageable drive from Phoenix." },
    coaches: [{ name: "Matt Fuerbringer", role: "Head Coach", email: "mfuerbringer@calbaptist.edu", phone: "" }],
    setters: [],
    azRadar: [],
    winHistory: [{ yr: '2026', w: 10, l: 15, p: '.400' }, { yr: '2025', w: 12, l: 14, p: '.462' }],
    news: [], schedule26: [], notes: ""
  },
  {
    id: "lbsu", name: "Long Beach State", city: "Long Beach", state: "CA", mascot: "Beach",
    divLevel: "DI", conference: "Big West", priority: "Target", section: "discovery",
    acceptance: "40%", tuitionIn: "$7,400", tuitionOut: "$7,400",
    programRank: "#3", setterNeed: "Low",
    url: "https://www.csulb.edu", logoUrl: "https://www.csulb.edu",
    vbUrl: "https://longbeachstate.com/sports/mens-volleyball",
    programIG: "@lbsmvb", questionnaireUrl: "https://longbeachstate.com/sports/mens-volleyball",
    academic: { top10: ["Business (BEACH)","Engineering","Nursing","Film","Social Work","Education","Computer Science","Psychology","Health Science","Communications"], business: "College of Business — AACSB accredited, large & well-resourced", theology: "Religious Studies dept", aviation: "Aerospace engineering, near LGB and LAX", avgGPA: "3.6", gradRate: "73%" },
    parkerFit: { business: true, aviation: false, theology: false, notes: "LBSU at #4 is elite volleyball — a national powerhouse. Setter need is LOW meaning competition for spots is fierce. But worth a questionnaire and camp visit. AACSB business, great in-state tuition. Best path: play exceptionally well at AZ Fear nationals and get noticed. HC Nick MacRae (promoted Dec 2025) is a setter specialist — perfect mentor for Parker." },
    coaches: [{ name: "Nick MacRae", role: "Head Coach", email: "Nick.MacRae@csulb.edu", phone: "(562) 985-1450" }],
    setters: [{ name: "Kyle Hobus", grad: "2026", class: "SR" }, { name: "JR Setter TBD", grad: "2027", class: "JR" }],
    azRadar: [],
    winHistory: [{ yr: '2026', w: 18, l: 4, p: '.818' }, { yr: '2025', w: 23, l: 7, p: '.767' }, { yr: '2024', w: 22, l: 8, p: '.733' }, { yr: '2023', w: 20, l: 9, p: '.690' }],
    news: [], schedule26: [], notes: ""
  },
  {
    id: "uh", name: "Univ. of Hawaii", city: "Honolulu", state: "HI", mascot: "Warriors",
    divLevel: "DI", conference: "Big West", priority: "Target", section: "discovery",
    acceptance: "70%", tuitionIn: "$11,000", tuitionOut: "$34,000",
    programRank: "#2", setterNeed: "Med",
    url: "https://www.hawaii.edu", logoUrl: "https://www.hawaii.edu",
    vbUrl: "https://hawaiiathletics.com/sports/mens-volleyball",
    programIG: "@uhmanoa_mvb", questionnaireUrl: "https://hawaiiathletics.com/sports/mens-volleyball",
    academic: { top10: ["Marine Biology","Hospitality Business","Engineering","Communications","Computer Science","Law","Pacific Islander Studies","Political Science","Education","Kinesiology"], business: "Shidler College of Business — strong hospitality & tourism management", theology: "Religious Studies dept — Pacific, Asian & world religions", aviation: "Aerospace engineering pathway; Honolulu International (HNL) nearby", avgGPA: "3.5", gradRate: "62%" },
    parkerFit: { business: true, aviation: false, theology: false, notes: "Hawaii at #2 nationally is the best-ranked team with moderate setter need. Unique setting and culture. Shidler Business has strong hospitality management. Playing at Hawaii means exposure to top competition and recruiting visibility. Honolulu is a real adventure for a young player." },
    coaches: [{ name: "Charlie Wade", role: "Head Coach", email: "cwade@hawaii.edu", phone: "(808) 956-9931" }],
    setters: [{ name: "Setter TBD", grad: "2027", class: "JR" }],
    azRadar: [],
    winHistory: [{ yr: '2026', w: 23, l: 3, p: '.885' }, { yr: '2025', w: 25, l: 5, p: '.833' }, { yr: '2024', w: 23, l: 7, p: '.767' }, { yr: '2023', w: 24, l: 6, p: '.800' }],
    news: [], schedule26: [], notes: ""
  },
  {
    id: "gm", name: "George Mason", city: "Fairfax", state: "VA", mascot: "Patriots",
    divLevel: "DI", conference: "EIVA", priority: "Target", section: "discovery",
    acceptance: "90%", tuitionIn: "$13,400", tuitionOut: "$37,000",
    programRank: "NR", setterNeed: "Med",
    url: "https://www.gmu.edu", logoUrl: "https://www.gmu.edu",
    vbUrl: "https://gomason.com/sports/mens-volleyball",
    programIG: "#", questionnaireUrl: "https://gomason.com/sports/mens-volleyball",
    academic: { top10: ["Business (Mason)","Computer Science","Engineering","Government & Politics","Psychology","Communications","Criminal Justice","Nursing","Education","Economics"], business: "School of Business — strong entrepreneurship & tech focus in DC metro", theology: "Religious Studies — philosophy & secular ethics emphasis", aviation: "Near Dulles (IAD) and Reagan (DCA) airports; aerospace engineering track", avgGPA: "3.4", gradRate: "73%" },
    parkerFit: { business: true, aviation: false, theology: false, notes: "George Mason is a solid Target with generous acceptance and affordable in-state tuition. The DC/Northern Virginia location creates massive internship opportunities for business-minded students. EIVA conference is competitive D-I volleyball with a moderate setter opening." },
    coaches: [{ name: "Jay Hosack", role: "Head Coach", email: "jhosack@gmu.edu", phone: "(703) 993-3227" }],
    setters: [],
    azRadar: [],
    winHistory: [{ yr: '2026', w: 18, l: 7, p: '.720' }, { yr: '2026', w: 10, l: 14, p: '.417' }, { yr: '2025', w: 15, l: 11, p: '.577' }, { yr: '2024', w: 14, l: 13, p: '.519' }],
    news: [], schedule26: [], notes: ""
  },
  {
    id: "pf", name: "Purdue Fort Wayne", city: "Fort Wayne", state: "IN", mascot: "Mastodons",
    divLevel: "DI", conference: "MIVA", priority: "Safety", section: "discovery",
    acceptance: "80%", tuitionIn: "$8,400", tuitionOut: "$21,000",
    programRank: "#20", setterNeed: "High",
    url: "https://www.pfw.edu", logoUrl: "https://www.pfw.edu",
    vbUrl: "https://gomastodons.com/sports/mens-volleyball",
    programIG: "#", questionnaireUrl: "https://gomastodons.com/sports/mens-volleyball",
    academic: { top10: ["Business","Engineering","Education","Nursing","Computer Science","Visual Communication Design","Allied Health","Criminal Justice","Psychology","Music"], business: "Doermer School of Business — affordable and career-focused", theology: "Philosophy & Religious Studies dept", aviation: "Fort Wayne International nearby; engineering programs available", avgGPA: "3.2", gradRate: "47%" },
    parkerFit: { business: true, aviation: false, theology: false, notes: "PFW is a Safety but don't overlook it. HIGH setter need at the D-I level means near-certain opportunity for playing time. One of the most affordable options on the list. Doermer Business is solid. If Parker wants to play D-I volleyball and develop, PFW offers that runway." },
    coaches: [{ name: "Donny Gleason", role: "Head Coach", email: "dgleason@pfw.edu", phone: "" }],
    setters: [{ name: "SR Setter TBD", grad: "2026", class: "SR" }],
    azRadar: [],
    winHistory: [{ yr: '2026', w: 11, l: 11, p: '.500' }, { yr: '2025', w: 10, l: 16, p: '.385' }, { yr: '2024', w: 9, l: 17, p: '.346' }],
    news: [], schedule26: [], notes: ""
  },
  {
    id: "hi", name: "Hope International", city: "Fullerton", state: "CA", mascot: "Royals",
    divLevel: "NAIA", conference: "GSAC", priority: "Target", section: "discovery",
    acceptance: "38%", tuitionIn: "$35,000", tuitionOut: "$35,000",
    programRank: "NR", setterNeed: "Med",
    url: "https://www.hiu.edu", logoUrl: "https://www.hiu.edu",
    vbUrl: "https://hopeinternational.edu/athletics",
    programIG: "#", questionnaireUrl: "#",
    academic: { top10: ["Business","Intercultural Studies","Ministry/Theology","Psychology","Education","Kinesiology","Communication","Music","Social Work","TESOL"], business: "School of Business & Management — Christian values integration", theology: "★★★ Ministry & Intercultural Studies — central to the HIU mission", aviation: "Near LAX/SNA, Orange County location", avgGPA: "3.3", gradRate: "55%" },
    parkerFit: { business: true, aviation: false, theology: true, notes: "Hope International is a faith-first institution — theology and intercultural studies are at the core of the HIU experience. Similar Christian mission to Brophy. Business program is solid. GSAC NAIA volleyball is competitive. Fullerton/OC location is excellent. Good fit for Parker's values." },
    coaches: [{ name: "Jeremy McCall", role: "Head Coach", email: "jmccall@hiu.edu", phone: "" }],
    setters: [],
    azRadar: [],
    winHistory: [{ yr: '2025', w: 15, l: 11, p: '.577' }],
    news: [], schedule26: [], notes: ""
  },
  {
    id: "acu", name: "Arizona Christian", city: "Glendale", state: "AZ", mascot: "Firestorm",
    divLevel: "NAIA", conference: "GSAC", priority: "Safety", section: "discovery",
    acceptance: "70%", tuitionIn: "$31,000", tuitionOut: "$31,000",
    programRank: "NR", setterNeed: "High",
    url: "https://www.arizonachristian.edu", logoUrl: "https://www.arizonachristian.edu",
    vbUrl: "https://acufirestorm.com/sports/mens-volleyball",
    programIG: "#", questionnaireUrl: "#",
    academic: { top10: ["Business","Ministry/Biblical Studies","Education","Psychology","Kinesiology","Communications","Music","Christian Counseling","Interdisciplinary Studies","Worship Arts"], business: "Business administration — faith-integrated approach", theology: "★★★ Biblical Studies is central to ACU's mission — Evangelical Christian university", aviation: "Phoenix/Glendale proximity to PHX & DVT airports", avgGPA: "3.1", gradRate: "50%" },
    parkerFit: { business: false, aviation: false, theology: true, notes: "ACU is Parker's closest geographic Safety — right in Glendale. The Evangelical Christian mission makes faith central to academics (similar to Brophy's formation-focused approach). HIGH setter need means a starting role is very likely. Family accessibility is a major plus." },
    coaches: [{ name: "Chris Shearn", role: "Head Coach", email: "chris.shearn@arizonachristian.edu", phone: "" }],
    setters: [],
    azRadar: [],
    winHistory: [{ yr: '2026', w: 11, l: 13, p: '.458' }, { yr: '2025', w: 13, l: 13, p: '.500' }],
    news: [], schedule26: [], notes: ""
  },
  {
    id: "menlo", name: "Menlo College", city: "Atherton", state: "CA", mascot: "Oaks",
    divLevel: "NAIA", conference: "Cal Pac", priority: "Target", section: "discovery",
    acceptance: "60%", tuitionIn: "$48,000", tuitionOut: "$48,000",
    programRank: "NR", setterNeed: "Med",
    url: "https://www.menlo.edu", logoUrl: "https://www.menlo.edu",
    vbUrl: "https://menloathletics.com/sports/mens-volleyball",
    programIG: "#", questionnaireUrl: "#",
    academic: { top10: ["Business Admin","Management","Marketing","Finance","Sports Management","Entrepreneurship","Communications","Psychology","Sports Media","Global Business"], business: "★★★ 100% Business school — Menlo is exclusively focused on business education", theology: "N/A (secular, non-denominational)", aviation: "Silicon Valley / Bay Area — massive tech & business internship network near SJC/SFO", avgGPA: "3.1", gradRate: "57%" },
    parkerFit: { business: true, aviation: false, theology: false, notes: "If Parker's priority is BUSINESS above all else, Menlo is worth serious consideration — it is literally a 100% business school in the heart of Silicon Valley. The NAIA Cal Pac volleyball is competitive. Atherton/Bay Area location is exceptional for business networking and internships. Moderate setter need." },
    coaches: [{ name: "Ali'i Keohohou", role: "Head Coach", email: "alii.keohohou@menlo.edu", phone: "" }],
    setters: [],
    azRadar: [],
    winHistory: [{ yr: '2026', w: 3, l: 14, p: '.176' }, { yr: '2025', w: 14, l: 12, p: '.538' }],
    news: [], schedule26: [], notes: ""
  },
];

// ─── HELPERS ───────────────��─────────────────────────────────────────────────
const getRecordTally = (sched) => {
  let w = 0, l = 0;
  (sched || []).forEach(g => { if (g.r?.startsWith('W')) w++; if (g.r?.startsWith('L')) l++; });
  return { w, l };
};

function getTrend(wh) {
  if (!wh || wh.length < 2) return null;
  const s = [...wh].sort((a, b) => b.yr - a.yr);
  const r = parseFloat(s[0].p), o = parseFloat(s[1].p);
  if (r > o + 0.05) return "up";
  if (r < o - 0.05) return "down";
  return "flat";
}

function domainFromUrl(url) {
  try { return new URL(url).hostname.replace(/^www\./, ''); } catch { return null; }
}

// ─── LOGO COMPONENT (multi-source with fallback) ──────────────────────────────
const SchoolLogo = ({ school, size = "md" }) => {
  const sizes = { xs: 32, sm: 40, md: 48, lg: 80 };
  const px = sizes[size];
  const cls = `flex-shrink-0 rounded-xl bg-white border border-slate-200 shadow-sm overflow-hidden flex items-center justify-center`;
  const style = { width: px, height: px, minWidth: px };

  const domain = domainFromUrl(school?.logoUrl || school?.url || "");
  const [srcIdx, setSrcIdx] = useState(0);

  const sources = domain ? [
    `https://logo.clearbit.com/${domain}`,
    `https://www.google.com/s2/favicons?domain=${domain}&sz=128`,
  ] : [];

  if (sources.length && srcIdx < sources.length) {
    return (
      <div className={cls} style={style}>
        <img
          src={sources[srcIdx]}
          alt={school?.name}
          style={{ width: "85%", height: "85%", objectFit: "contain" }}
          onError={() => setSrcIdx(i => i + 1)}
        />
      </div>
    );
  }
  // letter fallback
  const colors = ["bg-blue-600","bg-violet-600","bg-emerald-600","bg-orange-500","bg-slate-600","bg-rose-600"];
  const colorIdx = (school?.name?.charCodeAt(0) || 0) % colors.length;
  return (
    <div className={`${cls} ${colors[colorIdx]} border-0`} style={style}>
      <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, color: "white", fontSize: px * 0.45 }}>
        {school?.name?.charAt(0) || "?"}
      </span>
    </div>
  );
};

// ─── OTHER COMPONENTS ─────────────────────────────────────────────────────────
const DivBadge = ({ divLevel, size = "sm" }) => {
  const cfg = DIV_CONFIG[divLevel] || DIV_CONFIG["NAIA"];
  return size === "lg"
    ? <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-bold tracking-widest uppercase ${cfg.bg} ${cfg.text}`} style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{cfg.label}</span>
    : <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase ${cfg.bg} ${cfg.text}`} style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{cfg.label}</span>;
};

const PriorityBadge = ({ priority }) => {
  const map = { Reach: "bg-red-50 text-red-600 border-red-200", Target: "bg-sky-50 text-sky-600 border-sky-200", Safety: "bg-green-50 text-green-600 border-green-200" };
  return <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border ${map[priority] || "bg-slate-100 text-slate-500 border-slate-200"}`}>{priority}</span>;
};

const StatusBadge = ({ statusKey }) => {
  const s = STATUSES.find(x => x.key === statusKey) || STATUSES[0];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${s.bg} ${s.text}`}>
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: s.dot }} />
      {s.label}
    </span>
  );
};

const NeedBadge = ({ need }) => {
  const map = { High: "bg-rose-50 text-rose-600", Med: "bg-amber-50 text-amber-600", Low: "bg-slate-100 text-slate-400" };
  return <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${map[need] || "bg-slate-100 text-slate-400"}`}>{need || "?"} need</span>;
};

// ─── COACH CARD WITH HEADSHOT ────────────────────────────────────────────────
const CoachCard = ({ coach, schoolId }) => {
  const [imgFailed, setImgFailed] = useState(false);
  const photoUrl = COACH_PHOTOS[schoolId];
  const initials = coach.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
      <div className="flex items-start gap-3">
        {/* Headshot */}
        <div className="flex-shrink-0 w-16 h-20 rounded-xl overflow-hidden bg-slate-200 border border-slate-200 flex items-center justify-center">
          {photoUrl && !imgFailed ? (
            <img
              src={photoUrl}
              alt={coach.name}
              className="w-full h-full object-cover object-top"
              onError={() => setImgFailed(true)}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
              <span className="text-white font-black text-lg" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{initials}</span>
            </div>
          )}
        </div>
        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-1 mb-1">
            <span className="font-bold text-slate-800 text-sm leading-tight">{coach.name}</span>
            <span className="text-[9px] bg-slate-200 text-slate-600 font-bold px-2 py-0.5 rounded uppercase flex-shrink-0">{coach.role}</span>
          </div>
          {coach.email && (
            <a href={`mailto:${coach.email}`} className="flex items-center gap-1 text-xs text-blue-600 hover:underline mt-1">
              <Mail className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">{coach.email}</span>
            </a>
          )}
          {coach.phone && (
            <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
              <Phone className="w-3 h-3 flex-shrink-0" />
              <span>{coach.phone}</span>
            </div>
          )}
          {!photoUrl && (
            <div className="flex items-center gap-1 text-[10px] text-amber-600 mt-1.5 font-medium"><Camera className="w-3 h-3" /> No photo on file</div>
          )}
        </div>
      </div>
    </div>
  );
};


// ─── EXECUTIVE SUMMARY ───────────────────────────────────────────────────────
const ExecutiveSummary = ({ school }) => {
  const fit = school.parkerFit;
  if (!fit) return null;
  const interests = [
    fit.business && { icon: <Star className="w-3.5 h-3.5" />, label: "Business", color: "bg-blue-50 border-blue-200 text-blue-700" },
    fit.aviation && { icon: <Plane className="w-3.5 h-3.5" />, label: "Aviation", color: "bg-sky-50 border-sky-200 text-sky-700" },
    fit.theology && { icon: <Church className="w-3.5 h-3.5" />, label: "Faith/Theology", color: "bg-purple-50 border-purple-200 text-purple-700" },
  ].filter(Boolean);

  const notFit = [
    !fit.business && "Business",
    !fit.aviation && "Aviation",
    !fit.theology && "Theology",
  ].filter(Boolean);

  return (
    <div className="rounded-2xl overflow-hidden shadow-sm border border-slate-200 mb-8"
      style={{ background: "linear-gradient(135deg, #0f2044 0%, #1e3a8a 100%)" }}>
      <div className="px-6 pt-5 pb-2 flex items-center gap-3">
        <ShieldCheck className="text-blue-300 w-5 h-5 flex-shrink-0" />
        <div>
          <div className="text-blue-300 text-[10px] font-bold uppercase tracking-widest">Parker Henderson · Brophy CP '29 · AZ Fear 17s · Setter</div>
          <div className="text-white font-black text-lg leading-tight" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
            WHY {school.name.toUpperCase()} IS A FIT
          </div>
        </div>
      </div>
      <div className="px-6 pb-5">
        <p className="text-blue-100 text-sm leading-relaxed mb-4">{fit.notes}</p>
        <div className="flex flex-wrap gap-2 mb-3">
          {interests.map(({ icon, label, color }) => (
            <span key={label} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold ${color}`}>
              {icon} {label} <Check className="w-3 h-3" />
            </span>
          ))}
          {notFit.map(label => (
            <span key={label} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-600 bg-white/5 text-slate-400 text-xs font-bold">
              {label} —
            </span>
          ))}
        </div>
        <div className="flex flex-wrap gap-4 text-xs text-blue-300 border-t border-white/10 pt-3">
          <span className="inline-flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5" /> {school.divLevel} · {school.conference}</span>
          <span className="inline-flex items-center gap-1.5"><BarChart3 className="w-3.5 h-3.5" /> Setter Need: <strong className="text-white">{school.setterNeed}</strong></span>
          <span className="inline-flex items-center gap-1.5"><Target className="w-3.5 h-3.5" /> Priority: <strong className="text-white">{school.priority}</strong></span>
          {school.programRank && school.programRank !== "NR" && <span className="inline-flex items-center gap-1.5"><Trophy className="w-3.5 h-3.5" /> AVCA <strong className="text-amber-300">{school.programRank}</strong></span>}
        </div>
      </div>
    </div>
  );
};

// ─── CLAUDE API ───────────────────────────────────────────────────────────────
async function fetchSchoolFromClaude(schoolName) {
  const res = await fetch("/.netlify/functions/claude-discovery", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ schoolName })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `API error: ${res.status}`);
  }
  return res.json();
}

// ─── NETLIFY BLOBS: Unified load/save for all user data ──────────────────────
// Persists schools, statuses, logs, notes, hiddenIds, and sectionOverrides
// to Netlify Blobs via the schools-load / schools-save functions.
async function loadUserData() {
  const res = await fetch("/.netlify/functions/schools-load");
  if (!res.ok) {
    console.warn("Failed to load user data:", res.status);
    return {};
  }
  return res.json();
}

async function saveUserData(payload) {
  const res = await fetch("/.netlify/functions/schools-save", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Save error: ${res.status}`);
  }
  return res.json();
}

// ─── EMAIL TEMPLATES ─────────────────────────────────────────────────────────

const buildTemplate = (id, school) => {
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

const COLOR_MAP = {
  blue:    { badge: 'bg-blue-600',    light: 'bg-blue-50 border-blue-200 text-blue-700',       btn: 'bg-blue-600 hover:bg-blue-500 text-white' },
  emerald: { badge: 'bg-emerald-600', light: 'bg-emerald-50 border-emerald-200 text-emerald-700', btn: 'bg-emerald-600 hover:bg-emerald-500 text-white' },
  purple:  { badge: 'bg-purple-600',  light: 'bg-purple-50 border-purple-200 text-purple-700',  btn: 'bg-purple-600 hover:bg-purple-500 text-white' },
};

const EmailTemplatesView = ({ school, onBack }) => {
  const [activeTab, setActiveTab] = useState('intro');
  const [copied, setCopied] = useState('');
  const [editedSubjects, setEditedSubjects] = useState({});
  const [editedBodies, setEditedBodies] = useState({});
  const tIds = ['intro', 'tournament', 'video'];

  const getSubject = (id) => editedSubjects[id] ?? buildTemplate(id, school).subject;
  const getBody    = (id) => editedBodies[id]   ?? buildTemplate(id, school).body;

  const copy = (text, key) => {
    navigator.clipboard.writeText(text).then(() => { setCopied(key); setTimeout(() => setCopied(''), 2000); });
  };

  const tpl = buildTemplate(activeTab, school);
  const colors = COLOR_MAP[tpl.color];

  return (
    <div className="min-h-screen" style={{ background: "#f1f4f9" }}>
      <FontStyle />
      <div style={{ background: "linear-gradient(135deg, #0f172a, #1e3a5f)" }} className="px-8 py-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-8">
          <div>
            <div className="flex items-center gap-3 mb-0.5">
              <ShieldCheck className="text-blue-400 w-4 h-4" />
              <span className="text-blue-300 text-xs font-bold uppercase tracking-widest">Parker Henderson · Outreach Templates{school ? ` · ${school.name}` : ''}</span>
            </div>
            <h1 className="font-black text-white text-3xl tracking-tight" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>COACH OUTREACH <span className="text-blue-400">EMAIL TEMPLATES</span></h1>
          </div>
          <button onClick={onBack} className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 px-5 py-2.5 rounded-xl text-white text-xs font-bold uppercase tracking-wide transition-all">
            <ArrowLeft className="w-4 h-4" /> {school ? school.name : 'Dashboard'}
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 pb-20 pt-8">
        {/* STRATEGY BANNER */}
        <div className="rounded-2xl mb-8 p-6 border border-blue-200" style={{ background: 'linear-gradient(135deg, #eff6ff, #dbeafe)' }}>
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center flex-shrink-0">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-black text-blue-900 text-lg mb-1" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>3-PHASE OUTREACH STRATEGY</div>
              <p className="text-blue-800 text-sm leading-relaxed mb-3">
                Coaches receive hundreds of emails. Consistent, personalized outreach across all three phases dramatically increases visibility.
                {school ? ` These templates are pre-filled for ${school.name}${school.coaches?.[0]?.name ? ` — Coach ${school.coaches[0].name.split(' ').slice(-1)[0]}` : ''}.` : ' Select a school from the dashboard to auto-fill coach names.'}
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  { Icon: Mail, text: 'Phase 1: Introduce → get on radar' },
                  { Icon: Trophy, text: 'Phase 2: Tournament invite → live eval' },
                  { Icon: Video, text: 'Phase 3: New video → show growth' },
                ].map(({ Icon, text }, i) => (
                  <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/70 text-blue-800 text-xs font-semibold rounded-full border border-blue-200"><Icon className="w-3.5 h-3.5" /> {text}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* TAB SWITCHER */}
        <div className="flex gap-3 mb-6">
          {tIds.map(id => {
            const t = buildTemplate(id, school);
            const c = COLOR_MAP[t.color];
            const isActive = activeTab === id;
            return (
              <button key={id} onClick={() => setActiveTab(id)}
                className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm uppercase tracking-wide transition-all border ${isActive ? `${c.badge} text-white border-transparent shadow-lg` : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'}`}>
                <div className="text-[10px] opacity-70 mb-0.5">{t.phase}</div>
                {t.label}
              </button>
            );
          })}
        </div>

        {/* ACTIVE TEMPLATE CARD */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className={`px-6 py-3 flex items-center gap-2 text-sm font-semibold border-b border-slate-100 ${colors.light}`}>
            <span className="inline-flex items-center">{tpl.icon === 'mail' ? <Mail className="w-5 h-5" /> : tpl.icon === 'send' ? <Trophy className="w-5 h-5" /> : <Video className="w-5 h-5" />}</span>
            <span>{tpl.tip}</span>
            {school?.coaches?.[0]?.email && (
              <span className="ml-auto text-xs font-normal opacity-75">Send to: <strong>{school.coaches[0].email}</strong></span>
            )}
          </div>
          <div className="p-6 space-y-5">
            {/* SUBJECT */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Subject Line</label>
                <button onClick={() => copy(getSubject(activeTab), `subj-${activeTab}`)}
                  className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 hover:text-blue-600 px-2 py-1 rounded-lg hover:bg-blue-50 transition-colors">
                  {copied === `subj-${activeTab}` ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                  {copied === `subj-${activeTab}` ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <input className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 outline-none focus:border-blue-400 focus:bg-white transition-all"
                value={getSubject(activeTab)} onChange={e => setEditedSubjects(prev => ({ ...prev, [activeTab]: e.target.value }))} />
            </div>
            {/* BODY */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Email Body</label>
                <button onClick={() => copy(getBody(activeTab), `body-${activeTab}`)}
                  className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 hover:text-blue-600 px-2 py-1 rounded-lg hover:bg-blue-50 transition-colors">
                  {copied === `body-${activeTab}` ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                  {copied === `body-${activeTab}` ? 'Copied!' : 'Copy Body'}
                </button>
              </div>
              <textarea className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 text-sm text-slate-800 outline-none focus:border-blue-400 focus:bg-white transition-all resize-none leading-relaxed"
                style={{ minHeight: '420px', fontFamily: 'ui-monospace, monospace' }}
                value={getBody(activeTab)} onChange={e => setEditedBodies(prev => ({ ...prev, [activeTab]: e.target.value }))} />
            </div>
            {/* ACTIONS */}
            <div className="flex flex-wrap gap-3 pt-2 border-t border-slate-100">
              <button onClick={() => copy(`Subject: ${getSubject(activeTab)}\n\n${getBody(activeTab)}`, `all-${activeTab}`)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm uppercase tracking-wide transition-all ${colors.btn}`}>
                {copied === `all-${activeTab}` ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied === `all-${activeTab}` ? 'Copied!' : 'Copy Full Email'}
              </button>
              {school?.coaches?.[0]?.email && (
                <a href={`mailto:${school.coaches[0].email}?subject=${encodeURIComponent(getSubject(activeTab))}&body=${encodeURIComponent(getBody(activeTab))}`}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm uppercase tracking-wide bg-slate-800 hover:bg-slate-700 text-white transition-all">
                  <Mail className="w-4 h-4" /> Open in Mail App
                </a>
              )}
              <button onClick={() => { setEditedSubjects(p => { const n={...p}; delete n[activeTab]; return n; }); setEditedBodies(p => { const n={...p}; delete n[activeTab]; return n; }); }}
                className="flex items-center gap-2 px-4 py-3 rounded-xl font-bold text-sm text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-all">
                Reset to Default
              </button>
            </div>
          </div>
        </div>

        {/* QUICK REF */}
        <div className="mt-8">
          <h3 className="font-black text-slate-700 text-base uppercase tracking-widest mb-4" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Quick Reference — All 3 Phases</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {tIds.map(id => {
              const t = buildTemplate(id, school);
              const c = COLOR_MAP[t.color];
              return (
                <div key={id} className={`rounded-2xl border p-5 ${c.light}`}>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full text-white ${c.badge} inline-block mb-2`}>{t.phase}</span>
                  <div className="font-black text-slate-800 text-sm mb-2" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{t.label.toUpperCase()}</div>
                  <div className="text-xs text-slate-600 leading-relaxed mb-3">{t.tip}</div>
                  <button onClick={() => setActiveTab(id)} className={`w-full py-2 rounded-xl text-xs font-bold uppercase tracking-wide border ${activeTab === id ? `${c.badge} text-white border-transparent` : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'}`}>
                    {activeTab === id ? (<span className="inline-flex items-center gap-1.5"><Check className="w-3.5 h-3.5" /> Currently Viewing</span>) : 'View Template'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* PRO TIPS */}
        <div className="mt-8 bg-slate-900 rounded-2xl p-6 text-white">
          <div className="flex items-center gap-2 font-black text-white text-lg mb-4 uppercase tracking-widest" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}><ClipboardList className="w-5 h-5" /> Outreach Pro Tips</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-300 leading-relaxed">
            {[
              { Icon: Inbox, tip: 'Always fill in ALL bracketed fields before sending. Sending a template with "[INSERT]" still in it is worse than not sending at all.' },
              { Icon: Target, tip: "Personalize Phase 1 with one specific fact about the program — a recent win, a coach's style, or a specific major you researched." },
              { Icon: Calendar, tip: 'Send Phase 2 exactly 7–10 days before the tournament, not the night before. Coaches plan travel in advance.' },
              { Icon: Video, tip: 'For Phase 3, mention one specific skill you have improved. Vague follow-ups get ignored. Specific growth stories get responses.' },
              { Icon: CheckCircle2, tip: 'Log every email in the Interaction Log on each school detail page to keep your pipeline status current.' },
              { Icon: Phone, tip: 'If a coach responds, move immediately to a phone/video call. Rapid responsiveness signals high character.' },
            ].map(({ Icon, tip }, i) => (
              <div key={i} className="flex gap-3 p-3 bg-white/5 rounded-xl">
                <Icon className="w-5 h-5 flex-shrink-0 text-slate-200 mt-0.5" />
                <span>{tip}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};


// ─── GMAIL DRAFTS VIEW ───────────────────────────────────────────────────────

const GMAIL_CLIENT_ID = ''; // User will paste their Client ID here — see instructions

const GmailDraftsView = ({ allSchools, onBack }) => {
  const [authToken, setAuthToken] = useState(null);
  const [clientId, setClientId] = useState('');
  const [draftPhase, setDraftPhase] = useState('intro');
  const [results, setResults] = useState({}); // schoolId -> 'pending'|'done'|'error'|'skipped'
  const [isRunning, setIsRunning] = useState(false);
  const [currentSchool, setCurrentSchool] = useState('');
  const [showSetup, setShowSetup] = useState(true);

  const schoolsWithEmail = allSchools.filter(s => s.coaches?.[0]?.email && s.coaches[0].email !== 'recruit@jessup.edu' || s.coaches?.[0]?.email);

  // Gmail OAuth via Google Identity Services (GIS)
  const signIn = () => {
    if (!clientId.trim()) { alert('Please enter your Google OAuth Client ID first.'); return; }
    const scope = 'https://www.googleapis.com/auth/gmail.compose';
    const tokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: clientId.trim(),
      scope,
      callback: (resp) => {
        if (resp.error) { alert('Auth error: ' + resp.error); return; }
        setAuthToken(resp.access_token);
        setShowSetup(false);
      },
    });
    tokenClient.requestAccessToken();
  };

  const signOut = () => { setAuthToken(null); setShowSetup(true); setResults({}); };

  const buildDraftBody = (school) => {
    const tpl = buildTemplate(draftPhase, school);
    return { subject: tpl.subject, body: tpl.body, to: school.coaches?.[0]?.email || '' };
  };

  const createDraft = async (school) => {
    const { subject, body, to } = buildDraftBody(school);
    if (!to) return 'skipped';
    // RFC 2822 message
    const message = [
      `To: ${to}`,
      `Subject: ${subject}`,
      `MIME-Version: 1.0`,
      `Content-Type: text/html; charset=utf-8`,
      ``,
      body,
    ].join('\r\n');
    const encoded = btoa(unescape(encodeURIComponent(message)))
      .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    const res = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/drafts', {
      method: 'POST',
      headers: { Authorization: `Bearer ${authToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: { raw: encoded } }),
    });
    return res.ok ? 'done' : 'error';
  };

  const runAllDrafts = async () => {
    setIsRunning(true);
    setResults({});
    for (const school of schoolsWithEmail) {
      setCurrentSchool(school.name);
      setResults(prev => ({ ...prev, [school.id]: 'pending' }));
      try {
        const status = await createDraft(school);
        setResults(prev => ({ ...prev, [school.id]: status }));
      } catch {
        setResults(prev => ({ ...prev, [school.id]: 'error' }));
      }
      await new Promise(r => setTimeout(r, 400)); // gentle rate limiting
    }
    setCurrentSchool('');
    setIsRunning(false);
  };

  const doneCount  = Object.values(results).filter(v => v === 'done').length;
  const errorCount = Object.values(results).filter(v => v === 'error').length;
  const phaseLabels = { intro: 'Phase 1 — Introductory', tournament: 'Phase 2 — Tournament Invite', video: 'Phase 3 — Highlight Video' };
  const phaseColors = { intro: 'bg-blue-600', tournament: 'bg-emerald-600', video: 'bg-purple-600' };

  return (
    <div className="min-h-screen" style={{ background: "#f1f4f9" }}>
      <FontStyle />

      {/* Load Google Identity Services */}
      <script src="https://accounts.google.com/gsi/client" async></script>

      {/* HEADER */}
      <div style={{ background: "linear-gradient(135deg, #0f172a, #1e3a5f)" }} className="px-8 py-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-8">
          <div>
            <div className="flex items-center gap-3 mb-0.5">
              <ShieldCheck className="text-blue-400 w-4 h-4" />
              <span className="text-blue-300 text-xs font-bold uppercase tracking-widest">Parker Henderson · Gmail Draft Creator</span>
            </div>
            <h1 className="font-black text-white text-3xl tracking-tight" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
              GMAIL <span className="text-blue-400">DRAFT CREATOR</span>
            </h1>
          </div>
          <button onClick={onBack} className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 px-5 py-2.5 rounded-xl text-white text-xs font-bold uppercase tracking-wide transition-all">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 pb-20 pt-8 space-y-6">

        {/* SETUP PANEL */}
        {showSetup && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-black text-sm">1</div>
              <h2 className="font-black text-slate-800 text-lg uppercase tracking-widest" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Connect Your Gmail Account</h2>
            </div>

            {/* INSTRUCTIONS */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-5 text-sm text-amber-900 leading-relaxed">
              <div className="font-black mb-2 uppercase tracking-wide text-xs">One-Time Setup Required</div>
              <ol className="space-y-1.5 list-decimal list-inside">
                <li>Go to <a href="https://console.cloud.google.com/" target="_blank" rel="noreferrer" className="text-blue-600 underline font-semibold">console.cloud.google.com</a> and sign in with <strong>parkerhenderson.setter.2028@gmail.com</strong></li>
                <li>Create a new project (call it "Recruiting Hub")</li>
                <li>Go to <strong>APIs & Services → Enable APIs</strong> → enable <strong>Gmail API</strong></li>
                <li>Go to <strong>OAuth consent screen</strong> → External → fill in app name → add your email as test user</li>
                <li>Go to <strong>Credentials → Create Credentials → OAuth 2.0 Client ID</strong></li>
                <li>Choose <strong>Web application</strong> → add <code className="bg-white px-1 rounded border border-amber-300">http://localhost</code> AND the current page URL as Authorized JavaScript Origins</li>
                <li>Copy the <strong>Client ID</strong> and paste it below</li>
              </ol>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Google OAuth Client ID</label>
                <input
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-mono text-slate-800 outline-none focus:border-blue-400 focus:bg-white transition-all"
                  placeholder="XXXXXXXXXX-xxxxxxxxxxxxxxxxxx.apps.googleusercontent.com"
                  value={clientId}
                  onChange={e => setClientId(e.target.value)}
                />
              </div>
              <button onClick={signIn}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-sm uppercase tracking-wide transition-all">
                <Mail className="w-4 h-4" /> Connect Gmail Account
              </button>
            </div>
          </div>
        )}

        {/* CONNECTED STATE */}
        {!showSetup && (
          <>
            {/* SUCCESS BANNER */}
            <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-2xl px-5 py-3">
              <Check className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <span className="text-emerald-800 font-bold text-sm">Connected to parkerhenderson.setter.2028@gmail.com</span>
              <button onClick={signOut} className="ml-auto text-xs text-slate-400 hover:text-slate-600 font-bold uppercase tracking-wide">Disconnect</button>
            </div>

            {/* PHASE SELECTOR */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-black text-sm">2</div>
                <h2 className="font-black text-slate-800 text-lg uppercase tracking-widest" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Choose Email Phase</h2>
              </div>
              <div className="flex gap-3">
                {Object.entries(phaseLabels).map(([id, label]) => (
                  <button key={id} onClick={() => setDraftPhase(id)}
                    className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm uppercase tracking-wide transition-all border ${draftPhase === id ? `${phaseColors[id]} text-white border-transparent shadow-lg` : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'}`}>
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* SCHOOL LIST + LAUNCH */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-black text-sm">3</div>
                  <div>
                    <h2 className="font-black text-slate-800 text-lg uppercase tracking-widest" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Create Drafts</h2>
                    <p className="text-xs text-slate-400 mt-0.5">{schoolsWithEmail.length} schools with coach emails · {phaseLabels[draftPhase]}</p>
                  </div>
                </div>
                <button onClick={runAllDrafts} disabled={isRunning}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl font-bold text-sm uppercase tracking-wide transition-all">
                  {isRunning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
                  {isRunning ? `Drafting ${currentSchool}…` : `Create All ${schoolsWithEmail.length} Drafts`}
                </button>
              </div>

              {/* PROGRESS SUMMARY */}
              {Object.keys(results).length > 0 && (
                <div className="flex gap-3 mb-4 p-3 bg-slate-50 rounded-xl">
                  <span className="inline-flex items-center gap-1.5 text-emerald-600 font-bold text-sm"><Check className="w-4 h-4" /> {doneCount} created</span>
                  {errorCount > 0 && <span className="inline-flex items-center gap-1.5 text-red-500 font-bold text-sm"><X className="w-4 h-4" /> {errorCount} failed</span>}
                  <span className="text-slate-400 text-sm">{Object.keys(results).length} / {schoolsWithEmail.length} processed</span>
                  {!isRunning && doneCount > 0 && (
                    <a href="https://mail.google.com/mail/u/0/#drafts" target="_blank" rel="noreferrer"
                      className="ml-auto text-blue-600 font-bold text-xs hover:underline">
                      Open Gmail Drafts ↗
                    </a>
                  )}
                </div>
              )}

              {/* SCHOOL ROWS */}
              <div className="space-y-2">
                {schoolsWithEmail.map(school => {
                  const status = results[school.id];
                  const { subject, to } = buildDraftBody(school);
                  return (
                    <div key={school.id} className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${
                      status === 'done'    ? 'bg-emerald-50 border-emerald-200' :
                      status === 'error'   ? 'bg-red-50 border-red-200' :
                      status === 'pending' ? 'bg-blue-50 border-blue-200' :
                      status === 'skipped' ? 'bg-slate-50 border-slate-200 opacity-50' :
                      'bg-white border-slate-100'
                    }`}>
                      <SchoolLogo school={school} size="sm" />
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-slate-800 text-sm">{school.name}</div>
                        <div className="text-[11px] text-slate-400 truncate">To: {to || 'No email on file'}</div>
                      </div>
                      <div className="text-[10px] font-bold px-2 py-1 rounded-full flex-shrink-0 uppercase tracking-wide">
                        {status === 'done'    && <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-100 px-2 py-1 rounded-full"><Check className="w-3 h-3" /> Draft Created</span>}
                        {status === 'error'   && <span className="inline-flex items-center gap-1 text-red-600 bg-red-100 px-2 py-1 rounded-full"><X className="w-3 h-3" /> Error — Retry</span>}
                        {status === 'pending' && <span className="text-blue-600 bg-blue-100 px-2 py-1 rounded-full flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin inline" /> Creating…</span>}
                        {status === 'skipped' && <span className="text-slate-500 bg-slate-100 px-2 py-1 rounded-full">No Email</span>}
                        {!status && <span className="text-slate-300 bg-slate-50 px-2 py-1 rounded-full border border-slate-200">Queued</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* DONE STATE */}
            {!isRunning && doneCount === schoolsWithEmail.length && doneCount > 0 && (
              <div className="bg-emerald-600 rounded-2xl p-6 text-white text-center">
                <div className="flex justify-center mb-2"><PartyPopper className="w-10 h-10" /></div>
                <div className="font-black text-2xl mb-1" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>ALL {doneCount} DRAFTS CREATED!</div>
                <p className="text-emerald-100 text-sm mb-4">Head to Gmail Drafts, personalize the [INSERT] fields in each email, then send when ready.</p>
                <a href="https://mail.google.com/mail/u/0/#drafts" target="_blank" rel="noreferrer"
                  className="inline-flex items-center gap-2 bg-white text-emerald-700 px-6 py-3 rounded-xl font-bold text-sm uppercase tracking-wide hover:bg-emerald-50 transition-all">
                  <Mail className="w-4 h-4" /> Open Gmail Drafts ↗
                </a>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};


// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  // ── PERSISTED STATE (loaded from Netlify Blobs on mount, saved on change) ──
  const [extraSchools, setExtraSchools] = useState([]);
  const [statuses, setStatuses] = useState({});
  const [logs, setLogs] = useState({});
  const [notes, setNotes] = useState({});
  const [hiddenIds, setHiddenIds] = useState(new Set());
  const [sectionOverrides, setSectionOverrides] = useState({});
  const hydratedRef = React.useRef(false);

  // Hide/move helpers
  const isHidden = (id) => hiddenIds.has(id);
  const getEffectiveSection = (school) => sectionOverrides[school.id] || school.section;
  const hideSchool = (id) => setHiddenIds(prev => { const n = new Set(prev); n.add(id); return n; });
  const unhideSchool = (id) => setHiddenIds(prev => { const n = new Set(prev); n.delete(id); return n; });
  const moveToSection = (id, section) => setSectionOverrides(prev => ({ ...prev, [id]: section }));

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
      }).catch(err => console.warn("Save failed:", err));
    }, 600);
    return () => clearTimeout(timer);
  }, [extraSchools, statuses, logs, notes, hiddenIds, sectionOverrides]);

  const [view, setView] = useState('master');
  const [sel, setSel] = useState(null);
  const [search, setSearch] = useState('');
  const [divFilter, setDivFilter] = useState('All');
  const [newSchoolName, setNewSchoolName] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [logDate, setLogDate] = useState('');
  const [logType, setLogType] = useState('Submitted Questionnaire');
  const [showHidden, setShowHidden] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);

  // Click-outside dismiss for the ⋯ menu
  useEffect(() => {
    if (!openMenuId) return;
    const onDocClick = (e) => {
      if (!e.target.closest('[data-row-menu]')) setOpenMenuId(null);
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [openMenuId]);

  const allSchools = useMemo(() => [...ALL_SCHOOLS_DATA, ...extraSchools], [extraSchools]);
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

  const applyFilters = (list) => list.filter(s => {
    const q = search.toLowerCase();
    const matchSearch = s.name?.toLowerCase().includes(q) || s.city?.toLowerCase().includes(q) || s.conference?.toLowerCase().includes(q);
    const matchDiv = divFilter === 'All' || s.divLevel === divFilter;
    return matchSearch && matchDiv;
  });

  const filteredPrimary = useMemo(() => applyFilters(primarySchools).sort((a,b) => a.name.localeCompare(b.name)), [search, divFilter, primarySchools]);
  const filteredDiscovery = useMemo(() => applyFilters(discoverySchools).sort((a,b) => a.name.localeCompare(b.name)), [search, divFilter, discoverySchools]);

  const handleAddSchool = async () => {
    if (!newSchoolName.trim()) return;
    setIsSearching(true);
    try {
      const parsed = await fetchSchoolFromClaude(newSchoolName);
      if (parsed.isVolleyballSchool === false) {
        alert("No Men's Volleyball program found.");
      } else {
        setExtraSchools(prev => [{ ...parsed, section: parsed.section || "discovery" }, ...prev]);
        setNewSchoolName('');
      }
    } catch (err) { alert(`Error: ${err.message}`); }
    finally { setIsSearching(false); }
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

  const schoolStatus = sel ? (statuses[sel.id] || "None") : "None";
  const statusIdx = STATUSES.findIndex(s => s.key === schoolStatus);

  // ── SCHOOL ROW ──────────────────────────────────────────────────────────────
  const SchoolRow = ({ s, compact = false }) => {
    const sStatus = statuses[s.id] || "None";
    const py = compact ? "py-3" : "py-4";
    return (
      <tr onClick={() => navigate(s)} className={`hover:bg-blue-50/30 cursor-pointer transition-colors group`}>
        <td className={`px-5 ${py}`}>
          <div className="flex items-center gap-3">
            <SchoolLogo school={s} size={compact ? "sm" : "md"} />
            <div>
              <div className="flex items-center gap-2">
                <span className={`font-bold text-slate-800 group-hover:text-blue-600 transition-colors ${compact ? "text-xs" : "text-sm"}`}>{s.name}</span>
                <PriorityBadge priority={s.priority} />
              </div>
              <div className="text-[11px] text-slate-400">
                {s.mascot || "—"}
                {s.coaches?.[0]?.name && s.coaches[0].name !== "Head Coach TBD" && (
                  <span className="ml-1 text-slate-400">
                    · <span className="text-slate-600 font-medium">{s.coaches[0].name}</span>
                    {s.coaches[0].email && (
                      <a href={`mailto:${s.coaches[0].email}`}
                        className="ml-1 text-blue-500 hover:text-blue-700 hover:underline"
                        onClick={e => e.stopPropagation()}>
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
          <div className="text-[11px] text-slate-400">{s.tuitionIn || "—"}</div>
        </td>
        <td className={`px-5 ${py}`}><NeedBadge need={s.setterNeed} /></td>
        <td className={`px-5 ${py}`}><StatusBadge statusKey={sStatus} /></td>
        <td className={`px-3 ${py} text-right`} data-row-menu>
          <div className="inline-flex items-center gap-1 relative">
            <button
              onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === s.id ? null : s.id); }}
              className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition-colors"
              title="More actions"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
            <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500 transition-colors" />
            {openMenuId === s.id && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="absolute right-6 top-8 z-30 w-52 bg-white border border-slate-200 rounded-xl shadow-xl py-1.5 text-left"
              >
                {getEffectiveSection(s) !== "primary" && (
                  <button
                    onClick={() => { moveToSection(s.id, "primary"); setOpenMenuId(null); }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-bold uppercase tracking-wide text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                  >
                    <ArrowUpCircle className="w-4 h-4 text-blue-500" />
                    Move to Primary
                  </button>
                )}
                {getEffectiveSection(s) !== "discovery" && (
                  <button
                    onClick={() => { moveToSection(s.id, "discovery"); setOpenMenuId(null); }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-bold uppercase tracking-wide text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
                  >
                    <ArrowDownCircle className="w-4 h-4 text-indigo-500" />
                    Move to Discovery
                  </button>
                )}
                <div className="border-t border-slate-100 my-1" />
                <button
                  onClick={() => { hideSchool(s.id); setOpenMenuId(null); }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-bold uppercase tracking-wide text-slate-700 hover:bg-rose-50 hover:text-rose-700 transition-colors"
                >
                  <EyeOff className="w-4 h-4 text-rose-500" />
                  Hide School
                </button>
              </div>
            )}
          </div>
        </td>
      </tr>
    );
  };

  // ── MASTER VIEW ──────────────────────────────────────────────────────────────
  if (view === 'master') return (
    <div className="min-h-screen" style={{ background: "#f1f4f9" }}>
      <FontStyle />

      {/* TOP HEADER */}
      <div style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #0f2044 100%)" }} className="px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <ShieldCheck className="text-blue-400 w-5 h-5" />
                <span className="text-blue-300 text-xs font-bold uppercase tracking-widest">Brophy College Prep · AZ Fear 17s · Class of 2028</span>
              </div>
              <h1 className="font-black text-white tracking-tight leading-none" style={{ fontSize: "2.8rem", fontFamily: "'Barlow Condensed', sans-serif" }}>
                PARKER HENDERSON <span className="text-blue-400">RECRUITING HUB</span>
              </h1>
              <p className="text-slate-400 text-sm mt-1">Men's Volleyball · Setter · {allSchools.length} programs tracked · Business / Aviation / Theology</p>
            </div>
            <div className="flex flex-wrap gap-3">
              {[
                { label: "Total Programs", value: allSchools.length, color: "text-white" },
                { label: "D-I Programs", value: divCounts["DI"] || 0, color: "text-blue-400" },
                { label: "D-II / NAIA", value: (divCounts["DII"] || 0) + (divCounts["NAIA"] || 0), color: "text-violet-400" },
                { label: "Contacted", value: contacted, color: "text-emerald-400" },
              ].map(stat => (
                <div key={stat.label} className="bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-center min-w-20">
                  <div className={`font-black text-2xl leading-none ${stat.color}`} style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{stat.value}</div>
                  <div className="text-slate-500 text-[10px] uppercase tracking-wide mt-0.5">{stat.label}</div>
                </div>
              ))}
            </div>
            <button onClick={() => goEmail(null)}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl px-5 py-3 text-white text-xs font-bold uppercase tracking-widest transition-all flex-shrink-0">
              <Mail className="w-4 h-4 text-blue-300" />
              Email Templates
            </button>
            <button onClick={goGmail}
              className="flex items-center gap-2 bg-emerald-600/80 hover:bg-emerald-500 border border-emerald-400/40 rounded-2xl px-5 py-3 text-white text-xs font-bold uppercase tracking-widest transition-all flex-shrink-0">
              <Send className="w-4 h-4" />
              Gmail Drafts
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 pb-20 pt-8 space-y-8">

        {/* DISCOVERY ENGINE */}
        <div className="rounded-2xl overflow-hidden shadow-lg" style={{ background: "linear-gradient(135deg, #1e3a8a, #1e40af)" }}>
          <div className="p-8">
            <div className="flex items-center gap-3 mb-1">
              <Sparkles className="text-blue-200 w-5 h-5" />
              <h2 className="font-black text-white text-xl uppercase tracking-widest" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Discovery Engine</h2>
            </div>
            <p className="text-blue-300 text-sm mb-6">Research any college's men's volleyball program instantly — powered by Claude AI. Results include Parker-specific fit analysis.</p>
            <div className="flex flex-col md:flex-row gap-3">
              <input type="text" placeholder="Enter college name (e.g. 'Stanford', 'Ohio State')…"
                className="flex-1 bg-white/10 border border-white/20 rounded-xl px-5 py-3.5 text-white font-semibold placeholder:text-white/30 focus:bg-white/20 outline-none text-sm"
                value={newSchoolName} onChange={e => setNewSchoolName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAddSchool()} />
              <button onClick={handleAddSchool} disabled={isSearching}
                className="bg-white text-blue-700 px-8 py-3.5 rounded-xl font-bold uppercase tracking-widest text-sm flex items-center justify-center gap-2 hover:bg-blue-50 transition-all disabled:opacity-60 flex-shrink-0">
                {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <PlusCircle className="w-4 h-4" />}
                Add Program
              </button>
              {extraSchools.length > 0 && (
                <button onClick={() => { if (window.confirm(`Remove all ${extraSchools.length} added school(s)?`)) setExtraSchools([]); }}
                  className="bg-white/10 border border-white/20 text-white/60 px-4 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wide hover:bg-white/20 hover:text-white transition-all flex-shrink-0">
                  Clear Added ({extraSchools.length})
                </button>
              )}
            </div>
          </div>
        </div>

        {/* FILTER BAR */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="flex flex-wrap gap-2">
            {["All", "DI", "DII", "DIII", "NAIA", "JUCO"].map(d => (
              <button key={d} onClick={() => setDivFilter(d)}
                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wide transition-all ${divFilter === d ? 'bg-slate-800 text-white shadow' : 'bg-white text-slate-500 hover:bg-slate-100 border border-slate-200'}`}>
                {d === "All" ? `All (${allSchools.length})` : `${DIV_CONFIG[d]?.label || d} (${divCounts[d] || 0})`}
              </button>
            ))}
          </div>
          <div className="relative flex-1 md:max-w-xs ml-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input type="text" placeholder="Search programs, conferences…"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm font-medium outline-none focus:border-blue-400 shadow-sm"
              value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>


        {/* PRIMARY TARGETS TABLE */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <Target className="text-blue-600 w-5 h-5" />
            <h2 className="font-black text-slate-800 text-xl uppercase tracking-widest" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
              Primary Targets <span className="text-slate-400 font-normal">({filteredPrimary.length})</span>
            </h2>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100" style={{ background: "#f8fafc" }}>
                    {["Institution / Head Coach", "Division", "Conference", "Location", "Acceptance / Tuition", "Setter Need", "Status", ""].map((h, i) => (
                      <th key={i} className="px-5 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredPrimary.map(s => <SchoolRow key={s.id} s={s} />)}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* DISCOVERY PHASE TABLE */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <Compass className="text-indigo-500 w-5 h-5" />
            <h2 className="font-black text-slate-700 text-xl uppercase tracking-widest" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
              Discovery Phase <span className="text-slate-400 font-normal">({filteredDiscovery.length})</span>
            </h2>
            <span className="text-[10px] bg-indigo-50 text-indigo-500 border border-indigo-100 rounded-full px-3 py-0.5 font-bold uppercase">Under Evaluation</span>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-dashed border-slate-300 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100" style={{ background: "#f8fafc" }}>
                    {["Institution / Head Coach", "Division", "Conference", "Location", "Acceptance / Tuition", "Setter Need", "Status", ""].map((h, i) => (
                      <th key={i} className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredDiscovery.map(s => <SchoolRow key={s.id} s={s} compact />)}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* RECRUITING CALENDAR */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-5">
            <Calendar className="text-blue-500 w-5 h-5" />
            <h3 className="font-black text-slate-800 uppercase tracking-widest text-base" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Recruiting Calendar — Class of 2028</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { when: "Now — 2027", what: "Contact coaches, fill questionnaires, attend camps/clinics. AZ Fear 17s visibility is key.", color: "border-blue-400 bg-blue-50", iconColor: "text-blue-600", Icon: Inbox },
              { when: "June 15, 2026", what: "D-I coaches may now initiate contact with Parker (Sophomore year — critical window)", color: "border-amber-400 bg-amber-50", iconColor: "text-amber-600", Icon: Phone },
              { when: "Nov 2028", what: "Early National Signing Period (D-I only) opens — target offer by this date", color: "border-purple-400 bg-purple-50", iconColor: "text-purple-600", Icon: PenLine },
              { when: "Feb 2028", what: "National Signing Day — final letters of intent due", color: "border-emerald-400 bg-emerald-50", iconColor: "text-emerald-600", Icon: Trophy },
            ].map((item, i) => {
              const Icon = item.Icon;
              return (
                <div key={i} className={`rounded-xl border-l-4 p-4 ${item.color}`}>
                  <Icon className={`w-6 h-6 mb-1 ${item.iconColor}`} />
                  <div className="font-bold text-slate-800 text-sm mb-1">{item.when}</div>
                  <div className="text-slate-600 text-xs leading-relaxed">{item.what}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* HIDDEN SCHOOLS */}
        {hiddenSchools.length > 0 && (
          <section>
            <button
              onClick={() => setShowHidden(!showHidden)}
              className="w-full flex items-center gap-3 p-4 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-colors group"
            >
              <EyeOff className="w-4 h-4 text-slate-400" />
              <h2 className="font-black text-slate-500 text-sm uppercase tracking-widest" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                Hidden Schools <span className="text-slate-400 font-normal">({hiddenSchools.length})</span>
              </h2>
              <span className="text-[10px] bg-slate-100 text-slate-500 border border-slate-200 rounded-full px-2.5 py-0.5 font-bold uppercase">Archived</span>
              <ChevronDown className={`w-4 h-4 text-slate-400 ml-auto transition-transform ${showHidden ? 'rotate-180' : ''}`} />
            </button>
            {showHidden && (
              <div className="mt-3 bg-white rounded-2xl shadow-sm border border-dashed border-slate-300 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <tbody className="divide-y divide-slate-50">
                      {hiddenSchools.map(s => (
                        <tr key={s.id} className="opacity-70 hover:opacity-100 transition-opacity">
                          <td className="px-5 py-3">
                            <div className="flex items-center gap-3">
                              <SchoolLogo school={s} size="sm" />
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-slate-600 text-xs">{s.name}</span>
                                  <PriorityBadge priority={s.priority} />
                                  <DivBadge divLevel={s.divLevel} />
                                </div>
                                <div className="text-[11px] text-slate-400">{s.city}, {s.state} · {s.conference || "—"}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-3 text-right">
                            <button
                              onClick={() => unhideSchool(s.id)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-[10px] font-bold uppercase tracking-wide transition-colors"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              Restore
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </section>
        )}

      </div>
    </div>
  );

  // ── DETAIL VIEW ──────────────────────────────────────────────────────────────
  if (view === 'detail' && sel) {
    const trend = getTrend(sel.winHistory);
    const schoolNotes = notes[sel.id] || sel.notes || "";

    return (
      <div className="min-h-screen" style={{ background: "#f1f4f9" }}>
        <FontStyle />

        {/* HEADER */}
        <div style={{ background: "linear-gradient(135deg, #0f172a, #1e3a5f)" }} className="px-8 py-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
            <div>
              <div className="flex items-center gap-3 mb-0.5">
                <ShieldCheck className="text-blue-400 w-4 h-4" />
                <span className="text-blue-300 text-xs font-bold uppercase tracking-widest">Parker Henderson · Brophy CP · AZ Fear 17s · Class of 2028</span>
              </div>
              <h1 className="font-black text-white text-3xl tracking-tight" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                RECRUITING HUB <span className="text-slate-500">/ {sel.name.toUpperCase()}</span>
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={goGmail}
                className="flex items-center gap-2 bg-emerald-600/80 hover:bg-emerald-500 border border-emerald-400/40 px-5 py-2.5 rounded-xl text-white text-xs font-bold uppercase tracking-wide transition-all">
                <Send className="w-4 h-4" /> Gmail Drafts
              </button>
              <button onClick={() => goEmail(sel)}
                className="flex items-center gap-2 bg-blue-600/80 hover:bg-blue-500 border border-blue-400/40 px-5 py-2.5 rounded-xl text-white text-xs font-bold uppercase tracking-wide transition-all">
                <Mail className="w-4 h-4" /> Email Templates
              </button>
              <button onClick={goBack}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 px-5 py-2.5 rounded-xl text-white text-xs font-bold uppercase tracking-wide transition-all">
                <ArrowLeft className="w-4 h-4" /> Dashboard
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 sm:px-8 pb-20 pt-8">

          {/* EXECUTIVE SUMMARY */}
          <ExecutiveSummary school={sel} />

          {/* SCHOOL IDENTITY + PIPELINE */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-8">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <SchoolLogo school={sel} size="lg" />
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-1">
                  <h2 className="font-black text-slate-900 text-3xl leading-none" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{sel.name.toUpperCase()}</h2>
                  <DivBadge divLevel={sel.divLevel} size="lg" />
                  <PriorityBadge priority={sel.priority} />
                  {sel.programRank && sel.programRank !== "NR" && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-50 border border-amber-200 rounded-full text-xs font-bold text-amber-700">
                      <Trophy className="w-3 h-3" /> AVCA {sel.programRank}
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                  <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {sel.city}, {sel.state}</span>
                  <span className="font-semibold text-slate-700">{sel.conference} Conference</span>
                  <a href={sel.url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">University Site ↗</a>
                  {sel.vbUrl && sel.vbUrl !== "#" && <a href={sel.vbUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">VB Program ↗</a>}
                </div>
              </div>
              <div className="flex gap-4 flex-shrink-0">
                {[
                  { label: "Acceptance", value: sel.acceptance || "—" },
                  { label: "Setter Need", value: sel.setterNeed || "—" },
                  { label: "Trend", value: trend === "up" ? "↑ Up" : trend === "down" ? "↓ Down" : "→ Flat", color: trend === "up" ? "text-emerald-600" : trend === "down" ? "text-red-500" : "text-slate-500" },
                ].map((item, i) => (
                  <div key={i} className="text-center bg-slate-50 rounded-xl px-4 py-3 min-w-20">
                    <div className={`font-black text-lg leading-none ${item.color || "text-slate-800"}`} style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{item.value}</div>
                    <div className="text-[10px] text-slate-400 uppercase tracking-wide mt-0.5">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* RECRUITING PIPELINE */}
            <div className="mt-6 pt-6 border-t border-slate-100">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-4 h-4 text-blue-500" />
                <span className="font-bold text-slate-700 text-sm uppercase tracking-wide">My Recruiting Pipeline</span>
                <span className="ml-auto"><StatusBadge statusKey={schoolStatus} /></span>
              </div>
              <div className="flex items-center gap-1">
                {STATUSES.map((s, i) => (
                  <React.Fragment key={s.key}>
                    <button onClick={() => setStatuses(prev => ({ ...prev, [sel.id]: s.key }))}
                      className={`flex-1 text-center py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-wide transition-all border ${i <= statusIdx ? "border-blue-500 bg-blue-600 text-white shadow-md" : "border-slate-200 bg-white text-slate-400 hover:border-slate-300"}`}>
                      {s.label}
                    </button>
                    {i < STATUSES.length - 1 && <div className={`w-4 h-0.5 flex-shrink-0 ${i < statusIdx ? "bg-blue-500" : "bg-slate-200"}`} />}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>

          {/* MAIN GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

            {/* LEFT COLUMN */}
            <div className="lg:col-span-4 space-y-6">

              {/* Academic Profile */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <GraduationCap className="w-4 h-4 text-blue-500" />
                  <h3 className="font-black text-slate-800 text-base uppercase tracking-widest" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Academic Fit</h3>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-slate-50 rounded-xl p-3 text-center">
                    <div className="font-black text-lg text-slate-800" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{sel.academic?.avgGPA || "—"}</div>
                    <div className="text-[10px] text-slate-400 uppercase">Avg Team GPA</div>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-3 text-center">
                    <div className="font-black text-lg text-slate-800" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{sel.academic?.gradRate || "—"}</div>
                    <div className="text-[10px] text-slate-400 uppercase">Grad Rate</div>
                  </div>
                </div>
                {(sel.academic?.top10?.length > 0) && (
                  <div className="mb-3">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Top Programs</div>
                    <div className="flex flex-wrap gap-1.5">
                      {sel.academic.top10.map((m, i) => (
                        <span key={i} className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full text-[11px] font-semibold">{m}</span>
                      ))}
                    </div>
                  </div>
                )}
                <div className="space-y-2 text-xs">
                  {[
                    { label: "Business", value: sel.academic?.business, Icon: Briefcase },
                    { label: "Aviation", value: sel.academic?.aviation, Icon: Plane },
                    { label: "Faith/Theology", value: sel.academic?.theology, Icon: Church },
                  ].map(row => {
                    if (!row.value || row.value === "—" || row.value === "N/A") return null;
                    const Icon = row.Icon;
                    return (
                    <div key={row.label} className="flex gap-2 p-2 bg-slate-50 rounded-lg">
                      <Icon className="flex-shrink-0 w-4 h-4 text-slate-500 mt-0.5" />
                      <div>
                        <div className="font-bold text-slate-600 text-[10px] uppercase tracking-wide">{row.label}</div>
                        <div className="text-slate-700 text-xs">{row.value}</div>
                      </div>
                    </div>
                    );
                  })}
                </div>
              </div>

              {/* AZ Radar */}
              {(sel.azRadar?.length > 0) && (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Zap className="w-4 h-4 text-orange-500" />
                    <h3 className="font-black text-slate-800 text-base uppercase tracking-widest" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>AZ Radar</h3>
                  </div>
                  <div className="space-y-2">
                    {sel.azRadar.map((p, i) => (
                      <div key={i} className={`p-3 rounded-xl border-l-4 ${p.hs?.includes('Brophy') ? 'border-blue-600 bg-blue-50' : 'border-orange-400 bg-orange-50/50'}`}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-black text-slate-800 text-sm">{p.name}</span>
                          <span className="text-[10px] bg-white border border-slate-200 px-2 py-0.5 rounded font-bold text-slate-600">{p.pos}</span>
                        </div>
                        <span className={`text-[11px] font-semibold ${p.hs?.includes('Brophy') ? 'text-blue-600' : 'text-orange-600'}`}>{p.hs}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Setter Depth */}
              {(sel.setters?.length > 0) && (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Users className="w-4 h-4 text-blue-500" />
                    <h3 className="font-black text-slate-800 text-base uppercase tracking-widest" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Setter Depth Chart</h3>
                  </div>
                  <div className="space-y-2">
                    {sel.setters.map((s, i) => (
                      <div key={i} className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
                        <div>
                          <span className="font-bold text-slate-800 text-sm">{s.name}</span>
                          <span className="ml-2 text-[10px] text-slate-400 uppercase">{s.class || ""}</span>
                        </div>
                        <span className="text-[10px] bg-slate-200 text-slate-600 font-bold px-2.5 py-1 rounded-full">Grad {s.grad}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 p-3 rounded-xl border border-dashed border-slate-300 bg-slate-50/50">
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">Class of 2028 Opening</div>
                    <div className={`flex items-center gap-2 text-sm font-bold ${sel.setterNeed === 'High' ? 'text-emerald-600' : sel.setterNeed === 'Med' ? 'text-amber-600' : 'text-rose-600'}`}>
                      <Circle className={`w-2.5 h-2.5 flex-shrink-0 ${sel.setterNeed === 'High' ? 'fill-emerald-500 text-emerald-500' : sel.setterNeed === 'Med' ? 'fill-amber-500 text-amber-500' : 'fill-rose-500 text-rose-500'}`} />
                      {sel.setterNeed === 'High' ? 'Strong — multiple roster spots likely open' : sel.setterNeed === 'Med' ? 'Moderate — 1 spot likely available' : 'Limited — roster appears full through 2028'}
                    </div>
                  </div>
                </div>
              )}

              {/* Personal Notes */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center gap-2 mb-3">
                  <BookOpen className="w-4 h-4 text-slate-500" />
                  <h3 className="font-black text-slate-800 text-base uppercase tracking-widest" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>My Notes</h3>
                </div>
                <textarea
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-700 resize-none outline-none focus:border-blue-400 h-24"
                  placeholder="Add personal notes about this program…"
                  value={schoolNotes}
                  onChange={e => setNotes(prev => ({ ...prev, [sel.id]: e.target.value }))}
                />
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="lg:col-span-8 space-y-6">

              {/* Outreach Console */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <h3 className="font-black text-slate-800 text-base uppercase tracking-widest mb-5" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Outreach Console</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-3">
                    {sel.questionnaireUrl && sel.questionnaireUrl !== "#" && (
                      <a href={sel.questionnaireUrl} target="_blank" rel="noreferrer"
                        className="flex items-center justify-center gap-2 py-4 rounded-xl bg-blue-600 text-white text-sm font-bold uppercase tracking-wide hover:bg-blue-500 transition-all">
                        Fill Questionnaire ↗
                      </a>
                    )}
                    {sel.programIG && sel.programIG !== "#" && (
                      <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                        <div className="flex items-center gap-2">
                          <Instagram className="w-4 h-4 text-pink-500" />
                          <span className="text-xs font-bold text-slate-600 uppercase">Team IG</span>
                        </div>
                        <span className="text-sm font-bold text-slate-800">{sel.programIG}</span>
                      </div>
                    )}
                    {sel.coaches?.map((c, i) => (
                      <CoachCard key={i} coach={c} schoolId={sel.id} />
                    ))}
                  </div>

                  {/* Interaction Log */}
                  <div className="bg-slate-900 rounded-2xl p-5 text-white">
                    <div className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-4">Interaction Log</div>
                    <input type="date"
                      className="w-full bg-slate-800 rounded-xl p-3 text-sm text-white mb-3 outline-none border border-slate-700 focus:border-blue-500"
                      value={logDate} onChange={e => setLogDate(e.target.value)} />
                    <select className="w-full bg-slate-800 rounded-xl p-3 text-sm text-white mb-3 outline-none border border-slate-700"
                      value={logType} onChange={e => setLogType(e.target.value)}>
                      <option>Submitted Questionnaire</option>
                      <option>Email / DM Sent</option>
                      <option>Coach Responded</option>
                      <option>Phone / Video Call</option>
                      <option>Campus Visit</option>
                      <option>Verbal Offer</option>
                      <option>Tournament — Coach Watched</option>
                      <option>Camp / Clinic Attended</option>
                    </select>
                    <button onClick={addLog}
                      className="w-full py-3 bg-blue-600 rounded-xl font-bold text-sm uppercase tracking-wide hover:bg-blue-500 transition-all">
                      Log + Update Status
                    </button>
                    <div className="mt-4 space-y-2 max-h-40 overflow-y-auto">
                      {(logs[sel.id] || []).map((entry, i) => (
                        <div key={i} className="flex justify-between text-[11px] text-slate-400 border-t border-slate-800 pt-2">
                          <span className="font-semibold text-slate-300">{entry.type}</span>
                          <span>{entry.date}</span>
                        </div>
                      ))}
                      {!(logs[sel.id]?.length) && <p className="text-[11px] text-slate-600 italic">No interactions logged yet.</p>}
                    </div>
                  </div>
                </div>
              </div>

              {/* Program Stats */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Program Ranking", value: sel.programRank || "NR", sub: "AVCA Preseason", icon: <Trophy className="w-4 h-4 text-amber-500" /> },
                  { label: "2025 Record", value: sel.winHistory?.[0] ? `${sel.winHistory[0].w}–${sel.winHistory[0].l}` : "N/A", sub: sel.winHistory?.[0]?.p ? `${sel.winHistory[0].p} win%` : "", icon: <TrendingUp className="w-4 h-4 text-emerald-500" /> },
                ].map((item, i) => (
                  <div key={i} className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 text-center">
                    <div className="flex justify-center mb-2">{item.icon}</div>
                    <div className="font-black text-2xl text-slate-800 leading-none" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{item.value}</div>
                    <div className="text-[10px] text-slate-500 uppercase tracking-wide mt-1">{item.label}</div>
                    {item.sub && <div className="text-[10px] text-slate-400 mt-0.5">{item.sub}</div>}
                  </div>
                ))}
              </div>

              {/* Season Schedule */}
              {sel.schedule26?.length > 0 && (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-black text-slate-800 text-base uppercase tracking-widest" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>2026 Season Schedule</h3>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1.5 bg-green-50 text-green-700 border border-green-200 rounded-lg text-xs font-bold">W {getRecordTally(sel.schedule26).w}</span>
                      <span className="text-slate-300 font-bold">–</span>
                      <span className="px-3 py-1.5 bg-red-50 text-red-700 border border-red-200 rounded-lg text-xs font-bold">L {getRecordTally(sel.schedule26).l}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mb-4 text-[10px] text-slate-400 font-semibold uppercase tracking-wide">
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-400 inline-block" /> Home</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-slate-300 inline-block" /> Away</span>
                    <span className="flex items-center gap-1"><span className="px-1.5 py-0.5 bg-indigo-50 text-indigo-500 rounded font-bold text-[9px]">CONF</span> Conference</span>
                    <span className="flex items-center gap-1"><span className="px-1.5 py-0.5 bg-amber-50 text-amber-500 rounded font-bold text-[9px]">POST</span> Postseason</span>
                  </div>
                  <div className="space-y-1.5 max-h-[32rem] overflow-y-auto pr-1">
                    {sel.schedule26.map((g, i) => {
                      const isUpcoming = g.r === 'Upcoming';
                      const isWin = g.r?.startsWith('W');
                      const isLoss = g.r?.startsWith('L');
                      const isConf = /MPSF|MIVA|PacWest|Big West|EIVA|GSAC|GLVC|PCAC|Cal Pac/i.test(g.o);
                      const isPost = /tournament|championship|ncaa|final/i.test(g.o);
                      return (
                        <div key={i} className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border transition-all ${isUpcoming ? 'bg-slate-50/70 border-slate-100 opacity-60' : isWin ? 'bg-green-50/40 border-green-100' : isLoss ? 'bg-red-50/30 border-red-100' : 'bg-white border-slate-100'}`}>
                          <div className={`w-2 h-2 rounded-full flex-shrink-0 ${g.home ? 'bg-blue-400' : 'bg-slate-300'}`} />
                          <span className="text-[11px] font-bold text-slate-500 w-12 flex-shrink-0">{g.d}</span>
                          <span className={`text-sm flex-1 font-semibold ${isUpcoming ? 'text-slate-500' : 'text-slate-800'}`}>{g.o}</span>
                          {isPost && <span className="px-1.5 py-0.5 bg-amber-50 text-amber-600 border border-amber-200 rounded text-[9px] font-bold uppercase flex-shrink-0">Post</span>}
                          {isConf && !isPost && <span className="px-1.5 py-0.5 bg-indigo-50 text-indigo-500 border border-indigo-200 rounded text-[9px] font-bold uppercase flex-shrink-0">Conf</span>}
                          <span className={`text-xs font-black w-20 text-right flex-shrink-0 ${isUpcoming ? 'text-slate-300' : isWin ? 'text-green-600' : isLoss ? 'text-red-500' : 'text-slate-400'}`}>{g.r}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Historical Stability */}
              {sel.winHistory?.length > 0 && (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                  <h3 className="font-black text-slate-800 text-base uppercase tracking-widest mb-4" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Historical Stability</h3>
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        <th className="pb-3 pr-4">Year</th><th className="pb-3 pr-4">W</th><th className="pb-3 pr-4">L</th><th className="pb-3">Win %</th><th className="pb-3">Trend</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {sel.winHistory.map((h, i) => {
                        const prev = sel.winHistory[i + 1];
                        const t = prev ? (parseFloat(h.p) > parseFloat(prev.p) ? "↑" : parseFloat(h.p) < parseFloat(prev.p) ? "↓" : "→") : "—";
                        const tc = t === "↑" ? "text-emerald-500" : t === "↓" ? "text-red-400" : "text-slate-300";
                        return (
                          <tr key={i}>
                            <td className="py-2.5 pr-4 font-bold text-slate-700">{h.yr}</td>
                            <td className="py-2.5 pr-4 text-emerald-600 font-bold">{h.w}</td>
                            <td className="py-2.5 pr-4 text-red-500 font-bold">{h.l}</td>
                            <td className="py-2.5 font-semibold text-slate-600">{h.p}</td>
                            <td className={`py-2.5 font-bold text-lg ${tc}`}>{t}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {/* News */}
              {(sel.news?.length > 0) && (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                  <h3 className="font-black text-slate-800 text-base uppercase tracking-widest mb-4" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Program News</h3>
                  <div className="space-y-3">
                    {sel.news.map((n, i) => (
                      <a key={i} href={n.url} target="_blank" rel="noreferrer"
                        className="block p-4 bg-slate-50 rounded-xl hover:bg-blue-50 border border-transparent hover:border-blue-100 transition-all group">
                        <div className="text-[10px] font-bold text-blue-500 uppercase tracking-wide mb-1">{n.date}</div>
                        <div className="font-bold text-slate-800 text-sm group-hover:text-blue-600">{n.title}</div>
                        <div className="text-xs text-slate-500 mt-1 leading-relaxed">{n.body}</div>
                      </a>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    );
  }


  // ── GMAIL VIEW ───────────────────────────────────────────────────────────────
  if (view === 'gmail') {
    return <GmailDraftsView allSchools={allSchools} onBack={() => setView('master')} />;
  }

  // ── EMAIL VIEW ───────────────────────────────────────────────────────────────
  if (view === 'email') {
    return <EmailTemplatesView school={sel} onBack={() => sel ? setView('detail') : setView('master')} />;
  }

  return null;
}
