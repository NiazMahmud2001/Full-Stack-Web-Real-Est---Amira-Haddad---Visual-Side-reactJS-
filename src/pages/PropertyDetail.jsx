import { useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Bath,
  BedDouble,
  Building2,
  Check,
  MapPin,
  Ruler,
  TrendingUp
} from "lucide-react";
import { useAreas, useListings } from "../context/ContentContext";
import { compactAed, fullAed, pricePerSqft, priceSuffix, sqft } from "../lib/format";
import { gsap, ScrollTrigger, prefersReducedMotion } from "../lib/gsap";
import { Image } from "../components/ui/image";

import NavBar from "../components/layout/NavBar";
import SiteFooter from "../components/layout/SiteFooter";
import SmoothScroll from "../components/motion/SmoothScroll";
import ScrollProgress from "../components/motion/ScrollProgress";
import Reveal from "../components/motion/Reveal";
import SplitHeading from "../components/motion/SplitHeading";
import CountUp from "../components/motion/CountUp";
import Pill from "../components/common/Pill";

import PropertyGallery from "../components/property/PropertyGallery";
import PropertyEnquiry from "../components/property/PropertyEnquiry";
import PaymentCalculator from "../components/property/PaymentCalculator";
import PropertyLocationMap from "../components/property/PropertyLocationMap";
import SimilarListings from "../components/property/SimilarListings";

function Shell({ children }) {
  return (
    <div className="min-h-screen bg-sand">
      <NavBar variant="floating" />
      <div className="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-center justify-center px-6 text-center">
        {children}
      </div>
      <SiteFooter />
    </div>
  );
}

