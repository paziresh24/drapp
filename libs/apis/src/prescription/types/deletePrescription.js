import { client } from '../client';

export const deletePrescription = async param => {
    return await client.delete(`/insurance/prescription/${param.id}`);
};
