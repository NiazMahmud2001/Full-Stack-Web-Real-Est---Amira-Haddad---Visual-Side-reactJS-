// Downloads what the pages need before the site is shown, so photographs are
// already in the browser's cache by the time a section scrolls into view.
// The <img> tags later ask for exactly the same URLs, so they appear instantly.

// Holding on to the Image objects stops the browser from discarding the
// decoded pictures before the pages use them.
const warmed = [];

/** Resolves after `ms` milliseconds. */
export const wait = (ms) => new Promise((resolve) => setTimeout(resolve, Math.max(0, ms)));

/**
 * Every image the site shows, without duplicates: the hero frames, the named
 * section photos and each listing's cover and gallery. (The media table also
 * has city frames and a hero video, but no page uses those.)
 */
export function siteImageUrls({ media, listings }) {
  const urls = [
    ...media.heroFrames,
    ...Object.values(media.photo),
    ...listings.listings.flatMap((p) => [p.image_url, ...(p.image_urls || [])])
  ];
  return [...new Set(urls.filter(Boolean))];
}

/**
 * Downloads and decodes every image at the same time. `onEach(url, loaded)`
 * runs as each one finishes. A broken image still counts as finished, so one
 * bad URL can never keep the site from opening.
 */
export function preloadImages(urls, onEach) {
  return Promise.all(
    urls.map((url) => {
      const img = new Image();
      img.decoding = "async";
      img.src = url;
      warmed.push(img);
      return img.decode().then(
        () => onEach(url, true),
        () => onEach(url, false)
      );
    })
  );
}

/** The two web fonts from index.html, in the styles the pages use. */
export function loadFonts() {
  if (!document.fonts?.load) return Promise.resolve();
  return Promise.all([
    document.fonts.load('400 1em "Instrument Serif"'),
    document.fonts.load('italic 400 1em "Instrument Serif"'),
    document.fonts.load('400 1em "Manrope"'),
    document.fonts.load('600 1em "Manrope"')
  ]).catch(() => {});
}
