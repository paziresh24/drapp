import { client } from '../client';

export const addFavoriteServices = async params => {
    return await client.post(`/favorite-services`, params);
};
