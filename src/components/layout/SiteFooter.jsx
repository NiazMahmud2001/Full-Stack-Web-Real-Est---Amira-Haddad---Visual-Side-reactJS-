import { Link } from "react-router-dom";
import { useAgent, useAreas } from "@/context/ContentContext";
import Marquee from "@/components/motion/Marquee";
import Reveal from "@/components/motion/Reveal";

const YEAR = new Date().getFullYear();

export default function SiteFooter() {
  const agent = useAgent();
  const { dubaiAreas, abuDhabiAreas } = useAreas();
  // A few from each emirate rather than the top of one list.
  const topAreas = [...dubaiAreas.slice(0, 5), ...abuDhabiAreas.slice(0, 4)];

  return (
    <footer className="relative overflow-hidden bg-ink text-sand">
      <div className="grain absolute inset-0" />

      <Marquee className="border-y border-sand/10 py-6" speed={26} trackClassName="gap-10">
        {[0, 1, 2].map((n) => (
          <span key={n} className="flex shrink-0 items-center gap-10">
            <span className="font-display text-4xl text-sand/85 sm:text-6xl">Let&apos;s find your address</span>
            <span className="h-2 w-2 shrink-0 rounded-full bg-brass" />
            <span className="font-display text-4xl italic text-brass sm:text-6xl">Dubai</span>
            <span className="h-2 w-2 shrink-0 rounded-full bg-brass" />
            <span className="font-display text-4xl text-sand/85 sm:text-6xl">Let&apos;s find your address</span>
            <span className="h-2 w-2 shrink-0 rounded-full bg-brass" />
            <span className="font-display text-4xl italic text-brass sm:text-6xl">Abu Dhabi</span>
            <span className="h-2 w-2 shrink-0 rounded-full bg-brass" />
          </span>
        ))}
      </Marquee>

      <div className="relative mx-auto max-w-[1400px] px-5 py-16 sm:px-8">
        <Reveal className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]" stagger={0.08}>
          <div>
            <p className="font-display text-3xl">{agent.name}</p>
            <p className="mt-2 font-heading text-[10px] uppercase tracking-label text-sand/50">
              {agent.role} · {agent.licence}
            </p>
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-sand/65">{agent.tagline}</p>
          </div>

          <div>
            <p className="font-heading text-[10px] uppercase tracking-label text-brass">Contact</p>
            <ul className="mt-5 space-y-2.5 text-sm text-sand/70">
              <li>
                <a href={`tel:${agent.phone.replace(/\s/g, "")}`} className="link-underline" data-cursor="link">
                  {agent.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${agent.email}`} className="link-underline" data-cursor="link">
                  {agent.email}
                </a>
              </li>
              <li className="text-sand/45">{agent.officeHours}</li>
            </ul>
          </div>

          <div>
            <p className="font-heading text-[10px] uppercase tracking-label text-brass">Areas</p>
            <ul className="mt-5 grid gap-2 text-sm text-sand/70">
              {topAreas.map((a) => (
                <li key={a.name}>
                  <Link to="/explorer" className="link-underline" data-cursor="link">
                    {a.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-heading text-[10px] uppercase tracking-label text-brass">Elsewhere</p>
            <ul className="mt-5 space-y-2.5 text-sm text-sand/70">
              {agent.socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="link-underline"
                    data-cursor="link"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
              <li>
                <Link to="/explorer" className="link-underline" data-cursor="link">
                  Map + Chat
                </Link>
              </li>
              <li>
                <Link to="/login" className="link-underline" data-cursor="link">
                  Sign in
                </Link>
              </li>
            </ul>
          </div>
        </Reveal>

        <div className="mt-16 flex flex-col gap-3 border-t border-sand/10 pt-8 font-heading text-[10px] uppercase tracking-label text-sand/40 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {YEAR} {agent.brand}
          </p>
          <p>{agent.agency}</p>
          <p>Built with React, GSAP &amp; MapLibre</p>
        </div>
      </div>
    </footer>
  );
}
