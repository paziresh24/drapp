import { client } from './client';
import omit from 'lodash/omit';

export const updatePrescription = async params => {
    return await client.put(
        `/prescriptions/${params.prescriptionId}`,
        omit(params, ['prescriptionId'])
    );
};
