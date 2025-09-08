import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
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
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input-background))",
        ring: "hsl(var(--input-focus))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          hover: "hsl(var(--primary-hover))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        // GOV.UK specific colors
        govuk: {
          black: "hsl(var(--govuk-black))",
          'dark-grey': "hsl(var(--govuk-dark-grey))",
          'mid-grey': "hsl(var(--govuk-mid-grey))",
          'light-grey': "hsl(var(--govuk-light-grey))",
          white: "hsl(var(--govuk-white))",
          blue: "hsl(var(--govuk-blue))",
          'light-blue': "hsl(var(--govuk-light-blue))",
          green: "hsl(var(--govuk-green))",
          'light-green': "hsl(var(--govuk-light-green))",
          red: "hsl(var(--govuk-red))",
          'light-red': "hsl(var(--govuk-light-red))",
          orange: "hsl(var(--govuk-orange))",
          yellow: "hsl(var(--govuk-yellow))",
        },
      },
      fontSize: {
        'govuk-xl': 'var(--text-xl)',
        'govuk-lg': 'var(--text-lg)',
        'govuk-md': 'var(--text-md)',
        'govuk-sm': 'var(--text-sm)',
        'govuk-xs': 'var(--text-xs)',
      },
      spacing: {
        'govuk-xs': 'var(--space-xs)',
        'govuk-sm': 'var(--space-sm)',
        'govuk-md': 'var(--space-md)',
        'govuk-lg': 'var(--space-lg)',
        'govuk-xl': 'var(--space-xl)',
        'govuk-2xl': 'var(--space-2xl)',
        'govuk-3xl': 'var(--space-3xl)',
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
