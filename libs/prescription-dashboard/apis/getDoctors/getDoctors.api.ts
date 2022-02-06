import { client } from '../client';
import qs from 'query-string';

export const getDoctors = async params => {
    return await client.get(`/user/doctors`, {
        params,
        paramsSerializer: params => qs.stringify(params)
    });
};
