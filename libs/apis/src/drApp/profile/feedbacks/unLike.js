import { client } from '../../../client';

export const unLikeFeedbacks = async params => {
    return await client.post(`/doctor/feedbacks/${params.id}/unlike`);
};
