import { client } from '@paziresh24/apis/client';
import { useQuery } from 'react-query';

export interface Params {
    centerId: string;
}

export const getBalance = async ({ centerId }: Params) => {
    return await client.get(`/doctor/center/${centerId}/financials/balance`);
};

export const useGetBalance = (params: Params) => {
    return useQuery(['getBalance', params], () => getBalance(params));
};
