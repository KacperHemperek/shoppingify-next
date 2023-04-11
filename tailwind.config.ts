import { type Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#F9A109',
          light: '#FFF0DE',
        },
        secondary: {
          DEFAULT: '#80485B',
        },
        success: {
          DEFAULT: '#56CCF2',
        },
        danger: {
          DEFAULT: '#EB5757',
        },
        neutral: {
          DEFAULT: '#454545',
          light: '#C1C1C4',
          dark: '#34333A',
          extralight: '#FAFAFE',
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
