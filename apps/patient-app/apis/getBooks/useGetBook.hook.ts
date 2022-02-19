import { useQuery } from 'react-query';
import { getBooks } from './getBooks.api';

export const useGetBooks = (params: any) => {
    return useQuery(['getBooks', params], () => getBooks(params), {
        enabled: false
    });
};
