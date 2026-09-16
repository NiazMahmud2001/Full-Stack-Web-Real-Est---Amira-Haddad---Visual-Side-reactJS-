import { useEffect } from "react";
import LocomotiveScroll from "locomotive-scroll";
import { gsap, ScrollTrigger, prefersReducedMotion } from "../../lib/gsap";

/** The live instance, or null on pages that scroll natively. */
let instance = null;

/**
 * Locomotive Scroll v5 rides on Lenis and keeps the browser's *native* scroll
 * position, so `position: sticky`, ScrollTrigger pinning and MapLibre all keep
 * working — unlike v4, which translated a wrapper and broke every one of them.
 *
 * Lenis is stepped from GSAP's ticker (`initCustomTicker`) so smoothing and
 * scroll-driven animation share one frame, and `ScrollTrigger.update()` runs on
 * every Lenis scroll event to keep triggers exactly in step.
 *
 * Mount once per scrolling page. Pages that own the viewport (the map/chat
 * explorer) simply don't render it.
 */
export default function SmoothScroll({ children }) {
  useEffect(() => {
    if (prefersReducedMotion()) return undefined;

    const loco = new LocomotiveScroll({
      lenisOptions: {
        lerp: 0.085,
        wheelMultiplier: 1,
        touchMultiplier: 1.8,
        smoothWheel: true,
        syncTouch: false
      },
      triggerRootMargin: "-1px -1px -1px -1px",
      initCustomTicker: (render) => gsap.ticker.add(render),
      destroyCustomTicker: (render) => gsap.ticker.remove(render),
      scrollCallback: () => ScrollTrigger.update()
    });

    instance = loco;

    // Fonts and remote imagery change the document height after first paint;
    // both need a trigger recalculation or every `start` lands a few hundred
    // pixels off.
    const refresh = () => ScrollTrigger.refresh();
    const timers = [setTimeout(refresh, 250), setTimeout(refresh, 1200)];
    if (document.fonts?.ready) document.fonts.ready.then(refresh);
    window.addEventListener("load", refresh);

    return () => {
      timers.forEach(clearTimeout);
      window.removeEventListener("load", refresh);
      instance = null;
      loco.destroy();
    };
  }, []);

  return children;
}

/** Smooth-scroll to a selector or element, falling back to native scrolling. */
export function scrollToTarget(target, options = {}) {
  if (instance) {
    instance.scrollTo(target, { duration: 1.4, ...options });
    return;
  }
  const el = typeof target === "string" ? document.querySelector(target) : target;
  el?.scrollIntoView({ behavior: "smooth", block: "start" });
}

/**
 * Jump the page to an absolute Y with no easing. Used where something else is
 * already driving the motion — dragging a pinned rail, for instance — and the
 * scroller must follow the pointer exactly.
 */
export function setScrollY(y) {
  if (instance) {
    instance.scrollTo(y, { immediate: true, force: true });
    return;
  }
  window.scrollTo({ top: y, behavior: "auto" });
}

/** True while a page has smooth scrolling mounted. */
export function hasSmoothScroll() {
  return instance !== null;
}
