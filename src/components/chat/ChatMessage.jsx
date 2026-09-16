import React from "react";
import { FileText, Mail, Check } from "lucide-react";
import ListingCard from "../explorer/ListingCard";

export default function ChatMessage({ message }) {
  const isBot = message.role === "bot";
  const cards = message.cards || [];

  return (
    <div className={`flex flex-col gap-2 ${isBot ? "items-start" : "items-end"}`}>
      <div
        className={`max-w-[85%] whitespace-pre-line rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
          isBot
            ? message.error
              ? "rounded-tl-md border border-brass/40 bg-sand-light text-ink-mute"
              : "rounded-tl-md border border-ink/10 bg-sage text-ink-mute"
            : "rounded-br-md bg-ink text-sand"
        }`}
      >
        {isBot && (
          <div className="mb-1.5 font-heading text-[9px] font-semibold uppercase tracking-label text-brass-deep">
            mybot
          </div>
        )}
        {message.text}

        {(message.inquiry || message.email) && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {message.inquiry && (
              <span className="flex items-center gap-1 rounded-full bg-forest/10 px-2 py-0.5 font-heading text-[9px] uppercase tracking-label text-forest">
                <Check className="h-3 w-3" /> Enquiry saved
              </span>
            )}
            {message.email && (
              <span className="flex items-center gap-1 rounded-full bg-forest/10 px-2 py-0.5 font-heading text-[9px] uppercase tracking-label text-forest">
                <Mail className="h-3 w-3" /> Emailed to {message.email.to}
              </span>
            )}
          </div>
        )}
      </div>

      {message.draft && (
        <a
          href={message.draft.url}
          target="_blank"
          rel="noreferrer"
          className="flex max-w-[85%] items-center gap-3 rounded-2xl border border-ink/10 bg-sand-light px-4 py-3 text-sm text-ink transition-colors hover:border-brass/60"
        >
          <FileText className="h-5 w-5 shrink-0 text-brass-deep" />
          <span className="min-w-0">
            <span className="block truncate font-medium">{message.draft.title}</span>
            <span className="font-heading text-[9px] uppercase tracking-label text-ink/45">
              Open PDF{message.draft.version > 1 ? ` · version ${message.draft.version}` : ""}
            </span>
          </span>
        </a>
      )}

      {cards.length > 0 && (
        <div className="flex w-full gap-3 overflow-x-auto pb-2">
          {cards.map((card) => (
            <ListingCard key={card.id} property={card} />
          ))}
        </div>
      )}
    </div>
  );
}
