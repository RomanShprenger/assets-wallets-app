
/** @type {import('tailwindcss').Config} */
const colors = require("tailwindcss/colors")

module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./components/*.{js,jsx,ts,tsx}", "./screens/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
    colors: {
      ...colors,
      primary: {
        100: "#BF1DFF",
        200: '#02F9E4'
      },
      secondary: {
        100: '#021A29'
      },

    }
  },
  plugins: [],
}