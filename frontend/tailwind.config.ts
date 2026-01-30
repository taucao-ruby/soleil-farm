import type { Config } from 'tailwindcss';

/**
 * Soleil Farm Design System
 * ===========================
 * Thiết kế dựa trên:
 * - Màu xanh lá (green): Sức sống, mùa màng, nông nghiệp
 * - Màu vàng đất (amber/yellow): Mặt trời, đất đai, mùa gặt
 * - Màu nâu đất (brown): Đất canh tác, tự nhiên
 * - Màu xanh nước (blue): Nguồn nước, tưới tiêu
 */
const config: Config = {
  // ===== Dark Mode Strategy =====
  darkMode: ['class'],

  // ===== Content Paths =====
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ],

  // ===== Theme Configuration =====
  theme: {
    // ===== Container (Mobile-First) =====
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '1.5rem',
        lg: '2rem',
      },
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1400px', // Max width for readability
      },
    },

    extend: {
      // ===== Custom Colors (Soleil Farm Palette) =====
      colors: {
        // Primary: Green (Sức sống, mùa màng)
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e', // Main
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },

        // Secondary: Amber (Mặt trời, mùa gặt)
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },

        // Accent: Earth tones
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },

        // Farm-specific semantic colors
        farm: {
          // Đất canh tác
          soil: {
            light: '#d4a574',
            DEFAULT: '#a0522d',
            dark: '#654321',
          },
          // Lúa chín
          harvest: {
            light: '#fef3c7',
            DEFAULT: '#f59e0b',
            dark: '#b45309',
          },
          // Nước tưới
          water: {
            light: '#e0f2fe',
            DEFAULT: '#0ea5e9',
            dark: '#0369a1',
          },
          // Lá xanh
          leaf: {
            light: '#d1fae5',
            DEFAULT: '#10b981',
            dark: '#047857',
          },
          // Mặt trời (Soleil)
          sun: {
            light: '#fef9c3',
            DEFAULT: '#eab308',
            dark: '#a16207',
          },
        },

        // shadcn/ui CSS Variables
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',

        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },

        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },

        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },

        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },

        // Status colors
        success: {
          DEFAULT: '#22c55e',
          foreground: '#ffffff',
        },
        warning: {
          DEFAULT: '#f59e0b',
          foreground: '#ffffff',
        },
        error: {
          DEFAULT: '#ef4444',
          foreground: '#ffffff',
        },
        info: {
          DEFAULT: '#3b82f6',
          foreground: '#ffffff',
        },
      },

      // ===== Typography =====
      fontFamily: {
        sans: [
          'Inter',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'Noto Sans',
          'sans-serif',
        ],
        mono: [
          'JetBrains Mono',
          'Fira Code',
          'Monaco',
          'Consolas',
          'Liberation Mono',
          'monospace',
        ],
      },

      fontSize: {
        // Vietnamese-friendly sizes (slightly larger for readability)
        xs: ['0.75rem', { lineHeight: '1.25rem' }],
        sm: ['0.875rem', { lineHeight: '1.375rem' }],
        base: ['1rem', { lineHeight: '1.625rem' }],
        lg: ['1.125rem', { lineHeight: '1.75rem' }],
        xl: ['1.25rem', { lineHeight: '1.875rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.375rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.75rem' }],
      },

      // ===== Border Radius (Friendly, approachable) =====
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },

      // ===== Spacing =====
      spacing: {
        '4.5': '1.125rem',
        '5.5': '1.375rem',
        '18': '4.5rem',
        '22': '5.5rem',
      },

      // ===== Animations (Subtle, professional) =====
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'fade-out': {
          from: { opacity: '1' },
          to: { opacity: '0' },
        },
        'slide-in-from-top': {
          from: { transform: 'translateY(-100%)' },
          to: { transform: 'translateY(0)' },
        },
        'slide-in-from-bottom': {
          from: { transform: 'translateY(100%)' },
          to: { transform: 'translateY(0)' },
        },
        'scale-in': {
          from: { transform: 'scale(0.95)', opacity: '0' },
          to: { transform: 'scale(1)', opacity: '1' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '.5' },
        },
      },

      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.2s ease-out',
        'fade-out': 'fade-out 0.2s ease-out',
        'slide-in-from-top': 'slide-in-from-top 0.3s ease-out',
        'slide-in-from-bottom': 'slide-in-from-bottom 0.3s ease-out',
        'scale-in': 'scale-in 0.2s ease-out',
        shimmer: 'shimmer 2s infinite',
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },

      // ===== Box Shadow =====
      boxShadow: {
        soft: '0 2px 8px -2px rgba(0, 0, 0, 0.1)',
        medium: '0 4px 12px -4px rgba(0, 0, 0, 0.15)',
        large: '0 8px 24px -8px rgba(0, 0, 0, 0.2)',
      },

      // ===== Backdrop Blur =====
      backdropBlur: {
        xs: '2px',
      },
    },
  },

  // ===== Plugins =====
  plugins: [
    // Add any custom plugins here
    // require('@tailwindcss/forms'),
    // require('@tailwindcss/typography'),
  ],
};

export default config;
