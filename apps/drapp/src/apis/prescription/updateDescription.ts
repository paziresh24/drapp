import { client } from '@paziresh24/apis/client';
import { useMutation } from 'react-query';

interface Params {
    centerId: string;
    bookId: string;
    params: {
        description: string;
    };
}

export const updateDescription = ({ centerId, bookId, params }: Params) => {
    return client.patch(`/doctor/centers/${centerId}/books/${bookId}/description`, {
        ...params
    });
};

export const useUpdateDescription = () => {
    return useMutation(updateDescription);
};
