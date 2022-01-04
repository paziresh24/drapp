// /import-requests

import { client } from '../client';

export const importStatus = async params => {
    return await client.get(`/import-requests`, { params });
};
