const { projects } = require('./workspace.json');

const levelType = {
    error: 2,
    warning: 1,
    off: 0
};

module.exports = {
    extends: ['@commitlint/config-conventional'],
    rules: {
        'scope-empty': [levelType.error, 'never'],
        'scope-enum': [levelType.error, 'always', [...Object.keys(projects), '*']]
    }
};
