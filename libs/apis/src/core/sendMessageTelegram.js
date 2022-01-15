import { client } from '../client';

export const sendMessageTelegram = async params => {
    return await client.get(window._env_.P24_BASE_URL_P24BOTPROXY, { params });
};
