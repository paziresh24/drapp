const { projects } = require('./workspace.json');

module.exports = {
    extends: ['@commitlint/config-conventional'],
    rules: {
        'scope-empty': [2, 'never'],
        'scope-enum': () => [2, 'always', [...Object.keys(projects), '*']]
    }
};
