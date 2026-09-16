import React from "react";
import { Link } from "react-router-dom";
import { Image } from "../../components/ui/image";
import { BedDouble, Bath, Ruler, MapPin } from "lucide-react";
import { compactAed } from "../../lib/format";

export default function ListingCard({ property }) {
  return (
    <Link
      to={`/property/${property.id}`}
      data-cursor="view"
      data-cursor-label="View"
      className="group flex w-64 shrink-0 flex-col overflow-hidden rounded-2xl border border-ink/10 bg-sand transition-shadow duration-500 hover:shadow-lift"
    >
      <div className="relative overflow-hidden">
        <Image
          src={property.image_url}
          alt={property.title}
          className="h-28 w-full object-cover transition-transform [transition-duration:900ms] ease-expo group-hover:scale-110"
        />
        <span className="absolute left-2 top-2 rounded-full bg-ink/85 px-2.5 py-1 font-heading text-[9px] font-semibold uppercase tracking-label text-sand">
          {property.listing_type === "rent" ? "For rent" : "For sale"}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-3">
        <p className="font-display text-xl leading-none text-ink">
          AED {compactAed(property.price_aed)}
        </p>
        <p className="line-clamp-1 text-sm text-ink-mute">{property.title}</p>
        <p className="flex items-center gap-1 font-heading text-[10px] uppercase tracking-label text-brass-deep">
          <MapPin className="h-3 w-3" /> {property.area}
        </p>
        <div className="mt-auto flex items-center gap-3 border-t border-ink/10 pt-2 text-[11px] text-ink/55">
          <span className="flex items-center gap-1">
            <BedDouble className="h-3.5 w-3.5" />
            {property.bedrooms ?? 0}
          </span>
          <span className="flex items-center gap-1">
            <Bath className="h-3.5 w-3.5" />
            {property.bathrooms ?? 0}
          </span>
          <span className="flex items-center gap-1">
            <Ruler className="h-3.5 w-3.5" />
            {property.size_sqft ?? 0} sqft
          </span>
        </div>
      </div>
    </Link>
  );
}
