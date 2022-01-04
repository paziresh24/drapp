import { client } from '../client';

export const getFavoritePrescriptions = async params => {
    return await client.get(`/favorite-prescriptions`, { params });
};
