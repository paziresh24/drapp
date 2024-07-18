import { client } from '@paziresh24/apis/client';
import { refreshToken } from '@paziresh24/apis/drApp/auth/refreshToken';
import { clearToken, getToken, setToken } from '@paziresh24/utils/localstorage';
import axios from 'axios';

export const apiGatewayClient = axios.create({
    baseURL: window._env_.P24_API_GATEWAY_BASE_URL,
    withCredentials: true
});

// onRequest
apiGatewayClient.interceptors.request.use(
    config => {
        return config;
    },
    err => {
        return Promise.reject(err);
    }
);

// onResponse
apiGatewayClient.interceptors.response.use(
    res => {
        return res;
    },
    async err => {
        const originalRequest = err.config;
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
