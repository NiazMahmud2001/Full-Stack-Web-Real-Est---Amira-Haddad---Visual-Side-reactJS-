import { useMemo, useRef, useState } from "react";
import confetti from "canvas-confetti";
import { ArrowRight, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Slider } from "../../components/ui/slider";
import { useAgent, useAreas } from "../../context/ContentContext";
import { fullAed } from "../../lib/format";
import SplitHeading from "../../components/motion/SplitHeading";
import Reveal from "../../components/motion/Reveal";
import Pill from "../../components/common/Pill";

const PROPERTY_TYPES = ["apartment", "villa", "townhouse", "penthouse", "studio", "office"];
const BEDROOMS = [
  { label: "Any", value: "" },
  { label: "Studio", value: "0" },
  { label: "1", value: "1" },
  { label: "2", value: "2" },
  { label: "3", value: "3" },
  { label: "4", value: "4" },
  { label: "5+", value: "5" }
];

// Buying and renting live on completely different scales, so the slider
// re-ranges when the intent changes.
const BUDGET = {
  sale: { min: 400_000, max: 40_000_000, step: 50_000, start: 2_500_000 },
  rent: { min: 20_000, max: 1_000_000, step: 5_000, start: 140_000 }
};

const emptyForm = {
  full_name: "",
  email: "",
  phone: "",
  area: "",
  message: ""
};

function Chip({ active, children, ...rest }) {
  return (
    <button
      type="button"
      data-cursor="link"
      className={`rounded-full px-4 py-2 font-heading text-[10px] font-semibold uppercase tracking-label transition-colors duration-400 ${
        active
          ? "bg-ink text-sand"
          : "border border-ink/20 bg-transparent text-ink-mute hover:border-ink hover:text-ink"
      }`}
      {...rest}
    >
      {children}
    </button>
  );
}

