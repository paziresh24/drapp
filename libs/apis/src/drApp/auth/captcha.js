import { client } from './client';

export const captcha = async () => {
    return await client.get(`/auth/captcha`);
};
