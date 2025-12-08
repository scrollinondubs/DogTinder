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
          DEFAULT: "#E07A5F",
          light: "#F4A88E",
          dark: "#C45C3E",
        },
        secondary: {
          DEFAULT: "#81B29A",
          light: "#A8D4BE",
          dark: "#5C8A72",
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