export default function InquiryForm() {
  const agent = useAgent();
  const { areas } = useAreas();
  const [form, setForm] = useState(emptyForm);
  const [listingType, setListingType] = useState("sale");
  const [propertyType, setPropertyType] = useState("apartment");
  const [bedrooms, setBedrooms] = useState("");
  const [budget, setBudget] = useState(BUDGET.sale.start);
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const cardRef = useRef(null);

  const range = BUDGET[listingType];
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const summary = useMemo(() => {
    const bed = BEDROOMS.find((b) => b.value === bedrooms);
    const bedText = !bedrooms ? "any size" : bed?.value === "0" ? "a studio" : `${bed?.label} bed`;
    return `${listingType === "rent" ? "Renting" : "Buying"} · ${bedText} · ${propertyType} · up to ${fullAed(budget)}${
      form.area ? ` · ${form.area}` : ""
    }`;
  }, [listingType, bedrooms, propertyType, budget, form.area]);

  const switchIntent = (next) => {
    setListingType(next);
    setBudget(BUDGET[next].start);
  };

  const celebrate = () => {
    const rect = cardRef.current?.getBoundingClientRect();
    confetti({
      particleCount: 70,
      spread: 68,
      startVelocity: 34,
      scalar: 0.8,
      ticks: 160,
      colors: ["#B08D57", "#2F5D48", "#D2DAD5", "#151C17"],
      origin: rect
        ? {
            x: (rect.left + rect.width / 2) / window.innerWidth,
            y: (rect.top + rect.height / 3) / window.innerHeight
          }
        : { y: 0.5 }
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");

    const payload = {
      ...form,
      listing_type: listingType,
      property_type: propertyType,
      bedrooms: bedrooms === "" ? undefined : Number(bedrooms),
      budget_aed: budget,
      submitted_at: new Date().toISOString()
    };

    try {
      // TODO: send `payload` to a real endpoint (Formspree, your own API, etc.)
      console.log("Inquiry submitted:", payload);
      await new Promise((r) => setTimeout(r, 700));

      setStatus("sent");
      setForm(emptyForm);
      celebrate();
    } catch {
      setStatus("error");
    }
  };

  return (
    <section id="enquire" className="bg-sand px-5 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-[1400px]">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.4fr]">
          {/* Left rail */}
          <div className="flex flex-col justify-between rounded-[2rem] bg-ink p-8 text-sand sm:p-10" data-cursor="dark">
            <div>
              <p className="font-heading text-[10px] uppercase tracking-label text-brass">Enquire</p>
              <SplitHeading className="mt-4 font-display text-4xl leading-[1.05] sm:text-5xl">
                Tell me what you are looking for
              </SplitHeading>
              <p className="mt-6 max-w-sm text-sm leading-relaxed text-sand/60">
                The same three things the chatbot asks for — budget, area, property type.
                Answer them here and the shortlist comes back by email instead.
              </p>
            </div>

            <ul className="mt-12 space-y-5 border-t border-sand/15 pt-8 text-sm text-sand/70">
              {[
                "A reply within one working day",
                "Three to five matched addresses, with the honest drawbacks",
                "No cold calls, ever"
              ].map((line) => (
                <li key={line} className="flex items-start gap-3">
                  <ArrowRight className="mt-1 h-3.5 w-3.5 shrink-0 text-brass" />
                  {line}
                </li>
              ))}
            </ul>

            <p className="mt-10 font-heading text-[10px] uppercase tracking-label text-sand/40">
              {agent.phone} · {agent.officeHours}
            </p>
          </div>

          {/* Form */}
          <div ref={cardRef} className="rounded-[2rem] border border-ink/10 bg-sage p-7 sm:p-10">
            {status === "sent" ? (
              <Reveal className="flex h-full min-h-[26rem] flex-col items-center justify-center text-center">
                <CheckCircle2 className="h-10 w-10 text-forest" />
                <p className="mt-6 font-display text-4xl text-ink">Brief received</p>
                <p className="mt-3 max-w-sm text-sm leading-relaxed text-ink-mute">
                  Thank you — it is with me now. Expect a shortlist within one working day.
                  In the meantime the map is the fastest way to keep looking.
                </p>
                <div className="mt-9 flex flex-wrap justify-center gap-4">
                  <Pill to="/explorer">Open the map</Pill>
                  <Pill tone="outline" arrow={false} onClick={() => setStatus("idle")}>
                    Send another
                  </Pill>
                </div>
              </Reveal>
            ) : (
              <form onSubmit={onSubmit} className="grid gap-7">
                {/* Intent */}
                <div className="space-y-3">
                  <Label className="eyebrow">I am looking to</Label>
                  <div className="inline-flex rounded-full border border-ink/15 bg-sand p-1">
                    {["sale", "rent"].map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => switchIntent(t)}
                        data-cursor="link"
                        className={`rounded-full px-7 py-2.5 font-heading text-[10px] font-semibold uppercase tracking-label transition-colors duration-500 ${
                          listingType === t ? "bg-ink text-sand" : "text-ink-mute hover:text-ink"
                        }`}
                      >
                        {t === "sale" ? "Buy" : "Rent"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Property type */}
                <div className="space-y-3">
                  <Label className="eyebrow">Property type</Label>
                  <div className="flex flex-wrap gap-2">
                    {PROPERTY_TYPES.map((t) => (
                      <Chip key={t} active={propertyType === t} onClick={() => setPropertyType(t)}>
                        {t}
                      </Chip>
                    ))}
                  </div>
                </div>

                {/* Bedrooms */}
                <div className="space-y-3">
                  <Label className="eyebrow">Bedrooms</Label>
                  <div className="flex flex-wrap gap-2">
                    {BEDROOMS.map((b) => (
                      <Chip key={b.label} active={bedrooms === b.value} onClick={() => setBedrooms(b.value)}>
                        {b.label}
                      </Chip>
                    ))}
                  </div>
                </div>

                {/* Budget */}
                <div className="space-y-4">
                  <div className="flex items-baseline justify-between gap-4">
                    <Label className="eyebrow">
                      Budget {listingType === "rent" ? "per year" : ""}
                    </Label>
                    <span className="font-display text-2xl text-ink">{fullAed(budget)}</span>
                  </div>
                  <Slider
                    value={[budget]}
                    min={range.min}
                    max={range.max}
                    step={range.step}
                    onValueChange={([v]) => setBudget(v)}
                    aria-label="Budget in AED"
                    className="py-2 [&_[role=slider]]:h-5 [&_[role=slider]]:w-5 [&_[role=slider]]:border-ink/40 [&_[role=slider]]:shadow-lift"
                  />
                  <div className="flex justify-between font-heading text-[10px] uppercase tracking-label text-ink/40">
                    <span>{fullAed(range.min)}</span>
                    <span>{fullAed(range.max)}+</span>
                  </div>
                </div>

                <div className="rule" />

                {/* Contact */}
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="full_name" className="eyebrow">
                      Full name
                    </Label>
                    <Input
                      id="full_name"
                      required
                      value={form.full_name}
                      onChange={set("full_name")}
                      className="h-11 rounded-xl border-ink/15 bg-sand"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="eyebrow">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={form.email}
                      onChange={set("email")}
                      className="h-11 rounded-xl border-ink/15 bg-sand"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="eyebrow">
                      Phone
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={form.phone}
                      onChange={set("phone")}
                      className="h-11 rounded-xl border-ink/15 bg-sand"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="area" className="eyebrow">
                      Preferred area
                    </Label>
                    <Input
                      id="area"
                      list="dubai-areas"
                      placeholder="Dubai Marina"
                      value={form.area}
                      onChange={set("area")}
                      className="h-11 rounded-xl border-ink/15 bg-sand"
                    />
                    <datalist id="dubai-areas">
                      {areas.map((a) => (
                        <option key={a.name} value={a.name} />
                      ))}
                    </datalist>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message" className="eyebrow">
                    Anything else
                  </Label>
                  <Textarea
                    id="message"
                    rows={4}
                    placeholder="Timeline, school catchment, must-haves, mortgage status…"
                    value={form.message}
                    onChange={set("message")}
                    className="resize-none rounded-xl border-ink/15 bg-sand"
                  />
                </div>

                <p className="font-heading text-[10px] uppercase tracking-label text-ink/45">
                  {summary}
                </p>

                {status === "error" && (
                  <p className="flex items-center gap-2 rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    That did not send. Please try again, or email {agent.email}.
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-4">
                  <Pill type="submit" size="lg" disabled={status === "sending"} arrow={status !== "sending"}>
                    {status === "sending" ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="h-3.5 w-3.5 animate-spin" /> Sending
                      </span>
                    ) : (
                      "Send enquiry"
                    )}
                  </Pill>
                  <p className="text-xs text-ink/45">No spam. Your details stay with me.</p>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}