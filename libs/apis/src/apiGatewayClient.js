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
        if (err.response?.status === 401 && window.location.pathname !== '/auth') {
            return window.location.replace(
                `/auth${
                    window.location.pathname !== '/' || window.location.search
                        ? `?url=${window.location.pathname + window.location.search}`
                        : ''
                }`
            );
        }
        return Promise.reject(err);
    }
);
