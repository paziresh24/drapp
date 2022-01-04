import { client } from '../client';

export const insurances = async params => {
    return await client.get(`/V1/insurances/`, { params });
};
