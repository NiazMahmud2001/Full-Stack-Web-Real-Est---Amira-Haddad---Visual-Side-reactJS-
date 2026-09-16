-- ============================================================================
-- admin-setup.sql — the database side of the /admin page.
--
-- Do steps 1 and 2 in README.md first, then paste this whole file into
-- Supabase → SQL Editor and press Run. It is safe to run again.
--
-- What it sets up:
--   1. admins              who may use /admin (you add yourself in section 5)
--   2. admin_sessions      logins that passed BOTH steps: emailed code + password
--   3. two functions       admin_confirm_password() and is_verified_admin()
--   4. row level security  switched ON for your 5 tables:
--        · anyone can read listings, agent, media and uae_areas (the website)
--        · anyone can send an enquiry (the two forms)
--        · only a verified admin session can add/remove listings and
--          read/remove enquiries
--   5. makes your account an admin
--
-- Everything runs in one transaction: if any line fails, nothing changes.



****** 
-- 1. add user in : Authentication -> users -> click on Add User (in top-right corner)
-- 2. Authentication -> Emails -> SMTP setting -> set up below: 
/*
 * Sender email address  ->  you email: niazmahmud500@gmail.com
 * Sender name           -> your project name
 * Host                  -> smtp.gmail.com
 * Port number           -> 465
 * Username              -> you email: niazmahmud500@gmail.com
 * Password              -> follow below peocedure to get this: 
                                  -- https://myaccount.google.com/apppasswords 
                                  -- App Name: Supabase
                                  -- this will give a 16 degit number and past it in password
*/  
-- ============================================================================

drop table if exists admin_sessions; 
drop table if exists admins; 

begin;

-- crypt() checks a password against the bcrypt hash Supabase stores.
create extension if not exists pgcrypto with schema extensions;


-- 1. admins ------------------------------------------------------------------
create table if not exists public.admins (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);
-- No policies on purpose: nobody can read or change this table through the API.
alter table public.admins enable row level security;


-- 2. admin_sessions ----------------------------------------------------------
create table if not exists public.admin_sessions (
  session_id      uuid primary key,          -- the login's id (session_id in its token)
  user_id         uuid not null references auth.users (id) on delete cascade,
  verified_at     timestamptz,               -- set when the password check passes
  failed_attempts smallint not null default 0,
  expires_at      timestamptz not null
);
alter table public.admin_sessions enable row level security;

-- Signing out deletes your own row (and finding it needs read access to it).
drop policy if exists "Admins can see their own sessions" on public.admin_sessions;
create policy "Admins can see their own sessions" on public.admin_sessions
  for select to authenticated using (user_id = (select auth.uid()));

drop policy if exists "Admins can end their own sessions" on public.admin_sessions;
create policy "Admins can end their own sessions" on public.admin_sessions
  for delete to authenticated using (user_id = (select auth.uid()));

grant select, delete on public.admin_sessions to authenticated;


-- 3. functions ---------------------------------------------------------------

-- True while the current login is a verified, unexpired admin session.
create or replace function public.is_verified_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.admin_sessions s
    join public.admins a on a.user_id = s.user_id
    where s.user_id = auth.uid()
      and s.session_id = nullif(auth.jwt() ->> 'session_id', '')::uuid
      and s.verified_at is not null
      and s.expires_at > now()
  );
$$;

-- The last step of signing in, called right after the emailed code signed you
-- in. It checks the password against the one Supabase stores and, if it
-- matches, marks this login as an admin session for 8 hours.
-- Answers: ok | not_signed_in | not_email_code_login | not_admin | locked | wrong_password
create or replace function public.admin_confirm_password(password text)
returns text
language plpgsql
volatile
security definer
set search_path = ''
as $$
declare
  current_user_id uuid := auth.uid();
  current_session uuid := nullif(auth.jwt() ->> 'session_id', '')::uuid;
  earlier_failures smallint;
