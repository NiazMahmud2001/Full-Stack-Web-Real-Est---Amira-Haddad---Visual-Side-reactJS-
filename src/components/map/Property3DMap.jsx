import React, { useEffect, useRef } from "react";
// MapLibre (with its CSS and background worker already wired up) comes from
// src/lib/maplibre.js — importing "maplibre-gl" directly gives a white map on v6.
import maplibregl from "../../lib/maplibre";
import { propertyPinHtml } from "./propertyPinHtml";
import { addBuildingExtrusions, addBrandAtmosphere } from "./buildingExtrusions";
import { UAE_CENTER, UAE_ZOOM } from "../../lib/areas";
import { useAreas } from "../../context/ContentContext";

// An emirate is a wide frame; a single community is a close, tilted one.
const AREA_VIEW = { zoom: 15.2, pitch: 62, bearing: -20 };
const EMIRATE_VIEW = { zoom: 11.2, pitch: 50, bearing: -18 };

export default function Property3DMap({ properties, focus }) {
  const { matchesFocus } = useAreas();
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const framedRef = useRef(false);

  useEffect(() => {
    const map = new maplibregl.Map({
      container: containerRef.current,
      style: "https://tiles.openfreemap.org/styles/liberty",
      center: [UAE_CENTER[1], UAE_CENTER[0]],
      zoom: UAE_ZOOM,
      pitch: 55,
      bearing: -18,
      antialias: true,
      attributionControl: { compact: true }
    });
    map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), "bottom-right");
    map.on("load", () => {
      addBuildingExtrusions(map);
      addBrandAtmosphere(map);
    });
    mapRef.current = map;
    return () => map.remove();
  }, []);

  // sync markers
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = properties.map((p) => {
      const el = document.createElement("div");
      el.innerHTML = propertyPinHtml(p, Boolean(focus) && matchesFocus(p, focus));
      el.addEventListener("click", () => window.open(`/property/${p.id}`, "_blank"));
      return new maplibregl.Marker({ element: el, anchor: "bottom" })
        .setLngLat([p.lng, p.lat])
        .addTo(map);
    });
  }, [properties, focus, matchesFocus]);

  // Frame every listing once the first batch arrives — inventory now spans two
  // emirates, so a fixed opening camera would leave half of it off screen.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || focus || framedRef.current || properties.length === 0) return;
    const pins = properties.filter((p) => typeof p.lng === "number" && typeof p.lat === "number");
    if (pins.length === 0) return;
    framedRef.current = true;
    if (pins.length === 1) {
      map.easeTo({ center: [pins[0].lng, pins[0].lat], ...AREA_VIEW, duration: 1200 });
      return;
    }
    const bounds = pins.reduce(
      (b, p) => b.extend([p.lng, p.lat]),
      new maplibregl.LngLatBounds([pins[0].lng, pins[0].lat], [pins[0].lng, pins[0].lat])
    );
    // Solve the camera flat, then tilt. `fitBounds` with a pitch in the same
    // call solves for the tilted frustum and drifts the centre off the pins.
    const camera = map.cameraForBounds(bounds, { padding: 70 });
    map.easeTo({
      center: camera ? camera.center : [UAE_CENTER[1], UAE_CENTER[0]],
      zoom: camera ? Math.min(camera.zoom, 12) : UAE_ZOOM,
      pitch: 35,
      bearing: 0,
      duration: 1400
    });
  }, [properties, focus]);

  // fly to the focused area or emirate
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !focus) return;
    framedRef.current = true;
    const matches = properties.filter((p) => matchesFocus(p, focus));
    const center = matches.length
      ? [
          matches.reduce((s, p) => s + p.lng, 0) / matches.length,
          matches.reduce((s, p) => s + p.lat, 0) / matches.length
        ]
      : [focus.center[1], focus.center[0]];
    const view = focus.isEmirate ? EMIRATE_VIEW : AREA_VIEW;
    map.flyTo({ center, ...view, duration: 2500 });
  }, [focus, properties, matchesFocus]);

  return <div ref={containerRef} className="h-full w-full" data-cursor="drag" />;
}
