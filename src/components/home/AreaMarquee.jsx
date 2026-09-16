import { Link } from "react-router-dom";
import { useAreas } from "../../context/ContentContext";
import Marquee from "../../components/motion/Marquee";
import SplitHeading from "../../components/motion/SplitHeading";

function Row({ areas, speed, reverse = false }) {
  return (
    <Marquee reverse={reverse} speed={speed} trackClassName="gap-8 pr-8">
      {areas.map((a) => (
        <Link
          key={a.name}
          to="/explorer"
          data-cursor="link"
          className="group flex shrink-0 items-center gap-8 whitespace-nowrap"
        >
          <span className="font-display text-4xl text-ink/70 transition-colors duration-500 group-hover:text-brass-deep sm:text-6xl">
            {a.name}
          </span>
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-ink/25 transition-colors duration-500 group-hover:bg-brass" />
        </Link>
      ))}
    </Marquee>
  );
}

function Band({ label, children }) {
  return (
    <div>
      <p className="mx-auto mb-3 max-w-[1400px] px-5 font-heading text-[10px] uppercase tracking-label text-brass-deep sm:px-8">
        {label}
      </p>
      <div className="space-y-5">{children}</div>
    </div>
  );
}

export default function AreaMarquee() {
  const { dubaiAreas, abuDhabiAreas } = useAreas();
  const half = Math.ceil(dubaiAreas.length / 2);

  return (
    <section id="areas" className="overflow-hidden bg-sage py-24 sm:py-32">
      <div className="mx-auto mb-14 flex max-w-[1400px] flex-wrap items-end justify-between gap-6 px-5 sm:px-8">
        <div>
          <p className="eyebrow">Coverage</p>
          <SplitHeading className="mt-4 max-w-xl font-display text-4xl leading-[1.05] text-ink sm:text-6xl">
            Every community, one sentence away
          </SplitHeading>
        </div>
        <p className="max-w-xs text-sm leading-relaxed text-ink-mute">
          Dubai and Abu Dhabi, end to end. Say any of these to the chat and the camera is
          there before you finish typing.
        </p>
      </div>

      <div className="space-y-10">
        <Band label="Dubai">
          <Row areas={dubaiAreas.slice(0, half)} speed={34} />
          <Row areas={dubaiAreas.slice(half)} speed={38} reverse />
        </Band>
        <Band label="Abu Dhabi">
          <Row areas={abuDhabiAreas} speed={36} reverse />
        </Band>
      </div>
    </section>
  );
}
