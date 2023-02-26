import { client } from '@paziresh24/apis/client';
import { Params } from './getFinancial';
import { useMutation } from 'react-query';

export const submitSettlement = async ({ centerId }: Params) => {
    return await client.post(`/doctor/centers/${centerId}/financials/request`);
};

export const useSubmitSettlement = () => {
    return useMutation(submitSettlement);
};
