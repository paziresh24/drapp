import { client } from '../../client';

export const resendCode = async params => {
    return await client.get(`/auth/resendPassword`, { params });
};