export default function PropertyDetail() {
  const { id } = useParams();
  // Listings were loaded from Supabase before any page rendered (see
  // src/context/ContentProvider.jsx), so there is nothing to wait for here.
  const { getListing } = useListings();
  const { areaEmirate } = useAreas();
  const property = getListing(id);
  const heroRef = useRef(null);
  const heroImageRef = useRef(null);
  const barRef = useRef(null);

  // Hero parallax plus the floating action bar that takes over once the hero
  // has scrolled away.
  useEffect(() => {
    if (!property || prefersReducedMotion()) return undefined;
    const hero = heroRef.current;
    const image = heroImageRef.current;
    const bar = barRef.current;
    if (!hero) return undefined;

    const ctx = gsap.context(() => {
      if (image) {
        gsap.to(image, {
          yPercent: 16,
          scale: 1.12,
          ease: "none",
          scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true }
        });
      }
      gsap.to("[data-hero-copy]", {
        y: -40,
        opacity: 0,
        ease: "none",
        scrollTrigger: { trigger: hero, start: "center top", end: "bottom top", scrub: true }
      });
      if (bar) {
        gsap.set(bar, { yPercent: 140 });
        ScrollTrigger.create({
          trigger: hero,
          start: "bottom 70%",
          onEnter: () => gsap.to(bar, { yPercent: 0, duration: 0.6, ease: "expo.out" }),
          onLeaveBack: () => gsap.to(bar, { yPercent: 140, duration: 0.4, ease: "power2.in" })
        });
      }
    }, hero);

    return () => ctx.revert();
  }, [property]);

  if (!property) {
    return (
      <Shell>
        <p className="eyebrow">404</p>
        <h1 className="mt-4 font-display text-5xl text-ink">That address isn&apos;t on the map</h1>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-ink-mute">
          The listing may have been withdrawn or sold. The map has everything that is
          currently available.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-4">
          <Pill to="/explorer">Open the map</Pill>
          <Pill to="/" tone="outline" arrow={false}>
            Back home
          </Pill>
        </div>
      </Shell>
    );
  }

  const images = (property.image_urls?.length ? property.image_urls : [property.image_url]).filter(
    Boolean
  );
  const cover = images[0];
  const perSqft = pricePerSqft(property.price_aed, property.size_sqft);
  // Listing addresses often already carry the community name — don't say it
  // twice — and the city comes from the area registry rather than a hard-coded
  // "Dubai", now that inventory spans two emirates.
  const address = property.address || "";
  const emirate = areaEmirate(property.area);
  const locationLine = [
    address,
    address.toLowerCase().includes(String(property.area).toLowerCase()) ? "" : property.area,
    emirate
  ]
    .filter(Boolean)
    .join(", ");
  const paragraphs = String(property.description || "")
    .split(/\n{2,}/)
    .filter(Boolean);

  const facts = [
    { icon: BedDouble, label: "Bedrooms", value: property.bedrooms ?? 0, count: true },
    { icon: Bath, label: "Bathrooms", value: property.bathrooms ?? 0, count: true },
    { icon: Ruler, label: "Internal area", value: sqft(property.size_sqft) },
    { icon: Building2, label: "Property type", value: property.property_type || "—", capitalize: true },
    ...(perSqft ? [{ icon: TrendingUp, label: "Per sqft", value: `AED ${perSqft.toLocaleString()}` }] : [])
  ];

  return (
    <SmoothScroll>
      <div className="min-h-screen bg-sand">
        <ScrollProgress />
        <NavBar variant="floating" />

        {/* ---------------------------------------------------------------- Hero */}
        <header ref={heroRef} className="relative h-[88vh] min-h-[34rem] overflow-hidden bg-ink" data-cursor="dark">
          <div ref={heroImageRef} className="absolute left-0 right-0 -top-[8%] h-[116%]">
            <Image src={cover} alt={property.title} className="h-full w-full object-cover" />
          </div>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-ink/45 to-ink/55" />
          <div className="grain pointer-events-none absolute inset-0" />

          <div className="relative mx-auto flex h-full max-w-[1400px] flex-col justify-end px-5 pb-14 sm:px-8 sm:pb-20">
            <div data-hero-copy>
              <Link
                to="/explorer"
                data-cursor="link"
                className="inline-flex items-center gap-2 font-heading text-[10px] uppercase tracking-label text-sand/60 transition-colors hover:text-sand"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Back to the map
              </Link>

              <div className="mt-6 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-sand px-4 py-1.5 font-heading text-[9px] font-semibold uppercase tracking-label text-ink">
                  {property.listing_type === "rent" ? "For rent" : "For sale"}
                </span>
                <span className="rounded-full border border-sand/30 px-4 py-1.5 font-heading text-[9px] font-semibold uppercase tracking-label text-sand/80">
                  {property.area}
                </span>
                {property.is_demo && (
                  <span className="rounded-full border border-brass/50 px-4 py-1.5 font-heading text-[9px] font-semibold uppercase tracking-label text-brass-light">
                    Sample listing
                  </span>
                )}
              </div>

              <SplitHeading
                as="h1"
                className="mt-6 max-w-4xl font-display text-[9vw] leading-[1.02] text-sand sm:text-[5.2vw] lg:text-[4.4rem]"
                start="top 100%"
              >
                {property.title}
              </SplitHeading>

              <div className="mt-8 flex flex-wrap items-end justify-between gap-6">
                <p className="flex items-center gap-2 font-heading text-[11px] uppercase tracking-label text-sand/65">
                  <MapPin className="h-4 w-4" />
                  {locationLine}
                </p>
                <p className="font-display text-5xl leading-none text-sand sm:text-6xl">
                  AED {compactAed(property.price_aed)}
                  {priceSuffix(property.listing_type) && (
                    <span className="ml-3 font-heading text-[10px] uppercase tracking-label text-sand/55">
                      {priceSuffix(property.listing_type)}
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* ------------------------------------------------------------- Content */}
        <main className="mx-auto max-w-[1400px] px-5 py-16 sm:px-8 sm:py-24">
          <div className="grid gap-12 lg:grid-cols-[1.6fr_1fr] lg:gap-14">
            <div className="min-w-0">
              <Reveal>
                <PropertyGallery images={images} alt={property.title} />
              </Reveal>

              {/* Key facts */}
              <Reveal
                className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-[1.5rem] border border-ink/10 bg-ink/10 sm:grid-cols-3 lg:grid-cols-5"
                stagger={0.06}
                y={24}
              >
                {facts.map((f) => (
                  <div key={f.label} className="bg-sage px-5 py-6">
                    <f.icon className="h-4 w-4 text-brass-deep" />
                    <p className="mt-4 font-heading text-[9px] uppercase tracking-label text-ink/45">
                      {f.label}
                    </p>
                    <p className="mt-1.5 font-display text-xl text-ink">
                      {f.count ? (
                        <CountUp value={Number(f.value)} duration={1.2} />
                      ) : (
                        <span className={f.capitalize ? "capitalize" : undefined}>{f.value}</span>
                      )}
                    </p>
                  </div>
                ))}
              </Reveal>

              {/* Description */}
              <div className="mt-16">
                <p className="eyebrow">The description</p>
                <SplitHeading className="mt-4 font-display text-3xl leading-tight text-ink sm:text-4xl">
                  About this property
                </SplitHeading>
                <Reveal className="mt-7 space-y-5" stagger={0.08} y={22}>
                  {paragraphs.length ? (
                    paragraphs.map((p) => (
                      <p key={p.slice(0, 30)} className="max-w-2xl text-[0.95rem] leading-relaxed text-ink-mute">
                        {p}
                      </p>
                    ))
                  ) : (
                    <p className="text-[0.95rem] leading-relaxed text-ink-mute">
                      Full description on request — call or send an enquiry and I&apos;ll walk
                      you through it.
                    </p>
                  )}
                </Reveal>
              </div>

              {/* Amenities */}
              {property.amenities?.length > 0 && (
                <div className="mt-16">
                  <p className="eyebrow">What comes with it</p>
                  <Reveal className="mt-6 grid gap-x-8 gap-y-3 sm:grid-cols-2" stagger={0.05} y={18}>
                    {property.amenities.map((a) => (
                      <p
                        key={a}
                        className="flex items-center gap-3 border-b border-ink/10 pb-3 text-sm text-ink-mute"
                      >
                        <Check className="h-4 w-4 shrink-0 text-brass-deep" /> {a}
                      </p>
                    ))}
                  </Reveal>
                </div>
              )}

              {/* Payment */}
              <Reveal className="mt-16">
                <PaymentCalculator property={property} />
              </Reveal>

              {/* Location */}
              <div className="mt-16">
                <p className="eyebrow">Where it stands</p>
                <SplitHeading className="mt-4 font-display text-3xl leading-tight text-ink sm:text-4xl">
                  The block, not a thumbnail
                </SplitHeading>
                <p className="mt-4 max-w-xl text-sm leading-relaxed text-ink-mute">
                  Drag to orbit the building and its neighbours in 3D. What is next door,
                  how tall it is, and what it will block — before you book a viewing.
                </p>
                <Reveal className="mt-7">
                  <PropertyLocationMap property={property} />
                </Reveal>
              </div>
            </div>

            {/* Sticky enquiry rail */}
            <aside className="lg:sticky lg:top-28 lg:h-fit">
              <PropertyEnquiry property={property} />

              <div className="mt-5 rounded-[1.5rem] border border-ink/10 bg-sand-light p-6">
                <p className="eyebrow">At a glance</p>
                <dl className="mt-4 space-y-3 text-sm">
                  {[
                    ["Asking price", fullAed(property.price_aed)],
                    ["Listing", property.listing_type === "rent" ? "Rental" : "Sale"],
                    ["Community", property.area],
                    ["Reference", String(property.id).slice(-8).toUpperCase()]
                  ].map(([k, v]) => (
                    <div key={k} className="flex items-baseline justify-between gap-4 border-b border-ink/10 pb-3 last:border-0 last:pb-0">
                      <dt className="font-heading text-[10px] uppercase tracking-label text-ink/45">{k}</dt>
                      <dd className="text-right font-medium text-ink">{v}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </aside>
          </div>
        </main>

        <SimilarListings property={property} />
        <SiteFooter />

        {/* Floating action bar — appears once the hero is gone */}
        <div
          ref={barRef}
          className="glass fixed inset-x-3 bottom-3 z-40 flex items-center justify-between gap-4 rounded-full border border-ink/10 px-5 py-3 shadow-lift sm:inset-x-auto sm:left-1/2 sm:w-[min(44rem,calc(100vw-3rem))] sm:-translate-x-1/2"
        >
          <div className="min-w-0">
            <p className="truncate font-heading text-[10px] uppercase tracking-label text-ink/45">
              {property.area}
            </p>
            <p className="truncate font-display text-xl text-ink">
              AED {compactAed(property.price_aed)}
              {priceSuffix(property.listing_type) && (
                <span className="ml-2 font-heading text-[9px] uppercase tracking-label text-ink/45">
                  {priceSuffix(property.listing_type)}
                </span>
              )}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Pill
              href={`tel:${(property.agent_phone || "").replace(/[^0-9+]/g, "")}`}
              tone="outline"
              size="sm"
              arrow={false}
              magnetic={false}
              className="hidden sm:inline-flex"
            >
              Call
            </Pill>
            <Pill to="/explorer" size="sm" arrow={false} magnetic={false}>
              On the map
            </Pill>
          </div>
        </div>
      </div>
    </SmoothScroll>
  );
}