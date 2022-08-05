/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./assets/**/*.{html,js}', './index.html'],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                dark: '#191A19',
            },
        },
    },
    plugins: [],
};
