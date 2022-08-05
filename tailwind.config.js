/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./assets/**/*.{html,js}', './index.html'],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                bgDark: '#1A1A1A',
                darkColor: '#282929',
            },
            inset: {
                '[109px]': '109px',
            },
        },
    },
    plugins: [],
};
