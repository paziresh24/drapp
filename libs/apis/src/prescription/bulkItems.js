import { client } from './client';

export const bulkItems = async params => {
    return await client.post(`/prescription-items`, params);
};
