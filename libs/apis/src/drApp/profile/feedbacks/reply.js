import { client } from '../../../client';
import omit from 'lodash/omit';

export const replyFeedbacks = async params => {
    return await client.post(`/doctor/feedbacks/${params.id}/reply`, omit(params, 'id'));
};
