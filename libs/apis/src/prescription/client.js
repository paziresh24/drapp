import axios from 'axios';
import { baseURL } from '@paziresh24/utils/baseUrl';

const client = axios.create({
    baseURL: baseURL('PRESCRIPTION_API')
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
