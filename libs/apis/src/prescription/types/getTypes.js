import { client } from '../client';

export const getTypes = async params => {
    return await client.get(`/service-types`, {
        params
    });
};
