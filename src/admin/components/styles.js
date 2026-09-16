// Class names shared by the admin screens, so every label, field and button
// looks the same.

export const LABEL =
  "font-heading text-[10px] font-semibold uppercase tracking-label text-ink-mute";

export const INPUT =
  "h-11 w-full rounded-xl border border-ink/15 bg-sand px-3 text-sm text-ink outline-none transition-colors placeholder:text-ink/35 focus:border-brass disabled:opacity-60";

export const TEXTAREA =
  "w-full rounded-xl border border-ink/15 bg-sand px-3 py-2.5 text-sm leading-relaxed text-ink outline-none transition-colors placeholder:text-ink/35 focus:border-brass";

const BUTTON =
  "inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 font-heading text-[10px] font-semibold uppercase tracking-label transition-colors duration-300 disabled:cursor-not-allowed disabled:opacity-50";

export const BUTTON_PRIMARY = `${BUTTON} bg-ink text-sand hover:bg-ink-soft`;
export const BUTTON_OUTLINE = `${BUTTON} border border-ink/20 text-ink hover:border-ink`;
export const BUTTON_DANGER = `${BUTTON} border border-destructive/40 text-destructive hover:bg-destructive hover:text-white`;
