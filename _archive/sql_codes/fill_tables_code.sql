
-- 1. agent (src/content/agent.js)
insert into public.agent (id, name, initials, role, brand, tagline, licence, agency, phone, whatsapp, email, office_hours, languages, years_active, bio, credentials, socials)
values
  (1, 'Amira Haddad', 'AH', 'UAE property specialist', 'Dubai Property Explorer', 'Talk to the city. Watch it move.', 'RERA BRN 00000', 'Independent · Dubai & Abu Dhabi', '+971 4 000 0000', '+971500000000', 'hello@dubaipropertyexplorer.example', 'Sun–Thu · 09:00–19:00 GST', array['English', 'Arabic', 'Hindi'], 12, array['I have spent twelve years placing families and investors in the right address across Dubai and Abu Dhabi — from a first studio in Jumeirah Village Circle to beach villas on Saadiyat.', 'This site is how I work: describe what you want in plain language, watch the map move to it, and get a straight answer on price, service charge and yield before you ever step into a viewing.'], '[{"label":"RERA and ADREC registered","detail":"Brokerage licensed in both Dubai and Abu Dhabi"},{"label":"Off-plan specialist","detail":"Emaar, Aldar, Nakheel and Sobha launch access"},{"label":"Investor advisory","detail":"Yield, service charge and exit modelling on every deal"}]'::jsonb, '[{"label":"Instagram","href":"https://instagram.com"},{"label":"LinkedIn","href":"https://linkedin.com"}]'::jsonb)
on conflict (id) do update set
  name = excluded.name,
  initials = excluded.initials,
  role = excluded.role,
  brand = excluded.brand,
  tagline = excluded.tagline,
  licence = excluded.licence,
  agency = excluded.agency,
  phone = excluded.phone,
  whatsapp = excluded.whatsapp,
  email = excluded.email,
  office_hours = excluded.office_hours,
  languages = excluded.languages,
  years_active = excluded.years_active,
  bio = excluded.bio,
  credentials = excluded.credentials,
  socials = excluded.socials;

