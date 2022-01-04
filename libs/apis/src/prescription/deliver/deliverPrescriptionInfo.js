import { client } from '../client';

export const deliverPrescriptionInfo = async params => {
    return await client.get(`/insurance/prescription/deliver/info`, { params });
};
