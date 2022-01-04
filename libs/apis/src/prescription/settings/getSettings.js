import { client } from '../client';

export const getSettings = async params => {
    return await client.get(`/settings`, { params });
};
