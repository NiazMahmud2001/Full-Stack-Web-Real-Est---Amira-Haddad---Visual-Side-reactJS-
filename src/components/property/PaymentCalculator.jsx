import { useMemo, useState } from "react";
import { Slider } from "../../components/ui/slider";
import { fullAed, monthlyPayment } from "../../lib/format";
import { ABU_DHABI } from "../../lib/areas";
import { useAreas } from "../../context/ContentContext";

const SLIDER_CLASS =
  "py-2 [&_[role=slider]]:h-5 [&_[role=slider]]:w-5 [&_[role=slider]]:border-ink/40 [&_[role=slider]]:shadow-lift";

// Transaction costs differ by emirate: Dubai registers a sale with the DLD and
// a tenancy with Ejari, Abu Dhabi with the DMT and Tawtheeq, and the headline
// transfer rate is 4% against 2%. These are the commonly quoted figures — the
// agent's own fee schedule is the source of truth, hence the disclaimer below.
const COSTS = {
  Dubai: {
    transferLabel: "DLD transfer",
    transferRate: 0.04,
    adminLabel: "Registration and trustee fees",
    adminFee: 5_250,
    agencyRate: 0.02,
    tenancyLabel: "Ejari registration",
    tenancyFee: 220
  },
  [ABU_DHABI]: {
    transferLabel: "DMT registration",
    transferRate: 0.02,
    adminLabel: "Registration and admin",
    adminFee: 1_000,
    agencyRate: 0.02,
    tenancyLabel: "Tawtheeq registration",
    tenancyFee: 1_000
  }
};

function Row({ label, value, strong = false }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-ink/10 py-3 last:border-0">
      <span className="font-heading text-[10px] uppercase tracking-label text-ink/50">{label}</span>
      <span className={strong ? "font-display text-2xl text-ink" : "text-sm font-medium text-ink"}>
        {value}
      </span>
    </div>
  );
}

export default function PaymentCalculator({ property }) {
  const { areaEmirate } = useAreas();
  const price = property.price_aed || 0;
  const isRent = property.listing_type === "rent";
  // Areas outside the registry fall back to the Dubai schedule.
  const emirate = areaEmirate(property.area);
  const costs = COSTS[emirate] || COSTS.Dubai;

  const [downPct, setDownPct] = useState(20);
  const [years, setYears] = useState(25);
  const [rate, setRate] = useState(4.25);
  const [cheques, setCheques] = useState(4);

  const sale = useMemo(() => {
    const deposit = (price * downPct) / 100;
    const loan = price - deposit;
    return {
      deposit,
      loan,
      monthly: monthlyPayment(loan, rate, years),
      upfront:
        deposit + price * costs.transferRate + price * costs.agencyRate + costs.adminFee
    };
  }, [price, downPct, rate, years, costs]);

  if (!price) return null;

  if (isRent) {
    const perCheque = price / cheques;
    return (
      <div className="rounded-[1.75rem] border border-ink/10 bg-sage p-7 sm:p-8">
        <p className="eyebrow">Rent breakdown</p>
        <h3 className="mt-3 font-display text-3xl text-ink">What it costs to move in</h3>

        <div className="mt-7 space-y-3">
          <p className="font-heading text-[10px] uppercase tracking-label text-ink/50">
            Cheques per year
          </p>
          <div className="flex flex-wrap gap-2">
            {[1, 2, 4, 12].map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCheques(c)}
                data-cursor="link"
                className={`rounded-full px-5 py-2 font-heading text-[10px] font-semibold uppercase tracking-label transition-colors duration-500 ${
                  cheques === c ? "bg-ink text-sand" : "border border-ink/20 text-ink-mute hover:border-ink hover:text-ink"
                }`}
              >
                {c === 12 ? "Monthly" : `${c} cheque${c > 1 ? "s" : ""}`}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-7">
          <Row label="Annual rent" value={fullAed(price)} />
          <Row label={`Each of ${cheques}`} value={fullAed(perCheque)} strong />
          <Row label="Security deposit (5%)" value={fullAed(price * 0.05)} />
          <Row label="Agency fee (5%)" value={fullAed(price * 0.05)} />
          <Row label={costs.tenancyLabel} value={fullAed(costs.tenancyFee)} />
          <Row
            label="Due before keys"
            value={fullAed(perCheque + price * 0.1 + costs.tenancyFee)}
            strong
          />
        </div>

        <p className="mt-6 text-xs leading-relaxed text-ink/45">
          Indicative only. Chiller, DEWA deposit and any furnishing premium are agreed with
          the landlord and are not included above.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-[1.75rem] border border-ink/10 bg-sage p-7 sm:p-8">
      <p className="eyebrow">Payment estimate</p>
      <h3 className="mt-3 font-display text-3xl text-ink">What this would cost you</h3>

      <div className="mt-8 space-y-7">
        <div>
          <div className="flex items-baseline justify-between">
            <span className="font-heading text-[10px] uppercase tracking-label text-ink/50">
              Down payment
            </span>
            <span className="text-sm font-medium text-ink">
              {downPct}% · {fullAed(sale.deposit)}
            </span>
          </div>
          <Slider
            value={[downPct]}
            min={20}
            max={80}
            step={5}
            onValueChange={([v]) => setDownPct(v)}
            aria-label="Down payment percentage"
            className={`mt-3 ${SLIDER_CLASS}`}
          />
        </div>

        <div>
          <div className="flex items-baseline justify-between">
            <span className="font-heading text-[10px] uppercase tracking-label text-ink/50">
              Term
            </span>
            <span className="text-sm font-medium text-ink">{years} years</span>
          </div>
          <Slider
            value={[years]}
            min={5}
            max={25}
            step={1}
            onValueChange={([v]) => setYears(v)}
            aria-label="Mortgage term in years"
            className={`mt-3 ${SLIDER_CLASS}`}
          />
        </div>

        <div>
          <div className="flex items-baseline justify-between">
            <span className="font-heading text-[10px] uppercase tracking-label text-ink/50">
              Interest rate
            </span>
            <span className="text-sm font-medium text-ink">{rate.toFixed(2)}%</span>
          </div>
          <Slider
            value={[rate]}
            min={2.5}
            max={8}
            step={0.05}
            onValueChange={([v]) => setRate(v)}
            aria-label="Annual interest rate"
            className={`mt-3 ${SLIDER_CLASS}`}
          />
        </div>
      </div>

      <div className="mt-8">
        <Row label="Monthly repayment" value={fullAed(sale.monthly)} strong />
        <Row label="Loan amount" value={fullAed(sale.loan)} />
        <Row
          label={`${costs.transferLabel} (${costs.transferRate * 100}%)`}
          value={fullAed(price * costs.transferRate)}
        />
        <Row
          label={`Agency fee (${costs.agencyRate * 100}%)`}
          value={fullAed(price * costs.agencyRate)}
        />
        <Row label={costs.adminLabel} value={fullAed(costs.adminFee)} />
        <Row label="Cash needed up front" value={fullAed(sale.upfront)} strong />
      </div>

      <p className="mt-6 text-xs leading-relaxed text-ink/45">
        Indicative only and not a mortgage offer. Government fees shown are the{" "}
        {emirate || "Dubai"} schedule. Non-residents are usually capped at a 50%
        loan-to-value; bank arrangement and valuation fees are excluded.
      </p>
    </div>
  );
}
