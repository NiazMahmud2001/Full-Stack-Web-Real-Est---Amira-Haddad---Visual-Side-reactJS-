import { useMemo } from "react";
import { useProperties } from "../../hooks/useProperties";
import { useAreas } from "../../context/ContentContext";
import PropertyTile from "../../components/listings/PropertyTile";
import SplitHeading from "../../components/motion/SplitHeading";
import Reveal from "../../components/motion/Reveal";
import Pill from "../../components/common/Pill";

/** Nearby listings, never including the property you are already looking at. */
export default function SimilarListings({ property }) {
  const { properties } = useProperties(60);
  const { areaEmirate } = useAreas();

  // Same community first, then the same emirate, then whatever is closest on
  // price — nobody looking on Saadiyat wants a Deira flat as their second option.
  const similar = useMemo(() => {
    const emirate = areaEmirate(property.area);
    const byPrice = (a, b) =>
      Math.abs((a.price_aed || 0) - (property.price_aed || 0)) -
      Math.abs((b.price_aed || 0) - (property.price_aed || 0));

    const pool = properties.filter((p) => p.id !== property.id);
    const sameArea = pool.filter((p) => p.area === property.area);
    const sameEmirate = pool
      .filter((p) => p.area !== property.area && emirate && areaEmirate(p.area) === emirate)
      .sort(byPrice);
    const rest = pool
      .filter((p) => !sameArea.includes(p) && !sameEmirate.includes(p))
      .sort(byPrice);

    return [...sameArea, ...sameEmirate, ...rest].slice(0, 3);
  }, [properties, property, areaEmirate]);

  if (similar.length === 0) return null;

  return (
    <section className="bg-sage px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-[1400px]">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow">Nearby</p>
            <SplitHeading className="mt-4 font-display text-4xl leading-[1.05] text-ink sm:text-5xl">
              Others worth walking through
            </SplitHeading>
          </div>
          <Pill to="/explorer" tone="outline" size="sm">
            See all on the map
          </Pill>
        </div>

        <Reveal className="mt-12 grid gap-5 md:grid-cols-3" stagger={0.1} y={40}>
          {similar.map((p) => (
            <PropertyTile key={p.id} property={p} variant="grid" />
          ))}
        </Reveal>
      </div>
    </section>
  );
}
