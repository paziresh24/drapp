import { useMutation } from 'react-query';
import { apiGatewayClient } from '../apiGatewayClient';

export interface Payload {
    name: string;
    family: string;
    national_code: string;
    user_id: string;
}

export const updateUser = async ({ user_id, ...payload }: Payload) => {
    return await apiGatewayClient.patch(`/v1/users/${user_id}`, payload);
};

export const useUpdateUser = () => useMutation(updateUser);
