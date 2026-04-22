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
      },
    },
  },
  plugins: [],
};

export default config;
