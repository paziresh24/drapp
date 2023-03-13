import { client } from '../../../client';

export const getMessenger Info = async () => {
    return await client.get(`/doctor/visit-channels`);
};
