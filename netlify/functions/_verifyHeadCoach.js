// netlify/functions/_verifyHeadCoach.js
// Shared helper: fetches the school's own volleyball coaches page and
// extracts the head coach's email from the first mailto anchor whose
// surrounding HTML mentions "Head Coach" (and NOT Associate/Assistant/
// Interim/Former/Emeritus/Volunteer/Director of Operations Head Coach).
// Falls back to the first mailto on the page — on Sidearm athletics sites
// the head coach is typically listed first, per Tim's rule-of-thumb.
//
// Returns { name, role, email, phone, _verified, _sourceUrl, _titleConfirmed }
// or null if no coaches page could be fetched.

export async function verifyHeadCoachFromCoachesPage(vbUrl) {
  if (!vbUrl || typeof vbUrl !== "string") return null;
  const base = vbUrl.replace(/\/+$/, "");

  // Sidearm-style candidate paths for a coaches listing, tried in order.
  const candidates = [
    `${base}/coaches`,
    `${base}/roster/coaches`,
    `${base}/staff`,
    base,
  ];

  const UA =
    "Mozilla/5.0 (compatible; ParkerRecruitingHub/1.0; +https://parker-henderson-vb.netlify.app)";

  for (const url of candidates) {
    let html;
    try {
      const res = await fetch(url, {
        headers: { "User-Agent": UA, Accept: "text/html,*/*" },
        redirect: "follow",
      });
      if (!res.ok) continue;
      html = await res.text();
    } catch {
      continue;
    }

    // Find every mailto anchor with a ~2000-char window around it for context.
    const mailtoRe = /mailto:([A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,})/gi;
    const hits = [];
    let m;
    while ((m = mailtoRe.exec(html)) !== null) {
      const idx = m.index;
      const ctxStart = Math.max(0, idx - 2000);
      const ctxEnd = Math.min(html.length, idx + 500);
      hits.push({ email: m[1], context: html.slice(ctxStart, ctxEnd) });
    }
    if (hits.length === 0) continue;

    const DISQ =
      /(Associate|Assistant|Interim|Former|Emeritus|Volunteer|Director\s+of\s+Operations)\s+Head\s+Coach/i;
    const HEAD = /Head\s+Coach/i;
    const qualifying = hits.find(h => HEAD.test(h.context) && !DISQ.test(h.context));
    const pick = qualifying || hits[0];

    // Best-effort name extraction: strip tags in the context window, then look
    // for a capitalized-words sequence immediately preceding "Head Coach".
    const plain = pick.context
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/gi, " ")
      .replace(/&amp;/gi, "&")
      .replace(/&#39;|&apos;/gi, "'")
      .replace(/&quot;/gi, '"')
      .replace(/\s+/g, " ")
      .trim();

    let name = "";
    const nameBeforeTitle =
      /([A-Z][A-Za-z.'\-]+(?:\s+[A-Z][A-Za-z.'\-]+){1,3})\s*[-\u2013\u2014|,]?\s*Head\s+Coach/;
    const nmatch = nameBeforeTitle.exec(plain);
    if (nmatch) name = nmatch[1].trim();

    return {
      name,
      role: "Head Coach",
      email: pick.email,
      phone: "",
      _verified: true,
      _sourceUrl: url,
      _titleConfirmed: !!qualifying,
    };
  }

  return null;
}
