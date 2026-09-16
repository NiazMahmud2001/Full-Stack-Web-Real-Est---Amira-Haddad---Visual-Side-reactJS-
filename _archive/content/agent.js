// ---------------------------------------------------------------------------
// ARCHIVED SEED DATA — the site no longer reads this file.
// The live agent profile is the single row in the Supabase `agent` table (edit
// it in the Table Editor). This is the original data that
// _archive/scripts/generate-seed.mjs turned into supabase/seed.sql.
// ---------------------------------------------------------------------------

export const AGENT = {
  name: "Amira Haddad",
  initials: "AH",
  role: "UAE property specialist",
  brand: "Dubai Property Explorer",
  tagline: "Talk to the city. Watch it move.",
  licence: "RERA BRN 00000",
  agency: "Independent · Dubai & Abu Dhabi",
  phone: "+971 4 000 0000",
  whatsapp: "+971500000000",
  email: "hello@dubaipropertyexplorer.example",
  officeHours: "Sun–Thu · 09:00–19:00 GST",
  languages: ["English", "Arabic", "Hindi"],
  yearsActive: 12,
  bio: [
    "I have spent twelve years placing families and investors in the right address across Dubai and Abu Dhabi — from a first studio in Jumeirah Village Circle to beach villas on Saadiyat.",
    "This site is how I work: describe what you want in plain language, watch the map move to it, and get a straight answer on price, service charge and yield before you ever step into a viewing."
  ],
  credentials: [
    { label: "RERA and ADREC registered", detail: "Brokerage licensed in both Dubai and Abu Dhabi" },
    { label: "Off-plan specialist", detail: "Emaar, Aldar, Nakheel and Sobha launch access" },
    { label: "Investor advisory", detail: "Yield, service charge and exit modelling on every deal" }
  ]
};

export const SOCIALS = [
  { label: "Instagram", href: "https://instagram.com" },
  { label: "LinkedIn", href: "https://linkedin.com" },
  { label: "WhatsApp", href: `https://wa.me/${AGENT.whatsapp.replace(/[^0-9]/g, "")}` }
];
