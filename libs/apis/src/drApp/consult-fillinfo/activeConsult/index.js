import { client } from '../../../client';

export const activeConsult = params => {
    return client.post(`/doctor/consult`, params);
};
