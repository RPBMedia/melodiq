import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0B0A1A",
        surface: "#15132B",
        surface2: "#1E1B3A",
        line: "#2A2750",
        ink: "#F4F2FF",
        muted: "#A09CC4",
        magenta: "#FF2D87",
        violet: "#8B5CF6",
        cyan: "#22D3EE",
        good: "#34D399",
        bad: "#FB7185",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 40px -8px rgba(255,45,135,0.45)",
        card: "0 8px 40px -12px rgba(0,0,0,0.6)",
      },
      borderRadius: {
        xl2: "1.5rem",
      },
      keyframes: {
        floatup: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shake: {
          "10%,90%": { transform: "translateX(-2px)" },
          "20%,80%": { transform: "translateX(4px)" },
          "30%,50%,70%": { transform: "translateX(-8px)" },
          "40%,60%": { transform: "translateX(8px)" },
        },
      },
      animation: {
        floatup: "floatup 0.5s ease-out both",
        shake: "shake 0.5s ease-in-out",
      },
    },
  },
  plugins: [],
};
export default config;
