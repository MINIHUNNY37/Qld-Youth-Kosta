import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Warm, gentle community palette
        cream: {
          50: "#FFFBF2",
          100: "#FFF4DF",
          200: "#FDE7BE",
        },
        sunrise: {
          400: "#F5B461",
          500: "#E89B3C",
          600: "#C97A1F",
        },
        berry: {
          500: "#B4467A",
          600: "#8F2F5E",
        },
        ink: {
          700: "#3D2A1F",
          800: "#2A1C13",
        },
        // Sticky-note paper colors (used cyclically by index)
        sticky: {
          peach: "#FFE4D6",
          cream: "#FFF1C9",
          mint:  "#D9F2E0",
          lilac: "#E8DCFF",
          sky:   "#D7ECFF",
        },
        tape: {
          amber: "#F5C97D",
        },
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Noto Sans KR",
          "Roboto",
          "Inter",
          "sans-serif",
        ],
        display: [
          "Georgia",
          "Cambria",
          "Times New Roman",
          "serif",
        ],
      },
      boxShadow: {
        warm: "0 10px 30px -12px rgba(201, 122, 31, 0.25)",
        sticky: "0 12px 24px -10px rgba(61, 42, 31, 0.25), 0 2px 4px rgba(61, 42, 31, 0.06)",
      },
    },
  },
  safelist: [
    "bg-sticky-peach",
    "bg-sticky-cream",
    "bg-sticky-mint",
    "bg-sticky-lilac",
    "bg-sticky-sky",
    "-rotate-2",
    "-rotate-1",
    "rotate-0",
    "rotate-1",
    "rotate-2",
  ],
  plugins: [],
};

export default config;
