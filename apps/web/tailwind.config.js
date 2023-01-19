const twConfig = require("@acme/config/tailwind.config");

/** @type {import('tailwindcss').Config} */
module.exports = {
  ...twConfig,
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
  ],
}
