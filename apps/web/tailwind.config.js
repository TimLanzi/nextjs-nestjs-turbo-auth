const twConfig = require("@acme/config/tailwind.config");

/** @type {import('tailwindcss').Config} */
module.exports = {
  ...twConfig,
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
  ],
}
