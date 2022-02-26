import axios from 'axios';
import { baseURL } from '@paziresh24/utils/baseUrl';
import { getToken, setToken, clearToken } from '@paziresh24/utils/localstorage';
import { refreshToken } from './drApp/auth/refreshToken';
import { getSplunkInstance } from '@paziresh24/components/core/provider';

const client = axios.create({
    baseURL: baseURL('DRAPP_API')
    // validateStatus: status => status >= 200 && status !== 204 && status < 300
});

// onRequest
client.interceptors.request.use(
    config => {
        const token = getToken();
        if (token && config.url !== `${baseURL('PRESCRIPTION_API')}/pwa-versions/latest`) {
            config.headers['Authorization'] = 'Bearer ' + token;
            config.headers['Content-Type'] = 'application/json';
        }
        config.startTime = new Date();
        return config;
    },
    err => {
        return Promise.reject(err);
    }
);

// onResponse
client.interceptors.response.use(
    res => {
        if (new Date().getTime() - res.config.startTime.getTime() > 3000) {
            getSplunkInstance().sendEvent({
                group: 'doctor-api',
                type: 'response-time-greater-than-3-seconds',
                event: {
                    end_point: res.config.url,
                    time_ms: new Date().getTime() - res.config.startTime.getTime()
                }
            });
        }
        return res.data;
    },
    async err => {
        const originalRequest = err.config;
        if (
            localStorage.getItem('token') &&
            err.response?.status === 401 &&
            window.location.pathname !== '/auth'
        ) {
            try {
                const { access_token } = await refreshToken();
                setToken(access_token);
                return client(originalRequest);
            } catch (error) {
                clearToken();
                return window.location.replace(
                    `${
                        process.env.NODE_ENV === 'production'
                            ? window.location.host === 'dr.paziresh24.com'
                                ? ''
                                : process.env.PUBLIC_URL
                            : ''
                    }/auth`
                );
            }
        }
        return Promise.reject(err);
    }
);

export { client };
