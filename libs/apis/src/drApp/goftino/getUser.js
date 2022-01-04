import { client } from '../../client';

export const getUser = async () => {
    return await client.get(`/user/goftino`);
};
