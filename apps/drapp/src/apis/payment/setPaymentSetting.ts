import { client } from '@paziresh24/apis/client';
import { useMutation } from 'react-query';

interface Params {
    active: 0 | 1;
    deposit_amount?: number;
    card_number?: string;
    center_id: string;
    bank_name?: string;
    IBAN?: string;
    deposit_owners?: string;
}

export const setPaymentSetting = async (params: Params) => {
    return await client.patch(`/doctor/payments/settings/`, params);
};

export const useSetPaymentSetting = () => {
    return useMutation(setPaymentSetting);
};
