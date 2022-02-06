const { createGlobPatternsForDependencies } = require('@nrwl/react/tailwind');

module.exports = {
    content: [...createGlobPatternsForDependencies(__dirname)],
    theme: {
        extend: {}
    },
    plugins: []
};
