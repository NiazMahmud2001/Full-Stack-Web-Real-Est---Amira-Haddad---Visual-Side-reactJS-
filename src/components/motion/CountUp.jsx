import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "../../lib/gsap";

const round = (value, decimals) =>
  decimals ? value.toFixed(decimals) : String(Math.round(value));

/** Counts from `from` to `value` the first time it scrolls into view. */
export default function CountUp({
  value,
  from = 0,
  decimals = 0,
  duration = 1.8,
  prefix = "",
  suffix = "",
  separator = true,
  className = ""
}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    const print = (n) => {
      const text = round(n, decimals);
      const [whole, frac] = text.split(".");
      const grouped = separator ? Number(whole).toLocaleString("en-AE") : whole;
      el.textContent = `${prefix}${grouped}${frac ? `.${frac}` : ""}${suffix}`;
    };

    if (prefersReducedMotion()) {
      print(value);
      return undefined;
    }

    print(from);
    const counter = { n: from };
    const tween = gsap.to(counter, {
      n: value,
      duration,
      ease: "power2.out",
      onUpdate: () => print(counter.n),
      scrollTrigger: { trigger: el, start: "top 92%", once: true }
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [value, from, decimals, duration, prefix, suffix, separator]);

  return <span ref={ref} className={className} />;
}
