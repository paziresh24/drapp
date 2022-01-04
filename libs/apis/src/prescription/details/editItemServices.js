import _ from 'lodash';
import { client } from '../client';

export const editItemService = async param => {
    return await client.put(
        `/insurance/prescription/${param.prescriptionId}/prescription-item/${param.itemId}`,
        _.omit(param, ['prescriptionId', 'itemId'])
    );
};
