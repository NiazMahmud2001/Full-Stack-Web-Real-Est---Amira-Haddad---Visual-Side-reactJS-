import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, MessagesSquare, X } from "lucide-react";
import { gsap, prefersReducedMotion } from "../../lib/gsap";
import { scrollToTarget } from "../../components/motion/SmoothScroll";
import { useAgent } from "../../context/ContentContext";
import Pill from "../../components/common/Pill";

const SECTIONS = [
  { label: "Listings", hash: "#listings" },
  { label: "Approach", hash: "#approach" },
  { label: "Areas", hash: "#areas" },
  { label: "About", hash: "#about" },
  { label: "Enquire", hash: "#enquire" }
];

function Wordmark({ light = false }) {
  const agent = useAgent();

  return (
    <Link
      to="/"
      data-cursor="link"
      className="group flex items-center gap-3"
      aria-label={`${agent.name} — home`}
    >
      <span
        className={`grid h-9 w-9 shrink-0 place-items-center rounded-full border text-[11px] font-semibold tracking-wider transition-colors duration-500 ${
          light
            ? "border-sand/40 text-sand group-hover:border-brass group-hover:text-brass"
            : "border-ink/25 text-ink group-hover:border-brass group-hover:text-brass"
        }`}
      >
        {agent.initials}
      </span>
      <span className="leading-none">
        <span
          className={`block font-display text-lg tracking-tight ${light ? "text-sand" : "text-ink"}`}
        >
          {agent.name}
        </span>
        <span
          className={`mt-0.5 block font-heading text-[9px] font-medium uppercase tracking-wider2 ${
            light ? "text-sand/60" : "text-ink-mute"
          }`}
        >
          UAE Real Estate
        </span>
      </span>
    </Link>
  );
}

/**
 * `docked` keeps the original in-flow 56px bar the map/chat explorer lays out
 * around. `floating` is the marketing-page bar: transparent over the hero,
 * frosted once you scroll, and tucked away while scrolling down.
 */
export default function NavBar({ variant = "docked" }) {
  const agent = useAgent();
  const { pathname } = useLocation();
  const barRef = useRef(null);
  const menuRef = useRef(null);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  const floating = variant === "floating";

  // Frost the bar once past the fold and hide it while scrolling down.
  useEffect(() => {
    if (!floating) return undefined;
    const bar = barRef.current;
    let last = window.scrollY;

    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      if (!prefersReducedMotion() && bar) {
        const goingDown = y > last && y > 220;
        gsap.to(bar, {
          yPercent: goingDown && !open ? -140 : 0,
          duration: 0.55,
          ease: "expo.out",
          overwrite: true
        });
      }
      last = y;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [floating, open]);

  // Staggered reveal for the full-screen mobile menu.
  useEffect(() => {
    const menu = menuRef.current;
    if (!menu) return undefined;
    if (prefersReducedMotion()) return undefined;

    const items = menu.querySelectorAll("[data-menu-item]");
    const tl = gsap.timeline();
    tl.fromTo(menu, { clipPath: "inset(0% 0% 100% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.7, ease: "expo.out" })
      .from(items, { yPercent: 120, opacity: 0, duration: 0.7, stagger: 0.06, ease: "expo.out" }, "-=0.35");

    return () => {
      tl.kill();
    };
  }, [open]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => setOpen(false), [pathname]);

  const jump = (hash) => (event) => {
    setOpen(false);
    if (pathname !== "/") return; // let the router navigate to /#section
    event.preventDefault();
    scrollToTarget(hash, { offset: -80 });
  };

  if (!floating) {
    return (
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-ink/10 bg-sage px-4">
        <Wordmark />
        <nav className="flex items-center gap-2">
          <Link
            to="/explorer"
            data-cursor="link"
            className={`flex items-center gap-2 rounded-full px-4 py-2 font-heading text-[10px] font-semibold uppercase tracking-label transition-colors duration-500 ${
              pathname === "/explorer"
                ? "bg-ink text-sand"
                : "bg-sand text-ink-mute hover:bg-white hover:text-ink"
            }`}
          >
            <MessagesSquare className="h-3.5 w-3.5" />
            Map + Chat
          </Link>
          <Link
            to="/login"
            data-cursor="link"
            className="hidden rounded-full px-4 py-2 font-heading text-[10px] font-semibold uppercase tracking-label text-ink-mute transition-colors hover:text-ink sm:block"
          >
            Sign in
          </Link>
        </nav>
      </header>
    );
  }

  // Both marketing pages open on a dark hero, so the bar starts light and
  // flips to ink once it frosts over the page background. The open menu is
  // dark too, so it puts the bar back into light mode.
  const frosted = scrolled && !open;
  const light = !frosted;

  return (
    <>
      <header
        ref={barRef}
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
          frosted ? "glass border-b border-ink/10" : "border-b border-transparent"
        }`}
      >
        <div className="mx-auto flex h-20 max-w-[1400px] items-center justify-between px-5 sm:px-8">
          <Wordmark light={light} />

          <nav className="hidden items-center gap-1 lg:flex">
            {SECTIONS.map((s) => (
              <Link
                key={s.hash}
                to={`/${s.hash}`}
                onClick={jump(s.hash)}
                data-cursor="link"
                className={`relative px-4 py-2 font-heading text-[10px] font-semibold uppercase tracking-label transition-colors duration-500 ${
                  light ? "text-sand/70 hover:text-sand" : "text-ink-mute hover:text-ink"
                }`}
              >
                <span className="link-underline">{s.label}</span>
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <Pill
              to="/explorer"
              size="sm"
              tone={light ? "sand" : "ink"}
              arrow={false}
              className="hidden sm:inline-flex"
            >
              <MessagesSquare className="h-3.5 w-3.5" />
              Map + Chat
            </Pill>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              data-cursor="link"
              className={`grid h-11 w-11 place-items-center rounded-full border transition-colors duration-500 lg:hidden ${
                light
                  ? "border-sand/35 text-sand hover:bg-sand hover:text-ink"
                  : "border-ink/20 text-ink hover:border-ink hover:bg-ink hover:text-sand"
              }`}
            >
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </header>

      {open && (
        <div ref={menuRef} className="fixed inset-0 z-40 bg-ink px-6 pb-10 pt-28 lg:hidden">
          <nav className="flex flex-col">
            {SECTIONS.map((s) => (
              <span key={s.hash} className="line-mask border-b border-sand/10 py-1">
                <Link
                  data-menu-item
                  to={`/${s.hash}`}
                  onClick={jump(s.hash)}
                  className="block py-3 font-display text-4xl text-sand transition-colors hover:text-brass"
                >
                  {s.label}
                </Link>
              </span>
            ))}
            <span className="line-mask border-b border-sand/10 py-1">
              <Link
                data-menu-item
                to="/explorer"
                className="block py-3 font-display text-4xl text-brass"
              >
                Map + Chat
              </Link>
            </span>
          </nav>
          <div data-menu-item className="mt-10 space-y-1 font-heading text-[11px] uppercase tracking-label text-sand/50">
            <p>{agent.phone}</p>
            <p>{agent.email}</p>
            <p>{agent.licence}</p>
          </div>
        </div>
      )}
    </>
  );
}
