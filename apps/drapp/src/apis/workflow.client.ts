import { refreshToken } from '@paziresh24/apis/drApp/auth/refreshToken';
import { baseURL } from '@paziresh24/utils/baseUrl';
import { clearToken, getToken, setToken } from '@paziresh24/utils/localstorage';
import axios from 'axios';

export const workflow = axios.create({
    baseURL: baseURL('WORKFLOW_API'),
    withCredentials: true
});

// onRequest
workflow.interceptors.request.use(
    (config: any) => {
        config.headers['Content-Type'] = 'application/json';
        return config;
    },
    err => {
        return Promise.reject(err);
    }
);

// onResponse
workflow.interceptors.response.use(
    res => {
        return res.data;
    },
    async err => {
        if (err.response?.status === 401 && window.location.pathname !== '/auth') {
            return window.location.replace(
                `/auth${
                    location.pathname !== '/' || location.search
                        ? `?url=${location.pathname + location.search}`
                        : ''
                }`
            );
        }
        return Promise.reject(err);
    }
);
