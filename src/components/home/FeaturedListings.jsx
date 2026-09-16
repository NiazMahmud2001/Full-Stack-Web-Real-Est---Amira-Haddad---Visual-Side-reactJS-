import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "../../lib/gsap";
import { useProperties } from "../../hooks/useProperties";
import { useRailScroll } from "../../hooks/useRailScroll";
import { setScrollY } from "../../components/motion/SmoothScroll";
import PropertyTile from "../../components/listings/PropertyTile";
import SplitHeading from "../../components/motion/SplitHeading";
import Pill from "../../components/common/Pill";

const FILTERS = [
  { id: "all", label: "Everything" },
  { id: "sale", label: "To buy" },
  { id: "rent", label: "To rent" }
];

const DESKTOP = "(min-width: 1024px)";

export default function FeaturedListings() {
  const { properties, loading, isDemo } = useProperties(24);
  const [filter, setFilter] = useState("all");
  const [pinnable, setPinnable] = useState(false);
  const sectionRef = useRef(null);
  const trackRef = useRef(null);

  useEffect(() => {
    const mq = window.matchMedia(DESKTOP);
    const sync = () => setPinnable(mq.matches && !prefersReducedMotion());
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const shown = useMemo(() => {
    const list = filter === "all" ? properties : properties.filter((p) => p.listing_type === filter);
    return list.slice(0, 8);
  }, [properties, filter]);

  // Drag the rail sideways for the length of the section, with the section
  // pinned. `invalidateOnRefresh` re-measures after a filter changes the
  // track width or a photograph finishes loading.
  useLayoutEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track || !pinnable || shown.length === 0) return undefined;

    const ctx = gsap.context(() => {
      const distance = () => Math.max(0, track.scrollWidth - window.innerWidth + 96);
      const tween = gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${distance() + window.innerHeight * 0.4}`,
          pin: true,
          scrub: 0.7,
          anticipatePin: 1,
          invalidateOnRefresh: true
        }
      });

      gsap.utils.toArray("[data-tile]").forEach((tile) => {
        gsap.from(tile, {
          y: 60,
          opacity: 0,
          duration: 0.9,
          ease: "expo.out",
          scrollTrigger: { trigger: tile, containerAnimation: tween, start: "left 92%", once: true }
        });
      });
    }, section);

    const refresh = () => ScrollTrigger.refresh();
    const timer = setTimeout(refresh, 120);

    return () => {
      clearTimeout(timer);
      ctx.revert();
    };
  }, [pinnable, shown.length, filter]);

  // Below the pin breakpoint the rail is a plain overflow container, so the
  // shared wheel/drag behaviour applies directly.
  useRailScroll(trackRef, { enabled: !pinnable, resetKey: shown.length });

  // While pinned, horizontal position *is* page scroll — so dragging the rail
  // drives the page instead of the element, and the existing scrub keeps the
  // motion smooth.
  useEffect(() => {
    const track = trackRef.current;
    if (!track || !pinnable || shown.length === 0) return undefined;

    let pointerId = null;
    let startX = 0;
    let startScroll = 0;
    let travelled = 0;
    let suppressClick = false;

    // Page pixels consumed per pixel of horizontal travel: the trigger runs
    // for the track's width plus the 40vh tail added in the pin above.
    const ratio = () => {
      const distance = Math.max(1, track.scrollWidth - window.innerWidth + 96);
      return (distance + window.innerHeight * 0.4) / distance;
    };

    const onPointerDown = (e) => {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      pointerId = e.pointerId;
      startX = e.clientX;
      startScroll = window.scrollY;
      travelled = 0;
    };

    const onPointerMove = (e) => {
      if (pointerId === null || e.pointerId !== pointerId) return;
      const dx = e.clientX - startX;
      if (!travelled && Math.abs(dx) < 6) return;
      if (!travelled) {
        try {
          track.setPointerCapture(pointerId);
        } catch {
          /* pointer already gone — the drag still works without capture */
        }
        track.dataset.dragging = "true";
      }
      travelled = Math.max(travelled, Math.abs(dx));
      setScrollY(startScroll - dx * ratio());
    };

    const endDrag = () => {
      if (pointerId === null) return;
      if (track.hasPointerCapture?.(pointerId)) track.releasePointerCapture(pointerId);
      suppressClick = travelled > 6;
      pointerId = null;
      travelled = 0;
      delete track.dataset.dragging;
      if (suppressClick) setTimeout(() => { suppressClick = false; }, 0);
    };

    const onClickCapture = (e) => {
      if (!suppressClick) return;
      e.preventDefault();
      e.stopPropagation();
    };

    const onDragStart = (e) => e.preventDefault();

    track.addEventListener("pointerdown", onPointerDown);
    track.addEventListener("pointermove", onPointerMove);
    track.addEventListener("pointerup", endDrag);
    track.addEventListener("pointercancel", endDrag);
    track.addEventListener("click", onClickCapture, true);
    track.addEventListener("dragstart", onDragStart);

    return () => {
      track.removeEventListener("pointerdown", onPointerDown);
      track.removeEventListener("pointermove", onPointerMove);
      track.removeEventListener("pointerup", endDrag);
      track.removeEventListener("pointercancel", endDrag);
      track.removeEventListener("click", onClickCapture, true);
      track.removeEventListener("dragstart", onDragStart);
    };
  }, [pinnable, shown.length, filter]);

  return (
    <section
      id="listings"
      ref={sectionRef}
      className={`relative overflow-hidden bg-sage ${
        pinnable ? "flex h-screen flex-col justify-center py-14" : "py-20 sm:py-24"
      }`}
    >
      <div className="mx-auto w-full max-w-[1400px] shrink-0 px-5 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div className="max-w-xl">
            <p className="eyebrow">Portfolio</p>
            <SplitHeading className="mt-4 font-display text-4xl leading-[1.05] text-ink sm:text-6xl">
              Currently on the market
            </SplitHeading>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-ink-mute">
              A working selection across the communities I cover — priced, measured and
              pinned on the map exactly where they stand.
              {isDemo && !loading && (
                <span className="mt-2 block font-heading text-[10px] uppercase tracking-label text-brass-deep">
                  Showing sample inventory — no listings published yet
                </span>
              )}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilter(f.id)}
                data-cursor="link"
                className={`rounded-full px-5 py-2.5 font-heading text-[10px] font-semibold uppercase tracking-label transition-colors duration-500 ${
                  filter === f.id
                    ? "bg-ink text-sand"
                    : "border border-ink/20 text-ink-mute hover:border-ink hover:text-ink"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-10 shrink-0 sm:mt-14">
        {loading ? (
          <div className="mx-auto flex max-w-[1400px] gap-6 px-5 sm:px-8">
            {[0, 1, 2].map((n) => (
              <div
                key={n}
                className="h-[30rem] w-[26rem] shrink-0 animate-pulse rounded-[1.75rem] bg-ink/5"
              />
            ))}
          </div>
        ) : (
          <div
            ref={trackRef}
            className={
              pinnable
                ? "flex w-max gap-6 px-5 sm:px-8"
                : "no-scrollbar flex w-full gap-5 overflow-x-auto px-5 pb-4 sm:px-8"
            }
          >
            {shown.map((p, i) => (
              <div key={p.id} data-tile className="shrink-0">
                <PropertyTile property={p} index={i} />
              </div>
            ))}

            <div className="flex w-[80vw] shrink-0 flex-col justify-center gap-6 rounded-[1.75rem] border border-dashed border-ink/25 p-10 sm:w-[26rem]">
              <p className="font-display text-3xl leading-tight text-ink">
                Nothing here quite right?
              </p>
              <p className="text-sm leading-relaxed text-ink-mute">
                Tell the map what you are after and it will show you the rest — or send me
                the brief and I will come back with a shortlist.
              </p>
              <div className="flex flex-wrap gap-4">
                <Pill to="/explorer" size="sm">
                  Open the map
                </Pill>
                <Pill to="/#enquire" size="sm" tone="outline" arrow={false}>
                  Send a brief
                </Pill>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
