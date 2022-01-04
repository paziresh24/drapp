import { client } from './client';

export const getCenters = async () => {
    return await client.get(`/doctor/centers`);
};
