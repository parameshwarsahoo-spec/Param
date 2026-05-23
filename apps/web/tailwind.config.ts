import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#172026",
        mist: "#f6f8f7",
        mint: "#4fb286",
        coral: "#ee6c4d",
        amber: "#f4b942",
        ocean: "#277da1"
      },
      boxShadow: {
        soft: "0 12px 36px rgba(23, 32, 38, 0.10)"
      }
    }
  },
  plugins: []
};

export default config;
