import { client } from '../../../client';

export const deleteExpertises = async params => {
    return await client.delete(`doctor/expertises/${params.id}`);
};
