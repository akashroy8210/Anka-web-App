/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Outfit"', 'sans-serif'],
        heading: ['"Playfair Display"', 'serif'],
        accent: ['"Sacramento"', 'cursive'],
        romantic: ['"Great Vibes"', 'cursive'],
        handwritten: ['"Caveat"', 'cursive'],
      },
      colors: {
        // Surprises Palette (Warm/Romantic)
        rosePrimary: '#E11D48',
        blushAccent: '#FDA4AF',
        wineDeep: '#881337',
        creamBase: '#FFF7F5',
        goldAccent: '#D4AF37',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(136, 19, 55, 0.05)',
        'glass-rose': '0 8px 32px 0 rgba(225, 29, 72, 0.12)',
      },
      backdropBlur: {
        'xs': '2px',
      }
    },
  },
  plugins: [],
}
