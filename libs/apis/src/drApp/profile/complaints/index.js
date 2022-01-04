import { client } from '../../../client';

export const complaintsSummary = async () => {
    return await client.get('/doctor/feedbacks/messy/summary');
};
