import axios from 'axios';
import { baseURL } from '@paziresh24/utils/baseUrl';
import { getSplunkInstance } from '@paziresh24/components/core/provider';

const client = axios.create({
    baseURL: baseURL('PRESCRIPTION_API')
});

client.interceptors.response.use(
    res => {
        if (new Date().getTime() - res.config.startTime.getTime() > 3000) {
            getSplunkInstance().sendEvent({
                group: 'prescription-api',
                type: 'response-time-greater-than-3-seconds',
                event: {
                    end_point: res.config.url,
                    time_ms: new Date().getTime() - res.config.startTime.getTime()
                }
            });
        }
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
        config.startTime = new Date();
        return config;
    },
    err => {
        return Promise.reject(err);
    }
);

export { client };
