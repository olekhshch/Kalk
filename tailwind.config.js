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
      },
      fontFamily: {
        sys: ["Nunito"],
        textNode: ["Sahitya"],
      },
    },
  },
  plugins: [],
};
