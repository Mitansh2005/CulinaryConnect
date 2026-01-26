/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./app/**/*.{js,jsx}",
    "./src/**/*.{js,jsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        display: ["Inter", "sans-serif"], // For Culinary Connect modern UI
        title: ["Changa One", "sans-serif"], // For logo, titles
        heading: ["Merriweather", "serif"], // For elegant headings
        body: ["Poppins", "sans-serif"], // Clean, modern body text
        tags: ["Edu NSW ACT Cursive", "cursive"], // For tags
      },
      colors: {
        // Culinary Connect brand colors
        primary: {
          DEFAULT: "#13ec5b",
          foreground: "#111813",
        },
        "background-light": "#f6f8f6",
        "background-dark": "#102216",
        // Original color palette
        tea_green: {
          DEFAULT: "#ccd5ae",
          100: "#2d331a",
          200: "#5b6635",
          300: "#88994f",
          400: "#acbb7b",
          500: "#ccd5ae",
          600: "#d6debe",
          700: "#e1e6cf",
          800: "#ebeedf",
          900: "#f5f7ef",
        },
        beige: {
          DEFAULT: "#e9edc9",
          100: "#3d4216",
          200: "#79842c",
          300: "#b3c146",
          400: "#ced788",
          500: "#e9edc9",
          600: "#edf1d4",
          700: "#f2f4df",
          800: "#f6f8ea",
          900: "#fbfbf4",
        },
        cornsilk: {
          DEFAULT: "#fefae0",
          100: "#5d5103",
          200: "#baa206",
          300: "#f8dc27",
          400: "#fbeb84",
          500: "#fefae0",
          600: "#fefbe7",
          700: "#fefced",
          800: "#fffdf3",
          900: "#fffef9",
        },
        papaya_whip: {
          DEFAULT: "#faedcd",
          100: "#533e08",
          200: "#a57b10",
          300: "#eab227",
          400: "#f2d079",
          500: "#faedcd",
          600: "#fbf1d6",
          700: "#fcf4e0",
          800: "#fdf8eb",
          900: "#fefbf5",
        },
        buff: {
          DEFAULT: "#d4a373",
          100: "#32210f",
          200: "#64411f",
          300: "#96622e",
          400: "#c58341",
          500: "#d4a373",
          600: "#dcb68f",
          700: "#e5c8ab",
          800: "#eedac7",
          900: "#f6ede3",
        },
        // Keep original primary for backward compatibility
        primaryOld: {
          DEFAULT: "#d4a373",
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#ccd5ae",
          foreground: "#2d331a",
        },
        background: "#fefae0",
        card: {
          DEFAULT: "#ffffff",
          foreground: "#1f2937",
        },
        muted: {
          DEFAULT: "#f5f5f4",
          foreground: "#737373",
        },
        accent: {
          DEFAULT: "#faedcd",
          foreground: "#3f3f3f",
        },
        destructive: {
          DEFAULT: "#ef4444",
          foreground: "#ffffff",
        },
        input: "#e9edc9",
        border: "#d6debe",
        ring: "#d4a373",
        popover: {
          DEFAULT: "#ffffff",
          foreground: "#1f2937",
        },
      },
      borderRadius: {
        lg: "1rem",
        md: "0.75rem",
        sm: "0.5rem",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        swipeIn: {
          from: { width: "0%" },
          to: { width: "100%" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        swipeIn: "swipeIn 0.5s ease-in-out forwards",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
