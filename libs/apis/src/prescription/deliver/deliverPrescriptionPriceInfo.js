import { client } from '../client';

export const deliverPrescriptionPriceInfo = async params => {
    return await client.post(`/insurance/prescription/deliver/priceInfo`, params);
};
