import { cloneElement, useEffect, useRef } from "react";
import { gsap, hasFinePointer, prefersReducedMotion } from "../../lib/gsap";

/**
 * Pulls its single child a few pixels toward the pointer, then springs back.
 *
 * Two rules keep it from stealing a neighbour's clicks:
 *  - it only engages while the pointer is inside the element's box, or within
 *    `padding` of its edge — measured against the box, not the centre, so a
 *    wide button doesn't reach halfway across the row; and
 *  - the offset is hard-capped at `maxOffset` px, so the element can never
 *    travel far enough to sit on top of whatever is next to it.
 */
export default function Magnetic({ children, strength = 0.35, padding = 24, maxOffset = 7 }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !hasFinePointer() || prefersReducedMotion()) return undefined;

    const xTo = gsap.quickTo(el, "x", { duration: 0.7, ease: "elastic.out(1, 0.4)" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.7, ease: "elastic.out(1, 0.4)" });
    const clamp = gsap.utils.clamp(-maxOffset, maxOffset);

    const release = () => {
      xTo(0);
      yTo(0);
    };

    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      // Shortest distance from the pointer to the element's box — zero inside it.
      const gapX = Math.max(r.left - e.clientX, e.clientX - r.right, 0);
      const gapY = Math.max(r.top - e.clientY, e.clientY - r.bottom, 0);
      if (Math.hypot(gapX, gapY) > padding) {
        release();
        return;
      }
      xTo(clamp((e.clientX - (r.left + r.width / 2)) * strength));
      yTo(clamp((e.clientY - (r.top + r.height / 2)) * strength));
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", release);
    window.addEventListener("blur", release);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", release);
      window.removeEventListener("blur", release);
      gsap.set(el, { clearProps: "all" });
    };
  }, [strength, padding, maxOffset]);

  return cloneElement(children, { ref });
}
