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
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['SF Mono', 'Monaco', 'Cascadia Code', 'Courier New', 'monospace'],
      },
      colors: {
        // Primary - 商务蓝
        primary: {
          50: '#E6F0F7',
          100: '#CCE1EF',
          200: '#99C3DF',
          300: '#63B4FF', // 浅蓝 - 背景高亮
          400: '#4DA6F0',
          500: '#3C91E6', // 活力蓝 - 悬停状态
          600: '#2D7ACC',
          700: '#1E5F8B', // 商务蓝 - 主按钮
          800: '#164E73',
          900: '#0A3D62', // 深蓝 - 导航栏
        },
        // Success - 成功绿
        success: {
          100: '#D1FAE5',
          600: '#10B981',
          800: '#065F46',
        },
        // Warning - 警告橙
        warning: {
          100: '#FEF3C7',
          500: '#F59E0B',
          800: '#92400E',
        },
        // Error - 错误红
        error: {
          100: '#FEE2E2',
          600: '#EF4444',
          800: '#991B1B',
        },
        // Info - 信息蓝
        info: {
          100: '#DBEAFE',
          500: '#3B82F6',
          800: '#1E40AF',
        },
      },
    },
  },
  plugins: [],
};
