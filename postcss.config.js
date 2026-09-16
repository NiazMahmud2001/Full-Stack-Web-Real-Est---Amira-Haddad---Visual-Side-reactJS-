// Vite runs every .css file through PostCSS. These two plugins are what turn
// the `@tailwind` directives in src/index.css into real CSS.
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
