import { client } from '@paziresh24/apis/client';
import { useQuery } from 'react-query';

export interface Params {
    centerId: string;
}

export const getCheckouts = async ({ centerId }: Params) => {
    return await client.get(`/doctor/center/${centerId}/financials/checkouts`);
};

export const useGetCheckouts = (params: Params) => {
    return useQuery(['getCheckouts', params], () => getCheckouts(params));
};
