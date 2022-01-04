import { client } from '../../../client';

export const getBankInfo = async params => {
    return await client.get(`/center/bank`, { params });
};
