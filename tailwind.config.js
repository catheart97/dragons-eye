/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './source/**/*.html',
    './source/**/*.ts',
    './source/**/*.tsx',
  ],
  theme: {
    extend: {
      fontFamily: {
        default: "Fira Sans",
        sans: "Fira Sans",
        serif: "Fira Sans",
        mono: "Fira Code Medium"
      }
    },
  },
  plugins: [],
}

