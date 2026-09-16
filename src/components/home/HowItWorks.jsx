import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "../../lib/gsap";
import { Image } from "../../components/ui/image";
import { useMedia } from "../../context/ContentContext";
import SplitHeading from "../../components/motion/SplitHeading";

// `photoKey` is the `key` of a photo row in the Supabase `media` table.
const steps = [
  {
    n: "01",
    title: "Describe what you want",
    text: "A neighbourhood, a budget, a school catchment, or just \"somewhere quiet near the water\". Plain language is enough — no dropdowns to translate your life into.",
    photoKey: "dubaiNight"
  },
  {
    n: "02",
    title: "The map flies there",
    text: "The 3D city tilts and settles over the area you named, with every listing pinned in place and priced on the pin. You see the block, not a thumbnail.",
    photoKey: "downtownSkyline"
  },
  {
    n: "03",
    title: "Compare in context",
    text: "Open any address for photographs, floor size, service charge and a payment estimate. Distance to the metro stops being an abstraction.",
    photoKey: "livingRoom"
  },
  {
    n: "04",
    title: "Enquire and view",
    text: "One message reaches me directly with everything you have already told the map, so the first reply is a shortlist rather than a questionnaire.",
    photoKey: "poolVilla"
  }
];

export default function HowItWorks() {
  const { photo } = useMedia();
  const sectionRef = useRef(null);
  const railRef = useRef(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return undefined;

    const ctx = gsap.context(() => {
      if (railRef.current && !prefersReducedMotion()) {
        gsap.fromTo(
          railRef.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            transformOrigin: "top center",
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top 55%",
              end: "bottom 75%",
              scrub: true
            }
          }
        );
      }

      gsap.utils.toArray("[data-step]").forEach((el, i) => {
        ScrollTrigger.create({
          trigger: el,
          start: "top 62%",
          end: "bottom 62%",
          onToggle: (self) => self.isActive && setActive(i)
        });
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section id="approach" ref={sectionRef} className="bg-sand px-5 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-[1400px]">
        <p className="eyebrow">The approach</p>
        <SplitHeading className="mt-4 max-w-2xl font-display text-4xl leading-[1.05] text-ink sm:text-6xl">
          Four steps, no forms until the very end
        </SplitHeading>

        <div className="mt-16 grid gap-14 lg:grid-cols-[1fr_1.05fr] lg:gap-20">
          {/* Sticky visual — cross-fades to whichever step is in view */}
          <div className="hidden lg:block">
            <div className="sticky top-28">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-ink/10 bg-sage">
                {steps.map((s, i) => (
                  <Image
                    key={s.n}
                    src={photo[s.photoKey]}
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-0 h-full w-full object-cover transition-all [transition-duration:900ms] ease-expo"
                    style={{
                      opacity: active === i ? 1 : 0,
                      transform: active === i ? "scale(1)" : "scale(1.06)"
                    }}
                  />
                ))}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent" />
                <div className="grain pointer-events-none absolute inset-0" />
                <div className="absolute bottom-7 left-7">
                  <p className="font-display text-[5rem] leading-none text-sand/90">
                    {steps[active].n}
                  </p>
                  <p className="mt-1 font-heading text-[10px] uppercase tracking-label text-sand/70">
                    {steps[active].title}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Steps */}
          <div className="relative pl-8 sm:pl-12">
            <span className="absolute left-0 top-2 h-[calc(100%-1rem)] w-px bg-ink/12" />
            <span
              ref={railRef}
              className="absolute left-0 top-2 h-[calc(100%-1rem)] w-px origin-top bg-brass"
            />

            {steps.map((s, i) => (
              <div key={s.n} data-step className="relative py-10">
                <span
                  className={`absolute -left-[calc(2rem+3px)] top-[2.85rem] h-1.5 w-1.5 rounded-full transition-colors duration-500 sm:-left-[calc(3rem+3px)] ${
                    active >= i ? "bg-brass" : "bg-ink/25"
                  }`}
                />
                <p
                  className={`font-heading text-[10px] uppercase tracking-label transition-colors duration-500 ${
                    active === i ? "text-brass-deep" : "text-ink/35"
                  }`}
                >
                  Step {s.n}
                </p>
                <h3
                  className={`mt-3 font-display text-3xl transition-colors duration-500 sm:text-4xl ${
                    active === i ? "text-ink" : "text-ink/45"
                  }`}
                >
                  {s.title}
                </h3>
                <p className="mt-4 max-w-lg text-sm leading-relaxed text-ink-mute">{s.text}</p>
                <div className="mt-6 overflow-hidden rounded-2xl lg:hidden">
                  <Image src={photo[s.photoKey]} alt="" aria-hidden="true" className="h-48 w-full object-cover" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
