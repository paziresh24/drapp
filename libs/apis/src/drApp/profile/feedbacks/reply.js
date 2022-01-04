import { client } from '../../../client';
import _ from 'lodash';

export const replyFeedbacks = async params => {
    return await client.post(`/doctor/feedbacks/${params.id}/reply`, _.omit(params, 'id'));
};
