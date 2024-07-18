import axios from 'axios';
import { baseURL } from '@paziresh24/utils/baseUrl';
import { getSplunkInstance } from '@paziresh24/shared/ui/provider';

const client = axios.create({
    baseURL: baseURL('PRESCRIPTION_API'),
    withCredentials: true
});

client.interceptors.response.use(
    res => {
        const isTimeDifferenceNowAndStartTimeGreaterThan3Seconds =
            new Date().getTime() - res.config.startDateTime.getTime() > 3000;

        if (isTimeDifferenceNowAndStartTimeGreaterThan3Seconds) {
            getSplunkInstance().sendEvent({
                group: 'prescription-api',
                type: 'response-time-greater-than-3-seconds',
                event: {
                    end_point: res.config.url,
                    time_ms: new Date().getTime() - res.config.startDateTime.getTime()
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
        config.headers['Content-Type'] = 'application/json';
        config.startDateTime = new Date();
        return config;
    },
    err => {
        return Promise.reject(err);
    }
);

export { client };
