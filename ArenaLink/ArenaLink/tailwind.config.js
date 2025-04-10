import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // Activation du mode sombre
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
    './storage/framework/views/*.php',
    './resources/views/**/*.blade.php',
    './resources/js/**/*.jsx',
  ],
  theme: {
    extend: {
      // Polices personnalisées
      fontFamily: {
        sans: ['Figtree', ...defaultTheme.fontFamily.sans], // Police par défaut
        playfair: ['Playfair Display', 'serif'], // Police personnalisée
      },
      // Couleurs personnalisées
      colors: {
        primary: 'blue', // Couleur principale
        secondary: 'green', // Couleur secondaire
      },
      // Configuration du conteneur
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '2rem',
          lg: '4rem',
          xl: '5rem',
          '2xl': '6rem',
        },
      },
      // Animations personnalisées
      animation: {
        changeLogo: 'changeLogo 8s infinite', // Animation pour le logo
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
  plugins: [forms], // Plugin pour les formulaires
};