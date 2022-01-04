import { client } from '../../../client';

export const deleteTurns = async params => {
    return await client.post(`/doctor/books/${params.centerId}/delete`, params.data);
};
