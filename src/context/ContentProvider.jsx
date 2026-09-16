import { useEffect, useState } from "react";
import { loadContent } from "../lib/loadContent";
import { loadFonts, preloadImages, siteImageUrls, wait } from "../lib/preloadAssets";
import { ContentContext } from "./ContentContext";
import SiteLoader from "../components/common/SiteLoader";

// On a slow connection, open the site after this long anyway — photographs
// still on their way keep downloading in the background.
const MAX_IMAGE_WAIT_MS = 15_000;
const MAX_FONT_WAIT_MS = 3_000;

const LOADER_START = { progress: 0, status: "Connecting to the listings", photos: [], agentName: "" };

/**
 * Loads everything before the site is shown, behind a full-screen loader:
 *
 *   1. the four Supabase tables             first 10% of the counter
 *   2. every photograph the pages use       next 85%
 *   3. the two web fonts                    last 5%
 *
 * Then the loader slides away and the pages render. They read the data with
 * useAgent(), useMedia(), useAreas() and useListings().
 */
export default function ContentProvider({ children }) {
  const [content, setContent] = useState(null);
  const [loader, setLoader] = useState(LOADER_START);
  const [ready, setReady] = useState(false); // everything loaded: render the site
  const [loaderGone, setLoaderGone] = useState(false); // the loader has finished sliding away
  const [error, setError] = useState(null);
  // Changing this number re-runs the effect below, which starts loading again.
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    // If this effect is cleaned up part-way, ignore anything that finishes later.
    let cancelled = false;
    const show = (changes) => {
      if (!cancelled) setLoader((current) => ({ ...current, ...changes }));
    };

    async function loadEverything() {
      // 1. The data
      const data = await loadContent();
      if (cancelled) return;
      setContent(data);

      // 2. The photographs
      const urls = siteImageUrls(data);
      let finished = 0;
      show({
        progress: 0.1,
        status: `Loading photographs · 0 / ${urls.length}`,
        agentName: data.agent.name
      });

      const allImages = preloadImages(urls, (url, loaded) => {
        finished += 1;
        if (cancelled) return;
        setLoader((current) => ({
          ...current,
          progress: 0.1 + 0.85 * (finished / urls.length),
          status: `Loading photographs · ${finished} / ${urls.length}`,
          // The three most recent arrivals make up the photo stack.
          photos: loaded ? [...current.photos.slice(-2), url] : current.photos
        }));
      });

      const allArrived = await Promise.race([
        allImages.then(() => true),
        wait(MAX_IMAGE_WAIT_MS).then(() => false)
      ]);
      if (cancelled) return;
      if (!allArrived) {
        console.info("Some photographs are still downloading; opening the site anyway.");
      }

      // 3. The fonts
      show({ progress: 0.95, status: "Setting the scene" });
      await Promise.race([loadFonts(), wait(MAX_FONT_WAIT_MS)]);
      if (cancelled) return;

      show({ progress: 1, status: "Welcome" });
      setReady(true);
    }

    loadEverything().catch((err) => {
      if (cancelled) return;
      console.error("Could not load the site content from Supabase:", err);
      setError(err);
    });

    return () => {
      cancelled = true;
    };
  }, [attempt]);

  const retry = () => {
    setError(null);
    setLoader(LOADER_START);
    setAttempt((n) => n + 1);
  };

  if (error) return <ErrorScreen message={error.message} onRetry={retry} />;

  return (
    <>
      {ready && <ContentContext.Provider value={content}>{children}</ContentContext.Provider>}

      {/* Stays on top while the site renders underneath, then slides away */}
      {!loaderGone && (
        <SiteLoader
          progress={loader.progress}
          status={loader.status}
          photos={loader.photos}
          agentName={loader.agentName}
          done={ready}
          onExited={() => setLoaderGone(true)}
        />
      )}
    </>
  );
}

function ErrorScreen({ message, onRetry }) {
  return (
    <div
      role="alert"
      className="flex min-h-screen items-center justify-center bg-ink px-6 text-center text-sand"
      data-cursor="dark"
    >
      <div className="max-w-lg">
        <p className="font-heading text-[10px] uppercase tracking-label text-brass">
          Something went wrong
        </p>
        <h1 className="mt-4 font-display text-4xl sm:text-5xl">The listings could not be loaded</h1>
        <p className="mt-5 text-sm leading-relaxed text-sand/60">{message}</p>
        <button
          type="button"
          onClick={onRetry}
          data-cursor="link"
          className="mt-9 rounded-full bg-sand px-8 py-3 font-heading text-[10px] font-semibold uppercase tracking-label text-ink transition-colors duration-500 hover:bg-brass-light"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
