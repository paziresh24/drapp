import { useMutation, useQuery } from 'react-query';
import { workflow } from '../workflow.client';

export interface Params {
    bookId: string;
}

export const secureCall = async ({ bookId }: Params) => {
    return await workflow.get(`/webhook/483835a3-d567-47e6-adfb-fe698f9eb2c6/safe-call/${bookId}`);
};

export const useSecureCall = () => {
    return useMutation(secureCall);
};
