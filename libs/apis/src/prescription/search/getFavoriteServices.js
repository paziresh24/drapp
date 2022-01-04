import { client } from '../client';

export const getFavoriteServices = async params => {
    return await client.get(`/favorite-services`, {
        params
    });
};
