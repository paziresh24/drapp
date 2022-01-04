import { client } from '../../../client';

export const getWorkHours = async params => {
    return await client.get(`/doctor/center/workhours`, { params });
};
