import { client } from '../client';

export const createTaminDoctor = async param => {
    return await client.post(`/V1/insurances/tamin`, param);
};
