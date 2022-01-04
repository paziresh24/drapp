import { client } from '../client';

export const clinicLogin = async params => {
    return await client.get(`/auth/paziresh24/callback`, { params });
};
