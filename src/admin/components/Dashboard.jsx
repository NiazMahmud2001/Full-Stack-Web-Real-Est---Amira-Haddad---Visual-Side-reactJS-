import { useEffect, useState } from "react";
import { fetchAreas, fetchInquiries, fetchListings, SessionExpiredError } from "../lib/adminData";
import { isVerifiedAdmin } from "../lib/adminAuth";
import InquiriesTab from "./InquiriesTab";
import ListingsTab from "./ListingsTab";
import AddListingForm from "./AddListingForm";
import { BUTTON_OUTLINE } from "./styles";

/** Loads everything the dashboard shows, once the session is confirmed as a verified admin. */
async function loadDashboard() {
  if (!(await isVerifiedAdmin())) throw new SessionExpiredError();
  const [inquiries, listings, areas] = await Promise.all([fetchInquiries(), fetchListings(), fetchAreas()]);
  return { inquiries, listings, areas };
}

export default function Dashboard({ onSignOut, onSessionExpired }) {
  const [tab, setTab] = useState("inquiries");
  const [data, setData] = useState({ inquiries: [], listings: [], areas: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Any failure from any tab comes through here. An ended session goes back
  // to the sign-in screen; anything else is shown above the tabs.
  const handleError = (err) => {
    if (err instanceof SessionExpiredError) onSessionExpired();
    else setError(err.message);
  };

  useEffect(() => {
    let cancelled = false;
    loadDashboard()
      .then((loaded) => {
        if (!cancelled) setData(loaded);
      })
      .catch((err) => {
        if (cancelled) return;
        if (err instanceof SessionExpiredError) onSessionExpired();
        else setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [onSessionExpired]);

  const refresh = () => {
    setLoading(true);
    setError("");
    loadDashboard()
      .then(setData, handleError)
      .finally(() => setLoading(false));
  };

  const removeInquiry = (id) =>
    setData((d) => ({ ...d, inquiries: d.inquiries.filter((q) => q.id !== id) }));
  const removeListing = (id) =>
    setData((d) => ({ ...d, listings: d.listings.filter((l) => l.id !== id) }));
  const addListing = (row) => setData((d) => ({ ...d, listings: [row, ...d.listings] }));

  const tabs = [
    { id: "inquiries", label: `Enquiries (${data.inquiries.length})` },
    { id: "listings", label: `Listings (${data.listings.length})` },
    { id: "add", label: "Add listing" }
  ];

  return (
    <div className="min-h-screen bg-sand text-ink">
      <header className="bg-ink text-sand" data-cursor="dark">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-5 sm:px-8">
          <div>
            <p className="font-heading text-[10px] uppercase tracking-label text-brass">Admin</p>
            <p className="mt-1 font-display text-3xl leading-none">Property dashboard</p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-sand/25 px-5 py-2.5 font-heading text-[10px] font-semibold uppercase tracking-label text-sand/80 transition-colors hover:bg-sand hover:text-ink"
            >
              View website
            </a>
            <button
              type="button"
              onClick={onSignOut}
              className="rounded-full bg-sand px-5 py-2.5 font-heading text-[10px] font-semibold uppercase tracking-label text-ink transition-colors hover:bg-brass-light"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-8 sm:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink/10 pb-4">
          <nav className="flex flex-wrap gap-2" aria-label="Admin sections">
            {tabs.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                aria-current={tab === t.id ? "page" : undefined}
                className={`rounded-full px-5 py-2.5 font-heading text-[10px] font-semibold uppercase tracking-label transition-colors ${
                  tab === t.id ? "bg-ink text-sand" : "border border-ink/20 text-ink-mute hover:border-ink hover:text-ink"
                }`}
              >
                {t.label}
              </button>
            ))}
          </nav>
          <button type="button" onClick={refresh} disabled={loading} className={BUTTON_OUTLINE}>
            {loading ? "Loading…" : "Refresh"}
          </button>
        </div>

        {error && (
          <p role="alert" className="mt-6 rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </p>
        )}

        <div className="mt-6">
          {loading && data.listings.length === 0 ? (
            <p className="py-16 text-center font-heading text-[10px] uppercase tracking-label text-ink/45">
              Loading…
            </p>
          ) : tab === "inquiries" ? (
            <InquiriesTab inquiries={data.inquiries} onRemoved={removeInquiry} onError={handleError} />
          ) : tab === "listings" ? (
            <ListingsTab listings={data.listings} onRemoved={removeListing} onError={handleError} />
          ) : (
            <AddListingForm
              areas={data.areas}
              listings={data.listings}
              onAdded={addListing}
              onError={handleError}
            />
          )}
        </div>
      </main>
    </div>
  );
}
