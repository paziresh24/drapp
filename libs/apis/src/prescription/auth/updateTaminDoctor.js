import { client } from '../client';
import omit from 'lodash/omit';

export const updateTaminDoctor = async param => {
    return await client.patch(`/V1/insurances/tamin/${param.id}`, omit(param, ['id']));
};
