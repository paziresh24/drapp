// disable-static-
import { client } from './client';

export const disablePassword = async () => {
    return await client.patch(`/user/disable-static-password`);
};
