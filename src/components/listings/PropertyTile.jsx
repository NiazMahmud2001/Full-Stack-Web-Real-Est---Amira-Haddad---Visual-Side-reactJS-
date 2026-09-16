import { Link } from "react-router-dom";
import { BedDouble, Bath, Ruler, MapPin } from "lucide-react";
import { Image } from "../../components/ui/image";
import { compactAed, priceSuffix, sqft } from "../../lib/format";

/**
 * The listing card used by the home gallery (`tall`) and by the "nearby"
 * grid on a property page (`grid`). Hovering scales the photograph inside a
 * fixed frame and swaps the cursor to a VIEW disc.
 */
export default function PropertyTile({
  property,
  index = undefined,
  variant = "tall",
}) {
  const tall = variant === "tall";

  return (
    <Link
      to={`/property/${property.id}`}
      data-cursor="view"
      data-cursor-label="View"
      className={`group relative flex shrink-0 flex-col overflow-hidden rounded-[1.75rem] border border-ink/10 bg-sand-light transition-shadow duration-700 ease-expo hover:shadow-lift ${
        tall ? "w-[80vw] sm:w-[26rem]" : "w-full"
      }`}
    >
      <div
        className={`relative overflow-hidden ${
          tall
            ? "h-[clamp(13rem,32vh,22rem)] sm:h-[clamp(14rem,38vh,24rem)]"
            : "h-56"
        }`}
      >
        <Image
          src={property.image_url}
          alt={property.title}
          className="h-full w-full scale-[1.02] object-cover transition-transform [transition-duration:1100ms] ease-expo group-hover:scale-110"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/5 to-transparent opacity-80" />

        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-4">
          <span className="rounded-full bg-sand/90 px-3 py-1.5 font-heading text-[9px] font-semibold uppercase tracking-label text-ink">
            {property.listing_type === "rent" ? "For rent" : "For sale"}
          </span>
          {typeof index === "number" && (
            <span className="font-heading text-[10px] uppercase tracking-label text-sand/70">
              {String(index + 1).padStart(2, "0")}
            </span>
          )}
        </div>

        <div className="absolute inset-x-0 bottom-0 p-5">
          <p className="font-display text-3xl text-sand">
            AED {compactAed(property.price_aed)}
            {priceSuffix(property.listing_type) && (
              <span className="ml-2 font-heading text-[9px] uppercase tracking-label text-sand/70">
                {priceSuffix(property.listing_type)}
              </span>
            )}
          </p>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="flex items-center gap-1.5 font-heading text-[9px] font-semibold uppercase tracking-label text-brass-deep">
          <MapPin className="h-3 w-3" />
          {property.area}
        </p>
        <h3 className="mt-2.5 font-display text-xl leading-snug text-ink">
          {property.title}
        </h3>

        <div className="mt-auto flex items-center gap-4 border-t border-ink/10 pt-4 font-heading text-[11px] text-ink-mute">
          <span className="flex items-center gap-1.5">
            <BedDouble className="h-3.5 w-3.5" />
            {property.bedrooms ?? 0}
          </span>
          <span className="flex items-center gap-1.5">
            <Bath className="h-3.5 w-3.5" />
            {property.bathrooms ?? 0}
          </span>
          <span className="flex items-center gap-1.5">
            <Ruler className="h-3.5 w-3.5" />
            {sqft(property.size_sqft)}
          </span>
          <span className="ml-auto capitalize text-ink/50">
            {property.property_type}
          </span>
        </div>
      </div>
    </Link>
  );
}
