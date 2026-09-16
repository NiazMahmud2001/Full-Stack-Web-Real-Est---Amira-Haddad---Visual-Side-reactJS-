import { useEffect } from "react";

// How far the pointer must travel before it counts as a drag rather than a
// click — below this a card still opens normally.
const DRAG_THRESHOLD = 6;
const WHEEL_EASE = 0.22;

/**
 * Turns a plain `overflow-x-auto` element into a rail you can work with a
 * mouse: a vertical wheel moves it sideways (eased, because raw wheel deltas
 * arrive in ~100px jumps), and left-click dragging pans it. The click that
 * ends a real drag is swallowed so the card underneath doesn't navigate.
 *
 * Touch is left alone — native horizontal scrolling already handles it — and
 * the wheel is handed back to the page once the rail hits either end, so it
 * never traps the scroll.
 *
 * Pass `resetKey` whenever the rail is rendered conditionally (an empty state
 * or a loading skeleton): the ref object is stable, so without it the effect
 * would never re-run once the element finally appears.
 */
export function useRailScroll(ref, { enabled = true, resetKey = 0 } = {}) {
  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return undefined;

    const maxScroll = () => el.scrollWidth - el.clientWidth;
    const canScroll = () => maxScroll() > 1;

    // --- eased wheel -------------------------------------------------------
    let target = null;
    let frame = 0;

    const step = () => {
      if (target === null) {
        frame = 0;
        return;
      }
      const next = el.scrollLeft + (target - el.scrollLeft) * WHEEL_EASE;
      if (Math.abs(target - next) < 0.5) {
        el.scrollLeft = target;
        target = null;
        frame = 0;
        return;
      }
      el.scrollLeft = next;
      frame = requestAnimationFrame(step);
    };

    const stopWheelGlide = () => {
      target = null;
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
    };

    const onWheel = (e) => {
      if (!canScroll() || e.ctrlKey) return;
      // Trackpads send a real deltaX; a mouse only sends deltaY, so whichever
      // axis moved further becomes the horizontal movement.
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (!delta) return;

      const max = maxScroll();
      const from = target === null ? el.scrollLeft : target;
      if ((delta < 0 && from <= 0) || (delta > 0 && from >= max - 1)) return; // let the page scroll

      e.preventDefault();
      target = Math.min(Math.max(from + delta, 0), max);
      if (!frame) frame = requestAnimationFrame(step);
    };

    // --- drag to pan -------------------------------------------------------
    let pointerId = null;
    let startX = 0;
    let startLeft = 0;
    let travelled = 0;
    let suppressClick = false;

    const onPointerDown = (e) => {
      if (e.pointerType !== "mouse" || e.button !== 0 || !canScroll()) return;
      stopWheelGlide();
      pointerId = e.pointerId;
      startX = e.clientX;
      startLeft = el.scrollLeft;
      travelled = 0;
    };

    const onPointerMove = (e) => {
      if (pointerId === null || e.pointerId !== pointerId) return;
      const dx = e.clientX - startX;
      if (!travelled && Math.abs(dx) < DRAG_THRESHOLD) return;
      if (!travelled) {
        try {
          el.setPointerCapture(pointerId);
        } catch {
          /* pointer already gone — the drag still works without capture */
        }
        el.dataset.dragging = "true";
      }
      travelled = Math.max(travelled, Math.abs(dx));
      el.scrollLeft = startLeft - dx;
    };

    const endDrag = () => {
      if (pointerId === null) return;
      if (el.hasPointerCapture?.(pointerId)) el.releasePointerCapture(pointerId);
      suppressClick = travelled > DRAG_THRESHOLD;
      pointerId = null;
      travelled = 0;
      delete el.dataset.dragging;
      // The click fires synchronously after pointerup, so clearing on the next
      // task leaves exactly one click suppressed.
      if (suppressClick) setTimeout(() => { suppressClick = false; }, 0);
    };

    const onClickCapture = (e) => {
      if (!suppressClick) return;
      e.preventDefault();
      e.stopPropagation();
    };

    // Stop the browser's native image/link ghost drag from hijacking the pan.
    const onDragStart = (e) => e.preventDefault();

    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("pointerdown", onPointerDown);
    el.addEventListener("pointermove", onPointerMove);
    el.addEventListener("pointerup", endDrag);
    el.addEventListener("pointercancel", endDrag);
    el.addEventListener("click", onClickCapture, true);
    el.addEventListener("dragstart", onDragStart);

    return () => {
      stopWheelGlide();
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("pointerdown", onPointerDown);
      el.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("pointerup", endDrag);
      el.removeEventListener("pointercancel", endDrag);
      el.removeEventListener("click", onClickCapture, true);
      el.removeEventListener("dragstart", onDragStart);
    };
  }, [ref, enabled, resetKey]);
}
