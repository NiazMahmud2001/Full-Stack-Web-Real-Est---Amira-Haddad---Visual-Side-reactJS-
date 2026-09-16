// ---------------------------------------------------------------------------
// ARCHIVED SEED DATA — the site no longer reads this file.
// The live area list is the Supabase `uae_areas` table (edit it in the Table
// Editor). This is the original data that _archive/scripts/generate-seed.mjs
// turned into supabase/seed.sql.
//
// The map settings and the area-matching functions (areaEmirate, resolveFocus,
// matchesFocus…) live in src/lib/areas.js.
// ---------------------------------------------------------------------------
// Written out here rather than imported from src/lib/areas.js, so nothing in
// the archive points back into the app.
const DUBAI = "Dubai";
const ABU_DHABI = "Abu Dhabi";

// Centres are [lat, lng]; the table stores them as separate `lat` and `lng`.
export const UAE_AREAS = [
  // --- Dubai ---------------------------------------------------------------
  { name: "Al Barsha", emirate: DUBAI, aliases: ["al-barsha", "albarsha", "barsha"], center: [25.1107, 55.1977] },
  { name: "Downtown Dubai", emirate: DUBAI, aliases: ["downtown", "burj khalifa", "dubai mall"], center: [25.1972, 55.2744] },
  { name: "Dubai Marina", emirate: DUBAI, aliases: ["marina"], center: [25.0805, 55.1403] },
  { name: "Jumeirah Beach Residence", emirate: DUBAI, aliases: ["jbr", "jumeirah beach residence"], center: [25.0785, 55.1339] },
  { name: "Business Bay", emirate: DUBAI, aliases: ["business bay"], center: [25.1857, 55.2645] },
  { name: "Palm Jumeirah", emirate: DUBAI, aliases: ["palm", "palm jumeirah"], center: [25.1124, 55.139] },
  { name: "Jumeirah Lake Towers", emirate: DUBAI, aliases: ["jlt", "jumeirah lake towers"], center: [25.0693, 55.1416] },
  { name: "Deira", emirate: DUBAI, aliases: ["deira"], center: [25.2697, 55.3095] },
  { name: "Bur Dubai", emirate: DUBAI, aliases: ["bur dubai"], center: [25.2582, 55.2962] },
  { name: "Al Quoz", emirate: DUBAI, aliases: ["al quoz", "quoz"], center: [25.1447, 55.2354] },
  { name: "Mirdif", emirate: DUBAI, aliases: ["mirdif"], center: [25.2166, 55.4213] },
  { name: "Arabian Ranches", emirate: DUBAI, aliases: ["arabian ranches", "ranches"], center: [25.0511, 55.271] },
  { name: "Dubai Silicon Oasis", emirate: DUBAI, aliases: ["silicon oasis", "dso"], center: [25.1219, 55.3776] },
  { name: "International City", emirate: DUBAI, aliases: ["international city"], center: [25.1662, 55.4103] },
  { name: "Jumeirah Village Circle", emirate: DUBAI, aliases: ["jvc", "jumeirah village circle"], center: [25.0587, 55.2098] },
  { name: "Dubai Hills Estate", emirate: DUBAI, aliases: ["dubai hills", "hills estate"], center: [25.1067, 55.2494] },
  { name: "Al Nahda", emirate: DUBAI, aliases: ["al nahda", "nahda"], center: [25.2977, 55.3663] },
  { name: "Discovery Gardens", emirate: DUBAI, aliases: ["discovery gardens"], center: [25.0447, 55.1401] },
  { name: "Motor City", emirate: DUBAI, aliases: ["motor city"], center: [25.0453, 55.2394] },
  { name: "Jumeirah", emirate: DUBAI, aliases: ["jumeirah 1", "jumeirah beach road"], center: [25.2048, 55.2467] },

  // --- Abu Dhabi -----------------------------------------------------------
  { name: "Saadiyat Island", emirate: ABU_DHABI, aliases: ["saadiyat"], center: [24.543, 54.431] },
  { name: "Yas Island", emirate: ABU_DHABI, aliases: ["yas"], center: [24.488, 54.605] },
  { name: "Al Reem Island", emirate: ABU_DHABI, aliases: ["al reem", "reem island", "reem"], center: [24.499, 54.403] },
  { name: "Al Maryah Island", emirate: ABU_DHABI, aliases: ["al maryah", "maryah"], center: [24.501, 54.389] },
  { name: "Al Raha Beach", emirate: ABU_DHABI, aliases: ["al raha", "raha beach", "al zeina", "al bandar"], center: [24.45, 54.61] },
  { name: "Khalifa City", emirate: ABU_DHABI, aliases: ["khalifa city", "kca"], center: [24.42, 54.578] },
  { name: "Abu Dhabi Corniche", emirate: ABU_DHABI, aliases: ["corniche", "al khalidiyah", "khalidiyah"], center: [24.474, 54.34] },
  { name: "Masdar City", emirate: ABU_DHABI, aliases: ["masdar"], center: [24.427, 54.615] },
  { name: "Al Bateen", emirate: ABU_DHABI, aliases: ["bateen"], center: [24.453, 54.332] },
  { name: "Al Reef", emirate: ABU_DHABI, aliases: ["reef"], center: [24.434, 54.687] },
  { name: "Mohammed Bin Zayed City", emirate: ABU_DHABI, aliases: ["mbz", "mohammed bin zayed", "mbz city"], center: [24.344, 54.551] },
  { name: "Hudayriyat Island", emirate: ABU_DHABI, aliases: ["hudayriyat", "hudayriat"], center: [24.418, 54.313] }
];
