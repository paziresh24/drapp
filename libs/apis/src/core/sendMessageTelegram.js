import { client } from '../client';

export const sendMessageTelegram = async params => {
    return await client.get(process.env.REACT_APP_BASE_URL_P24BOTPROXY, { params });
};
