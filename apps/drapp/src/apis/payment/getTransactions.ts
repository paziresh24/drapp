import { useQuery } from 'react-query';
import { workflow } from '../workflow.client';

export interface Params {
    user_center_id: string;
    page: number;
}

export const getTransactions = async ({ user_center_id, page }: Params) => {
    return await workflow.get(
        `/webhook/70405cf8-5e7f-4224-8303-0f6d316e847d/transactions/${user_center_id}?page=${page}`
    );
};

export const useGetTransactions = (params: Params) => {
    return useQuery(['getTransactions', params], () => getTransactions(params), {
        keepPreviousData: true
    });
};
