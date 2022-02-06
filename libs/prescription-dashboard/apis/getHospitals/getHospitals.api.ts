import { client } from '../client';
import qs from 'query-string';

export const getHospitals = async params => {
    return await client.get(`/user/hospitals`, {
        params,
        paramsSerializer: params => qs.stringify(params)
    });
};
