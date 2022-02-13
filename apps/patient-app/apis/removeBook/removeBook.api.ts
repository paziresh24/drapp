import { client } from '../client';
import { formData } from '@paziresh24/utils';

export const removeBook = async (params: any) => {
    return await client.post(
        'https://www.paziresh24.com/api/deleteBook',
        formData({
            certificate: '$2y$10$lGttgXxc3vgPbsZg8EbnvehGTE4aFOdJO3JFVW5Z7H3k6ZM8Yubrq',
            ...params
        }),
        {
            headers: {
                Cookie: 'P24SESSION=l2ok4nmttnk32f7v43c0fcbpu7'
            }
        }
    );
};
