// Single place where GSAP plugins are registered, so every component imports
// the same configured instance instead of re-registering on each module.
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

// Locomotive/Lenis drives the ticker; lag smoothing would fight the scroll sync.
gsap.ticker.lagSmoothing(0);

gsap.defaults({ ease: "power3.out", duration: 0.9 });

export const EASE = {
  expo: "expo.out",
  power: "power3.out",
  soft: "power2.inOut"
};

/** True when the visitor asked the OS to keep motion to a minimum. */
export function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/** True for mouse/trackpad pointers — the only place custom cursors make sense. */
export function hasFinePointer() {
  return typeof window !== "undefined" && window.matchMedia("(pointer: fine)").matches;
}

export { gsap, ScrollTrigger, SplitText };
