import { client } from '../client';

export const getPrescriptionByPrintcode = async params => {
    return await client.get(`/insurance/search/printcode/${params.code}/${params.nationalCode}`, {
        params: {
            identifier: params.identifier
        }
    });
};
