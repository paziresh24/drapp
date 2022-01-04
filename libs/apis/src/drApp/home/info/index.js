import { client } from '../../../client';

export const info = async () => {
    return await client.get(`/auth/me`);
};
