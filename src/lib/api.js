// ─── CLAUDE API ───────────────────────────────────────────────────────────────
export async function fetchSchoolFromClaude(schoolName) {
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

// Re-runs head-coach verification against the school's own volleyball
// page. Returns the verified coach record (or throws on failure) so the
// UI can update a stale coach without re-adding the school.
export async function reVerifyCoach(vbUrl) {
  const res = await fetch("/.netlify/functions/coach-verify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ vbUrl }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Verify error: ${res.status}`);
  }
  return res.json();
}

// ─── NETLIFY BLOBS: Unified load/save for all user data ──────────────────────
// Persists schools, statuses, logs, notes, hiddenIds, and sectionOverrides
// to Netlify Blobs via the schools-load / schools-save functions.
export async function loadUserData() {
  const res = await fetch("/.netlify/functions/schools-load");
  if (!res.ok) {
    console.warn("Failed to load user data:", res.status);
    return {};
  }
  return res.json();
}

export async function saveUserData(payload) {
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
