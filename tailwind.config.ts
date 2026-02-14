import type { Config } from 'tailwindcss'

const config: Config = {
  // Files to scan for class names
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],

  theme: {
    extend: {
      // Custom brand colors - Light, non-vibrant palette
      colors: {
        primary: {
          DEFAULT: '#8B9DC3',    // Soft Slate Blue - Main brand color
          dark: '#6B7FA3',       // Darker variant
          light: '#ABB9D3',      // Lighter variant
        },
        secondary: {
          DEFAULT: '#F5F1E8',    // Warm Cream - Secondary color
          dark: '#E5DFC8',       // Darker cream
        },
        success: '#86A789',      // Muted Green
        error: '#C89B9B',        // Muted Rose
        warning: '#D4B896',      // Muted Gold
        danger: '#C89B9B',       // Alias for error (for compatibility)
      },

      // Custom spacing
      spacing: {
        '128': '32rem',
      },

      // Enhanced breakpoints for better mobile support
      screens: {
        'xs': '475px',      // Extra small devices
        'sm': '640px',      // Small devices (landscape phones)
        'md': '768px',      // Medium devices (tablets)
        'lg': '1024px',     // Large devices (laptops)
        'xl': '1280px',     // Extra large devices (desktops)
        '2xl': '1536px',    // 2X large devices
      },

      // Mobile-first typography
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
      },
    },
  },

  plugins: [],
}

export default config
