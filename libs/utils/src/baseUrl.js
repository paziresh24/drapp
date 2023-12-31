export const baseURL = key => {
    const isProduction = process.env.NODE_ENV === 'production';
    const isMainDomain =
        window.location.host === window._env_.P24_MAIN_DOMAIN ||
        window.location.hostname === 'localhost';

    if (key === 'DRAPP_API') {
        if (isProduction && !isMainDomain) {
            return window.location.origin + process.env.REACT_APP_BASE_ROUTE;
        }
        return window._env_.P24_BASE_URL;
    }

    if (key === 'WORKFLOW_API') {
        if (isProduction && !isMainDomain) {
            return window.location.origin + process.env.REACT_APP_BASE_ROUTE;
        }
        return window._env_.P24_WORKFLOW_API;
    }

    if (key === 'AUTH_API') {
        if (isProduction && !isMainDomain) {
            return window.location.origin + process.env.REACT_APP_AUTH_ROUTE;
        }
        return window._env_.P24_AUTH_API;
    }

    if (key === 'PRESCRIPTION_API') {
        if (isProduction && !isMainDomain) {
            return window.location.origin + process.env.REACT_APP_BASE_URL_PRESCRIPTION_ROUTE;
        }
        return window._env_.P24_BASE_URL_PRESCRIPTION_API;
    }

    if (key === 'STATISTICS_API') {
        if (isProduction && !isMainDomain) {
            return window.location.origin + process.env.REACT_APP_STATISTICS_ROUTE;
        }
        return window._env_.P24_STATISTICS_API;
    }

    if (key === 'PRESCRIPTION_IFRAM') {
        if (isProduction && !isMainDomain) {
            return window.location.origin + process.env.REACT_APP_PRESCRIPTION_IFRAM_ROUTE;
        }
        return process.env.REACT_APP_PRESCRIPTION_IFRAM_URL;
    }

    if (key === 'UPLOADER') {
        if (isProduction && !isMainDomain) {
            return window.location.origin + process.env.REACT_APP_BASE_URL_UPLOADER_ROUTE;
        }
        return window._env_.P24_BASE_URL_UPLOADER_API;
    }
};
