import { useState } from "react";
import { deleteInquiry } from "../lib/adminData";
import { fullAed } from "../../lib/format";
import { BUTTON_DANGER } from "./styles";

const formatDate = (iso) =>
  new Date(iso).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });

const digitsOnly = (phone) => String(phone || "").replace(/[^0-9]/g, "");

/** Every enquiry sent from the website, newest first. */
export default function InquiriesTab({ inquiries, onRemoved, onError }) {
  const [removingId, setRemovingId] = useState(null);

  const remove = async (inquiry) => {
    const sure = window.confirm(
      `Mark the enquiry from ${inquiry.full_name} as done and delete it from Supabase?\n\nThis can't be undone.`
    );
    if (!sure) return;
    setRemovingId(inquiry.id);
    try {
      await deleteInquiry(inquiry.id);
      onRemoved(inquiry.id);
    } catch (err) {
      onError(err);
    } finally {
      setRemovingId(null);
    }
  };

  if (inquiries.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-ink/20 p-10 text-center text-sm text-ink-mute">
        No enquiries waiting. New ones from the website appear here.
      </p>
    );
  }

  return (
    <ul className="grid gap-4">
      {inquiries.map((q) => (
        <li key={q.id} className="rounded-2xl border border-ink/10 bg-sand-light p-5 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="font-display text-2xl leading-tight">{q.full_name}</p>
              <p className="mt-1 font-heading text-[10px] uppercase tracking-label text-ink/45">
                {formatDate(q.created_at)}
              </p>
            </div>
            <button
              type="button"
              onClick={() => remove(q)}
              disabled={removingId === q.id}
              className={BUTTON_DANGER}
            >
              {removingId === q.id ? "Removing…" : "Done — remove"}
            </button>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <Tag>{q.listing_type === "rent" ? "Rent" : "Buy"}</Tag>
            <Tag>{q.property_type}</Tag>
            {q.bedrooms !== null && <Tag>{q.bedrooms === 0 ? "Studio" : `${q.bedrooms} bed`}</Tag>}
            <Tag>Budget {fullAed(q.budget_aed)}</Tag>
            {q.area && <Tag>{q.area}</Tag>}
          </div>

          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <a href={`mailto:${q.email}`} className="text-forest underline-offset-4 hover:underline">
              {q.email}
            </a>
            {q.phone && (
              <>
                <a
                  href={`tel:+${digitsOnly(q.phone)}`}
                  className="text-forest underline-offset-4 hover:underline"
                >
                  {q.phone}
                </a>
                <a
                  href={`https://wa.me/${digitsOnly(q.phone)}`}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-forest underline-offset-4 hover:underline"
                >
                  WhatsApp
                </a>
              </>
            )}
          </div>

          {q.message && (
            <p className="mt-4 whitespace-pre-line rounded-xl bg-sage/70 p-4 text-sm leading-relaxed text-ink-mute">
              {q.message}
            </p>
          )}
        </li>
      ))}
    </ul>
  );
}

function Tag({ children }) {
  return (
    <span className="rounded-full border border-ink/15 px-3 py-1 font-heading text-[10px] font-semibold uppercase tracking-label text-ink-mute">
      {children}
    </span>
  );
}
