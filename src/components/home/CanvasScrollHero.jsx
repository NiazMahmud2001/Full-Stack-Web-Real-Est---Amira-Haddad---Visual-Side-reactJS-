import { useEffect, useRef } from "react";
import { ArrowDown } from "lucide-react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "../../lib/gsap";
import { useAgent, useMedia } from "../../context/ContentContext";
import Pill from "../../components/common/Pill";

// One caption per frame. Titles are authored as discrete lines so each can be
// masked and slid independently. The last kicker quotes the agent's years in
// the UAE, which comes from Supabase, so the list is built inside the component.
const getCaptions = (yearsActive) => [
  {
    kicker: "UAE real estate, explored by conversation",
    lines: ["Talk to the city.", "Watch it move."],
    accent: 1,
    size: "text-[13vw] leading-[0.92] sm:text-[9vw] lg:text-[7.4rem]"
  },
  {
    kicker: "Villas · Towers · Waterfront",
    lines: ["Every address", "in view."],
    accent: 1,
    size: "text-[11vw] leading-[0.95] sm:text-[7.5vw] lg:text-[6rem]"
  },
  {
    kicker: "Ask in plain language",
    lines: ["Name an area —", "the camera flies there."],
    accent: 1,
    size: "text-[8.5vw] leading-[1] sm:text-[5.5vw] lg:text-[4.5rem]"
  },
  {
    kicker: `${yearsActive} years on the ground in the UAE`,
    lines: ["Start exploring."],
    accent: 0,
    size: "text-[9vw] leading-[1] sm:text-[6vw] lg:text-[5rem]"
  }
];

const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);

