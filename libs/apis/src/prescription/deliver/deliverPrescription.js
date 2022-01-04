import { client } from '../client';

export const deliverPrescription = async param => {
    return await client.post(`/insurance/prescription/deliver`, param);
};
