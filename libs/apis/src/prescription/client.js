import axios from 'axios';
import queryString from 'querystring';

const isProduction = process.env.NODE_ENV === 'production';
const isMainDomain =
    window.location.host === window._env_.P24_MAIN_DOMAIN ||
    window.location.hostname === 'localhost';

const client = axios.create({
    baseURL:
        isProduction && !isMainDomain
            ? window.location.origin + process.env.P24_BASE_URL_PRESCRIPTION_ROUTE
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
