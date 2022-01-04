import { client } from '../../../client';

export const createExpertise = async params => {
    return await client.post(`doctor/expertises`, params);
};
