const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');
const rootMain = require('../../../.storybook/main');

module.exports = {
    ...rootMain,
    core: { ...rootMain.core, builder: 'webpack5' },
    stories: [...rootMain.stories, '../**/*.stories.mdx', '../**/*.stories.@(js|jsx|ts|tsx)'],
    addons: [...rootMain.addons, '@nrwl/react/plugins/storybook'],
    // staticDirs: [{ from: '../public', to: '/static' }]
    webpackFinal: async (config, { configType }) => {
        if (rootMain.webpackFinal) {
            config = await rootMain.webpackFinal(config, { configType });
        }

        config.plugins.push(
            new CopyWebpackPlugin({
                patterns: [
                    {
                        from: path.resolve(__dirname, '../public'),
                        to: 'static'
                    }
                ]
            })
        );

        return config;
    }
};
