// tailwind.config.js
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}", // Next.js App Router 사용 시
    "./pages/**/*.{js,ts,jsx,tsx}", // Pages Router 사용 시
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "gray-custom": "#DFDFDF",
      },
    },
  },
  plugins: [],
};
