import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // 2.0 设计系统色
        bg: {
          0: "#F3EEE5",
          1: "#EDE6DA",
          2: "#E4DCCD",
          inv: "#1F1C18",
        },
        tx: {
          0: "#1F1C18",
          1: "#2E2A25",
          2: "#5A534A",
          3: "#8C8478",
          inv: "#F0EDE8",
        },
        ac: {
          DEFAULT: "#A0814F",
          dim: "#7A6038",
        },
        // 四化语义色
        lu:   "#2D7A4A",
        quan: "#1A56A8",
        ke:   "#8A7018",
        ji:   "#A83228",
      },
      fontFamily: {
        sans: ["var(--font)"],
        serif: ["var(--font)"],
        mono: ["var(--font-mono)"],
      },
      boxShadow: {
        xs: "0 1px 2px rgba(0,0,0,0.05)",
        sm: "0 2px 8px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)",
        md: "0 4px 20px rgba(0,0,0,0.08), 0 2px 6px rgba(0,0,0,0.05)",
        lg: "0 12px 40px rgba(0,0,0,0.10), 0 4px 12px rgba(0,0,0,0.06)",
      },
      borderRadius: {
        xs: "4px",
        sm: "8px",
        md: "12px",
        lg: "16px",
        xl: "24px",
        pill: "999px",
      },
      animation: {
        "fade-up": "fadeUp 0.5s ease forwards",
        "fade-in": "fadeIn 0.4s ease forwards",
        "spin-slow": "spin 20s linear infinite",
      },
      keyframes: {
        fadeUp: {
          "0%":   { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
