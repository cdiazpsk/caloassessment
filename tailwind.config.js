/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./lib/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        caliber: {
          navy: "#0B2F5B",
          blue: "#0F67B1",
          light: "#EAF4FF",
          ink: "#1F2937",
          muted: "#667085"
        }
      }
    }
  },
  plugins: []
};
