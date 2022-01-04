import { client } from '../../client';

export const importCaptchaSalamat = async params => {
    return await client.post(`/favorite-services/import/captcha`, params, {
        params
    });
};
