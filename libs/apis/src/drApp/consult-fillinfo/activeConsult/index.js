import { client } from '../../../client';

export const activeConsult = async params => {
    return await client.post(`/doctor/consult`, params);
};
