import { Image } from "../../components/ui/image";
import { useAgent, useMedia } from "../../context/ContentContext";
import Parallax from "../../components/motion/Parallax";
import SplitHeading from "../../components/motion/SplitHeading";
import Reveal from "../../components/motion/Reveal";
import Pill from "../../components/common/Pill";

export default function HomeCta() {
  const agent = useAgent();
  const { photo } = useMedia();

  return (
    <section className="relative overflow-hidden bg-ink" data-cursor="dark">
      <div className="absolute inset-0">
        <Parallax speed={0.3} className="absolute left-0 right-0 -top-[10%] h-[120%]">
          <Image src={photo.dubaiNight} alt="" aria-hidden="true" className="h-full w-full object-cover opacity-45" />
        </Parallax>
        <div className="absolute inset-0 bg-gradient-to-b from-ink/85 via-ink/70 to-ink" />
        <div className="grain absolute inset-0" />
      </div>

      <div className="relative mx-auto max-w-[1400px] px-5 py-32 text-center sm:px-8 sm:py-44">
        <p className="font-heading text-[10px] uppercase tracking-label text-brass">
          One conversation away
        </p>
        <SplitHeading className="mx-auto mt-6 max-w-4xl font-display text-[13vw] leading-[0.95] text-sand sm:text-[7vw] lg:text-[6.5rem]">
          Open the map and start talking
        </SplitHeading>
        <Reveal className="mt-10 flex flex-wrap items-center justify-center gap-4" stagger={0.08} y={24}>
          <Pill to="/explorer" tone="sand" size="lg">
            Map + Chat
          </Pill>
          <Pill href={`tel:${agent.phone.replace(/\s/g, "")}`} tone="outlineLight" size="lg" arrow={false}>
            Call {agent.phone}
          </Pill>
        </Reveal>
        <p className="mt-10 font-heading text-[10px] uppercase tracking-label text-sand/40">
          {agent.name} · {agent.licence} · {agent.officeHours}
        </p>
      </div>
    </section>
  );
}
