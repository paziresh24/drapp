import { client } from '../../../client';

export const feedbacks = async params => {
    return await client.get(`/doctor/feedbacks`, { params });
};
