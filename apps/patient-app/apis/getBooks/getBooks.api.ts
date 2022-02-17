import { nextClient } from '../client';

export const getBooks = async (params: any) => {
    return await nextClient.get('/books', { params });
};