export default function CanvasScrollHero() {
  const { yearsActive } = useAgent();
  const { heroFrames } = useMedia();
  const captions = getCaptions(yearsActive);

  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const captionsRef = useRef([]);
  const cueRef = useRef(null);
  const ticksRef = useRef([]);
  const imagesRef = useRef([]);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return undefined;

    const ctx = canvas.getContext("2d");
    let width = 0;
    let height = 0;
    let progress = 0;

    imagesRef.current = heroFrames.map((src) => {
      const img = new Image();
      img.decoding = "async";
      img.src = src;
      return img;
    });

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    // Cover-fit the frame, scaled about the centre.
    const paint = (img, zoom, alpha) => {
      if (!img || !img.complete || !img.naturalWidth || alpha <= 0.001) return;
      const scale = Math.max(width / img.naturalWidth, height / img.naturalHeight) * zoom;
      const dw = img.naturalWidth * scale;
      const dh = img.naturalHeight * scale;
      ctx.globalAlpha = alpha;
      ctx.drawImage(img, (width - dw) / 2, (height - dh) / 2, dw, dh);
      ctx.globalAlpha = 1;
    };

    const render = () => {
      if (!width || !height) return;
      const last = heroFrames.length - 1;
      const raw = progress * last;
      const index = Math.min(last, Math.floor(raw));
      const local = raw - index;
      // Hold each frame, then cross-dissolve across the last 45% of its span.
      const t = local < 0.55 ? 0 : (local - 0.55) / 0.45;

      ctx.clearRect(0, 0, width, height);
      paint(imagesRef.current[index], 1 + local * 0.14, 1);
      paint(imagesRef.current[index + 1], 1.14 - t * 0.14, t);

      // Captions live in the DOM; their opacity is a function of the same
      // scroll position, so text and imagery breathe together.
      captionsRef.current.forEach((el, k) => {
        if (!el) return;
        const distance = Math.abs(raw - k);
        const alpha = clamp01(1 - (distance - 0.12) / 0.42);
        el.style.opacity = String(alpha);
        el.style.transform = `translate3d(0, ${(1 - alpha) * 26}px, 0)`;
        el.style.pointerEvents = alpha > 0.6 ? "auto" : "none";
      });

      ticksRef.current.forEach((el, k) => {
        if (!el) return;
        el.style.transform = `scaleX(${clamp01(raw - k + 1)})`;
      });

      if (cueRef.current) cueRef.current.style.opacity = String(clamp01(1 - progress * 14));
    };

    resize();
    render();

    imagesRef.current.forEach((img) => {
      img.onload = render;
    });

    const trigger = ScrollTrigger.create({
      trigger: wrap,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        progress = self.progress;
        render();
      },
      onRefresh: (self) => {
        resize();
        progress = self.progress;
        render();
      }
    });

    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
      trigger.kill();
      imagesRef.current.forEach((img) => {
        img.onload = null;
      });
    };
  }, [heroFrames]);

  // Opening reveal — masked lines of the first caption plus the chrome.
  useEffect(() => {
    if (prefersReducedMotion()) return undefined;
    const tl = gsap.timeline({ delay: 0.15 });
    tl.from("[data-hero-chrome]", { opacity: 0, y: -14, duration: 0.9, stagger: 0.08 })
      .from("[data-hero-first] .hero-line", { yPercent: 118, duration: 1.3, stagger: 0.1, ease: "expo.out" }, 0.15)
      .from("[data-hero-first] [data-hero-kicker]", { opacity: 0, y: 16, duration: 0.9 }, 0.5)
      .from("[data-hero-cta]", { opacity: 0, y: 22, duration: 0.9 }, 0.7);
    return () => {
      tl.kill();
    };
  }, []);

  return (
    <section ref={wrapRef} className="relative h-[620vh] bg-ink" data-cursor="dark">
      <div className="sticky top-0 h-screen overflow-hidden">
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden="true" />

        {/* Legibility scrim + brand vignette */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink/60 via-ink/25 to-ink/85" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_0%,transparent_35%,rgba(21,28,23,0.65)_100%)]" />
        <div className="grain pointer-events-none absolute inset-0" />

        {/* Top chrome */}
        <div className="pointer-events-none absolute inset-x-0 top-24 z-20 hidden justify-between px-8 font-heading text-[10px] uppercase tracking-label text-sand/55 lg:flex">
          <span data-hero-chrome>25.2048° N · 55.2708° E</span>
          <span data-hero-chrome>Scroll to fly</span>
        </div>

        {/* Captions stack in one place; only their opacity is scroll-driven.
            The first is the page's real <h1>; the rest are the same message
            re-cut for the scroll and are hidden from assistive tech. */}
        <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 pb-8 pt-24">
          <div className="relative flex w-full flex-1 items-center justify-center">
            {captions.map((c, i) => {
              const Title = i === 0 ? "h1" : "p";
              return (
                <div
                  key={c.lines.join("")}
                  ref={(el) => {
                    captionsRef.current[i] = el;
                  }}
                  data-hero-first={i === 0 ? "" : undefined}
                  aria-hidden={i === 0 ? undefined : "true"}
                  className="absolute max-w-5xl text-center"
                  style={{ opacity: i === 0 ? 1 : 0 }}
                >
                  <span
                    data-hero-kicker
                    className="mx-auto inline-block rounded-full border border-sand/25 px-5 py-2 font-heading text-[9px] font-medium uppercase tracking-wider2 text-sand/80 backdrop-blur-sm"
                  >
                    {c.kicker}
                  </span>
                  <Title className={`mt-7 font-display text-sand ${c.size}`}>
                    {c.lines.map((line, k) => (
                      <span key={line} className="line-mask">
                        <span
                          className={`hero-line block ${k === c.accent ? "italic text-brass-light" : ""}`}
                        >
                          {line}
                        </span>
                      </span>
                    ))}
                  </Title>
                </div>
              );
            })}
          </div>

          <div data-hero-cta className="flex flex-wrap items-center justify-center gap-4 pb-16">
            <Pill to="/explorer" tone="sand" size="lg">
              Open the map
            </Pill>
            <Pill to="/#listings" tone="outlineLight" size="lg" arrow={false}>
              See listings
            </Pill>
          </div>
        </div>

        {/* Frame progress ticks */}
        <div className="absolute inset-x-0 bottom-7 z-20 mx-auto flex max-w-[14rem] gap-2 px-6">
          {captions.map((c, i) => (
            <span key={c.kicker} className="h-px flex-1 overflow-hidden bg-sand/20">
              <span
                ref={(el) => {
                  ticksRef.current[i] = el;
                }}
                className="block h-full w-full origin-left bg-brass"
                style={{ transform: "scaleX(0)" }}
              />
            </span>
          ))}
        </div>

        <div
          ref={cueRef}
          className="pointer-events-none absolute bottom-6 right-8 z-20 hidden items-center gap-2 font-heading text-[9px] uppercase tracking-label text-sand/55 sm:flex"
        >
          Scroll
          <ArrowDown className="h-3.5 w-3.5 animate-float-y" />
        </div>
      </div>
    </section>
  );
}
