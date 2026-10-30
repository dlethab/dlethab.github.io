/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ericsson: "rgb(0,85,164)",
        chartbeat: "rgb(20,50,79)",
        thermo: "rgb(232,10,14)",
      },
      keyframes: {
        pulseRing: {
          "0%": { transform: "scale(1)", opacity: "0.7" },
          "100%": { transform: "scale(1.8)", opacity: "0" },
        },
        sway: { "0%,100%": { transform: "translateX(-6%)" }, "50%": { transform: "translateX(6%)" } },
      },
      animation: {
        pulseRing: "pulseRing 1.6s ease-out infinite",
        sway: "sway 1.1s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
