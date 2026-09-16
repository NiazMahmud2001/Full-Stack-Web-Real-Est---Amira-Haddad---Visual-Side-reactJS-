import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "../../lib/gsap";

/** Hairline reading-progress bar pinned to the top of the viewport. */
export default function ScrollProgress() {
  const barRef = useRef(null);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return undefined;

    gsap.set(bar, { scaleX: 0, transformOrigin: "left center" });
    const trigger = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => gsap.set(bar, { scaleX: self.progress })
    });

    return () => trigger.kill();
  }, []);

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[2px]">
      <div ref={barRef} className="h-full w-full bg-gradient-to-r from-forest via-brass to-brass-light" />
    </div>
  );
}
