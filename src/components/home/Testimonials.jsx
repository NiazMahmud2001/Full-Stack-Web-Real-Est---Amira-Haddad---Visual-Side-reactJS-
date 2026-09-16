import { useEffect, useRef, useState } from "react";
import { Quote } from "lucide-react";
import { gsap, prefersReducedMotion } from "../../lib/gsap";

// PLACEHOLDER copy — swap for real, attributable client quotes before launch.
const QUOTES = [
  {
    text: "I described the school run and a budget, and had four addresses on screen before I finished my coffee. We viewed two and bought the second.",
    name: "R. Mehta",
    detail: "Bought in Dubai Hills Estate"
  },
  {
    text: "The 3D view saved us a wasted trip. We could see the tower opposite would block the light long before anyone drove us out there.",
    name: "S. & J. Okafor",
    detail: "Rented in Dubai Marina"
  },
  {
    text: "Straight answers on service charge and realistic yield, in writing, on the first call. That is rarer in this market than it should be.",
    name: "A. Karim",
    detail: "Investor, Business Bay"
  }
];

const INTERVAL = 6500;

export default function Testimonials() {
  const [index, setIndex] = useState(0);
  const bodyRef = useRef(null);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % QUOTES.length), INTERVAL);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const el = bodyRef.current;
    if (!el || prefersReducedMotion()) return undefined;
    const tween = gsap.fromTo(
      el.children,
      { opacity: 0, y: 22 },
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.07, ease: "expo.out" }
    );
    return () => {
      tween.kill();
    };
  }, [index]);

  const q = QUOTES[index];

  return (
    <section className="bg-sand-light px-5 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-4xl text-center">
        <Quote className="mx-auto h-6 w-6 text-brass" />
        <div ref={bodyRef} className="mt-10">
          <blockquote className="font-display text-[1.7rem] leading-[1.3] text-ink sm:text-[2.5rem] sm:leading-[1.25]">
            &ldquo;{q.text}&rdquo;
          </blockquote>
          <p className="mt-8 font-heading text-[10px] uppercase tracking-label text-ink">{q.name}</p>
          <p className="mt-1.5 font-heading text-[10px] uppercase tracking-label text-ink/40">
            {q.detail}
          </p>
        </div>

        <div className="mt-12 flex items-center justify-center gap-2">
          {QUOTES.map((item, i) => (
            <button
              key={item.name}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Show testimonial ${i + 1}`}
              data-cursor="link"
              className={`h-1.5 rounded-full transition-all duration-500 ease-expo ${
                i === index ? "w-10 bg-brass" : "w-1.5 bg-ink/20 hover:bg-ink/40"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
