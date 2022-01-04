import { client } from '../client';

export const drugInstructions = async params => {
    return await client.get(`/drug-instructions`, {
        params
    });
};
