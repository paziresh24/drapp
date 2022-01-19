import omit from 'lodash/omit';
import { client } from '../client';

export const editItemService = async param => {
    return await client.put(
        `/insurance/prescription/${param.prescriptionId}/prescription-item/${param.itemId}`,
        omit(param, ['prescriptionId', 'itemId'])
    );
};
