/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./screens/**/*.{js,jsx,ts,tsx}", "./screens/profile.tsx"],
  theme: {
    extend: {
      colors: {
        accent: "var(--accent)" //"#5e9e38", // TODO BRADEN figure out why this doesn't work
      }
    }
  },
}