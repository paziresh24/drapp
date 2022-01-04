import { client } from '../client';

export const auth = async param => {
    return await client.post(`/auth/local`, param);
};
