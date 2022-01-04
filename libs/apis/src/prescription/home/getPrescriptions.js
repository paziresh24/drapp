import { client } from '../client';

export const getPrescriptions = async params => {
    return await client.get(`/prescriptions`, {
        params
    });
};
