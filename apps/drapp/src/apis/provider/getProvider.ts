import { useMutation, useQuery } from 'react-query';
import { apiGatewayClient } from '../apiGatewayClient';

export interface Payload {
    user_id: string;
}

export const getProvider = async (payload: Payload) => {
    return await apiGatewayClient.get(`/v1/providers`, { params: { ...payload } });
};

export const useGetProvider = (payload: Payload) =>
    useQuery(['getProvider', payload], () => getProvider(payload), { enabled: false });
