// Adds extruded 3D buildings on top of the OpenFreeMap Liberty style,
// tinted to the site's sage/ink palette so the map reads as part of the brand.
export function addBuildingExtrusions(map) {
  if (map.getLayer("3d-buildings")) return;
  // hide the style's own flat / duplicate building layers
  map.getStyle().layers.forEach((l) => {
    if (l.id !== "3d-buildings" && l["source-layer"] === "building") {
      map.setLayoutProperty(l.id, "visibility", "none");
    }
  });
  const firstSymbol = map
    .getStyle()
    .layers.find((l) => l.type === "symbol")?.id;
  map.addLayer(
    {
      id: "3d-buildings",
      source: "openmaptiles",
      "source-layer": "building",
      type: "fill-extrusion",
      minzoom: 13,
      paint: {
        // Low blocks stay sage; towers deepen towards ink so height reads at a
        // glance from directly above.
        "fill-extrusion-color": [
          "interpolate",
          ["linear"],
          ["coalesce", ["get", "render_height"], 12],
          0,
          "#C9D2CA",
          40,
          "#AEB9B0",
          120,
          "#8C9A90",
          260,
          "#66756B",
        ],
        "fill-extrusion-height": ["coalesce", ["get", "render_height"], 12],
        "fill-extrusion-base": ["coalesce", ["get", "render_min_height"], 0],
        "fill-extrusion-opacity": 0.92,
        "fill-extrusion-vertical-gradient": true,
      },
    },
    firstSymbol,
  );
}

/** Warm haze on the horizon, so the tilted camera has some depth to it. */
export function addBrandAtmosphere(map) {
  try {
    map.setFog?.({
      range: [1, 12],
      color: "#E5EAE6",
      "horizon-blend": 0.22,
      "high-color": "#D2DAD5",
      "space-color": "#C6D0C8",
      "star-intensity": 0,
    });
  } catch {
    // Older MapLibre styles have no fog support — the map is fine without it.
  }
}
