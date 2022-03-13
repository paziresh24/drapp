import { client } from './client';

export const salamatLogin = async params => {
    return await client.post(`/salamat-auth/login`, params);
};
