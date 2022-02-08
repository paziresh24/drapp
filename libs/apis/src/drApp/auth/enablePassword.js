import { client } from './client';

export const enablePassword = async () => {
    return await client.patch(`/user/enable-static-password`);
};
