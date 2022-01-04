import { client } from '../../../client';

export const likeFeedbacks = async params => {
    return await client.post(`/doctor/feedbacks/${params.id}/like`);
};
