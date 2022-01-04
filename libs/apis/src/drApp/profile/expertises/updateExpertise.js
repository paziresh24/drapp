import _ from 'lodash';
import { client } from '../../../client';

export const updateExpertise = async params => {
    return await client.put(`doctor/expertises/${params.id}`, _.omit(params, ['id']));
};
