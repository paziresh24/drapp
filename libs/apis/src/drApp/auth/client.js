import axios from 'axios';
import { baseURL } from '@paziresh24/utils/baseUrl';
import { getToken, setToken, clearToken } from '@paziresh24/utils/localstorage';
import { refreshToken } from './refreshToken';

const client = axios.create({
    baseURL: baseURL('AUTH_API'),
    withCredentials: true
});

// onRequest
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

// onResponse
client.interceptors.response.use(
    res => res.data,
    async err => {
        const originalRequest = err.config;
        if (err.response?.status === 401 && window.location.pathname !== '/auth') {
            try {
                const { access_token } = await refreshToken();
                setToken(access_token);
                return client(originalRequest);
            } catch (error) {
                clearToken();
                return window.location.replace(
                    `/auth${
                        window.location.pathname !== '/' || window.location.search
                            ? `?url=${window.location.pathname + window.location.search}`
                            : ''
                    }`
                );
            }
        }
        return Promise.reject(err);
    }
);

export { client };
