import { client } from '../client';
import omit from 'lodash/omit';

export const updateSalamatDoctor = async param => {
    return await client.patch(`/V1/insurances/salamat/${param.id}`, omit(param, ['id']));
};
