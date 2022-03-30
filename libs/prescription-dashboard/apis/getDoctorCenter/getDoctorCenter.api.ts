import { client } from '../client';

export const getDoctorCenter = async params => {
    return await client.get(`/user/doctor-centers`, {
        params
    });
};
