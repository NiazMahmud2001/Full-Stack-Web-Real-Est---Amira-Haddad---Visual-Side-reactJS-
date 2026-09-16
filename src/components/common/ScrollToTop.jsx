import { useEffect } from "react";
import { useLocation, useNavigationType } from "react-router-dom";
import { scrollToTarget } from "../../components/motion/SmoothScroll";

const getHashId = (hash) => {
  const rawId = hash.slice(1);

  try {
    return decodeURIComponent(rawId);
  } catch {
    return rawId;
  }
};

export default function ScrollToTop() {
  const { pathname, hash } = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    if (navigationType === "POP") return;

    if (hash) {
      const id = getHashId(hash);
      const timer = window.setTimeout(() => {
        const target = document.getElementById(id);
        if (!target) return;
        // Hand off to Locomotive when the page has smooth scrolling mounted;
        // its Lenis instance owns the scroll position, so a native
        // scrollIntoView would be overwritten on the next frame.
        scrollToTarget(target, { offset: -80, duration: 1.2 });
      }, 80);
      return () => window.clearTimeout(timer);
    }

    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname, hash, navigationType]);

  return null;
}
