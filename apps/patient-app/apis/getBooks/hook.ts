import { useQuery } from 'react-query';
import { getBooks } from './api';

export const useGetBooks = (params: { page: number }) => {
    return useQuery(['getBooks', params], () => getBooks(params), {
        enabled: false
    });
};
