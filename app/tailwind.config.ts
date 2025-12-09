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
        primary: {
          DEFAULT: "#D64D7A",
          light: "#E87A9E",
          dark: "#6B2D4A",
        },
        secondary: {
          DEFAULT: "#8B3D5A",
          light: "#A85D78",
          dark: "#5C2940",
        },
        background: "#FAFAFA",
        card: "#FFFFFF",
        muted: "#9CA3AF",
        danger: "#EF4444",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
