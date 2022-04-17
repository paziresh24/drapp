import { formData } from '@paziresh24/shared/utils/formData';
import { clinicClient } from '../client';

export const getPagingBook = (params: { book_id: string }) => {
    return clinicClient.post(
        '/addBookToQueue',
        formData({
            ...params
        })
    );
};
