import { client } from '../../client';

export const setUser = async params => {
    return await client.put(`/user/goftino`, params);
};
