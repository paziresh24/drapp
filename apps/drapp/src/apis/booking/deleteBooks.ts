import { useMutation } from 'react-query';
import { apiGatewayClient } from '../apiGatewayClient';

interface DeleteBooks {
    book_ids: string[];
}

export const deleteBooks = async (params: DeleteBooks) => {
    return await apiGatewayClient.delete(`/v1/doctors/books`, {
        data: params
    });
};

export const useDeleteBooks = () => useMutation(deleteBooks);
