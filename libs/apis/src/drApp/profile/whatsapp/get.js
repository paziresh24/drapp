import { client } from '../../../client';

export const getWhatsapp = async params => {
    return await client.get(`/user`, { params });
};
