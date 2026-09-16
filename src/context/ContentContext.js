import { createContext, useContext } from "react";

// Holds everything loadContent() fetched from Supabase. <ContentProvider>
// (src/context/ContentProvider.jsx) fills it in, and the hooks below read it.
// The provider only shows the site once the data has arrived, so these hooks
// always return real data — no loading checks needed in components.
export const ContentContext = createContext(null);

function useContent() {
  const content = useContext(ContentContext);
  if (!content) {
    throw new Error("This component must be rendered inside <ContentProvider> (see src/App.jsx).");
  }
  return content;
}

/** The row from the `agent` table, plus `socials`. */
export const useAgent = () => useContent().agent;

/** From the `media` table: `{ photo, heroFrames, cityFrames, heroVideo }`. */
export const useMedia = () => useContent().media;

/**
 * From the `uae_areas` table: `{ areas, dubaiAreas, abuDhabiAreas, areaEmirate, resolveArea, resolveFocus, matchesFocus }`.
**/
export const useAreas = () => useContent().areas;

/** From the `listings` table: `{ listings, getListing }`. */
export const useListings = () => useContent().listings;
