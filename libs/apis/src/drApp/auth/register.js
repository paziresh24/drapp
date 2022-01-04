import { client } from '../../client';

export const register = async params => {
    return await client.post(`/auth/register`, params);
};
