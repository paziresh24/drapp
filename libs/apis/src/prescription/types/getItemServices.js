import { client } from '../client';
import qs from 'query-string';

export const getItemServices = async params => {
    return await client.get(`/prescription-items`, {
        params,
        paramsSerializer: params => qs.stringify(params)
    });
};
