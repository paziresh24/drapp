import { client } from '../../../client';

export const accept = async params => {
    return await client.get(`/doctor/book/paziresh`, { params });
};
