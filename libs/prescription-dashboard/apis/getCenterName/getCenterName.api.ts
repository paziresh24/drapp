import { client } from '../client';

export const getCenterName = async params => {
    return await client.get(`/user/centers-name`, {
        params
    });
};
