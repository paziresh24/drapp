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
        const token = getToken();
        if (token && config.url !== `${baseURL('PRESCRIPTION_API')}/pwa-versions/latest`) {
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
workflow.interceptors.response.use(
    res => {
        return res.data;
    },
    async err => {
        const originalRequest = err.config;
        if (err.response?.status === 401 && window.location.pathname !== '/auth') {
            try {
                const { access_token } = (await refreshToken()) as any;
                setToken(access_token);
                return workflow(originalRequest);
            } catch (error) {
                clearToken();
                return window.location.replace(
                    `/auth${
                        location.pathname !== '/' || location.search
                            ? `?url=${location.pathname + location.search}`
                            : ''
                    }`
                );
            }
        }
        return Promise.reject(err);
    }
);
