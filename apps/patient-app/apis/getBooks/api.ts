import { patientAppClient } from '../client';

export const getBooks = (params: { page: number }) => {
    return patientAppClient.get('/books', { params });
};
