import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      keyframes: {
        "gradient-x": {
          "0%, 100%": {
            "background-size": "200% 200%",
            "background-position": "left center",
          },
          "50%": {
            "background-position": "right center",
          },
        },
      },
      animation: {
        "gradient-x": "gradient-x 8s ease infinite",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        dsmlcDataOrange: "#F86306",
        dsmlcTangerine: "#FF914D",
        dsmlcGreen: "#4CAF50",  
        dsmlcRed: "#EA4335",
        dark: {
          dsmlcParchment: "#2E2B26",
          dsmlcEnhancedParchment: "#45413C",
          dsmlcWhite: "#1A1A1A",
          dsmlcBlack: "#F5EACF",
        },
        light: {
          dsmlcParchment: "#F5EACF",
          dsmlcEnhancedParchment: "#D6C8A3",
          dsmlcWhite: "#F2F2F2",
          dsmlcBlack: "#222222",
        },
      },
      fontFamily: {
        redHat: ['"Red Hat Display"', "sans-serif"],
        quicksand: ['"Quicksand"', "sans-serif"],
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
        "6xl": "9rem",
      },
      transitionDuration: {
        "1500": "1500ms",
        "2000": "2000ms",
        "3000": "3000ms",
      },
    },
  },
  plugins: [],
};
export default config;
