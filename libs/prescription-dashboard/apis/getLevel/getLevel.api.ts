import { client } from '../client';

export const getLevels = async () => {
    return await client.get(`/user/levels`);
};
