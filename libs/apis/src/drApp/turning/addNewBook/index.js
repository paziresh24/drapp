import { client } from '../../../client';

export const addNewBook = async params => {
    return await client.post(`/doctor/book`, params);
};
