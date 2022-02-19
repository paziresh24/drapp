const withNx = require('@nrwl/next/plugins/with-nx');

const isProduction = process.env.NODE_ENV === 'production';

/**
 * @type {import('@nrwl/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
    nx: {
        svgr: false
    },
    basePath: isProduction ? '/patient' : ''
};

module.exports = withNx(nextConfig);
