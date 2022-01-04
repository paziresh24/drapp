import { client } from '../../../client';

export const vacation = async params => {
    return await client.post(`/doctor/vacation/${params.centerId}`, params.data);
};
