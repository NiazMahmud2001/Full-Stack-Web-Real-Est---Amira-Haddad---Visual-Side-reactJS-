import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "../../lib/gsap";

/**
 * Seamless horizontal ticker. The track is duplicated once and translated by
 * exactly -50%, so the loop point is invisible. Scrolling nudges the speed and
 * flips direction, which is what makes it feel attached to the page rather
 * than looping on its own clock.
 */
export default function Marquee({
  children,
  speed = 32,
  reverse = false,
  className = "",
  trackClassName = "",
  scrollReactive = true
}) {
  const trackRef = useRef(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return undefined;

    if (prefersReducedMotion()) {
      gsap.set(track, { xPercent: reverse ? -50 : 0 });
      return undefined;
    }

    gsap.set(track, { xPercent: reverse ? -50 : 0 });
    const tween = gsap.to(track, {
      xPercent: reverse ? 0 : -50,
      duration: speed,
      ease: "none",
      repeat: -1
    });

    if (!scrollReactive) return () => tween.kill();

    const trigger = ScrollTrigger.create({
      trigger: track,
      start: "top bottom",
      end: "bottom top",
      onUpdate: (self) => {
        // Scroll velocity briefly speeds the ticker up and can reverse it.
        const boost = gsap.utils.clamp(-4, 4, self.getVelocity() / 320);
        tween.timeScale(gsap.utils.clamp(-5, 5, 1 + boost));
      },
      onLeave: () => tween.timeScale(1),
      onLeaveBack: () => tween.timeScale(1)
    });

    return () => {
      trigger.kill();
      tween.kill();
    };
  }, [speed, reverse, scrollReactive]);

  return (
    <div className={`overflow-hidden ${className}`}>
      <div ref={trackRef} className={`flex w-max flex-nowrap ${trackClassName}`}>
        {children}
        {children}
      </div>
    </div>
  );
}
