import { client } from '../client';

export const postFavoritePrescriptions = async params => {
    return await client.post(`/favorite-prescriptions`, params);
};
