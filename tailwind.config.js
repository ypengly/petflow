/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: "#FFF9F0", blush: "#FFDCE5", lavender: "#E9E0FF",
        mint: "#DDF5E8", ink: "#303044",
      },
      fontFamily: {
        display: ["Fredoka", "ui-rounded", "system-ui", "sans-serif"],
        body: ["Nunito", "system-ui", "sans-serif"],
      },
      boxShadow: { soft: "0 8px 30px -12px rgba(48,48,68,.25)" },
    },
  },
  plugins: [],
};
