import { useEffect, useRef, useState } from "react";

import maplibregl from "../../lib/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";

import { RotateCcw } from "lucide-react";
import { addBuildingExtrusions, addBrandAtmosphere } from "../../components/map/buildingExtrusions";
import { propertyPinHtml } from "../../components/map/propertyPinHtml";
import { useAreas } from "../../context/ContentContext";

/**
 * A single-address version of the explorer map: same 3D building extrusions
 * and brand-tinted style, framed on one property so the description page can
 * answer "what is actually around it".
 */
export default function PropertyLocationMap({ property }) {
  const { areaEmirate } = useAreas();
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!containerRef.current || typeof property?.lng !== "number") return undefined;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: "https://tiles.openfreemap.org/styles/liberty",
      center: [property.lng, property.lat],
      zoom: 15.4,
      pitch: 58,
      bearing: -22,
      antialias: true,
      attributionControl: { compact: true }
    });

    map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), "bottom-right");
    map.on("load", () => {
      addBuildingExtrusions(map);
      addBrandAtmosphere(map);
      setReady(true);
    });

    const el = document.createElement("div");
    el.innerHTML = propertyPinHtml(property, true);
    new maplibregl.Marker({ element: el, anchor: "bottom" })
      .setLngLat([property.lng, property.lat])
      .addTo(map);

    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [property]);

  const reset = () => {
    mapRef.current?.flyTo({
      center: [property.lng, property.lat],
      zoom: 15.4,
      pitch: 58,
      bearing: -22,
      duration: 1400
    });
  };

  if (typeof property?.lng !== "number") return null;

  return (
    // `data-lenis-prevent-wheel` hands the wheel to MapLibre's scroll-zoom
    // while the pointer is over the map, instead of the smooth scroller
    // running the page down at the same time.
    <div
      className="relative h-[24rem] overflow-hidden rounded-[1.75rem] border border-ink/10 bg-sage sm:h-[28rem]"
      data-cursor="drag"
      data-lenis-prevent-wheel
    >
      <div ref={containerRef} className="h-full w-full" />

      {!ready && (
        <div className="absolute inset-0 grid place-items-center bg-sage">
          <span className="font-heading text-[10px] uppercase tracking-label text-ink/40">
            Loading the city…
          </span>
        </div>
      )}

      <div className="pointer-events-none absolute left-4 top-4 rounded-full bg-sand/90 px-4 py-2 font-heading text-[9px] font-semibold uppercase tracking-label text-ink backdrop-blur">
        {[property.address || property.area, areaEmirate(property.area)].filter(Boolean).join(" · ")}
      </div>

      <button
        type="button"
        onClick={reset}
        data-cursor="link"
        className="absolute right-4 top-4 flex items-center gap-2 rounded-full bg-sand/90 px-4 py-2 font-heading text-[9px] font-semibold uppercase tracking-label text-ink backdrop-blur transition-colors hover:bg-sand"
      >
        <RotateCcw className="h-3 w-3" />
        Recentre
      </button>
    </div>
  );
}
