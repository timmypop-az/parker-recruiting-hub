// netlify/functions/schools-save.js
// Saves Parker's schools, statuses, logs, notes, hiddenIds, and sectionOverrides
// to Netlify Blobs.
// Body shape: { schools: [...], statuses: {...}, logs: {...}, notes: {...}, hiddenIds: [...], sectionOverrides: {...} }

import { getStore } from "@netlify/blobs";

export default async (req, context) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const body = await req.json();

    // Build a clean payload — accept partials and merge with what's there
    const store = getStore("parker-recruiting-hub");
    const existing = (await store.get("user-data", { type: "json" })) || {};

    const payload = {
      schools:          body.schools          ?? existing.schools          ?? [],
      statuses:         body.statuses         ?? existing.statuses         ?? {},
      logs:             body.logs             ?? existing.logs             ?? {},
      notes:            body.notes            ?? existing.notes            ?? {},
      hiddenIds:        body.hiddenIds        ?? existing.hiddenIds        ?? [],
      sectionOverrides: body.sectionOverrides ?? existing.sectionOverrides ?? {},
      updatedAt: new Date().toISOString(),
    };

    await store.setJSON("user-data", payload);

    return new Response(JSON.stringify({ ok: true, updatedAt: payload.updatedAt }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("schools-save error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
