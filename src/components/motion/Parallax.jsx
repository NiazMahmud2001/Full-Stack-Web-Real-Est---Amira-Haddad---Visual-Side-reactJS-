import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "../../lib/gsap";

/**
 * Moves its contents against the scroll while the section is on screen.
 * `speed` is a fraction of the viewport height: 0.15 drifts gently, 0.4 is a
 * strong background layer. Negative values run with the scroll.
 */
export default function Parallax({
  as: Tag = "div",
  className = "",
  children,
  speed = 0.18,
  scale = 1,
  ...rest
}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return undefined;

    const distance = window.innerHeight * speed;
    const tween = gsap.fromTo(
      el,
      { yPercent: 0, y: distance / 2, scale },
      {
        y: -distance / 2,
        ease: "none",
        scrollTrigger: {
          trigger: el.parentElement || el,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
          invalidateOnRefresh: true
        }
      }
    );

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
      gsap.set(el, { clearProps: "all" });
    };
  }, [speed, scale]);

  return (
    <Tag ref={ref} className={className} {...rest}>
      {children}
    </Tag>
  );
}
