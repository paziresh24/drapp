import { client } from '../client';

export const getPrescriptionBySamadcode = async params => {
    return await client.get(`/insurance/search/samadcode/${params.code}/${params.nationalCode}`);
};
