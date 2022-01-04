import { client } from '../../client';

export const changePassword = async params => {
    return await client.patch(`/user/change-static-password`, params);
};