begin
  if current_user_id is null or current_session is null then
    return 'not_signed_in';
  end if;

  -- Only a login made with the emailed code counts. Supabase records how a
  -- login was made in the token's "amr" list: "otp" for an emailed code,
  -- "password" for a password.
  if not exists (
    select 1
    from jsonb_array_elements(coalesce(auth.jwt() -> 'amr', '[]'::jsonb)) as m
    where m ->> 'method' in ('otp', 'magiclink')
  ) then
    return 'not_email_code_login';
  end if;

  if not exists (select 1 from public.admins where user_id = current_user_id) then
    return 'not_admin';
  end if;

  -- Five wrong passwords and this login is done; start again with a new code.
  select failed_attempts into earlier_failures
  from public.admin_sessions
  where session_id = current_session;
  if coalesce(earlier_failures, 0) >= 5 then
    return 'locked';
  end if;

  if exists (
    select 1
    from auth.users u
    where u.id = current_user_id
      and u.encrypted_password like '$2%'   -- a bcrypt hash
      and u.encrypted_password = extensions.crypt(password, u.encrypted_password)
  ) then
    insert into public.admin_sessions (session_id, user_id, verified_at, expires_at)
    values (current_session, current_user_id, now(), now() + interval '8 hours')
    on conflict (session_id) do update
      set verified_at = excluded.verified_at,
          expires_at  = excluded.expires_at;
    return 'ok';
  end if;

  insert into public.admin_sessions (session_id, user_id, expires_at, failed_attempts)
  values (current_session, current_user_id, now() + interval '8 hours', 1)
  on conflict (session_id) do update
    set failed_attempts = public.admin_sessions.failed_attempts + 1;
  return 'wrong_password';
end;
$$;

-- Only signed-in users may call these (visitors can't).
revoke all on function public.is_verified_admin() from public, anon;
grant execute on function public.is_verified_admin() to authenticated;
revoke all on function public.admin_confirm_password(text) from public, anon;
grant execute on function public.admin_confirm_password(text) to authenticated;


-- 4. row level security on your tables ---------------------------------------
alter table public.agent     enable row level security;
alter table public.media     enable row level security;
alter table public.uae_areas enable row level security;
alter table public.listings  enable row level security;
alter table public.inquiries enable row level security;

-- The website reads these, for visitors and a signed-in admin alike.
drop policy if exists "Anyone can read the agent profile" on public.agent;
create policy "Anyone can read the agent profile" on public.agent
  for select to anon, authenticated using (true);

drop policy if exists "Anyone can read media" on public.media;
create policy "Anyone can read media" on public.media
  for select to anon, authenticated using (true);

drop policy if exists "Anyone can read areas" on public.uae_areas;
create policy "Anyone can read areas" on public.uae_areas
  for select to anon, authenticated using (true);

drop policy if exists "Anyone can read listings" on public.listings;
create policy "Anyone can read listings" on public.listings
  for select to anon, authenticated using (true);

-- The home page and property page forms.
drop policy if exists "Visitors can send an enquiry" on public.inquiries;
create policy "Visitors can send an enquiry" on public.inquiries
  for insert to anon, authenticated with check (true);

-- Only a verified admin session.
drop policy if exists "Admins can add listings" on public.listings;
create policy "Admins can add listings" on public.listings
  for insert to authenticated with check ((select public.is_verified_admin()));

drop policy if exists "Admins can remove listings" on public.listings;
create policy "Admins can remove listings" on public.listings
  for delete to authenticated using ((select public.is_verified_admin()));

drop policy if exists "Admins can read enquiries" on public.inquiries;
create policy "Admins can read enquiries" on public.inquiries
  for select to authenticated using ((select public.is_verified_admin()));

drop policy if exists "Admins can remove enquiries" on public.inquiries;
create policy "Admins can remove enquiries" on public.inquiries
  for delete to authenticated using ((select public.is_verified_admin()));

-- Table permissions to match (Supabase usually grants these already).
grant select on public.agent, public.media, public.uae_areas, public.listings to anon, authenticated;
grant insert on public.inquiries to anon, authenticated;
grant select, delete on public.inquiries to authenticated;
grant insert, delete on public.listings to authenticated;


-- 5. make yourself an admin --------------------------------------------------
-- ▼ CHANGE this to the email of the user you created under Authentication → Users
insert into public.admins (user_id)
select id from auth.users where email = 'niazmahmud500@gmail.com'
on conflict (user_id) do nothing;

commit;

-- If this shows your email, you're set. If it's empty, the email above didn't
-- match a user: fix it and run the file again.
select u.email as admin_email
from public.admins a
join auth.users u on u.id = a.user_id;
