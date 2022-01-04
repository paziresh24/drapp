import { client } from '../client';

export const getOneItemService = async params => {
    return await client.get(`/prescription-items/${params.prescriptionId}/${params.itemId}`);
};
