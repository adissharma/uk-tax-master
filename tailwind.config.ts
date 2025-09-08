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
        // Material Design 3 specific colors
        md: {
          primary: "hsl(var(--md-primary))",
          'on-primary': "hsl(var(--md-on-primary))",
          'primary-container': "hsl(var(--md-primary-container))",
          'on-primary-container': "hsl(var(--md-on-primary-container))",
          secondary: "hsl(var(--md-secondary))",
          'on-secondary': "hsl(var(--md-on-secondary))",
          'secondary-container': "hsl(var(--md-secondary-container))",
          'on-secondary-container': "hsl(var(--md-on-secondary-container))",
          tertiary: "hsl(var(--md-tertiary))",
          'on-tertiary': "hsl(var(--md-on-tertiary))",
          'tertiary-container': "hsl(var(--md-tertiary-container))",
          'on-tertiary-container': "hsl(var(--md-on-tertiary-container))",
          error: "hsl(var(--md-error))",
          'on-error': "hsl(var(--md-on-error))",
          'error-container': "hsl(var(--md-error-container))",
          'on-error-container': "hsl(var(--md-on-error-container))",
          surface: "hsl(var(--md-surface))",
          'on-surface': "hsl(var(--md-on-surface))",
          'surface-variant': "hsl(var(--md-surface-variant))",
          'on-surface-variant': "hsl(var(--md-on-surface-variant))",
          'surface-container': "hsl(var(--md-surface-container))",
          'surface-container-high': "hsl(var(--md-surface-container-high))",
          'surface-container-highest': "hsl(var(--md-surface-container-highest))",
          'surface-container-low': "hsl(var(--md-surface-container-low))",
          'surface-container-lowest': "hsl(var(--md-surface-container-lowest))",
          'inverse-surface': "hsl(var(--md-inverse-surface))",
          'inverse-on-surface': "hsl(var(--md-inverse-on-surface))",
          'inverse-primary': "hsl(var(--md-inverse-primary))",
          outline: "hsl(var(--md-outline))",
          'outline-variant': "hsl(var(--md-outline-variant))",
        },
      },
      fontSize: {
        'display-large': 'var(--display-large)',
        'display-medium': 'var(--display-medium)',
        'display-small': 'var(--display-small)',
        'headline-large': 'var(--headline-large)',
        'headline-medium': 'var(--headline-medium)',
        'headline-small': 'var(--headline-small)',
        'title-large': 'var(--title-large)',
        'title-medium': 'var(--title-medium)',
        'title-small': 'var(--title-small)',
        'body-large': 'var(--body-large)',
        'body-medium': 'var(--body-medium)',
        'body-small': 'var(--body-small)',
        'label-large': 'var(--label-large)',
        'label-medium': 'var(--label-medium)',
        'label-small': 'var(--label-small)',
      },
      spacing: {
        'md-xs': 'var(--space-xs)',
        'md-sm': 'var(--space-sm)',
        'md-md': 'var(--space-md)',
        'md-lg': 'var(--space-lg)',
        'md-xl': 'var(--space-xl)',
        'md-2xl': 'var(--space-2xl)',
        'md-3xl': 'var(--space-3xl)',
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
