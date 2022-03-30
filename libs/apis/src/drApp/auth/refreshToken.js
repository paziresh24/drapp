import { client } from './client';

export const refreshToken = async () => {
    return await client.post(`/auth/refresh`);
};
