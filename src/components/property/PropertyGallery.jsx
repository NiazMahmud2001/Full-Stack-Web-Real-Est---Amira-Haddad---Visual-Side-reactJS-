import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import { Image } from "../../components/ui/image";

const EASE = [0.16, 1, 0.3, 1];

/**
 * Main plate with a thumbnail strip and a full-screen lightbox.
 * Arrow keys move between photographs; Escape closes the lightbox.
 */
export default function PropertyGallery({ images, alt }) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [open, setOpen] = useState(false);
  const total = images.length;

  const go = useCallback(
    (delta) => {
      setDirection(delta);
      setIndex((i) => (i + delta + total) % total);
    },
    [total]
  );

  const jump = (next) => {
    setDirection(next > index ? 1 : -1);
    setIndex(next);
  };

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const plate = (
    <AnimatePresence initial={false} mode="popLayout" custom={direction}>
      <motion.div
        key={index}
        custom={direction}
        initial={{ opacity: 0, scale: 1.05, x: direction * 40 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        exit={{ opacity: 0, scale: 0.99 }}
        transition={{ duration: 0.7, ease: EASE }}
        className="absolute inset-0"
      >
        <Image src={images[index]} alt={`${alt} — photo ${index + 1}`} className="h-full w-full object-cover" />
      </motion.div>
    </AnimatePresence>
  );

  const NavButton = ({ dir, children, label }) => (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        go(dir);
      }}
      aria-label={label}
      data-cursor="link"
      className="grid h-11 w-11 place-items-center rounded-full bg-sand/90 text-ink shadow-lift backdrop-blur transition-transform duration-500 ease-expo hover:scale-110 hover:bg-sand"
    >
      {children}
    </button>
  );

  return (
    <>
      <div className="relative overflow-hidden rounded-[1.75rem] border border-ink/10 bg-sage">
        <div className="relative aspect-[16/10]">
          {plate}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/35 via-transparent to-transparent" />

          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open full screen"
            data-cursor="view"
            data-cursor-label="Expand"
            className="absolute right-4 top-4 flex items-center gap-2 rounded-full bg-ink/70 px-4 py-2.5 font-heading text-[9px] font-semibold uppercase tracking-label text-sand backdrop-blur transition-colors hover:bg-ink"
          >
            <Expand className="h-3.5 w-3.5" />
            Full screen
          </button>

          {total > 1 && (
            <>
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <NavButton dir={-1} label="Previous photo">
                  <ChevronLeft className="h-5 w-5" />
                </NavButton>
              </div>
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <NavButton dir={1} label="Next photo">
                  <ChevronRight className="h-5 w-5" />
                </NavButton>
              </div>
              <p className="absolute bottom-4 left-5 font-heading text-[10px] uppercase tracking-label text-sand">
                {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
              </p>
            </>
          )}
        </div>
      </div>

      {total > 1 && (
        <div className="no-scrollbar mt-3 flex gap-3 overflow-x-auto pb-1">
          {images.map((src, i) => (
            <button
              key={src + i}
              type="button"
              onClick={() => jump(i)}
              aria-label={`Show photo ${i + 1}`}
              data-cursor="link"
              className={`relative h-20 w-28 shrink-0 overflow-hidden rounded-xl border transition-all duration-500 ease-expo ${
                i === index
                  ? "border-brass opacity-100"
                  : "border-ink/10 opacity-55 hover:opacity-90"
              }`}
            >
              <Image src={src} alt="" aria-hidden="true" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Rendered into <body>: any transformed ancestor (a GSAP reveal, a
          tilt card) would otherwise become the containing block and trap
          this `fixed` overlay inside the gallery frame. */}
      {createPortal(
        <AnimatePresence>
          {open && (
            <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="fixed inset-0 z-[80] flex flex-col bg-ink/97 p-4 sm:p-8"
            data-cursor="dark"
            role="dialog"
            aria-modal="true"
            aria-label={`${alt} gallery`}
          >
            <div className="flex items-center justify-between">
              <p className="font-heading text-[10px] uppercase tracking-label text-sand/70">
                {alt} · {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
              </p>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close gallery"
                data-cursor="link"
                className="grid h-11 w-11 place-items-center rounded-full border border-sand/25 text-sand transition-colors hover:bg-sand hover:text-ink"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="relative mt-4 flex-1 overflow-hidden rounded-2xl">{plate}</div>

            <div className="mt-4 flex items-center justify-center gap-3">
              <NavButton dir={-1} label="Previous photo">
                <ChevronLeft className="h-5 w-5" />
              </NavButton>
              <NavButton dir={1} label="Next photo">
                <ChevronRight className="h-5 w-5" />
              </NavButton>
            </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}
