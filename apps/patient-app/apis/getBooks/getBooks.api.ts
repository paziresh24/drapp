import { patientAppClient } from '../client';

export const getBooks = async (params: any) => {
    return await patientAppClient.get('/books', { params });
};
