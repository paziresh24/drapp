import { client } from '../client';

export const drugAmounts = async params => {
    return await client.get(`/drug-amounts`, {
        params
    });
};
