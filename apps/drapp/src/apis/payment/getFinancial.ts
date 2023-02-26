import { client } from '@paziresh24/apis/client';
import { useQuery } from 'react-query';

export interface Params {
    centerId: string;
}

export const getfinancial = async ({ centerId }: Params) => {
    return await client.get(`/doctor/centers/${centerId}/financials`);
};

export const useGetFinancial = (params: Params) => {
    return useQuery(['getfinancial', params], () => getfinancial(params));
};
