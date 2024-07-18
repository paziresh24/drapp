import axios from 'axios';
import queryString from 'query-string';

const isProduction = process.env.NODE_ENV === 'production';
const isMainDomain = window.location.host === window._env_.P24_MAIN_DOMAIN;

const client = axios.create({
    baseURL:
        isProduction && !isMainDomain
            ? window.location.origin + process.env.REACT_APP_DR_APP_ROUTE
            : process.env.REACT_APP_DR_APP_API
});

client.interceptors.request.use(
    config => {
        config.headers['Content-Type'] = 'application/json';

        return config;
    },
    err => {
        return Promise.reject(err);
    }
);

client.interceptors.response.use(
    res => {
        return res.data;
    },
    err => {
        return Promise.reject(err);
    }
);

export { client };
