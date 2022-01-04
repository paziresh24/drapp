import { client } from '../../../client';

export const came = async params => {
    return await client.put(`/doctor/book/came`, params);
};
