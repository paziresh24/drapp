import { client } from '../../../client';

export const workHours = async params => {
    return await client.post(`/doctor/center/workhours`, params);
};
