import { client } from './client';

export const logout = async () => {
    return await client.post(`/auth/logout`);
};
