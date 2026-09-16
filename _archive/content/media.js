// ARCHIVED SEED DATA — the site no longer reads this file.
// The live copy is the Supabase `media` table (edit it in the Table Editor).
// This is the original data that _archive/scripts/generate-seed.mjs turned
// into supabase/seed.sql.
//
// Shared image/video assets. The `HERO_FRAMES` set is hosted with the app;
// editorial photography comes from Unsplash's CDN and is sized on request.
// Every id below was checked by eye — the names describe what is actually in
// the frame, so listings never get captioned with the wrong landmark.

export const HERO_FRAMES = [
  "https://media.base44.com/images/public/6aa4ab2061a0333c8c5c5fc5/254ef788c_generated_image.png",
  "https://media.base44.com/images/public/6aa4ab2061a0333c8c5c5fc5/383d72501_generated_image.png",
  "https://media.base44.com/images/public/6aa4ab2061a0333c8c5c5fc5/1f4579358_generated_image.png",
  "https://media.base44.com/images/public/6aa4ab2061a0333c8c5c5fc5/ca2d3979e_generated_image.png"
];

export const CITY_FRAMES = [
  "https://media.base44.com/images/public/6aa4ab2061a0333c8c5c5fc5/e3793639b_generated_image.png",
  "https://media.base44.com/images/public/6aa4ab2061a0333c8c5c5fc5/8504f3048_generated_image.png",
  "https://media.base44.com/images/public/6aa4ab2061a0333c8c5c5fc5/4ebbec730_generated_image.png",
  "https://media.base44.com/images/public/6aa4ab2061a0333c8c5c5fc5/cf45ef67a_generated_image.png",
  "https://media.base44.com/images/public/6aa4ab2061a0333c8c5c5fc5/c869fdd33_generated_image.png",
  "https://media.base44.com/images/public/6aa4ab2061a0333c8c5c5fc5/5aa2947dd_generated_image.png"
];

export const HERO_VIDEO =
  "https://media.base44.com/videos/public/6aa4ab2061a0333c8c5c5fc5/d9b40e24d_Hero_Video.mp4";

/** Build a width-constrained Unsplash CDN URL. */
export const unsplash = (id, w = 1200) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=80&w=${w}`;

export const PHOTO = {
  // --- Dubai, exterior -----------------------------------------------------
  downtownSkyline: unsplash("1512453979798-5ea266f8880c", 1600), // Burj Khalifa / Downtown
  dubaiNight: unsplash("1526495124232-a04e1849168c", 1600), // skyline after dark
  burjAlArab: unsplash("1518684079-3c830dcef090", 1600), // Jumeirah beachfront

  // --- Abu Dhabi, exterior -------------------------------------------------
  sheikhZayedMosque: unsplash("1512632578888-169bbbc64f33", 1600), // Grand Mosque at dusk

  // --- Villas and houses ---------------------------------------------------
  palmVilla: unsplash("1613490493576-7fde63acd811", 1400),
  poolVilla: unsplash("1582268611958-ebfd161ef9cf", 1400),
  whiteVilla: unsplash("1600596542815-ffad4c1539a9", 1400),
  modernHouse: unsplash("1580587771525-78b9dba3b914", 1400),
  gardenHouse: unsplash("1512917774080-9991f1c4c750", 1400),
  stoneHouse: unsplash("1600585154340-be6161a56a0c", 1400),
  woodHouse: unsplash("1600566753190-17f0baa2a6c3", 1400),
  coastalVilla: unsplash("1613977257363-707ba9348227", 1400),
  greyVilla: unsplash("1600047509807-ba8f99d2cdde", 1400),
  timberTower: unsplash("1600585154526-990dced4db0d", 1400),
  apartmentBlock: unsplash("1567684014761-b65e2e59b9eb", 1400),

  // --- Interiors -----------------------------------------------------------
  livingRoom: unsplash("1616486338812-3dadae4b4ace", 1400),
  lounge: unsplash("1583847268964-b28dc8f51f92", 1400),
  terrace: unsplash("1567767292278-a4f21aa2d36e", 1400),
  bedroom: unsplash("1616594039964-ae9021a400a0", 1400),
  bathroom: unsplash("1584622650111-993a426fbf0a", 1400),
  kitchen: unsplash("1556909212-d5b604d0c90d", 1400),
  dining: unsplash("1560185007-cde436f6a4d0", 1400),
  atrium: unsplash("1502005229762-cf1b2da7c5d6", 1400),
  livingRoomAlt: unsplash("1600210492493-0946911123ea", 1400),
  diningKitchen: unsplash("1600607687920-4e2a09cf159d", 1400),
  bedroomAlt: unsplash("1512918728675-ed5a9ecdebfd", 1400),

  // --- Amenity -------------------------------------------------------------
  infinityPool: unsplash("1571003123894-1f0594d2b5d9", 1400),
  resortDeck: unsplash("1566073771259-6a8506099945", 1400)
};
