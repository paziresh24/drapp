import { routeApiClient } from '../client';

export const getBooks = async (params: any) => {
    return await routeApiClient.get('/books', { params });
};
