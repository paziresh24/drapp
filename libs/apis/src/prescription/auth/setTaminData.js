import { client } from '../client';

export const setTaminData = async param => {
    return await client.post(`/insurance/setTaminData`, param);
};
