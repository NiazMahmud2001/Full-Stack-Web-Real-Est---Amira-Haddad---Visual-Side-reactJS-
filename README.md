# Amira Haddad — Real Estate Website

A property website for a Dubai and Abu Dhabi real estate agent, built with React and Vite.
Listings, photos, areas and enquiries live in Supabase. The chat assistant on the explorer
page is answered by a separate Python service (see [The chat assistant](#the-chat-assistant)).

## Features

**The website**

- **Home page** with the agent profile, featured listings and an enquiry form.
- **Explorer**: an interactive 3D map of every property, a listing strip that follows the
  area you are looking at, and the chat assistant beside them.
- **Property pages**: photo gallery, location map, a calculator for buying or renting costs,
  similar listings, and an enquiry form that saves straight to the database.
- **Loading screen** that fetches the data and preloads every photograph and font first, so
  the site never pops in half-finished.
- Works from phone to desktop, and the panels on the explorer can be dragged to resize.

**The chat assistant**

- Understands what a client wants (budget, area, property type, bedrooms) and searches the
  listings for it.
- Shows property cards inside the chat and moves the map to the area being discussed.
- Compares properties, summarises area prices and estimates buying or renting costs.
- Saves an enquiry for the agent, and can email a PDF brochure or shortlist to the client.
- If the assistant is unreachable, the chat still moves the map for any area you name.

**Admin area** (`/admin`)

- Two-step sign-in: password, then a 6-digit code sent by email.
- Add or remove listings, and read or clear enquiries.
- Setup steps are in [`src/admin/README.md`](src/admin/README.md).

## Screens

| Path | What it shows |
| --- | --- |
| `/` | Home page |
| `/explorer` | Map, listing strip and the chat assistant |
| `/property/:id` | One property in full |
| `/admin` | Admin sign-in and dashboard |

## Built with

React 19, Vite 8, Tailwind CSS 3, React Router 7, MapLibre GL (3D map), GSAP and Framer
Motion (animation), Radix UI, and Supabase for the database and admin sign-in.

## Requirements

- Node.js 20 or newer (built with Node 24)
- A Supabase project with the tables listed under [The database](#the-database)
- Optional: the Python chat backend running, for the assistant

## Setup

1. **Install the packages**

   ```bash
   npm install
   ```

2. **Create a `.env` file** in this folder:

   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-public-anon-key
   VITE_AGENT_API_URL=http://localhost:8000
   ```

3. **Start it**

   ```bash
   npm run dev
   ```

   The site opens at http://localhost:5173.

## Settings

| Name | Needed | What it is |
| --- | --- | --- |
| `VITE_SUPABASE_URL` | yes | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | yes | The **public anon** key. It is meant to be visible in the browser; the database row level security rules are what protect the data |
| `VITE_AGENT_API_URL` | no | Address of the Python chat backend. Without it, `http://localhost:8000` is used |

These are read when the site is **built**, not when it runs, so after changing any of them
restart `npm run dev`, or redeploy the hosted site.

> Without the two Supabase settings the page stays blank, because the site cannot reach the
> database at all.

## The database

Supabase tables the website reads and writes:

| Table | Used for |
| --- | --- |
| `agent` | The agent profile: name, licence, phone, WhatsApp, bio, socials |
| `media` | Photographs, hero frames and the hero video |
| `uae_areas` | Areas of Dubai and Abu Dhabi, with their map positions and nicknames |
| `listings` | The properties |
| `inquiries` | Enquiries sent from the forms and the chat |
| `admins`, `admin_sessions` | Who may sign in to `/admin`, and which sign-ins are approved |

Every table needs a policy that lets the public read it, `inquiries` needs one that lets the
public add a row, and the admin tables are handled by the database functions
`admin_confirm_password` and `is_verified_admin`.

The SQL used to create and fill these tables is kept in
[`_archive/sql_codes/`](_archive/sql_codes), together with the original content files the
data was moved from. None of it is needed to run the site, so it can be deleted.

## The chat assistant

The assistant is a separate Python service (FastAPI and LangGraph, with a language model
through OpenRouter). It has its own repository and README:

> https://github.com/NiazMahmud2001/Full-Stack-Web-Real-Est---Amira-Haddad---pyhon_agent_backend

Point `VITE_AGENT_API_URL` at it. The website sends each message to `POST /chat` along with
its own address, so the links inside the PDFs and emails the assistant writes come back to
this site. While the backend is asleep or missing, the chat says so and keeps working as a
simple area search for the map.

## Project structure

```
src/
  admin/         the /admin area: sign-in, dashboard, listings and enquiries
  components/
    chat/        the assistant panel and its messages
    common/      loading screen and shared pieces
    explorer/    listing cards and the strip under the map
    home/        the home page sections
    layout/      navigation bar and footer
    listings/    listing tiles
    map/         the 3D MapLibre map
    motion/      cursor and animation helpers
    property/    gallery, cost calculator, enquiry form, similar listings
    ui/          small building blocks (buttons, inputs, images)
  context/       loads everything from Supabase once, behind the loading screen
  hooks/         reusable behaviour (properties, scrolling)
  lib/           Supabase client, data loading, area matching, formatting
  pages/         Home, Explorer, PropertyDetail, PageNotFound
public/          favicon and icons
_archive/        the original content files and SQL (not used by the site)
```

## Commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Build the site into `dist/` |
| `npm run preview` | Serve the built site locally |
| `npm run lint` | Check the code with ESLint |

## Deploying

The site is a static build, so any static host works. On Render, create a **Static Site**:

| Setting | Value |
| --- | --- |
| Build Command | `npm install && npm run build` |
| Publish Directory | `dist` |
| Environment Variables | `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_AGENT_API_URL` |

Then add a rewrite rule, source `/*`, destination `/index.html`, action **Rewrite**. Without
it, opening `/explorer`, a property page or `/admin` directly, or refreshing on one of them,
returns "not found", because the addresses only exist inside the browser.

Deploy the chat backend first, so you know its address before building the site.

## If something does not work

| What you see | Why |
| --- | --- |
| A blank page | `VITE_SUPABASE_URL` or `VITE_SUPABASE_ANON_KEY` is missing from the build |
| "The listings could not be loaded" | The Supabase project is paused, or a table has no public read policy |
| The chat says it cannot reach the assistant | The Python backend is not running, or `VITE_AGENT_API_URL` is wrong. On free hosting the first message after an idle period takes about a minute |
| The first chat message is slow | The free language model is answering; replies usually take a few seconds |
| Page not found after a refresh on a hosted site | The rewrite rule above is missing |
