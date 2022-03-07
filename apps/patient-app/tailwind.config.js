const { join } = require('path');
const { createGlobPatternsForDependencies } = require('@nrwl/next/tailwind');

module.exports = {
    content: [
        join(__dirname, './**/*.{js,ts,jsx,tsx}'),
        ...createGlobPatternsForDependencies(__dirname)
    ],
    theme: {
        extend: {
            colors: {
                primary: '#0077DB',
                gray: '#F8FAFB',
                secondary: '#27BDA0',
                brand: '#3F3F79'
            },
            boxShadow: {
                card: '0px 7px 25px #98a1a925'
            }
        }
    },
    plugins: [require('@tailwindcss/line-clamp'), require('tailwindcss-rtl')]
};
