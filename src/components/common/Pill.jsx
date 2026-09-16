import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import Magnetic from "../../components/motion/Magnetic";

const TONES = {
  ink: "bg-ink text-sand hover:bg-ink-soft",
  sand: "bg-sand text-ink hover:bg-white",
  brass: "bg-brass text-ink hover:bg-brass-light",
  outline: "border border-ink/25 text-ink hover:border-ink hover:bg-ink hover:text-sand",
  outlineLight: "border border-sand/40 text-sand hover:border-sand hover:bg-sand hover:text-ink"
};

const SIZES = {
  sm: "h-9 px-5 text-[10px]",
  md: "h-12 px-7 text-[11px]",
  lg: "h-14 px-9 text-xs"
};

/**
 * The site's one button shape: a magnetic pill with an arrow that slides on
 * hover. Renders a router `Link`, an anchor or a `button` depending on props.
 */
export default function Pill({
  to = undefined,
  href = undefined,
  tone = "ink",
  size = "md",
  arrow = true,
  className = "",
  children = null,
  magnetic = true,
  ...rest
}) {
  const classes = [
    "group relative inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-full",
    "font-heading font-semibold uppercase tracking-label",
    "transition-colors duration-500 ease-expo",
    TONES[tone] || TONES.ink,
    SIZES[size] || SIZES.md,
    className
  ].join(" ");

  const inner = (
    <>
      <span className="relative z-10">{children}</span>
      {arrow && (
        <ArrowUpRight className="relative z-10 h-3.5 w-3.5 transition-transform duration-500 ease-expo group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      )}
    </>
  );

  let node;
  if (to) {
    node = (
      <Link to={to} className={classes} data-cursor="link" {...rest}>
        {inner}
      </Link>
    );
  } else if (href) {
    node = (
      <a href={href} className={classes} data-cursor="link" {...rest}>
        {inner}
      </a>
    );
  } else {
    node = (
      <button className={classes} data-cursor="link" {...rest}>
        {inner}
      </button>
    );
  }

  return magnetic ? <Magnetic strength={0.28}>{node}</Magnetic> : node;
}
