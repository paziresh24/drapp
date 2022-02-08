import axios from 'axios';
// @ts-ignore
import { getToken } from '@paziresh24/utils/localstorage';
// @ts-ignore
import { baseURL } from '@paziresh24/utils/baseUrl';

/*
    This is the client for the prescription-statistics api.
    when request in proxy pass client -> {localtion.origin}/statistics
    when request local client -> {public_env.P24_STATISTICS_API}
*/
const client = axios.create({
    baseURL: baseURL('STATISTICS_API')
});

client.interceptors.request.use(
    config => {
        const token = getToken();
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

client.interceptors.response.use(
    res => {
        return res.data;
    },
    err => {
        return Promise.reject(err);
    }
);

export { client };
