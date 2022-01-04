import { client } from '../client';

export const deleteFavoritePrescriptions = async id => {
    return await client.delete(`/favorite-prescriptions/${id}`);
};
