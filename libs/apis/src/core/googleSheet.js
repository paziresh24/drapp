import { client } from '../client';

export const googleSheet = async params => {
    return await client.post(`https://www.paziresh24.com/api/googleSheetsInsert`, params);
};
