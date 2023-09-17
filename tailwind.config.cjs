/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  theme: {
    extend: {
      fontFamily: {
        primary: ['"Cabin"'],
      },
    },
    container: {
      center: true,
      padding: "2rem",
    },
    screens: {
      mobile: "767px",
      // => @media (min-width: 767px) { ... }

      tablet: "768px",
      // => @media (min-width: 768px) { ... }

      desktop: "1024px",
      // => @media (min-width: 1024px) { ... }

      desktoplarge: "1280px",
      // => @media (min-width: 1280px) { ... }
    },
    fontSize: {
      xl: [
        "24px",
        {
          lineHeight: "2rem",
        },
      ],
      "2xl": [
        "26px",
        {
          lineHeight: "2rem",
        },
      ],
      "3xl": [
        "30px",
        {
          lineHeight: "2.25rem",
        },
      ],
      "4xl": [
        "34px",
        {
          lineHeight: "3.125rem",
        },
      ],
      "5xl": [
        "50px",
        {
          lineHeight: "2.25rem",
        },
      ],
      "6xl": [
        "60px",
        {
          lineHeight: "2.25rem",
        },
      ],
      min: [
        "12px",
        {
          lineHeight: "1.25rem",
        },
      ],
    },
  },
  plugins: [require("daisyui")],
};
