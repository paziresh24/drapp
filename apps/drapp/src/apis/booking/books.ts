import { useMutation, useQuery } from 'react-query';
import { client } from '@paziresh24/apis/client';

interface Books {
    center_id: string;
    from: number;
    to: number;
    deleted_after: number;
    payment_status: number[];
    inserted_before: number;
}

export const getBooks = async (params: Books) => {
    return await client.get(`/doctor/books`, {
        params
    });
};

export const useGetBooks = (params: Books, options?: any) =>
    useQuery(['getBooks', params], () => getBooks(params), { ...options });
