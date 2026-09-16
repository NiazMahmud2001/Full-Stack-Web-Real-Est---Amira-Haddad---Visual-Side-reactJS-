import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "../../lib/gsap";

/**
 * Fade-and-rise on scroll. `stagger` animates the wrapper's direct children
 * instead of the wrapper itself, which is what most grids want.
 */
export default function Reveal({
  as: Tag = "div",
  className = "",
  children,
  y = 34,
  x = 0,
  scale = 1,
  delay = 0,
  duration = 1,
  stagger = 0,
  start = "top 88%",
  ...rest
}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return undefined;

    const targets = stagger ? Array.from(el.children) : el;
    const tween = gsap.from(targets, {
      opacity: 0,
      y,
      x,
      scale,
      duration,
      delay,
      stagger,
      ease: "expo.out",
      scrollTrigger: { trigger: el, start, once: true },
      // A leftover `transform: translate(0,0)` still makes the element a
      // containing block for `position: fixed` descendants — which quietly
      // traps modals inside the card they were opened from.
      onComplete: () => gsap.set(targets, { clearProps: "all" })
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
      gsap.set(targets, { clearProps: "all" });
    };
  }, [y, x, scale, delay, duration, stagger, start]);

  return (
    <Tag ref={ref} className={className} {...rest}>
      {children}
    </Tag>
  );
}
