import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        // Viola d'Arte: palette ametista/atelier, più profonda e pittorica
        purple: {
          50: "#f7f3fd",
          100: "#efe7fb",
          200: "#e0d1f7",
          300: "#c9aeef",
          400: "#ad83e3",
          500: "#9159d2",
          600: "#7a3fbb",
          700: "#65339a",
          800: "#532d7c",
          900: "#452a64",
          950: "#2b1544",
        },
        primary: {
          50: "#f7f3fd",
          100: "#efe7fb",
          200: "#e0d1f7",
          300: "#c9aeef",
          400: "#ad83e3",
          500: "#9159d2",
          600: "#7a3fbb",
          700: "#65339a",
          800: "#532d7c",
          900: "#452a64",
          950: "#2b1544",
        },
        accent: {
          50: "#fff7ed",
          100: "#ffedd5",
          200: "#fed7aa",
          300: "#fdba74",
          400: "#fb923c",
          500: "#f97316",
          600: "#ea580c",
          700: "#c2410c",
          800: "#9a3412",
          900: "#7c2d12",
          950: "#451a03",
        },
        dark: {
          DEFAULT: "#121212",
          surface: "#181818",
          highlight: "#282828",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [],
};

export default config;
