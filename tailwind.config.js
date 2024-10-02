/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    borderRadius: {
      strd: "2px",
    },
    extend: {
      colors: {
        white: "#F0F4F8",
        black: "#333D51",
        main: "#0A9396",
        sec: "#94D2BD",
        number: "#0A9396",
        vector: "#2563EB",
        matrix: "#8B5CF6",
        "sec-mtx": "#A08AC4",
        gray: "#D1D5DB",
        orange: "#FFB385",
        red: "#6B1F1F",
        "red-sec": "#A06D6D",
      },
      fontFamily: {
        sys: ["Nunito"],
        textNode: ["Sahitya"],
      },
    },
  },
  plugins: [],
};
