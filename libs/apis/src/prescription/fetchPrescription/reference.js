import { client } from '../client';

export const getPrescriptionReference = async ({ code, nationalCode, identifier, ...params }) => {
    console.log('hi');
    return await client.post(
        `/insurance/search/referencePrintCode/${code}/${nationalCode}`,
        params,
        {
            params: {
                identifier
            }
        }
    );
};
