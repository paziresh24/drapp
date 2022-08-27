import { client } from '../../client';

interface Params {
    active: 0 | 1;
    depositAmount?: number;
    cardNumber?: string;
    centerId: string;
}

export const paymentActive = async (params: Params) => {
    return await client.patch(`/doctor/payments/activate/`, params);
};
