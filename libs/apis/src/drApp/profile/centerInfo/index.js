import { client } from '../../../client';

export const centerInfo = async () => {
    return await client.get(`/doctor/centers`);
};
