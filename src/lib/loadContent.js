import { supabase } from "./supabase";
import { makeAreaHelpers } from "./areas";

// Give up after 15 seconds, so a paused or unreachable Supabase project shows
// the error screen instead of spinning forever.
const TIMEOUT_MS = 15_000;

// `newName:column_name` is Supabase's way of renaming a column as it is read.
// The components were written against `officeHours` and `yearsActive`, while
// the table uses the usual database style, `office_hours` and `years_active`.
const AGENT_COLUMNS =
  "name, initials, role, brand, tagline, licence, agency, phone, whatsapp, email, " +
  "officeHours:office_hours, languages, yearsActive:years_active, bio, credentials, socials";

/** Runs one query and returns its rows, or throws an error naming the table. */
async function readRows(table, query) {
  const { data, error } = await query;
  if (error) {
    throw new Error(`Could not read the "${table}" table: ${error.message}`);
  }
  // With row level security on and no SELECT policy, Supabase answers with an
  // empty list rather than an error — so "no rows" counts as a failure too.
  if (!data || data.length === 0) {
    throw new Error(
      `The "${table}" table returned no rows. Check that supabase/seed.sql has been run ` +
        `and that the table has a SELECT policy for anon (see supabase/schema.sql).`
    );
  }
  return data;
}

/**
 * Fetches the four content tables in parallel and shapes them for the site:
 *
 *   agent      → the agent object, with `socials` (WhatsApp link added)
 *   media      → { photo, heroFrames, cityFrames, heroVideo }
 *   uae_areas  → { areas, dubaiAreas, abuDhabiAreas, areaEmirate, resolveFocus, … }
 *   listings   → { listings, getListing }
 */
export async function loadContent() {
  const signal = AbortSignal.timeout(TIMEOUT_MS);

  const [agentRows, mediaRows, areaRows, listingRows] = await Promise.all([
    readRows("agent", supabase.from("agent").select(AGENT_COLUMNS).limit(1).abortSignal(signal)),
    readRows(
      "media",
      supabase.from("media").select("key, kind, url").order("sort_order").abortSignal(signal)
    ),
    readRows(
      "uae_areas",
      supabase
        .from("uae_areas")
        .select("name, emirate, aliases, lat, lng")
        .order("sort_order")
        .abortSignal(signal)
    ),
    readRows("listings", supabase.from("listings").select("*").order("sort_order").abortSignal(signal))
  ]);

  // --- agent -----------------------------------------------------------------
  const row = agentRows[0];
  const socials = [...(row.socials || [])];
  // Built from the number, so the link and the number can never disagree.
  if (row.whatsapp) {
    socials.push({ label: "WhatsApp", href: `https://wa.me/${row.whatsapp.replace(/[^0-9]/g, "")}` });
  }
  const agent = { ...row, socials };

  // --- media -----------------------------------------------------------------
  // Rows arrive in sort_order, so the hero and city frames stay in sequence.
  const media = { photo: {}, heroFrames: [], cityFrames: [], heroVideo: null };
  for (const item of mediaRows) {
    if (item.kind === "photo") media.photo[item.key] = item.url;
    else if (item.kind === "hero_frame") media.heroFrames.push(item.url);
    else if (item.kind === "city_frame") media.cityFrames.push(item.url);
    else if (item.kind === "hero_video") media.heroVideo = item.url;
  }

  // --- uae_areas ---------------------------------------------------------------
  const areas = makeAreaHelpers(
    areaRows.map((a) => ({
      name: a.name,
      emirate: a.emirate,
      aliases: a.aliases || [],
      center: [a.lat, a.lng]
    }))
  );

  // --- listings ----------------------------------------------------------------
  // Every listing is handled by the one agent, so the contact details come
  // from the agent row rather than being stored again on each listing.
  const listings = listingRows.map((p) => ({
    ...p,
    agent_name: agent.name,
    agent_phone: agent.phone
  }));
  const getListing = (id) => listings.find((p) => p.id === id) || null;

  return { agent, media, areas, listings: { listings, getListing } };
}
