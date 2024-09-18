const defaultTheme = require("tailwindcss/defaultTheme");
const defaultThemeConfig = require("daisyui/src/colors/themes");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,js,ts,jsx,tsx}",
    "./node_modules/react-tailwindcss-datepicker/dist/index.esm.js",
  ],
  darkMode: ["class", '[data-theme="dark"]'],
  theme: {
    extend: {
      height: {
        content: "calc(100vh - 67px)",
      },
      fontFamily: {
        montserrat: ['"Montserrat"', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  daisyui: {
    // darkTheme: "dark",
    prefix: "",
    themes: [
      {
        dark: {
          ...defaultThemeConfig["[data-theme=dark]"],
          primary: "#3d4451",
          secondary: "#4B6BFB",
          // neutral: "#3d4451",
          accent: "#04B3FF",
          ring: "#3b82f680",
        },
      },
      {
        light: {
          ...defaultThemeConfig["[data-theme=light]"],
          primary: "#03386A",
          secondary: "#09507A",
          accent: "#03386A",
          neutral: "#3d4451",
          ring: "#3b82f680",
          "base-100": "#ffffff",
          "--rounded-box": "1rem", // border radius rounded-box utility class, used in card and other large boxes
          "--rounded-btn": "0.5rem", // border radius rounded-btn utility class, used in buttons and similar element
          "--rounded-badge": "1.9rem", // border radius rounded-badge utility class, used in badges and similar
          "--animation-btn": "0.25s", // duration of animation when you click on button
          "--animation-input": "0.2s", // duration of animation for inputs like checkbox, toggle, radio, etc
          "--btn-text-case": "uppercase", // set default text transform for buttons

          "--btn-focus-scale": "0.95", // scale transform of button when you focus on it
          "--border-btn": "1px", // border width of buttons
          "--tab-border": "1px", // border width of tabs
          "--tab-radius": "0.5rem", // border radius of tabs
        },
      },
    ],
  },
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
};
