import { useState } from "react";
import { addListing, PROPERTY_TYPES } from "../lib/adminData";
import { BUTTON_PRIMARY, INPUT, LABEL, TEXTAREA } from "./styles";

const EMPTY = {
  title: "",
  area: "",
  address: "",
  listing_type: "sale",
  property_type: "apartment",
  price_aed: "",
  bedrooms: "",
  bathrooms: "",
  size_sqft: "",
  description: "",
  image_url: "",
  more_images: "",
  amenities: "",
  lat: "",
  lng: ""
};

/** Text with one item per line → a list, ignoring blank lines. */
const lines = (text) =>
  text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

const isLink = (text) => {
  try {
    const url = new URL(text);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
};

/** "Sunny villa by the park" → "sunny-villa-by-the-park-k3x9" (used in /property/<id>). */
function makeId(title) {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
  return `${slug || "listing"}-${Math.random().toString(36).slice(2, 6)}`;
}

function Field({ label, hint, className = "", children }) {
  return (
    <label className={`block space-y-2 ${className}`}>
      <span className={LABEL}>{label}</span>
      {children}
      {hint && <span className="block text-xs text-ink/45">{hint}</span>}
    </label>
  );
}

/** Adds a new listing to Supabase. It appears on the website after a refresh. */
export default function AddListingForm({ areas, listings, onAdded, onError }) {
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [problem, setProblem] = useState("");
  const [added, setAdded] = useState(null);
  const [brokenImages, setBrokenImages] = useState([]);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  // Picking an area fills in its map position; you can fine-tune it after.
  const chooseArea = (e) => {
    const area = areas.find((a) => a.name === e.target.value);
    setForm((f) => ({
      ...f,
      area: e.target.value,
      lat: area ? String(area.lat) : f.lat,
      lng: area ? String(area.lng) : f.lng
    }));
  };

  const cover = form.image_url.trim();
  const imageLinks = [...new Set([cover, ...lines(form.more_images)].filter(Boolean))];

  const submit = async (e) => {
    e.preventDefault();
    setProblem("");
    setAdded(null);

    const badLink = imageLinks.find((link) => !isLink(link));
    if (badLink) {
      setProblem(`This image link isn't a web address: ${badLink}`);
      return;
    }

    const row = {
      id: makeId(form.title),
      title: form.title.trim(),
      area: form.area,
      address: form.address.trim() || null,
      price_aed: Number(form.price_aed),
      listing_type: form.listing_type,
      property_type: form.property_type,
      bedrooms: Number(form.bedrooms),
      bathrooms: Number(form.bathrooms),
      size_sqft: form.size_sqft === "" ? null : Number(form.size_sqft),
      description: form.description.trim() || null,
      image_url: cover,
      image_urls: imageLinks, // the cover first, then the rest
      amenities: lines(form.amenities),
      lat: Number(form.lat),
      lng: Number(form.lng),
      is_demo: false,
      // The website shows the smallest sort_order first, so a new listing
      // leads the home page.
      sort_order: listings.length ? Math.min(...listings.map((l) => l.sort_order)) - 1 : 0
    };

    setSaving(true);
    try {
      await addListing(row);
      onAdded(row);
      setAdded(row);
      setForm(EMPTY);
      setBrokenImages([]);
    } catch (err) {
      onError(err);
    } finally {
      setSaving(false);
    }
  };

  const emirates = [...new Set(areas.map((a) => a.emirate))];

  return (
    <form onSubmit={submit} className="grid gap-8">
      {added && (
        <div className="rounded-2xl border border-forest/30 bg-forest/10 p-5 text-sm text-ink">
          <p className="font-semibold">“{added.title}” was added.</p>
          <p className="mt-1 text-ink-mute">
            It shows first on the website after the page is refreshed.{" "}
            <a
              href={`/property/${added.id}`}
              target="_blank"
              rel="noreferrer"
              className="text-forest underline underline-offset-4"
            >
              Open its page
            </a>
          </p>
        </div>
      )}

      <section className="grid gap-5 sm:grid-cols-2">
        <Field label="Title *" className="sm:col-span-2">
          <input required value={form.title} onChange={set("title")} className={INPUT} placeholder="Sea-view two-bed with a wide terrace" />
        </Field>

        <Field label="Area *" hint="Picking an area fills in the map position below.">
          <select required value={form.area} onChange={chooseArea} className={INPUT}>
            <option value="">Choose an area…</option>
            {emirates.map((emirate) => (
              <optgroup key={emirate} label={emirate}>
                {areas
                  .filter((a) => a.emirate === emirate)
                  .map((a) => (
                    <option key={a.name} value={a.name}>
                      {a.name}
                    </option>
                  ))}
              </optgroup>
            ))}
          </select>
        </Field>

        <Field label="Address">
          <input value={form.address} onChange={set("address")} className={INPUT} placeholder="Building or street" />
        </Field>

        <Field label="For *">
          <select value={form.listing_type} onChange={set("listing_type")} className={INPUT}>
            <option value="sale">Sale</option>
            <option value="rent">Rent</option>
          </select>
        </Field>

        <Field label="Property type *">
          <select value={form.property_type} onChange={set("property_type")} className={`${INPUT} capitalize`}>
            {PROPERTY_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </Field>

        <Field label={form.listing_type === "rent" ? "Rent per year (AED) *" : "Price (AED) *"}>
          <input required type="number" min="0" step="1" value={form.price_aed} onChange={set("price_aed")} className={INPUT} />
        </Field>

        <Field label="Size (sq ft)">
          <input type="number" min="0" step="1" value={form.size_sqft} onChange={set("size_sqft")} className={INPUT} />
        </Field>

        <Field label="Bedrooms *" hint="0 for a studio.">
          <input required type="number" min="0" step="1" value={form.bedrooms} onChange={set("bedrooms")} className={INPUT} />
        </Field>

        <Field label="Bathrooms *">
          <input required type="number" min="0" step="1" value={form.bathrooms} onChange={set("bathrooms")} className={INPUT} />
        </Field>

        <Field label="Description" hint="Leave a blank line to start a new paragraph." className="sm:col-span-2">
          <textarea rows={5} value={form.description} onChange={set("description")} className={TEXTAREA} />
        </Field>

        <Field label="Amenities" hint="One per line." className="sm:col-span-2">
          <textarea rows={4} value={form.amenities} onChange={set("amenities")} className={TEXTAREA} placeholder={"Private pool\nCovered parking"} />
        </Field>
      </section>

      <section className="grid gap-5">
        <Field label="Cover image link *" hint="The main photo. Paste a full https:// link.">
          <input required type="url" value={form.image_url} onChange={set("image_url")} className={INPUT} placeholder="https://images.unsplash.com/photo-…" />
        </Field>

        <Field label="More image links" hint="Gallery photos, one link per line.">
          <textarea rows={4} value={form.more_images} onChange={set("more_images")} className={TEXTAREA} />
        </Field>

        {imageLinks.length > 0 && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {imageLinks.map((link, i) => (
              <div key={link} className="relative aspect-[4/3] overflow-hidden rounded-xl border border-ink/10 bg-sage">
                {isLink(link) && (
                  <img
                    src={link}
                    alt=""
                    onLoad={() => setBrokenImages((list) => list.filter((l) => l !== link))}
                    onError={() => setBrokenImages((list) => (list.includes(link) ? list : [...list, link]))}
                    className="h-full w-full object-cover"
                  />
                )}
                {(!isLink(link) || brokenImages.includes(link)) && (
                  <p className="absolute inset-0 grid place-items-center bg-sage p-2 text-center text-xs text-destructive">
                    This link doesn't show an image
                  </p>
                )}
                {i === 0 && (
                  <span className="absolute left-2 top-2 rounded-full bg-ink/80 px-2 py-0.5 font-heading text-[9px] uppercase tracking-label text-sand">
                    Cover
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="grid gap-5 sm:grid-cols-2">
        <Field label="Latitude *" hint="Where the pin goes on the map.">
          <input required type="number" step="any" min="-90" max="90" value={form.lat} onChange={set("lat")} className={INPUT} />
        </Field>
        <Field label="Longitude *">
          <input required type="number" step="any" min="-180" max="180" value={form.lng} onChange={set("lng")} className={INPUT} />
        </Field>
      </section>

      {problem && (
        <p role="alert" className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {problem}
        </p>
      )}

      <div>
        <button type="submit" disabled={saving} className={`${BUTTON_PRIMARY} px-8 py-3.5`}>
          {saving ? "Adding…" : "Add listing"}
        </button>
      </div>
    </form>
  );
}
