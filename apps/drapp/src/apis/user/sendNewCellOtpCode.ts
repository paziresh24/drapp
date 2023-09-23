import { useMutation } from 'react-query';
import { apiGatewayClient } from '../apiGatewayClient';

export interface Payload {
    new_cell: string;
    user_id: string;
}

export const sendNewCellOtpCode = async ({ user_id, ...payload }: Payload) => {
    return await apiGatewayClient.patch(`/v1/users/${user_id}/otp`, payload);
};

export const useSendNewCellOtpCode = () => useMutation(sendNewCellOtpCode);
