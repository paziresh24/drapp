import { useMutation } from 'react-query';
import { getPagingBook } from './getPagingBook.api';

export const useGetPagingBook = () => {
    return useMutation(getPagingBook);
};
