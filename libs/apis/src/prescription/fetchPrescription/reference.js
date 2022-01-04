import { client } from '../client';

export const getPrescriptionReference = async params => {
    return await client.get(
        `/insurance/search/referencePrintCode/${params.code}/${params.nationalCode}`
    );
};
