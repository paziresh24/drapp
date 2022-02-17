const { join } = require('path');
const { createGlobPatternsForDependencies } = require('@nrwl/react/tailwind');

module.exports = {
    content: [
        'src/**/*.{js,ts,jsx,tsx}',
        '../../libs/**/*.{js,jsx,ts,tsx}',
        '../**/*.{js,jsx,ts,tsx}',
        ...createGlobPatternsForDependencies(__dirname)
    ],
    theme: {
        extend: {
            minWidth: {
                20: '5rem'
            }
        }
    },
    plugins: [require('tailwindcss-rtl')]
};
