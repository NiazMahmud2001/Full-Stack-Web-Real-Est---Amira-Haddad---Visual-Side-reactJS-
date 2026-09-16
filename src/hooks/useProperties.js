import { useMemo } from "react";
import { useListings } from "../context/ContentContext";

/**
 * The listings loaded from the Supabase `listings` table, in the same
 * `{ properties, loading, isDemo }` shape the pages already use. `loading` is
 * always false because <ContentProvider> waits for the data before it shows
 * any page.
 */
export function useProperties(limit = 200) {
  const { listings } = useListings();
  // Memoised, so the map pins and the rail only redraw when the list changes.
  const properties = useMemo(() => listings.slice(0, limit), [listings, limit]);

  return {
    properties,
    loading: false,
    isDemo: listings.some((p) => p.is_demo)
  };
}
