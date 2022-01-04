import { client } from '../client';

export const createSalamatDoctor = async param => {
    return await client.post(`/V1/insurances/salamat`, param);
};
