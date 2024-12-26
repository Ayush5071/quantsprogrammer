import { Config } from "tailwindcss";

// This plugin adds each Tailwind color as a global CSS variable, e.g. var(--gray-200).


/** @type {Config} */
const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class", // Use class for dark mode
  theme: {
    extend: {
      animation: {
        "meteor-effect": "meteor 5s linear infinite", // Your meteor animation
        shimmer: "shimmer 2s linear infinite", // Shimmer animation for loading effects
      },
      keyframes: {
        meteor: {
          "0%": { transform: "rotate(215deg) translateX(0)", opacity: "1" },
          "70%": { opacity: "1" },
          "100%": {
            transform: "rotate(215deg) translateX(-500px)",
            opacity: "0",
          },
        },
        shimmer: {
          from: {
            backgroundPosition: "0 0",
          },
          to: {
            backgroundPosition: "-200% 0",
          },
        },
      },
      fontFamily: {
        bebas: ["Bebas Neue", "sans-serif"],
        bionix: ["Bionix", "sans-serif"],
        moon: ['"MOONGETTI"'],
        sfText: ['"SF Pro Text"', "Arial", "sans-serif"],
        Sfpro: ['"Sfpro"'],
        Manrope: ['"Manrope"'],
        Acme: ['"Acme"'],
      },
    },
  },
  plugins: [
  ],
};

export default config;
