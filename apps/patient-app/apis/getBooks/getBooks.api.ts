import { client } from '../client';

export const getBooks = async (params: any) => {
    return await client.get('/books', { params });
};
