import { client } from '../client';

export const getOnePrescription = async params => {
    return await client.get(`/prescriptions/${params.id}`);
};
