// ---------------------------------------------------------------------------
// ARCHIVED SEED DATA — the site no longer reads this file.
// The live listings are the Supabase `listings` table (add, edit or remove
// them in the Table Editor). This is the original data that
// _archive/scripts/generate-seed.mjs turned into supabase/seed.sql.
//
// Every id is prefixed `demo-` and `is_demo` is set, so the site labels them
// as sample listings.
// ---------------------------------------------------------------------------
// The `.js` endings let Node read this file (_archive/scripts/generate-seed.mjs).
import { PHOTO } from "./media.js";
import { AGENT } from "./agent.js";

const agent = { agent_name: AGENT.name, agent_phone: AGENT.phone };

export const DEMO_LISTINGS = [
  {
    id: "demo-marina-skyline",
    is_demo: true,
    title: "Skyline half-floor above the marina walk",
    area: "Dubai Marina",
    address: "Marina Gate Tower 1",
    price_aed: 6_450_000,
    listing_type: "sale",
    bedrooms: 3,
    bathrooms: 4,
    size_sqft: 2380,
    property_type: "apartment",
    description:
      "A half-floor apartment on the 54th storey with an uninterrupted sweep from the marina channel out to Bluewaters. The living space runs the full width of the plate, glazed floor to ceiling on three sides, with a kitchen by Poliform set behind a stone island. Handed over furnished; service charge is AED 18.40 per sqft.",
    image_url: PHOTO.dubaiNight,
    image_urls: [PHOTO.dubaiNight, PHOTO.livingRoom, PHOTO.bedroom, PHOTO.bathroom],
    amenities: [
      "Private lift lobby",
      "Infinity pool on level 40",
      "Two covered parking bays",
      "24h concierge",
      "Gym and residents' spa",
      "Walk to Marina Metro"
    ],
    lat: 25.0805,
    lng: 55.1403,
    ...agent
  },
  {
    id: "demo-palm-signature",
    is_demo: true,
    title: "Signature villa with a private beach run",
    area: "Palm Jumeirah",
    address: "Frond K, Palm Jumeirah",
    price_aed: 32_000_000,
    listing_type: "sale",
    bedrooms: 5,
    bathrooms: 6,
    size_sqft: 7100,
    property_type: "villa",
    description:
      "One of the original Signature villas, taken back to shell and rebuilt in 2023. Twenty-two metres of private beach, a lap pool set into travertine, and a garden room that opens completely to the water. The upper floor holds four suites; the principal suite takes the whole sea-facing wing.",
    image_url: PHOTO.palmVilla,
    image_urls: [PHOTO.palmVilla, PHOTO.infinityPool, PHOTO.lounge, PHOTO.resortDeck],
    amenities: [
      "22m private beach",
      "Heated lap pool",
      "Staff quarters",
      "Smart home throughout",
      "Four-car garage",
      "Atlantis skyline view"
    ],
    lat: 25.1124,
    lng: 55.139,
    ...agent
  },
  {
    id: "demo-downtown-boulevard",
    is_demo: true,
    title: "Boulevard apartment facing the fountain",
    area: "Downtown Dubai",
    address: "Burj Vista Tower 2",
    price_aed: 4_150_000,
    listing_type: "sale",
    bedrooms: 2,
    bathrooms: 3,
    size_sqft: 1480,
    property_type: "apartment",
    description:
      "A corner two-bedroom on a mid-floor with the Burj on one axis and the fountain lake on the other. Quiet for Downtown — the tower sits back from Mohammed Bin Rashid Boulevard, so you get the view without the Friday-night noise. Vacant on transfer.",
    image_url: PHOTO.downtownSkyline,
    image_urls: [PHOTO.downtownSkyline, PHOTO.livingRoom, PHOTO.dining],
    amenities: [
      "Full Burj Khalifa view",
      "Direct Dubai Mall link",
      "Temperature-controlled pool",
      "Kids' play area",
      "One parking bay"
    ],
    lat: 25.1972,
    lng: 55.2744,
    ...agent
  },
  {
    id: "demo-hills-family",
    is_demo: true,
    title: "Family villa backing onto the golf park",
    area: "Dubai Hills Estate",
    address: "Sidra 2, Dubai Hills",
    price_aed: 9_800_000,
    listing_type: "sale",
    bedrooms: 4,
    bathrooms: 5,
    size_sqft: 4020,
    property_type: "villa",
    description:
      "Type E3 on a green belt plot — nothing will ever be built behind it. The ground floor was opened up into a single kitchen-and-family run facing the garden, and the study was converted to a fifth bedroom with an ensuite. Two minutes to Dubai Hills Mall, five to GEMS Wellington Academy.",
    image_url: PHOTO.whiteVilla,
    image_urls: [PHOTO.whiteVilla, PHOTO.gardenHouse, PHOTO.kitchen, PHOTO.bedroom],
    amenities: [
      "Green belt plot",
      "Private pool",
      "Maid's room",
      "Solar water heating",
      "Walk to community pool",
      "Golf park access"
    ],
    lat: 25.1067,
    lng: 55.2494,
    ...agent
  },
  {
    id: "demo-jbr-rental",
    is_demo: true,
    title: "Beachfront two-bed, let furnished",
    area: "Jumeirah Beach Residence",
    address: "Sadaf 5, JBR",
    price_aed: 215_000,
    listing_type: "rent",
    bedrooms: 2,
    bathrooms: 2,
    size_sqft: 1290,
    property_type: "apartment",
    description:
      "Full sea view from the living room and both bedrooms, one row back from The Walk. Comes furnished and serviced, with chiller included in the rent. Available on one or four cheques; the landlord will consider a two-year lock at the same rate.",
    image_url: PHOTO.burjAlArab,
    image_urls: [PHOTO.burjAlArab, PHOTO.lounge, PHOTO.bedroom],
    amenities: [
      "Direct beach access",
      "Furnished and serviced",
      "Chiller free",
      "Shared pool and gym",
      "Covered parking"
    ],
    lat: 25.0785,
    lng: 55.1339,
    ...agent
  },
  {
    id: "demo-business-bay-loft",
    is_demo: true,
    title: "Canal-side loft with a double-height wall",
    area: "Business Bay",
    address: "Peninsula Three",
    price_aed: 2_680_000,
    listing_type: "sale",
    bedrooms: 1,
    bathrooms: 2,
    size_sqft: 1020,
    property_type: "apartment",
    description:
      "A duplex loft on the canal promenade — six metres of glass in the living room, mezzanine bedroom above, and a terrace wide enough to actually eat on. Handover was 2024, so the building warranty still has three years to run.",
    image_url: PHOTO.lounge,
    image_urls: [PHOTO.lounge, PHOTO.livingRoom, PHOTO.bathroom],
    amenities: [
      "Double-height living room",
      "Canal promenade access",
      "Rooftop pool",
      "Co-working lounge",
      "EV charging bay"
    ],
    lat: 25.1857,
    lng: 55.2645,
    ...agent
  },
  {
    id: "demo-jvc-starter",
    is_demo: true,
    title: "Bright one-bed with a garden terrace",
    area: "Jumeirah Village Circle",
    address: "Belgravia Heights II",
    price_aed: 1_120_000,
    listing_type: "sale",
    bedrooms: 1,
    bathrooms: 2,
    size_sqft: 870,
    property_type: "apartment",
    description:
      "Ground-floor unit with a 340 sqft private terrace — rare in JVC and the reason this one moves quickly. Currently tenanted at AED 78,000 until March, which makes it a clean 7 percent gross entry for an investor, or vacant possession for an end user next spring.",
    image_url: PHOTO.terrace,
    image_urls: [PHOTO.terrace, PHOTO.livingRoom, PHOTO.bedroom],
    amenities: [
      "340 sqft private terrace",
      "Tenanted at 7% gross",
      "Shared pool",
      "Pet friendly building",
      "One parking bay"
    ],
    lat: 25.0587,
    lng: 55.2098,
    ...agent
  },
  {
    id: "demo-ranches-townhouse",
    is_demo: true,
    title: "Townhouse on a quiet ranches cul-de-sac",
    area: "Arabian Ranches",
    address: "Palmera 3",
    price_aed: 4_600_000,
    listing_type: "sale",
    bedrooms: 3,
    bathrooms: 4,
    size_sqft: 2650,
    property_type: "townhouse",
    description:
      "End unit on a cul-de-sac with a plot half again the size of its neighbours. Extended kitchen, landscaped garden with mature ghaf trees, and a pool added under community approval in 2022. Walkable to Ranches Souk and the Jess campus.",
    image_url: PHOTO.stoneHouse,
    image_urls: [PHOTO.stoneHouse, PHOTO.gardenHouse, PHOTO.kitchen],
    amenities: [
      "Oversized end plot",
      "Private pool",
      "Mature landscaping",
      "Walk to JESS Ranches",
      "Community golf access"
    ],
    lat: 25.0511,
    lng: 55.271,
    ...agent
  },

  // --- Abu Dhabi -----------------------------------------------------------
  {
    id: "demo-saadiyat-beach",
    is_demo: true,
    title: "Beach villa on the Saadiyat cultural mile",
    area: "Saadiyat Island",
    address: "Saadiyat Beach Villas",
    price_aed: 18_500_000,
    listing_type: "sale",
    bedrooms: 5,
    bathrooms: 6,
    size_sqft: 6250,
    property_type: "villa",
    description:
      "A corner plot on the beach row, twelve minutes from Louvre Abu Dhabi and backing onto protected dune. The ground floor was reworked into one continuous kitchen-dining-garden run, and the pool was rebuilt in 2023 with a shaded shallow end for small children.\n\nSaadiyat is freehold for all nationalities and the beach here is a nesting site, so the sea frontage cannot be built out — the view is permanent in a way very little else in the emirate is.",
    image_url: PHOTO.coastalVilla,
    image_urls: [PHOTO.coastalVilla, PHOTO.infinityPool, PHOTO.livingRoomAlt, PHOTO.bedroomAlt],
    amenities: [
      "Direct beach access",
      "Private pool rebuilt 2023",
      "Maid's and driver's rooms",
      "Walk to Saadiyat Beach Club",
      "Cranleigh and Redwood schools nearby",
      "Freehold, all nationalities"
    ],
    lat: 24.543,
    lng: 54.431,
    ...agent
  },
  {
    id: "demo-reem-corniche-view",
    is_demo: true,
    title: "High-floor two-bed facing the Corniche",
    area: "Al Reem Island",
    address: "Sun Tower, Shams Abu Dhabi",
    price_aed: 2_150_000,
    listing_type: "sale",
    bedrooms: 2,
    bathrooms: 3,
    size_sqft: 1340,
    property_type: "apartment",
    description:
      "Floor 41, looking straight back across the channel at the Corniche skyline rather than into the neighbouring tower — the difference between a view and a wall, and the reason this line sells first in the building.\n\nVacant now. Service charge runs around AED 16 per sqft including chiller, which is on the reasonable side for Shams.",
    image_url: PHOTO.apartmentBlock,
    image_urls: [PHOTO.apartmentBlock, PHOTO.livingRoomAlt, PHOTO.diningKitchen, PHOTO.bathroom],
    amenities: [
      "Full Corniche skyline view",
      "Chiller included in service charge",
      "Shared pool and gym",
      "Reem Central Park a block away",
      "One covered parking bay"
    ],
    lat: 24.499,
    lng: 54.403,
    ...agent
  },
  {
    id: "demo-yas-waters-edge",
    is_demo: true,
    title: "Canal-front townhouse a walk from the marina",
    area: "Yas Island",
    address: "Water's Edge, Yas Island",
    price_aed: 3_250_000,
    listing_type: "sale",
    bedrooms: 3,
    bathrooms: 4,
    size_sqft: 2180,
    property_type: "townhouse",
    description:
      "An end unit on the water row with the canal promenade at the garden gate. Handed over in 2021 and lightly used — the developer's kitchen and wardrobes are still in, which for once is a good thing here; the specification was better than the current build.\n\nYas Mall, the marina and the two theme parks are all inside a ten-minute drive, and the airport is twelve.",
    image_url: PHOTO.greyVilla,
    image_urls: [PHOTO.greyVilla, PHOTO.atrium, PHOTO.livingRoom, PHOTO.bedroom],
    amenities: [
      "Canal-front end unit",
      "Community pool and gym",
      "Two parking bays",
      "Walk to Yas Marina",
      "12 minutes to Zayed International"
    ],
    lat: 24.488,
    lng: 54.605,
    ...agent
  },
  {
    id: "demo-maryah-penthouse",
    is_demo: true,
    title: "Penthouse over the financial district",
    area: "Al Maryah Island",
    address: "The Galleria Residences",
    price_aed: 11_800_000,
    listing_type: "sale",
    bedrooms: 4,
    bathrooms: 5,
    size_sqft: 4380,
    property_type: "penthouse",
    description:
      "The top two floors of the residences, with a private lift lobby and a terrace that runs the length of the plate looking north over the water. Cladding, glazing and plant were all replaced in the 2022 building refit.\n\nThe Galleria and Cleveland Clinic are both a covered walk away, which in August is the entire argument for living on Maryah.",
    image_url: PHOTO.timberTower,
    image_urls: [PHOTO.timberTower, PHOTO.lounge, PHOTO.diningKitchen, PHOTO.bedroomAlt],
    amenities: [
      "Private lift lobby",
      "Wraparound terrace",
      "Covered link to The Galleria",
      "Three parking bays",
      "24h concierge and valet"
    ],
    lat: 24.501,
    lng: 54.389,
    ...agent
  },
  {
    id: "demo-raha-beach-rental",
    is_demo: true,
    title: "Waterfront two-bed at Al Zeina, let furnished",
    area: "Al Raha Beach",
    address: "Al Zeina, Al Raha Beach",
    price_aed: 145_000,
    listing_type: "rent",
    bedrooms: 2,
    bathrooms: 3,
    size_sqft: 1420,
    property_type: "apartment",
    description:
      "Sea view from the living room and the principal bedroom, one building back from the promenade. Comes furnished and serviced with chiller included, and the landlord will take up to four cheques.\n\nRaha International School and the Etihad Plaza retail strip are both inside the community, so the school run never touches a main road.",
    image_url: PHOTO.woodHouse,
    image_urls: [PHOTO.woodHouse, PHOTO.livingRoomAlt, PHOTO.bedroomAlt],
    amenities: [
      "Sea view",
      "Furnished and serviced",
      "Chiller included",
      "Beach and pool access",
      "Walk to Raha International School"
    ],
    lat: 24.45,
    lng: 54.61,
    ...agent
  },
  {
    id: "demo-khalifa-city-villa",
    is_demo: true,
    title: "Compound villa with a walled garden",
    area: "Khalifa City",
    address: "Khalifa City A",
    price_aed: 195_000,
    listing_type: "rent",
    bedrooms: 4,
    bathrooms: 5,
    size_sqft: 3600,
    property_type: "villa",
    description:
      "A standalone villa inside a small nine-unit compound — shared pool, single gate, and enough garden for a trampoline and a table at the same time. Rare for Khalifa City at this rent, because most of what is available is a sub-divided floor of a larger house.\n\nTwenty minutes to the Corniche off-peak, ten to the airport, and every British and American curriculum school in the eastern suburbs is inside a fifteen-minute drive.",
    image_url: PHOTO.gardenHouse,
    image_urls: [PHOTO.gardenHouse, PHOTO.atrium, PHOTO.kitchen, PHOTO.bedroom],
    amenities: [
      "Standalone in a 9-villa compound",
      "Walled private garden",
      "Shared pool",
      "Maid's room",
      "Covered parking for two",
      "Landlord accepts 2 cheques"
    ],
    lat: 24.42,
    lng: 54.578,
    ...agent
  },
  {
    id: "demo-masdar-studio",
    is_demo: true,
    title: "Efficient studio in the eco quarter",
    area: "Masdar City",
    address: "Leonardo Residences, Masdar City",
    price_aed: 690_000,
    listing_type: "sale",
    bedrooms: 0,
    bathrooms: 1,
    size_sqft: 495,
    property_type: "studio",
    description:
      "A shaded-street studio in the low-energy quarter — the building geometry does most of the cooling, and utility bills here land well under the city average for the size.\n\nCurrently tenanted at AED 45,000, which is a shade over 6 percent gross before charges. Sensible first entry for an investor who wants a tenant already in place.",
    image_url: PHOTO.atrium,
    image_urls: [PHOTO.atrium, PHOTO.livingRoom, PHOTO.bathroom],
    amenities: [
      "Tenanted at ~6% gross",
      "Low-energy building",
      "Shaded pedestrian streets",
      "Shared gym",
      "8 minutes to the airport"
    ],
    lat: 24.427,
    lng: 54.615,
    ...agent
  }
];
