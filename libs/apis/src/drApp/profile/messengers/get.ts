import { client } from '../../../client';

export const getMessengerInfo = async () => {
    return await client.get(`/doctor/visit-channels`);
};
