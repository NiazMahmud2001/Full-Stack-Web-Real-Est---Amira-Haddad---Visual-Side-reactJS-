import { useEffect, useRef } from "react";
import { gsap, hasFinePointer, prefersReducedMotion } from "../../lib/gsap";

/**
 * Subtle perspective tilt that follows the pointer across the card, plus a
 * moving specular highlight driven by two CSS custom properties
 * (`--mx` / `--my`) the child can pick up.
 */
export default function TiltCard({ className = "", children, max = 7, lift = -6, ...rest }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !hasFinePointer() || prefersReducedMotion()) return undefined;

    const rotX = gsap.quickTo(el, "rotationX", { duration: 0.7, ease: "power3.out" });
    const rotY = gsap.quickTo(el, "rotationY", { duration: 0.7, ease: "power3.out" });
    const moveY = gsap.quickTo(el, "y", { duration: 0.7, ease: "power3.out" });

    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      rotY((px - 0.5) * max * 2);
      rotX((0.5 - py) * max * 2);
      el.style.setProperty("--mx", `${px * 100}%`);
      el.style.setProperty("--my", `${py * 100}%`);
    };

    const onEnter = () => moveY(lift);
    const onLeave = () => {
      rotX(0);
      rotY(0);
      moveY(0);
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerenter", onEnter);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerenter", onEnter);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [max, lift]);

  return (
    <div
      ref={ref}
      className={className}
      style={{ transformStyle: "preserve-3d", willChange: "transform" }}
      {...rest}
    >
      {children}
    </div>
  );
}
