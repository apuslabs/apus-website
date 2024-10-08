/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      height: {
        150: "37.5rem",
      },
      colors: {
        gray33: "#333333",
        black5: "rgba(0, 0, 0, 0.05)",
        black20: "rgba(0, 0, 0, 0.2)",
        black50: "rgba(0, 0, 0, 0.5)",
        black80: "rgba(0, 0, 0, 0.8)",
        white50: "rgba(255, 255, 255, 0.5)",
        light: "#EDF2FF",
        "light-purple": "#D7DDF4",
        blue: "#061EFA",
      },
    },
  },
  plugins: [],
};
