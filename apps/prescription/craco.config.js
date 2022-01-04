const path = require('path');
const sassResourcesLoader = require('craco-sass-resources-loader');
const TsConfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin');

module.exports = {
    style: {
        postcss: {
            plugins: [require('tailwindcss'), require('autoprefixer')]
        }
    },
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
            '@config': path.resolve(__dirname, 'src/config'),
            'config': path.resolve(__dirname, 'src/config')
        },

        configure: (config, { env, paths }) => {
            // Remove guard against importing modules outside of `src`.
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
            config.module.rules.forEach(r => {
                if (r.oneOf) {
                    const babelLoader = r.oneOf.find(
                        rr => rr.loader.indexOf('babel-loader') !== -1
                    );
                    babelLoader.exclude = /node_modules/;
                    delete babelLoader.include;
                }
            });
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
    paths: {
        configure: (config, { env, paths }) => {
            paths.appBuild = path.resolve(__dirname, '../../dist/apps/prescription');
            return paths;
        }
    }
};
