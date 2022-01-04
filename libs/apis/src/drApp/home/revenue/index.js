import { client } from '../../../client';

export const revenue = async params => {
    return await client.get(`/doctor/payment/statistics`, { params });
};
