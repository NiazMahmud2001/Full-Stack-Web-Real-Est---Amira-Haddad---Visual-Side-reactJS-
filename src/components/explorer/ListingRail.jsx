import React, { useMemo, useRef } from "react";
import ListingCard from "./ListingCard";
import { useAreas } from "../../context/ContentContext";
import { useRailScroll } from "../../hooks/useRailScroll";

export default function ListingRail({ properties, focus }) {
  const railRef = useRef(null);
  const { matchesFocus } = useAreas();

  const shown = useMemo(
    () => properties.filter((p) => matchesFocus(p, focus)).slice(0, 24),
    [properties, focus, matchesFocus]
  );

  useRailScroll(railRef, { resetKey: shown.length });

  const avg = shown.length
    ? Math.round(shown.reduce((s, p) => s + (p.price_aed || 0), 0) / shown.length)
    : 0;

  return (
    <div className="flex h-full flex-col gap-3 p-3">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="font-heading text-[10px] font-semibold uppercase tracking-label text-ink">
          {focus ? focus.name : "All UAE"}
          <span className="ml-2 text-ink/40">
            {shown.length} listing{shown.length === 1 ? "" : "s"}
          </span>
        </p>
        {avg > 0 && (
          <p className="font-heading text-[10px] uppercase tracking-label text-brass-deep">
            Avg. AED {avg.toLocaleString()}
          </p>
        )}
      </div>
      {shown.length === 0 ? (
        <p className="text-sm text-ink/50">No listings here yet — try another area.</p>
      ) : (
        <div ref={railRef} className="no-scrollbar flex flex-1 gap-3 overflow-x-auto pb-1">
          {shown.map((p) => (
            <ListingCard key={p.id} property={p} />
          ))}
        </div>
      )}
    </div>
  );
}
