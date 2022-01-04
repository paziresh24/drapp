import { client } from '../../../client';

export const paziresh = async params => {
    return await client.put(`/doctor/book/paziresh`, params);
};
