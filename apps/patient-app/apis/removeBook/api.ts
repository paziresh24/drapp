import { clinicClient } from '../client';
import { formData } from '@paziresh24/utils';

export const removeBook = async (params: any) => {
    return await clinicClient.post(
        '/deleteBook',
        formData({
            ...params
        })
    );
};
