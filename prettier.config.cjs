module.exports = {
  singleQuote: true,
  importOrderSeparation: true,
  importOrder: [
    '^@/components/(.*)$',
    '^@/hooks/(.*)$',
    '^@/lib/(.*)$',
    '^@/redux/(.*)$',
    '^@/types/(.*)$',
    '^@/utils/(.*)$',
    '^@/server/(.*)$',
    '^@/styles/(.*)$',
    '^[./]',
  ],
  plugins: [require.resolve('prettier-plugin-tailwindcss')],
};
