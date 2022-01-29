const { join } = require('path');
const { createGlobPatternsForDependencies } = require('@nrwl/react/tailwind');

module.exports = {
    content: [
        'src/**/*.{js,ts,jsx,tsx}',
        '../../libs/**/*.{js,jsx,ts,tsx}',
        ...createGlobPatternsForDependencies(__dirname)
    ],
    theme: {
        extend: {}
    },
    plugins: [require('tailwindcss-rtl')]
};
