/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./*.jsx",
    "./*.js",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  safelist: [
    // amber dynamic classes
    'text-amber-400', 'text-amber-300', 'text-amber-200',
    'bg-amber-500', 'bg-amber-500/10', 'bg-amber-500/20', 'bg-amber-500/30',
    'border-amber-500', 'border-amber-500/30', 'border-amber-500/40', 'border-amber-500/50',
    'from-amber-500', 'to-yellow-500',
    'hover:border-amber-500', 'hover:border-amber-500/50',
    'hover:bg-amber-500/10', 'hover:text-amber-400',
    'accent-amber-500',
    // purple dynamic classes
    'text-purple-400', 'text-purple-300', 'text-purple-200',
    'bg-purple-500', 'bg-purple-500/10', 'bg-purple-500/20', 'bg-purple-500/30',
    'border-purple-500', 'border-purple-500/30', 'border-purple-500/40', 'border-purple-500/50',
    'from-purple-500', 'to-pink-500',
    'hover:border-purple-500', 'hover:border-purple-500/50',
    'hover:bg-purple-500/10',
    'accent-purple-500',
    // border-t spin colors
    'border-t-amber-500', 'border-t-purple-500',
    'border-amber-500/30', 'border-purple-500/30',
  ],
}
