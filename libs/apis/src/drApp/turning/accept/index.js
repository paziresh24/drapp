import { client } from '../../../client';

export const visit = async params => {
    return await client.get(`/doctor/book/visit`, { params });
};
