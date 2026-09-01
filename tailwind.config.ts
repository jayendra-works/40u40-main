import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      maxWidth: {
        container: "var(--container-max)",
      },
      colors: {
        primary: "var(--color-primary)",
        secondary: "var(--color-secondary)",
        gold: "var(--color-gold)",
        "gold-light": "var(--color-gold-light)",
        "gold-muted": "var(--color-gold-muted)",
        white: "var(--color-white)",
        "text-primary": "var(--color-text-primary)",
        "text-secondary": "var(--color-text-secondary)",
        "text-tertiary": "var(--color-text-tertiary)",
        neutral: {
          400: "var(--color-text-secondary)",
          500: "var(--color-text-tertiary)",
          600: "var(--color-text-tertiary)",
        },
      },
      fontFamily: {
        display: ["var(--font-cormorant)", "serif"],
        sans: ["var(--font-inter)", "sans-serif"],
      },
      fontSize: {
        hero: ["var(--text-hero)", { lineHeight: "var(--leading-heading)" }],
        section: ["var(--text-section)", { lineHeight: "var(--leading-heading)" }],
        subhead: ["var(--text-subhead)", { lineHeight: "var(--leading-body)" }],
        body: ["var(--text-body)", { lineHeight: "var(--leading-body)" }],
        small: ["var(--text-small)", { lineHeight: "1.5" }],
      },
      spacing: {
        xs: "var(--space-xs)",
        sm: "var(--space-sm)",
        md: "var(--space-md)",
        lg: "var(--space-lg)",
        xl: "var(--space-xl)",
        "2xl": "var(--space-2xl)",
        "3xl": "var(--space-3xl)",
        section: "var(--space-section)",
      },
      padding: {
        section: "var(--space-section)",
      },
      borderColor: {
        DEFAULT: "var(--color-border-muted)",
        "border-muted": "var(--color-border-muted)",
        gold: "var(--color-border)",
      },
      backgroundImage: {
        "gold-gradient": "var(--color-accent-gradient)",
      },
      letterSpacing: {
        heading: "var(--tracking-heading)",
        label: "var(--tracking-label)",
      },
      transitionTimingFunction: {
        luxury: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      transitionDuration: {
        "1500": "1500ms",
        "2000": "2000ms",
      },
    },
  },
  plugins: [],
};

export default config;
