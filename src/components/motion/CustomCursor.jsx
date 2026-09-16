import { useEffect, useRef, useState } from "react";
import { gsap, hasFinePointer, prefersReducedMotion } from "../../lib/gsap";

/**
 * Two-part cursor: a dot that tracks the pointer exactly and a ring that
 * trails it. Elements opt into a variant with `data-cursor="view|link|drag|
 * text|dark"` and can override the ring label with `data-cursor-label`.
 *
 * Rendered once at the app root. It bows out entirely on touch screens and
 * when the visitor has asked for reduced motion, leaving the OS cursor alone.
 */
export default function CustomCursor() {
  const rootRef = useRef(null);
  const ringRef = useRef(null);
  const dotRef = useRef(null);
  const [enabled, setEnabled] = useState(false);
  const [label, setLabel] = useState("");

  useEffect(() => {
    if (!hasFinePointer() || prefersReducedMotion()) return undefined;
    setEnabled(true);
    document.documentElement.classList.add("cursor-none");
    return () => document.documentElement.classList.remove("cursor-none");
  }, []);

  useEffect(() => {
    if (!enabled) return undefined;
    const root = rootRef.current;
    const ring = ringRef.current;
    const dot = dotRef.current;
    if (!root || !ring || !dot) return undefined;

    gsap.set([ring, dot], { xPercent: 0, yPercent: 0, opacity: 0 });

    const ringX = gsap.quickTo(ring, "x", { duration: 0.55, ease: "power3.out" });
    const ringY = gsap.quickTo(ring, "y", { duration: 0.55, ease: "power3.out" });
    const dotX = gsap.quickTo(dot, "x", { duration: 0.12, ease: "power2.out" });
    const dotY = gsap.quickTo(dot, "y", { duration: 0.12, ease: "power2.out" });

    let shown = false;
    const onMove = (e) => {
      if (!shown) {
        shown = true;
        gsap.to([ring, dot], { opacity: 1, duration: 0.3 });
      }
      ringX(e.clientX);
      ringY(e.clientY);
      dotX(e.clientX);
      dotY(e.clientY);
    };

    // The ring is 40px, so these are multipliers of that. `drag` stays small
    // and unfilled: it sits over a live map, where a big solid disc hides the
    // pins and labels underneath it.
    const SCALE = { view: 1.6, drag: 1.05, link: 1.4, text: 0.4 };

    const setState = (state, text) => {
      root.dataset.state = state || "";
      setLabel(state === "drag" ? "" : text || "");
      gsap.to(ring, {
        scale: SCALE[state] ?? 1,
        duration: 0.45,
        ease: "expo.out"
      });
    };

    const onOver = (e) => {
      const target = e.target instanceof Element ? e.target : null;
      if (!target) return;
      const holder = target.closest("[data-cursor]");
      if (holder) {
        setState(holder.getAttribute("data-cursor"), holder.getAttribute("data-cursor-label"));
        return;
      }
      if (target.closest("input, textarea, select, [contenteditable='true']")) {
        setState("text", "");
        return;
      }
      if (target.closest("a, button, [role='button']")) {
        setState("link", "");
        return;
      }
      setState("", "");
    };

    const onDown = () => gsap.to(ring, { scale: 0.78, duration: 0.2, ease: "power2.out" });
    const onUp = () =>
      gsap.to(ring, { scale: SCALE[root.dataset.state] ?? 1, duration: 0.3, ease: "expo.out" });
    const onLeave = () => gsap.to([ring, dot], { opacity: 0, duration: 0.25 });
    const onEnter = () => gsap.to([ring, dot], { opacity: 1, duration: 0.25 });

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div ref={rootRef} className="cursor-root" aria-hidden="true">
      <div ref={ringRef} className="cursor-ring absolute">
        <span className="cursor-label">{label}</span>
      </div>
      <div ref={dotRef} className="cursor-dot absolute" />
    </div>
  );
}
