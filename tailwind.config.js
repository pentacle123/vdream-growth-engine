/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#050a12",
        surface: "#0c1220",
        surfaceAlt: "#141d2e",
        surfaceHi: "#1a2540",
        accent: "#00C9A7",
        blue: "#1D85EB",
        warn: "#F59E0B",
        red: "#EF4444",
        purple: "#A78BFA",
        text: "#E2E8F0",
        textDim: "#94A3B8",
        textMute: "#64748B",
      },
      fontFamily: {
        sans: ["'Noto Sans KR'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
    },
  },
  plugins: [],
};
