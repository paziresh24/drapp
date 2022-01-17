import { client } from '../client';
import qs from 'query-string';

export const search = async (endpoint, params) => {
    return await client.get(`/insurance/search/${endpoint !== 'undefined' ? endpoint : ''}`, {
        params,
        paramsSerializer: params => qs.stringify(params)
    });
};
