import { client } from '../../../client';

export const pagingStatistics = async centerId => {
    return await client.get(`/doctor/book/officeTodayStatistics`, {
        params: { center_id: centerId }
    });
};
