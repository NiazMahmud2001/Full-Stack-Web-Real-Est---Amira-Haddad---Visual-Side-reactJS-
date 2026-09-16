import { Check, Phone } from "lucide-react";
import { Image } from "../../components/ui/image";
import { useAgent, useMedia } from "../../context/ContentContext";
import SplitHeading from "../../components/motion/SplitHeading";
import Reveal from "../../components/motion/Reveal";
import Parallax from "../../components/motion/Parallax";
import Pill from "../../components/common/Pill";

export default function AgentProfile() {
  const agent = useAgent();
  const { photo } = useMedia();

  return (
    <section id="about" className="relative overflow-hidden bg-sand px-5 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto grid max-w-[1400px] gap-16 lg:grid-cols-[1fr_1.1fr] lg:gap-24">
        {/* Collage — the tall plate drifts against the scroll, the inset one
            is driven by Locomotive's own data-scroll parallax. */}
        <div className="relative">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-ink/10 bg-sage">
            <Parallax speed={0.22} className="absolute left-0 right-0 -top-[8%] h-[116%]">
              <Image src={photo.downtownSkyline} alt="Downtown Dubai skyline" className="h-full w-full object-cover" />
            </Parallax>
            <div className="grain pointer-events-none absolute inset-0" />
          </div>

          <div
            data-scroll
            data-scroll-speed="0.08"
            className="absolute -bottom-10 -right-4 hidden w-52 overflow-hidden rounded-[1.5rem] border border-ink/10 shadow-lift sm:block lg:-right-10 lg:w-64"
          >
            <Image src={photo.lounge} alt="Interior of a UAE apartment" className="h-56 w-full object-cover lg:h-64" />
          </div>

          <div className="absolute -left-4 top-8 hidden rounded-2xl bg-ink px-5 py-4 text-sand shadow-lift lg:block">
            <p className="font-display text-3xl leading-none">{agent.yearsActive}</p>
            <p className="mt-1 font-heading text-[9px] uppercase tracking-label text-sand/60">
              years in the UAE
            </p>
          </div>
        </div>

        <div>
          <p className="eyebrow">Who you are dealing with</p>
          <SplitHeading className="mt-4 font-display text-4xl leading-[1.05] text-ink sm:text-6xl">
            {agent.name}
          </SplitHeading>
          <p className="mt-3 font-heading text-[10px] uppercase tracking-label text-brass-deep">
            {agent.role} · {agent.licence}
          </p>

          <Reveal className="mt-8 space-y-5" stagger={0.1} y={26}>
            {agent.bio.map((p) => (
              <p key={p.slice(0, 24)} className="max-w-xl text-[0.95rem] leading-relaxed text-ink-mute">
                {p}
              </p>
            ))}
          </Reveal>

          <Reveal className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-ink/10 bg-ink/10" stagger={0.08} y={20}>
            {agent.credentials.map((c) => (
              <div key={c.label} className="flex items-start gap-4 bg-sage px-6 py-5">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-brass-deep" />
                <div>
                  <p className="font-heading text-sm font-semibold text-ink">{c.label}</p>
                  <p className="mt-1 text-sm text-ink-mute">{c.detail}</p>
                </div>
              </div>
            ))}
          </Reveal>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Pill href={`tel:${agent.phone.replace(/\s/g, "")}`} tone="ink" arrow={false}>
              <Phone className="h-3.5 w-3.5" />
              {agent.phone}
            </Pill>
            <Pill to="/#enquire" tone="outline">
              Send a brief
            </Pill>
            <p className="font-heading text-[10px] uppercase tracking-label text-ink/40">
              {agent.languages.join(" · ")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
