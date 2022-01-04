import { client } from '../../../client';

export const books = async params => {
    return await client.get(`/doctor/book/statistics`, { params });
};
