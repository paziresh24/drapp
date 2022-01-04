import { client } from '../../../client';

export const centerAccess = async params => {
    return await client.get(`/doctor/center/access`, { params });
};
