// netlify/functions/schools-load.js
// Loads Parker's saved schools, statuses, logs, notes, hiddenIds, sectionOverrides,
// coachOverrides, deletedIds, and schoolOrder from Netlify Blobs. No env vars or
// auth required — Netlify Blobs is built into the platform.

import { getStore } from "@netlify/blobs";

export default async (req, context) => {
  try {
    const store = getStore("parker-recruiting-hub");
    const data = await store.get("user-data", { type: "json" });

    // First-ever load: nothing in the blob yet
    if (!data) {
      return new Response(JSON.stringify({
        schools: [],
        statuses: {},
        logs: {},
        notes: {},
        hiddenIds: [],
        sectionOverrides: {},
        coachOverrides: {},
        deletedIds: [],
        schoolOrder: [],
      }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({
      schools:          data.schools          || [],
      statuses:         data.statuses         || {},
      logs:             data.logs             || {},
      notes:            data.notes            || {},
      hiddenIds:        data.hiddenIds        || [],
      sectionOverrides: data.sectionOverrides || {},
      coachOverrides:   data.coachOverrides   || {},
      deletedIds:       data.deletedIds       || [],
      schoolOrder:      data.schoolOrder      || [],
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("schools-load error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
