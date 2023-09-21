import { useMutation } from 'react-query';
import { apiGatewayClient } from '../apiGatewayClient';

export interface Payload {
    biography: string;
    employee_id: string;
    user_id: string;
}

export const updateProvider = async ({ user_id, ...payload }: Payload) => {
    return await apiGatewayClient.patch(`/v1/providers`, payload, { params: { user_id } });
};

export const useUpdateProvider = () => useMutation(updateProvider);
