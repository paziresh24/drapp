import { useMutation } from 'react-query';
import { apiGatewayClient } from '../apiGatewayClient';

export interface Params {
    book_id: string;
}

export const safeCall = async ({ book_id }: Params) => {
    return await apiGatewayClient.post(`/v1/book-safe-call/${book_id}`);
};

export const useSafeCall = () => {
    return useMutation(safeCall);
};
