import { client } from '../client';

export const importRequests = async params => {
    return await client.post(`/favorite-prescriptions/import`, params);
};
