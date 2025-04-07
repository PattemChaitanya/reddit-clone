/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "reddit-orange": "#FF4500",
        "reddit-blue": "#0079D3",
        "reddit-dark": "#1A1A1B",
        "reddit-light": "#DAE0E6",
        "reddit-text": "#1C1C1C",
        "reddit-text-dark": "#D7DADC",
        "reddit-border": "#EDEFF1",
        "reddit-border-dark": "#343536",
        "reddit-hover": "#F5F5F5",
        "reddit-hover-dark": "#2D2D2D",
      },
      fontFamily: {
        sans: ["IBM Plex Sans", "sans-serif"],
      },
      spacing: {
        72: "18rem",
        84: "21rem",
        96: "24rem",
      },
      boxShadow: {
        card: "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)",
      },
    },
  },
  plugins: [],
};
