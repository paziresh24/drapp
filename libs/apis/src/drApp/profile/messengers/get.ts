import { client } from '../../../client';

export const getMessagerInfo = async () => {
    return await client.get(`/doctor/visit-channels`);
};
