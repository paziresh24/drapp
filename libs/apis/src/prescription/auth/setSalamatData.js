import { client } from '../client';

export const setSalamatData = async param => {
    return await client.post(`/insurance/setSalamatData`, param);
};
