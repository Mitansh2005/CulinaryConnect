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
          50: "#fdf8f4",
          100: "#faece1",
          200: "#f3d5bd",
          300: "#eab48b",
          400: "#c08552",
          500: "#a96f3d",
          600: "#915b2e",
          700: "#764821",
          800: "#5d3715",
          900: "#45270c",
          DEFAULT: "#c08552",
        },
        forest: {
          50: "#f9f6f4",
          100: "#f1ebe6",
          200: "#dfccbe",
          300: "#c9a187",
          400: "#ab7a5d",
          500: "#895737",
          600: "#70452a",
          700: "#5e3923",
          800: "#4a2d1b",
          900: "#362113",
          DEFAULT: "#895737",
          dark: "#362113",
        },
        stone: {
          50: "#fbf8f5",
          100: "#f3e9dc",
          200: "#ecd6c3",
          300: "#e3c2aa",
          400: "#dab49d",
          500: "#c99a7e",
          600: "#b58264",
          700: "#986749",
          800: "#7a5038",
          900: "#5e3d29",
        },
        charcoal: {
          50: "#f4f1f0",
          100: "#e3dad8",
          200: "#c9b6b2",
          300: "#ab8c86",
          400: "#8c6057",
          500: "#5e3023",
          600: "#4e271c",
          700: "#3d1d14",
          800: "#2d140e",
          900: "#1e0b08",
          DEFAULT: "#3d1d14",
        },
        amber: {
          50: "#fdfbfa",
          100: "#f8efe4",
          200: "#edd8c1",
          300: "#debe9a",
          400: "#cda579",
          500: "#b58757",
          600: "#8c653f",
          700: "#65472a",
          800: "#422e1a",
          900: "#21160c",
          DEFAULT: "#b58757",
        },
        primary: {
          DEFAULT: "#c08552",
          container: "#895737",
          foreground: "#f3e9dc",
        },
        background: {
          light: "#f3e9dc",
          dark: "#3d1f17",
        },
        surface: {
          light: "#e8d6c4",
          highest: "#faf5ef",
          dark: "#5e3023",
        },
        text: {
          main: {
            light: "#3d1f17",
            dark: "#f3e9dc",
          },
          sub: {
            light: "#895737",
            dark: "#dab49d",
          },
        },
        border: {
          DEFAULT: "#dab49d",
          light: "#e8d6c4",
          dark: "#895737",
        },
        secondary: {
          DEFAULT: "#895737",
          foreground: "#f3e9dc",
          container: "#dab49d",
        },
        card: {
          DEFAULT: "#faf5ef",
          foreground: "#3d1f17",
        },
        muted: {
          DEFAULT: "#e8d6c4",
          foreground: "#895737",
        },
        destructive: {
          DEFAULT: "#994B43",
          foreground: "#f3e9dc",
        },
        input: "#faf5ef",
        ring: "#c08552",
        popover: {
          DEFAULT: "#faf5ef",
          foreground: "#3d1f17",
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
