export function propertyPinHtml(property, highlighted) {
  const img = property.image_url || "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=200";
  const price = property.price_aed
    ? (property.price_aed >= 1000000
        ? `${(property.price_aed / 1000000).toFixed(1)}M`
        : `${Math.round(property.price_aed / 1000)}K`)
    : "";
  // Brand pin: ink card, brass ring and price bar when the area is in focus.
  const frame = highlighted ? "border-brass" : "border-sand";
  const bar = highlighted ? "bg-brass text-ink" : "bg-sand text-ink";
  const tail = highlighted ? "border-t-brass" : "border-t-sand";
  return `
    <div class="flex cursor-pointer flex-col items-center transition-transform duration-500 ${highlighted ? "scale-110" : ""}">
      <div class="overflow-hidden rounded-xl border-2 ${frame} bg-sand shadow-[0_10px_24px_-10px_rgba(21,28,23,0.75)]">
        <img src="${img}" alt="" class="block h-12 w-16 object-cover" />
        <div class="${bar} px-1 py-0.5 text-center text-[10px] font-semibold tracking-wide">AED ${price}</div>
      </div>
      <div class="h-0 w-0 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent ${tail}"></div>
    </div>`;
}