-- 2. media (src/content/media.js)
insert into public.media (key, kind, url, sort_order)
values
  ('hero_frame_1', 'hero_frame', 'https://media.base44.com/images/public/6aa4ab2061a0333c8c5c5fc5/254ef788c_generated_image.png', 1),
  ('hero_frame_2', 'hero_frame', 'https://media.base44.com/images/public/6aa4ab2061a0333c8c5c5fc5/383d72501_generated_image.png', 2),
  ('hero_frame_3', 'hero_frame', 'https://media.base44.com/images/public/6aa4ab2061a0333c8c5c5fc5/1f4579358_generated_image.png', 3),
  ('hero_frame_4', 'hero_frame', 'https://media.base44.com/images/public/6aa4ab2061a0333c8c5c5fc5/ca2d3979e_generated_image.png', 4),
  ('city_frame_1', 'city_frame', 'https://media.base44.com/images/public/6aa4ab2061a0333c8c5c5fc5/e3793639b_generated_image.png', 5),
  ('city_frame_2', 'city_frame', 'https://media.base44.com/images/public/6aa4ab2061a0333c8c5c5fc5/8504f3048_generated_image.png', 6),
  ('city_frame_3', 'city_frame', 'https://media.base44.com/images/public/6aa4ab2061a0333c8c5c5fc5/4ebbec730_generated_image.png', 7),
  ('city_frame_4', 'city_frame', 'https://media.base44.com/images/public/6aa4ab2061a0333c8c5c5fc5/cf45ef67a_generated_image.png', 8),
  ('city_frame_5', 'city_frame', 'https://media.base44.com/images/public/6aa4ab2061a0333c8c5c5fc5/c869fdd33_generated_image.png', 9),
  ('city_frame_6', 'city_frame', 'https://media.base44.com/images/public/6aa4ab2061a0333c8c5c5fc5/5aa2947dd_generated_image.png', 10),
  ('hero_video', 'hero_video', 'https://media.base44.com/videos/public/6aa4ab2061a0333c8c5c5fc5/d9b40e24d_Hero_Video.mp4', 11),
  ('downtownSkyline', 'photo', 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=1600', 12),
  ('dubaiNight', 'photo', 'https://images.unsplash.com/photo-1526495124232-a04e1849168c?auto=format&fit=crop&q=80&w=1600', 13),
  ('burjAlArab', 'photo', 'https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&q=80&w=1600', 14),
  ('sheikhZayedMosque', 'photo', 'https://images.unsplash.com/photo-1512632578888-169bbbc64f33?auto=format&fit=crop&q=80&w=1600', 15),
  ('palmVilla', 'photo', 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=1400', 16),
  ('poolVilla', 'photo', 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&q=80&w=1400', 17),
  ('whiteVilla', 'photo', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1400', 18),
  ('modernHouse', 'photo', 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&q=80&w=1400', 19),
  ('gardenHouse', 'photo', 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1400', 20),
  ('stoneHouse', 'photo', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1400', 21),
  ('woodHouse', 'photo', 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&q=80&w=1400', 22),
  ('coastalVilla', 'photo', 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&q=80&w=1400', 23),
  ('greyVilla', 'photo', 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&q=80&w=1400', 24),
  ('timberTower', 'photo', 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&q=80&w=1400', 25),
  ('apartmentBlock', 'photo', 'https://images.unsplash.com/photo-1567684014761-b65e2e59b9eb?auto=format&fit=crop&q=80&w=1400', 26),
  ('livingRoom', 'photo', 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=1400', 27),
  ('lounge', 'photo', 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&q=80&w=1400', 28),
  ('terrace', 'photo', 'https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?auto=format&fit=crop&q=80&w=1400', 29),
  ('bedroom', 'photo', 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&q=80&w=1400', 30),
  ('bathroom', 'photo', 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=1400', 31),
  ('kitchen', 'photo', 'https://images.unsplash.com/photo-1556909212-d5b604d0c90d?auto=format&fit=crop&q=80&w=1400', 32),
  ('dining', 'photo', 'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?auto=format&fit=crop&q=80&w=1400', 33),
  ('atrium', 'photo', 'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?auto=format&fit=crop&q=80&w=1400', 34),
  ('livingRoomAlt', 'photo', 'https://images.unsplash.com/photo-1600210492493-0946911123ea?auto=format&fit=crop&q=80&w=1400', 35),
  ('diningKitchen', 'photo', 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=1400', 36),
  ('bedroomAlt', 'photo', 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&q=80&w=1400', 37),
  ('infinityPool', 'photo', 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&q=80&w=1400', 38),
  ('resortDeck', 'photo', 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1400', 39)
on conflict (key) do update set
  kind = excluded.kind,
  url = excluded.url,
  sort_order = excluded.sort_order;

-- 3. uae_areas (src/content/uaeAreas.js) — before listings, which point at it
insert into public.uae_areas (name, emirate, aliases, lat, lng, sort_order)
values
  ('Al Barsha', 'Dubai', array['al-barsha', 'albarsha', 'barsha'], 25.1107, 55.1977, 1),
  ('Downtown Dubai', 'Dubai', array['downtown', 'burj khalifa', 'dubai mall'], 25.1972, 55.2744, 2),
  ('Dubai Marina', 'Dubai', array['marina'], 25.0805, 55.1403, 3),
  ('Jumeirah Beach Residence', 'Dubai', array['jbr', 'jumeirah beach residence'], 25.0785, 55.1339, 4),
  ('Business Bay', 'Dubai', array['business bay'], 25.1857, 55.2645, 5),
  ('Palm Jumeirah', 'Dubai', array['palm', 'palm jumeirah'], 25.1124, 55.139, 6),
  ('Jumeirah Lake Towers', 'Dubai', array['jlt', 'jumeirah lake towers'], 25.0693, 55.1416, 7),
  ('Deira', 'Dubai', array['deira'], 25.2697, 55.3095, 8),
  ('Bur Dubai', 'Dubai', array['bur dubai'], 25.2582, 55.2962, 9),
  ('Al Quoz', 'Dubai', array['al quoz', 'quoz'], 25.1447, 55.2354, 10),
  ('Mirdif', 'Dubai', array['mirdif'], 25.2166, 55.4213, 11),
  ('Arabian Ranches', 'Dubai', array['arabian ranches', 'ranches'], 25.0511, 55.271, 12),
  ('Dubai Silicon Oasis', 'Dubai', array['silicon oasis', 'dso'], 25.1219, 55.3776, 13),
  ('International City', 'Dubai', array['international city'], 25.1662, 55.4103, 14),
  ('Jumeirah Village Circle', 'Dubai', array['jvc', 'jumeirah village circle'], 25.0587, 55.2098, 15),
  ('Dubai Hills Estate', 'Dubai', array['dubai hills', 'hills estate'], 25.1067, 55.2494, 16),
  ('Al Nahda', 'Dubai', array['al nahda', 'nahda'], 25.2977, 55.3663, 17),
  ('Discovery Gardens', 'Dubai', array['discovery gardens'], 25.0447, 55.1401, 18),
  ('Motor City', 'Dubai', array['motor city'], 25.0453, 55.2394, 19),
  ('Jumeirah', 'Dubai', array['jumeirah 1', 'jumeirah beach road'], 25.2048, 55.2467, 20),
  ('Saadiyat Island', 'Abu Dhabi', array['saadiyat'], 24.543, 54.431, 21),
  ('Yas Island', 'Abu Dhabi', array['yas'], 24.488, 54.605, 22),
  ('Al Reem Island', 'Abu Dhabi', array['al reem', 'reem island', 'reem'], 24.499, 54.403, 23),
  ('Al Maryah Island', 'Abu Dhabi', array['al maryah', 'maryah'], 24.501, 54.389, 24),
  ('Al Raha Beach', 'Abu Dhabi', array['al raha', 'raha beach', 'al zeina', 'al bandar'], 24.45, 54.61, 25),
  ('Khalifa City', 'Abu Dhabi', array['khalifa city', 'kca'], 24.42, 54.578, 26),
  ('Abu Dhabi Corniche', 'Abu Dhabi', array['corniche', 'al khalidiyah', 'khalidiyah'], 24.474, 54.34, 27),
  ('Masdar City', 'Abu Dhabi', array['masdar'], 24.427, 54.615, 28),
  ('Al Bateen', 'Abu Dhabi', array['bateen'], 24.453, 54.332, 29),
  ('Al Reef', 'Abu Dhabi', array['reef'], 24.434, 54.687, 30),
  ('Mohammed Bin Zayed City', 'Abu Dhabi', array['mbz', 'mohammed bin zayed', 'mbz city'], 24.344, 54.551, 31),
  ('Hudayriyat Island', 'Abu Dhabi', array['hudayriyat', 'hudayriat'], 24.418, 54.313, 32)
on conflict (name) do update set
  emirate = excluded.emirate,
  aliases = excluded.aliases,
  lat = excluded.lat,
  lng = excluded.lng,
  sort_order = excluded.sort_order;

-- 4. listings (src/content/demoListings.js)
insert into public.listings (id, title, area, address, price_aed, listing_type, property_type, bedrooms, bathrooms, size_sqft, description, image_url, image_urls, amenities, lat, lng, is_demo, sort_order)
values
  ('demo-marina-skyline', 'Skyline half-floor above the marina walk', 'Dubai Marina', 'Marina Gate Tower 1', 6450000, 'sale', 'apartment', 3, 4, 2380, 'A half-floor apartment on the 54th storey with an uninterrupted sweep from the marina channel out to Bluewaters. The living space runs the full width of the plate, glazed floor to ceiling on three sides, with a kitchen by Poliform set behind a stone island. Handed over furnished; service charge is AED 18.40 per sqft.', 'https://images.unsplash.com/photo-1526495124232-a04e1849168c?auto=format&fit=crop&q=80&w=1600', array['https://images.unsplash.com/photo-1526495124232-a04e1849168c?auto=format&fit=crop&q=80&w=1600', 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=1400', 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&q=80&w=1400', 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=1400'], array['Private lift lobby', 'Infinity pool on level 40', 'Two covered parking bays', '24h concierge', 'Gym and residents'' spa', 'Walk to Marina Metro'], 25.0805, 55.1403, true, 1),
  ('demo-palm-signature', 'Signature villa with a private beach run', 'Palm Jumeirah', 'Frond K, Palm Jumeirah', 32000000, 'sale', 'villa', 5, 6, 7100, 'One of the original Signature villas, taken back to shell and rebuilt in 2023. Twenty-two metres of private beach, a lap pool set into travertine, and a garden room that opens completely to the water. The upper floor holds four suites; the principal suite takes the whole sea-facing wing.', 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=1400', array['https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=1400', 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&q=80&w=1400', 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&q=80&w=1400', 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1400'], array['22m private beach', 'Heated lap pool', 'Staff quarters', 'Smart home throughout', 'Four-car garage', 'Atlantis skyline view'], 25.1124, 55.139, true, 2),
  ('demo-downtown-boulevard', 'Boulevard apartment facing the fountain', 'Downtown Dubai', 'Burj Vista Tower 2', 4150000, 'sale', 'apartment', 2, 3, 1480, 'A corner two-bedroom on a mid-floor with the Burj on one axis and the fountain lake on the other. Quiet for Downtown — the tower sits back from Mohammed Bin Rashid Boulevard, so you get the view without the Friday-night noise. Vacant on transfer.', 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=1600', array['https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=1600', 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=1400', 'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?auto=format&fit=crop&q=80&w=1400'], array['Full Burj Khalifa view', 'Direct Dubai Mall link', 'Temperature-controlled pool', 'Kids'' play area', 'One parking bay'], 25.1972, 55.2744, true, 3),
  ('demo-hills-family', 'Family villa backing onto the golf park', 'Dubai Hills Estate', 'Sidra 2, Dubai Hills', 9800000, 'sale', 'villa', 4, 5, 4020, 'Type E3 on a green belt plot — nothing will ever be built behind it. The ground floor was opened up into a single kitchen-and-family run facing the garden, and the study was converted to a fifth bedroom with an ensuite. Two minutes to Dubai Hills Mall, five to GEMS Wellington Academy.', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1400', array['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1400', 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1400', 'https://images.unsplash.com/photo-1556909212-d5b604d0c90d?auto=format&fit=crop&q=80&w=1400', 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&q=80&w=1400'], array['Green belt plot', 'Private pool', 'Maid''s room', 'Solar water heating', 'Walk to community pool', 'Golf park access'], 25.1067, 55.2494, true, 4),
  ('demo-jbr-rental', 'Beachfront two-bed, let furnished', 'Jumeirah Beach Residence', 'Sadaf 5, JBR', 215000, 'rent', 'apartment', 2, 2, 1290, 'Full sea view from the living room and both bedrooms, one row back from The Walk. Comes furnished and serviced, with chiller included in the rent. Available on one or four cheques; the landlord will consider a two-year lock at the same rate.', 'https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&q=80&w=1600', array['https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&q=80&w=1600', 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&q=80&w=1400', 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&q=80&w=1400'], array['Direct beach access', 'Furnished and serviced', 'Chiller free', 'Shared pool and gym', 'Covered parking'], 25.0785, 55.1339, true, 5),
  ('demo-business-bay-loft', 'Canal-side loft with a double-height wall', 'Business Bay', 'Peninsula Three', 2680000, 'sale', 'apartment', 1, 2, 1020, 'A duplex loft on the canal promenade — six metres of glass in the living room, mezzanine bedroom above, and a terrace wide enough to actually eat on. Handover was 2024, so the building warranty still has three years to run.', 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&q=80&w=1400', array['https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&q=80&w=1400', 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=1400', 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=1400'], array['Double-height living room', 'Canal promenade access', 'Rooftop pool', 'Co-working lounge', 'EV charging bay'], 25.1857, 55.2645, true, 6),
  ('demo-jvc-starter', 'Bright one-bed with a garden terrace', 'Jumeirah Village Circle', 'Belgravia Heights II', 1120000, 'sale', 'apartment', 1, 2, 870, 'Ground-floor unit with a 340 sqft private terrace — rare in JVC and the reason this one moves quickly. Currently tenanted at AED 78,000 until March, which makes it a clean 7 percent gross entry for an investor, or vacant possession for an end user next spring.', 'https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?auto=format&fit=crop&q=80&w=1400', array['https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?auto=format&fit=crop&q=80&w=1400', 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=1400', 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&q=80&w=1400'], array['340 sqft private terrace', 'Tenanted at 7% gross', 'Shared pool', 'Pet friendly building', 'One parking bay'], 25.0587, 55.2098, true, 7),
  ('demo-ranches-townhouse', 'Townhouse on a quiet ranches cul-de-sac', 'Arabian Ranches', 'Palmera 3', 4600000, 'sale', 'townhouse', 3, 4, 2650, 'End unit on a cul-de-sac with a plot half again the size of its neighbours. Extended kitchen, landscaped garden with mature ghaf trees, and a pool added under community approval in 2022. Walkable to Ranches Souk and the Jess campus.', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1400', array['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1400', 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1400', 'https://images.unsplash.com/photo-1556909212-d5b604d0c90d?auto=format&fit=crop&q=80&w=1400'], array['Oversized end plot', 'Private pool', 'Mature landscaping', 'Walk to JESS Ranches', 'Community golf access'], 25.0511, 55.271, true, 8),
  ('demo-saadiyat-beach', 'Beach villa on the Saadiyat cultural mile', 'Saadiyat Island', 'Saadiyat Beach Villas', 18500000, 'sale', 'villa', 5, 6, 6250, 'A corner plot on the beach row, twelve minutes from Louvre Abu Dhabi and backing onto protected dune. The ground floor was reworked into one continuous kitchen-dining-garden run, and the pool was rebuilt in 2023 with a shaded shallow end for small children.

Saadiyat is freehold for all nationalities and the beach here is a nesting site, so the sea frontage cannot be built out — the view is permanent in a way very little else in the emirate is.', 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&q=80&w=1400', array['https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&q=80&w=1400', 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&q=80&w=1400', 'https://images.unsplash.com/photo-1600210492493-0946911123ea?auto=format&fit=crop&q=80&w=1400', 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&q=80&w=1400'], array['Direct beach access', 'Private pool rebuilt 2023', 'Maid''s and driver''s rooms', 'Walk to Saadiyat Beach Club', 'Cranleigh and Redwood schools nearby', 'Freehold, all nationalities'], 24.543, 54.431, true, 9),
  ('demo-reem-corniche-view', 'High-floor two-bed facing the Corniche', 'Al Reem Island', 'Sun Tower, Shams Abu Dhabi', 2150000, 'sale', 'apartment', 2, 3, 1340, 'Floor 41, looking straight back across the channel at the Corniche skyline rather than into the neighbouring tower — the difference between a view and a wall, and the reason this line sells first in the building.

Vacant now. Service charge runs around AED 16 per sqft including chiller, which is on the reasonable side for Shams.', 'https://images.unsplash.com/photo-1567684014761-b65e2e59b9eb?auto=format&fit=crop&q=80&w=1400', array['https://images.unsplash.com/photo-1567684014761-b65e2e59b9eb?auto=format&fit=crop&q=80&w=1400', 'https://images.unsplash.com/photo-1600210492493-0946911123ea?auto=format&fit=crop&q=80&w=1400', 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=1400', 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=1400'], array['Full Corniche skyline view', 'Chiller included in service charge', 'Shared pool and gym', 'Reem Central Park a block away', 'One covered parking bay'], 24.499, 54.403, true, 10),
  ('demo-yas-waters-edge', 'Canal-front townhouse a walk from the marina', 'Yas Island', 'Water''s Edge, Yas Island', 3250000, 'sale', 'townhouse', 3, 4, 2180, 'An end unit on the water row with the canal promenade at the garden gate. Handed over in 2021 and lightly used — the developer''s kitchen and wardrobes are still in, which for once is a good thing here; the specification was better than the current build.

Yas Mall, the marina and the two theme parks are all inside a ten-minute drive, and the airport is twelve.', 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&q=80&w=1400', array['https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&q=80&w=1400', 'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?auto=format&fit=crop&q=80&w=1400', 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=1400', 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&q=80&w=1400'], array['Canal-front end unit', 'Community pool and gym', 'Two parking bays', 'Walk to Yas Marina', '12 minutes to Zayed International'], 24.488, 54.605, true, 11),
  ('demo-maryah-penthouse', 'Penthouse over the financial district', 'Al Maryah Island', 'The Galleria Residences', 11800000, 'sale', 'penthouse', 4, 5, 4380, 'The top two floors of the residences, with a private lift lobby and a terrace that runs the length of the plate looking north over the water. Cladding, glazing and plant were all replaced in the 2022 building refit.

The Galleria and Cleveland Clinic are both a covered walk away, which in August is the entire argument for living on Maryah.', 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&q=80&w=1400', array['https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&q=80&w=1400', 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&q=80&w=1400', 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=1400', 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&q=80&w=1400'], array['Private lift lobby', 'Wraparound terrace', 'Covered link to The Galleria', 'Three parking bays', '24h concierge and valet'], 24.501, 54.389, true, 12),
  ('demo-raha-beach-rental', 'Waterfront two-bed at Al Zeina, let furnished', 'Al Raha Beach', 'Al Zeina, Al Raha Beach', 145000, 'rent', 'apartment', 2, 3, 1420, 'Sea view from the living room and the principal bedroom, one building back from the promenade. Comes furnished and serviced with chiller included, and the landlord will take up to four cheques.

Raha International School and the Etihad Plaza retail strip are both inside the community, so the school run never touches a main road.', 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&q=80&w=1400', array['https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&q=80&w=1400', 'https://images.unsplash.com/photo-1600210492493-0946911123ea?auto=format&fit=crop&q=80&w=1400', 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&q=80&w=1400'], array['Sea view', 'Furnished and serviced', 'Chiller included', 'Beach and pool access', 'Walk to Raha International School'], 24.45, 54.61, true, 13),
  ('demo-khalifa-city-villa', 'Compound villa with a walled garden', 'Khalifa City', 'Khalifa City A', 195000, 'rent', 'villa', 4, 5, 3600, 'A standalone villa inside a small nine-unit compound — shared pool, single gate, and enough garden for a trampoline and a table at the same time. Rare for Khalifa City at this rent, because most of what is available is a sub-divided floor of a larger house.

Twenty minutes to the Corniche off-peak, ten to the airport, and every British and American curriculum school in the eastern suburbs is inside a fifteen-minute drive.', 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1400', array['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1400', 'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?auto=format&fit=crop&q=80&w=1400', 'https://images.unsplash.com/photo-1556909212-d5b604d0c90d?auto=format&fit=crop&q=80&w=1400', 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&q=80&w=1400'], array['Standalone in a 9-villa compound', 'Walled private garden', 'Shared pool', 'Maid''s room', 'Covered parking for two', 'Landlord accepts 2 cheques'], 24.42, 54.578, true, 14),
  ('demo-masdar-studio', 'Efficient studio in the eco quarter', 'Masdar City', 'Leonardo Residences, Masdar City', 690000, 'sale', 'studio', 0, 1, 495, 'A shaded-street studio in the low-energy quarter — the building geometry does most of the cooling, and utility bills here land well under the city average for the size.

Currently tenanted at AED 45,000, which is a shade over 6 percent gross before charges. Sensible first entry for an investor who wants a tenant already in place.', 'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?auto=format&fit=crop&q=80&w=1400', array['https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?auto=format&fit=crop&q=80&w=1400', 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=1400', 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=1400'], array['Tenanted at ~6% gross', 'Low-energy building', 'Shaded pedestrian streets', 'Shared gym', '8 minutes to the airport'], 24.427, 54.615, true, 15)
on conflict (id) do update set
  title = excluded.title,
  area = excluded.area,
  address = excluded.address,
  price_aed = excluded.price_aed,
  listing_type = excluded.listing_type,
  property_type = excluded.property_type,
  bedrooms = excluded.bedrooms,
  bathrooms = excluded.bathrooms,
  size_sqft = excluded.size_sqft,
  description = excluded.description,
  image_url = excluded.image_url,
  image_urls = excluded.image_urls,
  amenities = excluded.amenities,
  lat = excluded.lat,
  lng = excluded.lng,
  is_demo = excluded.is_demo,
  sort_order = excluded.sort_order;
