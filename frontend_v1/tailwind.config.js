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
      padding: "1.5rem",
      screens: {
        "2xl": "1440px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["Manrope", "sans-serif"],
        display: ["Fraunces", "serif"],
        title: ["Fraunces", "serif"],
        heading: ["Fraunces", "serif"],
        body: ["Manrope", "sans-serif"],
        tags: ["IBM Plex Mono", "monospace"],
      },
      colors: {
        ember: {
          50: "#fff4eb",
          100: "#ffe7d3",
          200: "#ffc99f",
          300: "#ffab6b",
          400: "#f58b3d",
          500: "#e06a21",
          600: "#bf5319",
          700: "#9a4116",
          800: "#7b3416",
          900: "#5f2814",
          DEFAULT: "#e06a21",
        },
        forest: {
          50: "#edf7f0",
          100: "#d8ecde",
          200: "#b5d8c0",
          300: "#8bbd99",
          400: "#5f9d73",
          500: "#3f7f57",
          600: "#2f6444",
          700: "#254f36",
          800: "#1e402d",
          900: "#183225",
          DEFAULT: "#2f6444",
          dark: "#183225",
        },
        stone: {
          50: "#fffaf3",
          100: "#f8efe4",
          200: "#eedfcd",
          300: "#deccb0",
          400: "#c7ae88",
          500: "#ab8e69",
          600: "#8a7053",
          700: "#6d5943",
          800: "#564736",
          900: "#43382b",
        },
        charcoal: {
          50: "#f7f5f2",
          100: "#ece7e1",
          200: "#d7cec2",
          300: "#b6a897",
          400: "#94826f",
          500: "#766554",
          600: "#5f5245",
          700: "#4e433a",
          800: "#2f2925",
          900: "#1f1b18",
          DEFAULT: "#2f2925",
        },
        amber: {
          50: "#fff7e9",
          100: "#feebc3",
          200: "#fbd88c",
          300: "#f6c153",
          400: "#eea928",
          500: "#d98d17",
          600: "#b77012",
          700: "#945612",
          800: "#784314",
          900: "#633715",
          DEFAULT: "#d98d17",
        },
        primary: {
          DEFAULT: "#e06a21",
          container: "#bf5319",
          foreground: "#fffaf3",
        },
        background: {
          light: "#fffaf3",
          dark: "#1a1714",
        },
        surface: {
          light: "#f8efe4",
          highest: "#fffdf9",
          dark: "#241f1b",
        },
        text: {
          main: {
            light: "#2f2925",
            dark: "#f7f1e8",
          },
          sub: {
            light: "#5f5245",
            dark: "#cfbead",
          },
        },
        border: {
          DEFAULT: "#e6d8c5",
          light: "#eadcc8",
          dark: "#3a312a",
        },
        secondary: {
          DEFAULT: "#2f6444",
          foreground: "#fffaf3",
          container: "#d8ecde",
        },
        card: {
          DEFAULT: "#fffdf9",
          foreground: "#2f2925",
        },
        muted: {
          DEFAULT: "#f3e7d8",
          foreground: "#766554",
        },
        destructive: {
          DEFAULT: "#bb4d3a",
          foreground: "#fff8f4",
        },
        input: "#fff8f0",
        ring: "#e06a21",
        popover: {
          DEFAULT: "#fffdf9",
          foreground: "#2f2925",
        },
      },
      borderRadius: {
        lg: "1.5rem",
        md: "1rem",
        sm: "0.75rem",
      },
      boxShadow: {
        atelier:
          "0 30px 90px -38px rgba(72, 40, 18, 0.28), 0 18px 44px -28px rgba(47, 41, 37, 0.14)",
        float:
          "0 20px 44px -26px rgba(72, 40, 18, 0.2), 0 10px 18px -12px rgba(47, 41, 37, 0.12)",
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
        skeletonShimmer: {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
        floatUp: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        swipeIn: "swipeIn 0.5s ease-in-out forwards",
        skeletonShimmer: "skeletonShimmer 1.8s ease-in-out infinite",
        floatUp: "floatUp 8s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
