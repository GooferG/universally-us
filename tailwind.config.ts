import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: "#FDFAF6",
          100: "#FAF5EE",
          200: "#F5EDE0",
          300: "#EEE0CC",
        },
        rose: {
          warm: "#C4775A",
          light: "#D4917B",
          pale: "#EDD5CB",
          deep: "#A85E45",
        },
        slate: {
          warm: "#2D2A27",
          mid: "#4A4540",
          light: "#7A7470",
          pale: "#B8B0A8",
        },
        sand: {
          100: "#F0E8DC",
          200: "#E5D8C8",
          300: "#D4C4B0",
        },
      },
      fontFamily: {
        playfair: ["var(--font-playfair)", "Georgia", "serif"],
        inter: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      typography: {
        warm: {
          css: {
            "--tw-prose-body": "#4A4540",
            "--tw-prose-headings": "#2D2A27",
            "--tw-prose-links": "#C4775A",
            "--tw-prose-bold": "#2D2A27",
            "--tw-prose-quotes": "#C4775A",
            "--tw-prose-quote-borders": "#C4775A",
          },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
export default config;
