const path = require('path');
const sassResourcesLoader = require('craco-sass-resources-loader');
const TsConfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin');

module.exports = {
    webpack: {
        alias: {
            '@components': path.resolve(__dirname, 'src/components/'),
            'components': path.resolve(__dirname, 'src/components/'),
            '@assets': path.resolve(__dirname, 'src/assets'),
            'assets': path.resolve(__dirname, 'src/assets'),
            '@hooks': path.resolve(__dirname, 'src/hooks'),
            'hooks': path.resolve(__dirname, 'src/hooks'),
            '@context': path.resolve(__dirname, 'src/context'),
            'context': path.resolve(__dirname, 'src/context'),
            '@constants': path.resolve(__dirname, 'src/constants'),
            'constants': path.resolve(__dirname, 'src/constants'),
            '@apis': path.resolve(__dirname, 'src/apis'),
            'apis': path.resolve(__dirname, 'src/apis'),
            '@pages': path.resolve(__dirname, 'src/pages'),
            'pages': path.resolve(__dirname, 'src/pages'),
            '@utils': path.resolve(__dirname, 'src/utils'),
            'utils': path.resolve(__dirname, 'src/utils'),
            '@configs': path.resolve(__dirname, 'src/configs'),
            'configs': path.resolve(__dirname, 'src/configs')
        },
        configure: config => {
            // Remove guard against importing modules outside of \`src\`.
            // Needed for workspace projects.
            config.resolve.plugins = config.resolve.plugins.filter(
                plugin => !(plugin instanceof ModuleScopePlugin)
            );
            // Add support for importing workspace projects.
            config.resolve.plugins.push(
                new TsConfigPathsPlugin({
                    configFile: path.resolve(__dirname, 'tsconfig.json'),
                    extensions: ['.ts', '.tsx', '.js', '.jsx'],
                    mainFields: ['module', 'main']
                })
            );

            // Replace include option for babel loader with exclude
            // so babel will handle workspace projects as well.
            config.module.rules[0].oneOf.forEach(r => {
                if (r.loader && r.loader.indexOf('babel') !== -1) {
                    r.exclude = /node_modules/;
                    delete r.include;
                }
            });

            config.output.publicPath = '';

            return config;
        }
    },
    plugins: [
        {
            plugin: sassResourcesLoader,
            options: {
                resources: './src/assets/styles/base.scss'
            }
        }
    ],
    jest: {
        configure: config => {
            config.resolver = '@nrwl/jest/plugins/resolver';
            return config;
        }
    }
};
