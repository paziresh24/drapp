import { client } from '../../client';

interface Params {
    active: 0 | 1;
    deposit_amount?: number;
    card_number?: string;
    center_id: string;
}

export const setPaymentSetting = async (params: Params) => {
    return await client.patch(`/doctor/payments/settings/`, params);
};
