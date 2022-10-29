import { client } from '@paziresh24/apis/client';
import { useMutation } from 'react-query';

export interface Params {
    type: 'igap';
    channel: string;
}

export const visitChannle = async (params: Params) => {
    return await client.patch(`/doctor/visit-channels`, params);
};

export const useVisitChannle = () => useMutation(visitChannle);
