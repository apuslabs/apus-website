/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      height: {
        150: "37.5rem",
      },
      colors: {
        gray21: "#212121",
        gray33: "#333333",
        gray90: "#909090",
        grayd8: "#D8D8D8",
        black5: "rgba(0, 0, 0, 0.05)",
        black20: "rgba(0, 0, 0, 0.2)",
        black50: "rgba(0, 0, 0, 0.5)",
        black80: "rgba(0, 0, 0, 0.8)",
        white50: "rgba(255, 255, 255, 0.5)",
        light: "#EDF2FF",
        "light-purple": "#D7DDF4",
        blue: "#061EFA",
        mainblue: "#091DFF",
        // Theme A
        primary: "#6AC5F9",
        primaryHover: "#4FB3E8",
      },
      backgroundImage: {
        purpleToBlue45: "linear-gradient(-45deg, #9b8aff 0%, #2806fa 100%)",
        blueToPink135: "linear-gradient(135deg, #2806fa 0%, #a253fc 59%, #ffdbdb 100%)",
      },
      boxShadow: {
        "inset-white-16": "inset 0 0 16px rgba(255, 255, 255, 0.25)",
      },
      borderWidth: {
        1: "1px",
      },
    },
  },
  plugins: [],
};
