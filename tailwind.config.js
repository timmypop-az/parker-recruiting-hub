import ccPreset from './handoff/tailwind.preset.js';

/** @type {import('tailwindcss').Config} */
export default {
  presets: [ccPreset],
  // Theme is driven by [data-theme="dark"] on <html> (set by useTheme),
  // so dark: variants resolve against that selector instead of .dark.
  darkMode: ['class', '[data-theme="dark"]'],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
