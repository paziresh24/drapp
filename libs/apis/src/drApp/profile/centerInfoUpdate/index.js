import { client } from '../../../client';

export const centerInfoUpdate = async params => {
    return await client.put(`/doctor/centers/${params.centerId}`, params.data);
};
