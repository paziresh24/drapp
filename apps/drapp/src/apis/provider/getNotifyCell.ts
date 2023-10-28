import { useMutation, useQuery } from 'react-query';
import { apiGatewayClient } from '../apiGatewayClient';

export interface Payload {
    provider_id: string;
}

export const getNotifyCell = async ({ provider_id, ...payload }: Payload) => {
    return await apiGatewayClient.get(`/v1/providers/${provider_id}/notify-cell`, {
        params: { ...payload }
    });
};

export const useGetNotifyCell = (payload: Payload) =>
    useQuery(['getNotifyCell', payload], () => getNotifyCell(payload), { enabled: false });
