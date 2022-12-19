import { client } from '@paziresh24/apis/client';
import { useQuery } from 'react-query';

export interface Params {
    centerId: string;
}

export const getIncomes = async ({ centerId }: Params) => {
    return await client.get(`/doctor/center/${centerId}/financials/incomes`);
};

export const useGetIncomes = (params: Params) => {
    return useQuery(['getIncomes', params], () => getIncomes(params));
};
