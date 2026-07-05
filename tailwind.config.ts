import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#070707",
        panel: "#0f0f11",
        muted: "#a1a1aa",
      },
      fontFamily: {
        sans: [
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },
      boxShadow: {
        glow: "0 20px 60px -20px rgba(0,0,0,0.7)",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0", transform: "translateY(6px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        aurora: {
          "0%, 100%": { transform: "translate3d(-8%, -6%, 0) scale(1)" },
          "50%": { transform: "translate3d(8%, 6%, 0) scale(1.25)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.5s ease-out both",
        aurora: "aurora 22s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
