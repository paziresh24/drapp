import { client } from '@paziresh24/apis/client';
import { useQuery } from 'react-query';

export interface Params {
    card_number: string;
}

export const ibanInquiry = async (params: Params) => {
    return await client.get(`/doctor/payments/iban-inquiry/`, { params });
};

export const useIbanInquiry = (params: Params) => {
    return useQuery(['ibanInquiry', params], () => ibanInquiry(params), {
        enabled: false
    });
};
