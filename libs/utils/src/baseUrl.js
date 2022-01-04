export const baseURL = key => {
    const isProduction = process.env.NODE_ENV === 'production';
    const isMainDomain = window.location.host === process.env.REACT_APP_MAIN_DOMAIN;

    if (key === 'DRAPP_API') {
        if (isProduction && !isMainDomain) {
            return window.location.origin + process.env.REACT_APP_BASE_ROUTE;
        }
        return process.env.REACT_APP_BASE_URL;
    }

    if (key === 'PRESCRIPTION_API') {
        if (isProduction && !isMainDomain) {
            return window.location.origin + process.env.REACT_APP_BASE_URL_PRESCRIPTION_ROUTE;
        }
        return process.env.REACT_APP_BASE_URL_PRESCRIPTION_API;
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
        return process.env.REACT_APP_BASE_URL_UPLOADER_API;
    }
};
