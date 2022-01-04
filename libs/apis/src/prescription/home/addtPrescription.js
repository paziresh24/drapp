import { client } from '../client';

export const addPrescription = async param => {
    return await client.post(`/insurance/prescription`, param);
};
