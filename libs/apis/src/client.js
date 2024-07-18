import axios from 'axios';
import { baseURL } from '@paziresh24/utils/baseUrl';
import { getToken, setToken, clearToken } from '@paziresh24/utils/localstorage';
import { refreshToken } from './drApp/auth/refreshToken';
import { getSplunkInstance } from '@paziresh24/shared/ui/provider';

const client = axios.create({
    baseURL: baseURL('DRAPP_API'),
    withCredentials: true
});

// onRequest
client.interceptors.request.use(
    config => {
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

export { client };
