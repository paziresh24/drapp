import { client } from '../client';

export const deleteFavoriteServices = async ({ id }) => {
    return await client.delete(`/favorite-services/${id}`);
};
