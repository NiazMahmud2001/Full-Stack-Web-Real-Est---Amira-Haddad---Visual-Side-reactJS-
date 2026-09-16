// Shared number/price formatting so every surface prints AED the same way.

/** 2450000 -> "2.45M", 850000 -> "850K". */
export function compactAed(value) {
  if (!value && value !== 0) return "—";
  if (value >= 1_000_000) {
    const m = value / 1_000_000;
    return `${m >= 10 ? m.toFixed(1) : m.toFixed(2).replace(/0$/, "")}M`;
  }
  if (value >= 1_000) return `${Math.round(value / 1_000)}K`;
  return String(value);
}

/** 2450000 -> "AED 2,450,000". */
export function fullAed(value) {
  if (!value && value !== 0) return "Price on application";
  return `AED ${Math.round(value).toLocaleString("en-AE")}`;
}

/** "per year" for rentals, empty for sales — keeps price blocks consistent. */
export function priceSuffix(listingType) {
  return listingType === "rent" ? "per year" : "";
}

/** 1450 -> "1,450 sqft". */
export function sqft(value) {
  if (!value) return "—";
  return `${Math.round(value).toLocaleString("en-AE")} sqft`;
}

/** AED per square foot, the number Dubai buyers actually compare on. */
export function pricePerSqft(price, size) {
  if (!price || !size) return null;
  return Math.round(price / size);
}

/** Flat monthly payment for a repayment mortgage. */
export function monthlyPayment(principal, annualRatePct, years) {
  const r = annualRatePct / 100 / 12;
  const n = years * 12;
  if (!principal || n <= 0) return 0;
  if (r === 0) return principal / n;
  return (principal * r) / (1 - Math.pow(1 + r, -n));
}
