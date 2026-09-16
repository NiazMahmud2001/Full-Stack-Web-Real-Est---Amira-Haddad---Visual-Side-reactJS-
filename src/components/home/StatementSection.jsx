import { useEffect, useRef } from "react";
import { gsap, SplitText, prefersReducedMotion } from "../../lib/gsap";

const STATEMENT =
  "Most portals hand you a filter and wish you luck. This one starts with a sentence — your budget, the school run, the commute, the view you actually want — and answers with the city itself, tilted and lit and pinned with what is available today.";

/**
 * The statement paragraph lights up word by word as it is scrolled through,
 * scrubbed rather than triggered so the reader controls the pace.
 */
export default function StatementSection() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return undefined;

    let split;
    let tween;
    let cancelled = false;

    const run = () => {
      if (cancelled || !ref.current) return;
      split = new SplitText(el, { type: "words" });
      tween = gsap.fromTo(
        split.words,
        { opacity: 0.14 },
        {
          opacity: 1,
          ease: "none",
          stagger: 0.5,
          scrollTrigger: {
            trigger: el,
            start: "top 78%",
            end: "bottom 58%",
            scrub: 0.6
          }
        }
      );
    };

    if (document.fonts?.ready) document.fonts.ready.then(run);
    else run();

    return () => {
      cancelled = true;
      tween?.scrollTrigger?.kill();
      tween?.kill();
      split?.revert();
    };
  }, []);

  return (
    <section className="relative bg-sand px-5 py-28 sm:px-8 sm:py-40">
      <div className="mx-auto max-w-4xl">
        <div className="rule mb-14" />
        <p className="eyebrow mb-8">The idea</p>
        <p
          ref={ref}
          className="font-display text-[2rem] leading-[1.22] tracking-tight text-ink sm:text-[2.9rem] sm:leading-[1.18]"
        >
          {STATEMENT}
        </p>
      </div>
    </section>
  );
}
