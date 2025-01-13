/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "#14b8a6", // teal-500
      },
      fontSize: {
        xs: ["0.625rem", "0.75rem"], // 10px 12px
        sm: ["0.75rem", "1rem"], // 12px 16px
        base: ["0.875rem", "1.25rem"], // 14px 20px
        lg: ["1rem", "1.5rem"], // 16px 24px
        xl: ["1.125rem", "1.75rem"], // 18px 28px
        "2xl": ["1.25rem", "1.75rem"], // 20px 28px
        "3xl": ["1.5rem", "2rem"], // 24px 32px
        "4xl": ["1.875rem", "2.25rem"], // 30px 36px
      },
    },
  },
  plugins: [],
};
