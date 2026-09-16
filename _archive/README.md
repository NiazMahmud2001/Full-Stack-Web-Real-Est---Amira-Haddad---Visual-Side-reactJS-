# _archive

Files the website no longer uses, kept for reference. Nothing in `src/` imports
anything from here, so you can edit or delete this folder without affecting the
site.

| Path | What it was | Where that data lives now |
|---|---|---|
| `content/agent.js` | The agent's profile | Supabase table `agent` |
| `content/media.js` | Hero frames, video and photo URLs | Supabase table `media` |
| `content/uaeAreas.js` | The Dubai and Abu Dhabi area list | Supabase table `uae_areas` |
| `content/demoListings.js` | The 15 sample listings | Supabase table `listings` |
| `scripts/generate-seed.mjs` | Built `supabase/seed.sql` from the files above | — |

To change what the website shows, edit the rows in the Supabase **Table Editor**.

To rebuild `supabase/seed.sql` from these files (this overwrites that file):

```bash
node _archive/scripts/generate-seed.mjs
```
