import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "../../lib/gsap";

// Resting angles for the back, middle and front card of the photo stack.
const TILTS = [-10, 6, -2];

/**
 * The full-screen intro shown while ContentProvider loads the data,
 * photographs and fonts. The counter and the brass line ease towards
 * `progress` (0 → 1). Once `done` is true and the counter reads 100, the
 * panel slides up out of the way and `onExited` is called.
 */
export default function SiteLoader({ progress, status, photos, agentName, done, onExited }) {
  const rootRef = useRef(null);
  const counterRef = useRef(null);
  const barRef = useRef(null);

  // The animation loop below starts once and reads the newest props through
  // this ref, instead of restarting every time a photo finishes.
  const latest = useRef({ progress, done, onExited });
  useEffect(() => {
    latest.current = { progress, done, onExited };
  });

  useEffect(() => {
    const root = rootRef.current;
    const reduced = prefersReducedMotion();
    let shown = 0; // the value on screen, 0 → 1
    let frame = 0;
    let exit = null;

    const paint = () => {
      counterRef.current.textContent = String(Math.round(shown * 100)).padStart(2, "0");
      barRef.current.style.transform = `scaleX(${shown})`;
    };

    const leave = () => {
      const finish = () => latest.current.onExited?.();
      if (reduced) {
        exit = gsap.to(root, { autoAlpha: 0, duration: 0.3, onComplete: finish });
        return;
      }
      exit = gsap
        .timeline({ onComplete: finish })
        .to(root.querySelectorAll("[data-loader-fade]"), {
          opacity: 0,
          y: -24,
          duration: 0.45,
          stagger: 0.05,
          ease: "power2.in"
        })
        .to(root, { yPercent: -100, duration: 1.1, ease: "expo.inOut" }, "-=0.2");
    };

    const tick = () => {
      const goal = latest.current.progress;
      if (reduced) {
        shown = goal;
      } else if (shown < goal) {
        // Ease towards the real value, but never slower than a steady crawl,
        // so the last few percent don't drag.
        shown = Math.min(goal, shown + Math.max((goal - shown) * 0.08, 0.004));
      }
      paint();

      if (latest.current.done && shown >= 1) {
        leave();
        return;
      }
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      exit?.kill();
    };
  }, []);

  return (
    <div
      ref={rootRef}
      role="progressbar"
      aria-label="Loading the site"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(progress * 100)}
      className="fixed inset-0 z-[200] flex flex-col overflow-hidden bg-ink text-sand"
      data-cursor="dark"
      data-lenis-prevent
    >
      <div className="grain pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute -left-40 top-1/4 h-[32rem] w-[32rem] rounded-full bg-forest/25 blur-[140px]" />
      <div className="pointer-events-none absolute -right-40 bottom-0 h-[26rem] w-[26rem] rounded-full bg-brass/15 blur-[140px]" />

      {/* Top chrome — the agent's name appears as soon as the data arrives */}
      <div
        data-loader-fade
        className="relative flex items-center justify-between px-6 pt-7 font-heading text-[10px] uppercase tracking-label text-sand/55 sm:px-10"
      >
        <span>{agentName || "UAE real estate"}</span>
        <span>Dubai · Abu Dhabi</span>
      </div>

      <div className="relative flex flex-1 flex-col items-center justify-center gap-8 px-6">
        {/* Each photograph drops onto the stack as it finishes downloading */}
        <div data-loader-fade className="relative h-[min(15rem,30vh)] w-[min(12rem,24vh)]" aria-hidden="true">
          <div className="absolute inset-0 rounded-2xl border border-dashed border-sand/15" />
          {photos.map((url, i) => (
            <StackCard key={url} url={url} tilt={TILTS[TILTS.length - photos.length + i]} />
          ))}
        </div>

        <div data-loader-fade className="text-center">
          <p className="font-display text-[length:min(24vw,20vh,10rem)] leading-none" aria-hidden="true">
            <span ref={counterRef}>00</span>
            <span className="ml-1 align-top text-[0.4em] italic text-brass-light">%</span>
          </p>
          <p className="mt-3 font-heading text-[10px] uppercase tracking-label text-sand/55">{status}</p>
        </div>
      </div>

      {/* Progress line between the two cities */}
      <div data-loader-fade className="relative px-6 pb-8 sm:px-10">
        <div className="flex justify-between font-heading text-[9px] uppercase tracking-label text-sand/35">
          <span>Dubai · 25.20° N</span>
          <span>Abu Dhabi · 24.45° N</span>
        </div>
        <div className="mt-3 h-px overflow-hidden bg-sand/15">
          <div ref={barRef} className="h-full origin-left bg-brass" style={{ transform: "scaleX(0)" }} />
        </div>
      </div>
    </div>
  );
}

function StackCard({ url, tilt }) {
  const cardRef = useRef(null);

  // Drop in when this photo arrives. The rotation lives on the outer wrapper,
  // so GSAP's movement here never fights it.
  useEffect(() => {
    if (prefersReducedMotion()) return undefined;
    const tween = gsap.fromTo(
      cardRef.current,
      { opacity: 0, scale: 0.8, y: 50 },
      { opacity: 1, scale: 1, y: 0, duration: 0.8, ease: "expo.out" }
    );
    return () => tween.kill();
  }, []);

  return (
    <div
      className="absolute inset-0 transition-transform duration-700 ease-expo"
      style={{ transform: `rotate(${tilt}deg)` }}
    >
      <div
        ref={cardRef}
        className="h-full w-full overflow-hidden rounded-2xl border border-sand/15 bg-ink-soft shadow-lift-lg"
      >
        <img src={url} alt="" className="h-full w-full object-cover" />
      </div>
    </div>
  );
}
