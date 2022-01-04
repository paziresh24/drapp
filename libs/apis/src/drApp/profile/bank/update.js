import { client } from '../../../client';

export const bankInfo = async params => {
    return await client.put(`/center/bank`, params);
};
