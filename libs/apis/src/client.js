import axios from 'axios';
import { baseURL } from '@paziresh24/utils/baseUrl';
import { getToken, setToken, clearToken } from '@paziresh24/utils/localstorage';
import { refreshToken } from './drApp/auth/refreshToken';
import { getSplunkInstance } from '@paziresh24/shared/ui/provider';

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
        config.startDateTime = new Date();
        return config;
    },
    err => {
        return Promise.reject(err);
    }
);

// onResponse
client.interceptors.response.use(
    res => {
        const isTimeDifferenceNowAndStartTimeGreaterThan3Seconds =
            new Date().getTime() - res.config.startDateTime.getTime() > 3000;

        if (isTimeDifferenceNowAndStartTimeGreaterThan3Seconds) {
            getSplunkInstance().sendEvent({
                group: 'doctor-api',
                type: 'response-time-greater-than-3-seconds',
                event: {
                    end_point: res.config.url,
                    time_ms: new Date().getTime() - res.config.startDateTime.getTime()
                }
            });
        }
        return res.data;
    },
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

export { client };
