import { client } from '../../../client';

export const uploadPorfile = async params => {
    return await client.post(`/doctor/profile/image`, params);
};
