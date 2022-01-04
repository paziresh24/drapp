import { client } from '../../client';

export const importOtpSalamat = async params => {
    return await client.post(`/favorite-services/import/otp`, params, {
        params
    });
};
