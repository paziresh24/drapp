import { client } from '../client';

export const setSetting = async params => {
    return await client.post(`/settings`, params);
};
