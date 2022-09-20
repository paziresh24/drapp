const { join } = require('path');
const { createGlobPatternsForDependencies } = require('@nrwl/react/tailwind');

module.exports = {
    content: [
        'src/**/*.{js,ts,jsx,tsx}',
        '../prescription/src/**/*.{js,ts,jsx,tsx}',
        '../../libs/**/*.{js,jsx,ts,tsx}',
        ...createGlobPatternsForDependencies(__dirname)
    ],
    theme: {
        extend: {
            minWidth: {
                20: '5rem'
            },
            colors: {
                disabled: '#D3D9DF',
                primary: '#0070f3'
            }
        }
    },
    plugins: [
        require('@tailwindcss/line-clamp'),
        require('tailwindcss-rtl'),
        require('@tailwindcss/forms')({
            strategy: 'class'
        })
    ]
};
