import { useEffect, useRef } from "react";
import { gsap, SplitText, prefersReducedMotion } from "../../lib/gsap";

/**
 * Headline that slides in line by line from behind a mask when it scrolls into
 * view. Splitting waits for `document.fonts.ready` — split before the webfont
 * lands and the line breaks are measured against the fallback face.
 */
export default function SplitHeading({
  as: Tag = "h2",
  className = "",
  children,
  delay = 0,
  stagger = 0.09,
  duration = 1.15,
  start = "top 86%",
  id = undefined
}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return undefined;

    let split;
    let tween;
    let cancelled = false;

    gsap.set(el, { autoAlpha: 0 });

    const run = () => {
      if (cancelled || !ref.current) return;
      split = new SplitText(el, { type: "lines", mask: "lines", linesClass: "split-line" });
      gsap.set(el, { autoAlpha: 1 });
      tween = gsap.from(split.lines, {
        yPercent: 118,
        duration,
        delay,
        stagger,
        ease: "expo.out",
        scrollTrigger: { trigger: el, start, once: true }
      });
    };

    if (document.fonts?.ready) document.fonts.ready.then(run);
    else run();

    return () => {
      cancelled = true;
      tween?.scrollTrigger?.kill();
      tween?.kill();
      split?.revert();
      gsap.set(el, { clearProps: "all" });
    };
  }, [delay, stagger, duration, start]);

  return (
    <Tag id={id} ref={ref} className={className}>
      {children}
    </Tag>
  );
}
