import { useMutation } from 'react-query';
import { removeBook } from './removeBook.api';

export const useRemoveBook = () => {
    return useMutation(removeBook);
};
