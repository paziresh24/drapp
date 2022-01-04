import { client } from '../../../client';

export const updateCenterAccess = async params => {
    return await client.post(`/doctor/center/access`, { ...params });
};
