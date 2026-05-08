/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#FFFFFF",
        surface: "#F8FAFC",
        surfaceAlt: "#F1F5F9",
        surfaceHi: "#E2E8F0",
        accent: "#00C9A7",
        blue: "#1D85EB",
        warn: "#F59E0B",
        red: "#EF4444",
        green: "#10B981",
        purple: "#A78BFA",
        text: "#0F172A",
        textDim: "#334155",
        textMute: "#64748B",
        border: "#E2E8F0",
        borderStrong: "#CBD5E1",
      },
      fontFamily: {
        sans: ["'Noto Sans KR'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
    },
  },
  plugins: [],
};
