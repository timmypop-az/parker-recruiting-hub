// netlify/functions/coach-verify.js
// Re-runs the head-coach verification against the school's own volleyball
// page. Used by the "Re-verify Coach" button in DetailView so Tim can
// refresh a stale coach record without re-adding the school (and losing
// logs / notes / status).
//
// Body shape: { vbUrl: string }
// Returns:    { name, role, email, phone, _verified, _sourceUrl,
//               _titleConfirmed } on success, or { error } on failure.

import { verifyHeadCoachFromCoachesPage } from "./_verifyHeadCoach.js";

export default async (req, context) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const { vbUrl } = await req.json();
    if (!vbUrl || typeof vbUrl !== "string") {
      return new Response(JSON.stringify({ error: "vbUrl is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const verified = await verifyHeadCoachFromCoachesPage(vbUrl);
    if (!verified || !verified.email) {
      return new Response(
        JSON.stringify({
          error: "Could not verify head coach from coaches page",
          _verified: false,
        }),
        { status: 502, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify(verified), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("coach-verify error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
