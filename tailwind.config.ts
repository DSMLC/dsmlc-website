import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        dsmlcDataOrange: "#F86306",
        dsmlcTangerine: "#FF914D",
        dsmlcParchment: "#F5EACF",
        dsmlcWhite: "#F2F2F2",
        dsmlcDarkBlack: "#222222",
        dsmlcBlack: "#222222",
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
