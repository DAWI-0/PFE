/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        playfair: ["Playfair Display", "serif"],
      },
      colors: {
        primary: "green",
        secondary: "#fb923c",
      },
      container: {
        center: true,
        padding: {
          DEFAULT: "1rem",
          sm: "2rem",
          lg: "4rem",
          xl: "5rem",
          "2xl": "6rem",
        },
      },
      // Déplacez animation et keyframes ici
      animation: {
        changeLogo: 'changeLogo 8s infinite',
      },
      keyframes: {
        changeLogo: {
          '0%, 25%': { opacity: '1' },
          '26%, 50%': { opacity: '0' },
          '51%, 75%': { opacity: '0' },
          '76%, 100%': { opacity: '0' },
        },
      },
    },
  },
  plugins: [],
};