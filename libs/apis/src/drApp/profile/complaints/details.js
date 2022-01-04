import { client } from '../../../client';

export const complaintsDetail = async params => {
    return await client.get('/doctor/feedbacks/messy');
};
