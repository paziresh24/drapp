import { client } from '../../client';

export const reverseGeocoding = async (params: { lat: number; long: number }) => {
    return await client.get(`/geocoding/reverse`, { params });
};
