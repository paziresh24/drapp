import { client } from '../client';

export const removeSetting = async params => {
    return await client.delete(`/settings/${params.id}`, { params });
};
