import { client } from './client';

export const getBrands = async params => {
    return await client.get(`/brands`, { params });
};
