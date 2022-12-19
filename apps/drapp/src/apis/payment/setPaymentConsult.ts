import { client } from '@paziresh24/apis/client';
import { useMutation } from 'react-query';

interface Params {
    active: 0 | 1;
    card_number?: string;
    IBAN: string;
}

export const setPaymentConsult = async (params: Params) => {
    return await client.put(`/center/bank`, params);
};

export const useSetPaymentConsult = () => {
    return useMutation(setPaymentConsult);
};
