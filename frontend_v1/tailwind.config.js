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
          50: "#f6f9f7",
          100: "#e7efe9",
          200: "#cbcbcb",
          300: "#749e8a",
          400: "#3b785c",
          500: "#174d38",
          600: "#123c2c",
          700: "#0e2e21",
          800: "#0a2017",
          900: "#06130e",
          DEFAULT: "#174d38",
        },
        forest: {
          50: "#f6f9f7",
          100: "#e7efe9",
          200: "#cbd0cb",
          300: "#a3bcae",
          400: "#749e8a",
          500: "#537865",
          600: "#3b5749",
          700: "#253a30",
          800: "#122019",
          900: "#08100c",
          DEFAULT: "#749e8a",
          dark: "#174d38",
        },
        stone: {
          50: "#fafafb",
          100: "#f3f4f6",
          200: "#e5e7eb",
          300: "#d1d5db",
          400: "#9ca3af",
          500: "#6b7280",
          600: "#4b5563",
          700: "#374151",
          800: "#1f2937",
          900: "#111827",
        },
        charcoal: {
          50: "#f8f9f8",
          100: "#f1f3f1",
          200: "#e2e4e2",
          300: "#cbd0cb",
          400: "#9ca59c",
          500: "#6c766c",
          600: "#4b524b",
          700: "#333733",
          800: "#1e201e",
          900: "#0f100f",
          DEFAULT: "#1e201e",
        },
        amber: {
          50: "#fefce8",
          100: "#fef9c3",
          200: "#fef08a",
          300: "#fde047",
          400: "#facc15",
          500: "#eab308",
          600: "#ca8a04",
          700: "#a16207",
          800: "#854d0e",
          900: "#713f12",
          DEFAULT: "#eab308",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        background: {
          light: "#f2f2f2",
          dark: "#0a120e",
        },
        surface: {
          light: "#e2e4e2",
          highest: "#ffffff",
          dark: "#12241d",
        },
        text: {
          main: {
            light: "#0e231b",
            dark: "#f2f2f2",
          },
          sub: {
            light: "#3b5246",
            dark: "#cbd0cb",
          },
        },
        border: {
          DEFAULT: "hsl(var(--border))",
          light: "#e2e4e2",
          dark: "#174d38",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
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
