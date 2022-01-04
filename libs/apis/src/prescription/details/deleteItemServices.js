import { client } from '../client';

export const deleteItemService = async param => {
    return await client.delete(
        `/insurance/prescription/${param.prescriptionId}/prescription-item/${param.itemId}`
    );
};
