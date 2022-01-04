import { client } from './client';
import qs from 'query-string';

export const diseases = async params => {
    return await client.get(`/diseases/`, {
        params,
        paramsSerializer: params => qs.stringify(params)
    });
};
