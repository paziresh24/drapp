//insurance/prescription/:prescription/finalize
import { client } from '../client';

export const finalizePrescription = async ({ prescriptionId, ...param }) => {
    return await client.put(`/insurance/prescription/${prescriptionId}/finalize`, { ...param });
};
