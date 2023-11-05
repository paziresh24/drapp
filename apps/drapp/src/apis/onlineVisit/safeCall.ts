import { useMutation } from 'react-query';
import { workflow } from '../workflow.client';

export interface Params {
    book_id: string;
}

export const safeCall = async ({ book_id }: Params) => {
    return await workflow.post(
        `webhook-test/483835a3-d567-47e6-adfb-fe698f9eb2c6/safe-call/${book_id}`
    );
};

export const useSafeCall = () => {
    return useMutation(safeCall);
};
