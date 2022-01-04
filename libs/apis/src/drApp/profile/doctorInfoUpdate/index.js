import { client } from '../../../client';

export const doctorInfoUpdate = async params => {
    return await client.put(`/doctor/profile`, params);
};
