import { client } from '../../../client';

export const pagingNext = async centerId => {
    return await client.get(`/doctor/paging/${centerId}/next`);
};
