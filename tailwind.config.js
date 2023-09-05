/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./assets/**/*.{html,js}', './index.html', './node_modules/flowbite/**/*.js'],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                bgDark: '#1A1A1A',
                darkColor: '#282929',
            },
            inset: {
                '[109px]': '115px',
                '[7.5px]': '7.5px',
            },
        },
    },
    plugins: [require('flowbite/plugin')],
};
