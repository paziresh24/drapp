import { client } from '../../../client';

export const getExpertises = async params => {
    return await client.get(`doctor/expertises`, { params });
};
