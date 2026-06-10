import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        display: ["var(--font-neue)", "serif"],
      },
      colors: {
        cream: "#F8FAFF",
        "cream-dark": "#EFF5FF",
        surface: "#FFFFFF",
        "surface-soft": "#F4F8FF",
        "surface-strong": "#E6EEFF",
        border: "#D8E6FF",
        ink: "#071B33",
        "ink-muted": "#5A6C8B",
        "ink-faint": "#8D99B5",
        accent: "#1B65FF",
        "accent-dark": "#0E4ECB",
        "accent-soft": "#DCE7FF",
        navy: "#0B1F3F",
      },
      letterSpacing: {
        widest: "0.2em",
        "extra-wide": "0.15em",
      },
      animation: {
        "fade-up": "fadeUp 0.6s ease-out forwards",
        "fade-in": "fadeIn 0.4s ease-out forwards",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
