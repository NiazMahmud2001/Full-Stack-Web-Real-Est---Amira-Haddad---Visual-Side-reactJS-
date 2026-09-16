-- drop table inquiries;

create table if not exists inquiries (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  full_name text not null,
  email text not null,
  phone text not null,
  area text not null,
  message text,
  listing_type text not null check (listing_type in ('sale', 'rent')),
  property_type text not null check (property_type in ('apartment','villa','townhouse','penthouse','studio','office')),
  bedrooms smallint check (bedrooms >= 0),
  budget_aed bigint not null check (budget_aed >= 0)
);
/*
alter table inquiries enable row level security;

create policy "Visitors can send an enquiry"
  on public.inquiries
  for insert
  to anon, authenticated
  with check (true);

  
select * from inquiries;

*/





/*================================= schema =================================*/
/* 1. agent -------------------------------------------------------------------*/

create table if not exists agent (
  id smallint primary key default 1 check (id = 1), -- only ever one row
  name text not null,
  initials text not null,
  role text not null,
  brand text not null,
  tagline text,
  licence text,
  agency text,
  phone text not null,
  whatsapp text,                          -- the WhatsApp link is built from this
  email text not null,
  office_hours text,
  languages text[] not null default '{}',
  years_active smallint not null default 0,
  bio text[] not null default '{}',  -- one entry per paragraph
  credentials jsonb not null default '[]',   -- [{"label": "...", "detail": "..."}]
  socials jsonb not null default '[]'    -- [{"label": "Instagram", "href": "https://..."}]
);



-- 2. media -------------------------------------------------------------------
create table if not exists media (
  key text primary key,  -- e.g. 'livingRoom' or 'hero_frame_1'
  kind text not null check (kind in ('photo', 'hero_frame', 'city_frame', 'hero_video')),
  url text not null,
  sort_order integer not null default 0      -- hero and city frames play in this order
);



-- 3. uae_areas ---------------------------------------------------------------
create table if not exists uae_areas (
  name text primary key,               -- e.g. 'Dubai Marina'
  emirate text not null,                  -- 'Dubai' or 'Abu Dhabi'
  aliases text[] not null default '{}',   -- other ways people type it, lower case
  lat double precision not null,
  lng double precision not null,
  sort_order integer not null default 0      -- order in the footer and area marquee
);


-- 4. listings ----------------------------------------------------------------
create table if not exists listings (
  id text primary key,            -- used in the page address: /property/<id>
  title text not null,
  -- Must be a name from uae_areas. Renaming an area there renames it here too.
  area text not null references public.uae_areas (name) on update cascade,
  address text,
  price_aed bigint not null check (price_aed >= 0), -- sale price, or rent per year
  listing_type  text not null check (listing_type in ('sale', 'rent')),
  property_type text not null,               -- apartment, villa, townhouse, penthouse, studio…
  bedrooms smallint not null default 0, -- 0 means a studio
  bathrooms smallint not null default 0,
  size_sqft integer,
  description text,                        -- a blank line starts a new paragraph
  image_url text,                        -- cover photo
  image_urls text[] not null default '{}',-- gallery, cover first
  amenities text[] not null default '{}',
  lat double precision not null,
  lng double precision not null,
  is_demo boolean not null default false, -- shows the "Sample listing" badge
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);
/*
create index listings_area_idx on public.listings (area);


-- Row level security: anyone may read, nobody may write through the API. ----
alter table public.agent enable row level security;
alter table public.media enable row level security;
alter table public.uae_areas enable row level security;
alter table public.listings  enable row level security;


create policy "Anyone can read the agent profile" on public.agent
  for select to anon, authenticated using (true);
create policy "Anyone can read media" on public.media
  for select to anon, authenticated using (true);
create policy "Anyone can read areas" on public.uae_areas
  for select to anon, authenticated using (true);
create policy "Anyone can read listings" on public.listings
  for select to anon, authenticated using (true);

grant select on public.agent, public.media, public.uae_areas, public.listings
  to anon, authenticated;
  */