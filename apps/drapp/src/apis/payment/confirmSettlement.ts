import { formData } from '@paziresh24/shared/utils';
import { client } from '@paziresh24/apis/client';
import { useMutation } from 'react-query';

interface Params {
    centerId: string;
    detailes: {
        confirm_code: string;
        is_confirm: number;
    };
}

export const confirmSettlement = ({ centerId, detailes }: Params) => {
    return client.post(`/doctor/centers/${centerId}/financials/confirm`, { ...detailes });
};

export const useConfirmSettlement = () => {
    return useMutation(confirmSettlement);
};
