// Area helpers: the map camera settings, plus the functions that match chat
// text to an area. The area *list* lives in the Supabase `uae_areas` table —
// loadContent() fetches it and passes it to makeAreaHelpers(), and components
// get the result from useAreas().
//
// Centres are [lat, lng]. MapLibre wants [lng, lat], so callers flip them.

export const DUBAI = "Dubai";
export const ABU_DHABI = "Abu Dhabi";
export const EMIRATES = [DUBAI, ABU_DHABI];

export const DUBAI_CENTER = [25.152, 55.24];
export const ABU_DHABI_CENTER = [24.4539, 54.3773];
// Roughly halfway along the E11 — a cold map opens on both emirates at once.
export const UAE_CENTER = [24.82, 54.82];
export const UAE_ZOOM = 8.3;

export const EMIRATE_CENTER = {
  [DUBAI]: DUBAI_CENTER,
  [ABU_DHABI]: ABU_DHABI_CENTER
};

const normalise = (text) =>
  String(text || "").toLowerCase().replace(/[-_]/g, " ").replace(/\s+/g, " ").trim();

/** "show me abu dhabi" — an emirate on its own, when no single area was named. */
function resolveEmirate(text) {
  const t = normalise(text);
  if (!t) return null;
  const name = EMIRATES.find((e) => t.includes(e.toLowerCase()));
  if (!name) return null;
  return { name, emirate: name, center: EMIRATE_CENTER[name], isEmirate: true };
}

/**
 * Builds the area lookups for a list of areas shaped
 * `{ name, emirate, aliases, center: [lat, lng] }`.
 */
export function makeAreaHelpers(areas) {
  /** Which emirate an area name belongs to, or null if it isn't in the list. */
  function areaEmirate(areaName) {
    const key = normalise(areaName);
    return areas.find((a) => normalise(a.name) === key)?.emirate ?? null;
  }

  /**
   * Longest matching area name or alias wins, so "Al Reem Island" beats "reem"
   * and a sentence mentioning two areas resolves to the more specific one.
   */
  function resolveArea(text) {
    const t = normalise(text);
    if (!t) return null;
    let best = null;
    for (const area of areas) {
      for (const key of [area.name.toLowerCase(), ...area.aliases]) {
        if (t.includes(key) && (!best || key.length > best.len)) best = { area, len: key.length };
      }
    }
    return best ? best.area : null;
  }

  /**
   * What the chat hands the map. An area is more specific than an emirate, so it
   * is tried first — "Saadiyat Island, Abu Dhabi" focuses Saadiyat, not the city.
   */
  function resolveFocus(text) {
    return resolveArea(text) || resolveEmirate(text);
  }

  /** Does a property belong to the current focus — one area, or a whole emirate? */
  function matchesFocus(property, focus) {
    if (!focus) return true;
    if (focus.isEmirate) return areaEmirate(property.area) === focus.emirate;
    return property.area === focus.name;
  }

  return {
    areas,
    dubaiAreas: areas.filter((a) => a.emirate === DUBAI),
    abuDhabiAreas: areas.filter((a) => a.emirate === ABU_DHABI),
    areaEmirate,
    resolveArea,
    resolveFocus,
    matchesFocus
  };
}
