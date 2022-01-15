import axios from 'axios';
import queryString from 'querystring';

const client = axios.create({
    baseURL:
        process.env.NODE_ENV === 'production'
            ? window.location.host === window._env_.P24_MAIN_DOMAIN
                ? queryString.parse(window.location.search)?.baseURL
                    ? queryString.parse(window.location.search)?.baseURL + '/prescription-api'
                    : window._env_.P24_BASE_URL_PRESCRIPTION_API
                : queryString.parse(window.location.search)?.baseURL
                ? queryString.parse(window.location.search)?.baseURL + '/prescription-api'
                : `${window.location.origin}/prescription-api`
            : queryString.parse(window.location.search)?.baseURL
            ? queryString.parse(window.location.search)?.baseURL + '/prescription-api'
            : window._env_.P24_BASE_URL_PRESCRIPTION_API
});

client.interceptors.response.use(
    res => {
        return res.data;
    },
    err => {
        return Promise.reject(err);
    }
);

client.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = 'Bearer ' + token;
            config.headers['Content-Type'] = 'application/json';
        }
        return config;
    },
    err => {
        return Promise.reject(err);
    }
);

export { client };
