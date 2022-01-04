//insurance/prescription/:prescription/finalize
import { client } from '../client';

export const finalizePrescription = async param => {
    return await client.put(`/insurance/prescription/${param.prescriptionId}/finalize`);
};
