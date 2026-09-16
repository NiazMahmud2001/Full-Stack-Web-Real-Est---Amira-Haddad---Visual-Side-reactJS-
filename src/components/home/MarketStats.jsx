import CountUp from "../../components/motion/CountUp";
import Reveal from "../../components/motion/Reveal";
import { useAgent, useAreas } from "../../context/ContentContext";
import { useProperties } from "../../hooks/useProperties";

export default function MarketStats() {
  const agent = useAgent();
  const { areas } = useAreas();
  const { properties } = useProperties(200);

  const stats = [
    {
      value: areas.length,
      suffix: "+",
      label: "Communities mapped across Dubai and Abu Dhabi"
    },
    {
      value: agent.yearsActive,
      suffix: " yrs",
      label: "On the ground between Deira and the Corniche"
    },
    {
      value: properties.length,
      suffix: "",
      label: "Addresses pinned in the live 3D map right now"
    },
    { value: 0, prefix: "AED ", suffix: "", label: "Cost to explore every listing on this site" }
  ];

  return (
    <section className="relative overflow-hidden bg-ink px-5 py-24 text-sand sm:px-8 sm:py-28" data-cursor="dark">
      <div className="grain absolute inset-0" />
      <div className="pointer-events-none absolute -left-32 top-1/2 h-[30rem] w-[30rem] -translate-y-1/2 rounded-full bg-forest/25 blur-[120px]" />
      <div className="pointer-events-none absolute -right-32 top-0 h-[26rem] w-[26rem] rounded-full bg-brass/15 blur-[120px]" />

      <div className="relative mx-auto max-w-[1400px]">
        <p className="font-heading text-[10px] uppercase tracking-label text-brass">By the numbers</p>
        <Reveal className="mt-12 grid gap-12 sm:grid-cols-2 lg:grid-cols-4" stagger={0.1} y={40}>
          {stats.map((s) => (
            <div key={s.label} className="border-t border-sand/15 pt-6">
              <p className="font-display text-6xl leading-none text-sand lg:text-7xl">
                <CountUp value={s.value} prefix={s.prefix || ""} suffix={s.suffix || ""} />
              </p>
              <p className="mt-5 max-w-[15rem] text-sm leading-relaxed text-sand/55">{s.label}</p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
