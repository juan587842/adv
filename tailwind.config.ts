import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--color-background)",
        surface: {
          DEFAULT: "var(--color-surface)",
          elevated: "var(--color-surface-elevated)",
        },
        primary: {
          DEFAULT: "var(--color-primary)",
          light: "var(--color-primary-light)",
        },
        secondary: "var(--color-secondary)",
        tertiary: "var(--color-tertiary)",
        error: "var(--color-error)",
        border: "var(--color-border)",
      },
      borderRadius: {
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
      },
      boxShadow: {
        'card': '0 2px 12px rgba(0,0,0,0.25), 0 0 1px rgba(201,169,110,0.05)',
        'card-hover': '0 4px 24px rgba(0,0,0,0.35), 0 0 1px rgba(201,169,110,0.1)',
        'inner-glow': 'inset 0 1px 0 rgba(255,255,255,0.03)',
      },
    },
  },
  plugins: [],
};
export default config;
