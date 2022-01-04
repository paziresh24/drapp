import { client } from '../client';
import _ from 'lodash';

export const addItemService = async param => {
    return await client.post(
        `/insurance/prescription/${param.prescriptionId}/prescription-item`,
        _.omit(param, ['prescriptionId'])
    );
};
