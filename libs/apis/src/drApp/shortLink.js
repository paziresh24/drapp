import { client } from '../client';

export const shortLink = async params => {
    return await client.post(`/doctor/support`, params);
};
