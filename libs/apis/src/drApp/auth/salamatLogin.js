import { client } from './client';

export const salamatLogin = params => {
    return client.post(`/salamat-auth/login`, params);
};
