const { background } = require('storybook/internal/theming');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        primary: '#00dddd',
        background: '#000',
        text: '#fff'
      }
    }
  },
  plugins: []
};
