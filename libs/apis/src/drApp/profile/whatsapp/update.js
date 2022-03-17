import { client } from '../../../client';

export const updateWhatsapp = async params => {
    return await client.patch(`/user`, params);
};
