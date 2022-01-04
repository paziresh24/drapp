import { client } from '../../client';

export const login = async params => {
    return await client.post(`/auth/login`, params);
};
