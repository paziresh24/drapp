import { client } from '@paziresh24/apis/client';

interface Params {
    active: 0 | 1;
    deposit_amount?: number;
    card_number?: string;
    center_id: string;
    bank_name: string;
    IBAN: string;
    deposit_owners: string;
}

export const setPaymentSetting = async (params: Params) => {
    return await client.patch(`/doctor/payments/settings/`, params);
};
