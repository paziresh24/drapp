import { useQuery } from 'react-query';
import { getBooks } from './api';

export const useGetBooks = (params: any) => {
    return useQuery(['getBooks', params], () => getBooks(params), {
        enabled: false
    });
};
