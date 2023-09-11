import { useMutation, useQuery } from 'react-query';
import { apiGatewayClient } from '../apiGatewayClient';

export interface Payload {
    user_id: string;
}

export const getUser = async ({ user_id, ...payload }: Payload) => {
    return await apiGatewayClient.get(`/v1/users/${user_id}`, {
        params: { ...payload, is_current_user: true }
    });
};

export const useGetUser = (payload: Payload) =>
    useQuery(['getUser', payload], () => getUser(payload), { enabled: false });
