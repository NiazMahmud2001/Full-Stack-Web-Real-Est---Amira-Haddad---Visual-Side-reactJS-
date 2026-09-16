import { useState } from "react";
import { deleteListing } from "../lib/adminData";
import { compactAed, priceSuffix } from "../../lib/format";
import { BUTTON_DANGER, BUTTON_OUTLINE, INPUT } from "./styles";

/** Every listing in Supabase, in the order the website shows them. */
export default function ListingsTab({ listings, onRemoved, onError }) {
  const [search, setSearch] = useState("");
  const [removingId, setRemovingId] = useState(null);

  const words = search.trim().toLowerCase();
  const shown = words
    ? listings.filter((l) => `${l.title} ${l.area} ${l.id}`.toLowerCase().includes(words))
    : listings;

  const remove = async (listing) => {
    const sure = window.confirm(
      `Delete "${listing.title}" from Supabase?\n\nIt disappears from the website straight away. This can't be undone.`
    );
    if (!sure) return;
    setRemovingId(listing.id);
    try {
      await deleteListing(listing.id);
      onRemoved(listing.id);
    } catch (err) {
      onError(err);
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by title, area or id"
          className={`${INPUT} max-w-sm`}
        />
        <p className="font-heading text-[10px] uppercase tracking-label text-ink/45">
          {shown.length} of {listings.length} listings
        </p>
      </div>

      {shown.length === 0 ? (
        <p className="mt-5 rounded-2xl border border-dashed border-ink/20 p-10 text-center text-sm text-ink-mute">
          No listings match.
        </p>
      ) : (
        <ul className="mt-5 grid gap-3">
          {shown.map((l) => (
            <li
              key={l.id}
              className="flex flex-wrap items-center gap-4 rounded-2xl border border-ink/10 bg-sand-light p-3 sm:flex-nowrap"
            >
              <img
                src={l.image_url}
                alt=""
                className="h-20 w-28 shrink-0 rounded-xl bg-sage object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate font-display text-xl leading-tight">{l.title}</p>
                <p className="mt-1 font-heading text-[10px] uppercase tracking-label text-ink/50">
                  {l.area} · {l.property_type} · {l.bedrooms === 0 ? "Studio" : `${l.bedrooms} bed`} ·{" "}
                  {l.is_demo ? "Sample" : "Added by admin"}
                </p>
                <p className="mt-1 truncate text-xs text-ink/40">{l.id}</p>
              </div>
              <p className="shrink-0 font-display text-2xl">
                AED {compactAed(l.price_aed)}
                {priceSuffix(l.listing_type) && (
                  <span className="ml-1 font-heading text-[9px] uppercase tracking-label text-ink/45">
                    {priceSuffix(l.listing_type)}
                  </span>
                )}
              </p>
              <div className="flex shrink-0 gap-2">
                <a href={`/property/${l.id}`} target="_blank" rel="noreferrer" className={BUTTON_OUTLINE}>
                  View
                </a>
                <button
                  type="button"
                  onClick={() => remove(l)}
                  disabled={removingId === l.id}
                  className={BUTTON_DANGER}
                >
                  {removingId === l.id ? "Removing…" : "Remove"}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
