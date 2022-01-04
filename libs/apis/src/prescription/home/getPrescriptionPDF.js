import { client } from '../client';

export const getPrescriptionPDF = async params => {
    return await client.get(`/insurance/prescription/${params.id}/pdf`);
};
