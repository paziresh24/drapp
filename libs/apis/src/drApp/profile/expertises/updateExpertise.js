import omit from 'lodash/omit';
import { client } from '../../../client';

export const updateExpertise = async params => {
    return await client.put(`doctor/expertises/${params.id}`, omit(params, ['id']));
};
