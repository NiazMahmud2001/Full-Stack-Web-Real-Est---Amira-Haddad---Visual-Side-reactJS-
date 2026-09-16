import { MessagesSquare, Building2, Compass } from "lucide-react";
import TiltCard from "../../components/motion/TiltCard";
import Reveal from "../../components/motion/Reveal";
import SplitHeading from "../../components/motion/SplitHeading";

const items = [
  {
    icon: MessagesSquare,
    title: "Chat-led search",
    text: "Say what you want the way you would say it out loud — budget, bedrooms, a school, a marina view. The map answers instead of a filter panel.",
    meta: "01 / Conversation"
  },
  {
    icon: Building2,
    title: "A true 3D city",
    text: "Real building geometry from Deira to the Corniche, extruded and tilted. You can read the height of the block next door before you ever book a viewing.",
    meta: "02 / Context"
  },
  {
    icon: Compass,
    title: "Listings in place",
    text: "Every property is pinned exactly where it stands with its asking price on the pin, so distance, noise and outlook stop being a guess.",
    meta: "03 / Certainty"
  }
];

export default function FeatureGrid() {
  return (
    <section className="bg-sand px-5 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-[1400px]">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow">Why it works</p>
            <SplitHeading className="mt-4 max-w-lg font-display text-4xl leading-[1.05] text-ink sm:text-6xl">
              Three things a portal never gives you
            </SplitHeading>
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-ink-mute">
            Built around how buyers actually decide: where is it, what is around it, and
            what will it really cost.
          </p>
        </div>

        <Reveal className="mt-16 grid gap-5 lg:grid-cols-3" stagger={0.12} y={48}>
          {items.map((item) => (
            <TiltCard
              key={item.title}
              className="group relative overflow-hidden rounded-[1.75rem] border border-ink/10 bg-sage p-8 shadow-lift transition-colors duration-700"
            >
              {/* Specular highlight follows the pointer via --mx / --my. */}
              <span
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
                style={{
                  background:
                    "radial-gradient(340px circle at var(--mx,50%) var(--my,50%), rgba(176,141,87,0.22), transparent 65%)"
                }}
              />
              <div className="relative flex h-full flex-col">
                <span className="font-heading text-[9px] uppercase tracking-label text-brass-deep">
                  {item.meta}
                </span>
                <span className="mt-8 flex h-12 w-12 items-center justify-center rounded-2xl bg-ink text-sand transition-transform duration-700 ease-expo group-hover:scale-110 group-hover:rotate-3">
                  <item.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-7 font-display text-2xl text-ink">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-mute">{item.text}</p>
              </div>
            </TiltCard>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
