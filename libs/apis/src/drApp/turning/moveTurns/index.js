import { client } from '../../../client';

export const moveTurns = async params => {
    return await client.post(`/doctor/books/${params.centerId}/move`, params.data);
};
