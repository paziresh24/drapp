import { client } from '../client';
import qs from 'query-string';

export const getFrequentItems = async params => {
    return await client.get(`/frequent-items`, {
        params,
        paramsSerializer: params => qs.stringify(params)
    });
};
