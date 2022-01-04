import { client } from './client';

export const getDefault = async params => {
    return await client.get(`/defaults/best`, { params });
};
