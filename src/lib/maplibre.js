// One place to load MapLibre, so every map component gets the fix below.
//
// MapLibre v5+ draws map tiles in a background Web Worker, and by default looks
// for that worker file right next to its own main script. Vite's dependency
// pre-bundling moves the main script into node_modules/.vite/deps/ but leaves
// the worker behind, so the worker 404s and the map renders completely white.
//
// Handing MapLibre the worker's URL explicitly fixes that. The `?worker&url`
// suffix also makes Vite bundle the worker — together with the shared code it
// imports — when you run `npm run build`, so production works too.
//
// Usage in a component:  import maplibregl from "../../lib/maplibre";
import * as maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import workerUrl from "maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url";

maplibregl.setWorkerUrl(workerUrl);

export default maplibregl;
