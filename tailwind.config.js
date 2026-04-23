/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'Noto Sans SC', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'SF Mono', 'Monaco', 'Cascadia Code', 'Courier New', 'monospace'],
      },
      colors: {
        // Primary - Original premium darker blue
        primary: {
          50: '#E6F0F7',
          100: '#CCE1EF',
          200: '#99C3DF',
          300: '#63B4FF',
          400: '#4DA6F0',
          500: '#3C91E6',
          600: '#2D7ACC',
          700: '#1E5F8B', // Original - Main buttons
          800: '#164E73',
          900: '#0A3D62', // Original - Navbar, emphasis
        },
        // Accent - Brass Gold (设计系统: #B8860B)
        accent: {
          50: '#FDF8E8',
          100: '#FAF0C4',
          200: '#F5E09B',
          300: '#E8C44B',
          400: '#D4A84B',
          500: '#B8860B',
          600: '#8B6508',
          700: '#6B4F0A',
          800: '#4A3707',
          900: '#2A2004',
        },
        // Success - Forest Green (设计系统: #059669)
        success: {
          50: '#ECFDF5',
          100: '#D1FAE5',
          200: '#A7F3D0',
          300: '#6EE7B7',
          400: '#34D399',
          500: '#059669',
          600: '#10B981',
          700: '#047857',
          800: '#065F46',
          900: '#064E3B',
        },
        // Warning - Amber (设计系统: #D97706)
        warning: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#D97706',
          600: '#F59E0B',
          700: '#B45309',
          800: '#92400E',
          900: '#78350F',
        },
        // Error - Rust Red (设计系统: #DC2626)
        error: {
          50: '#FEF2F2',
          100: '#FEE2E2',
          200: '#FECACA',
          300: '#FCA5A5',
          400: '#F87171',
          500: '#DC2626',
          600: '#EF4444',
          700: '#B91C1C',
          800: '#991B1B',
          900: '#7F1D1D',
        },
        // Info (设计系统)
        info: {
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#2563EB',
          600: '#3B82F6',
          700: '#1D4ED8',
          800: '#1E40AF',
          900: '#1E3A8A',
        },
      },
      // Shadow system (设计系统)
      boxShadow: {
        'sm': '0 1px 2px rgba(0, 0, 0, 0.05)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        'primary': '0 4px 12px rgba(30, 90, 139, 0.3)', // Original primary hover
        'card-hover': '0 8px 24px rgba(30, 90, 139, 0.1)', // Original card hover
      },
      // Border radius (设计系统)
      borderRadius: {
        'button': '8px',
        'card': '12px',
        'modal': '16px',
      },
      // Transition timing (设计系统)
      transitionDuration: {
        'fast': '150ms',
        'normal': '200ms',
        'slow': '300ms',
      },
    },
  },
  plugins: [],
};
