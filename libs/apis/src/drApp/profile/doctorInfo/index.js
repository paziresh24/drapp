import { client } from '../../../client';

export const doctorInfo = async params => {
    return await client.get(`/doctor/profile`, { params });
};
