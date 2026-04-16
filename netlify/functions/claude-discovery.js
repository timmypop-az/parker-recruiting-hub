// netlify/functions/claude-discovery.js
// Server-side Anthropic API call for the Discovery Engine.
// Requires ANTHROPIC_API_KEY env var in Netlify (Site settings → Environment variables).

export default async (req, context) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({
      error: "ANTHROPIC_API_KEY is not set in Netlify environment variables. Add it under Site settings → Environment variables and redeploy.",
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const { schoolName } = await req.json();
    if (!schoolName || typeof schoolName !== "string") {
      return new Response(JSON.stringify({ error: "schoolName (string) is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const prompt = `You are a college volleyball recruiting expert. Provide comprehensive data for "${schoolName}" men's volleyball program for a recruit named Parker Henderson (setter, born 5/10/09, Brophy College Prep Phoenix AZ, club: AZ Fear 17s, interests: business, aviation, theology).
Return ONLY valid JSON (no markdown, no backticks):
{
  "id": "short_id", "name": "Full Name", "city": "City", "state": "ST", "mascot": "Mascot",
  "divLevel": "DI|DII|DIII|NAIA|JUCO", "conference": "Conference name",
  "acceptance": "XX%", "tuitionIn": "$XX,XXX", "tuitionOut": "$XX,XXX",
  "programRank": "#XX or NR", "setterNeed": "High|Med|Low", "priority": "Reach|Target|Safety",
  "url": "https://school.edu", "logoUrl": "https://school.edu", "vbUrl": "https://...", "programIG": "@handle", "questionnaireUrl": "https://...",
  "academic": { "top10": ["Major1","Major2"], "business": "description", "theology": "description", "aviation": "description", "avgGPA": "3.X", "gradRate": "XX%" },
  "parkerFit": { "business": true, "aviation": false, "theology": true, "notes": "2-3 sentence explanation of why this school fits Parker specifically" },
  "coaches": [{ "name": "Name", "role": "Head Coach", "email": "email@school.edu", "phone": "" }],
  "setters": [{ "name": "Name", "grad": "20XX", "class": "JR" }],
  "azRadar": [], "winHistory": [{ "yr": "2025", "w": 0, "l": 0, "p": ".000" }],
  "schedule26": [], "news": [], "notes": "", "section": "discovery", "isVolleyballSchool": true
}
If no men's volleyball program, return: {"isVolleyballSchool": false}`;

    const upstream = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-5",
        max_tokens: 2000,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!upstream.ok) {
      const errText = await upstream.text();
      console.error("Anthropic API error:", upstream.status, errText);
      return new Response(JSON.stringify({
        error: `Anthropic API returned ${upstream.status}: ${errText.slice(0, 300)}`,
      }), {
        status: 502,
        headers: { "Content-Type": "application/json" },
      });
    }

    const data = await upstream.json();
    const text = data.content?.find(b => b.type === "text")?.text || "";

    // Strip markdown code fences if Claude wrapped the response. The previous
    // regex ate the content between fences; this one strips only the markers.
    let cleaned = text
      .replace(/^\s*```(?:json)?\s*/i, "")
      .replace(/\s*```\s*$/i, "")
      .trim();

    // Fallback: if there's prose before/after the JSON, extract the outermost
    // {...} block. Always run when braces exist so a trailing note doesn't
    // break JSON.parse.
    const first = cleaned.indexOf("{");
    const last = cleaned.lastIndexOf("}");
    if (first !== -1 && last > first) {
      cleaned = cleaned.slice(first, last + 1);
    }

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch (parseErr) {
      console.error("Failed to parse Claude response as JSON. Raw text:", text.slice(0, 1000));
      return new Response(JSON.stringify({
        error: "Claude returned non-JSON. Try a more specific school name.",
        raw: text.slice(0, 500),
      }), {
        status: 502,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(parsed), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("claude-discovery error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
