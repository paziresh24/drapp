import { client } from '../client';
import omit from 'lodash/omit';

export const addItemService = async param => {
    return await client.post(
        `/insurance/prescription/${param.prescriptionId}/prescription-item`,
        omit(param, ['prescriptionId'])
    );
};
