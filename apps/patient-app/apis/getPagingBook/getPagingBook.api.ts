import { formData } from '@paziresh24/utils';
import { clinicClient } from '../client';

export const getPagingBook = async (params: any) => {
    return await clinicClient.post(
        '/addBookToQueue',
        formData({
            ...params
        })
    );
};
