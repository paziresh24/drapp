import { useMutation } from 'react-query';
import { apiGatewayClient } from '../apiGatewayClient';

interface BookingStatus {
    user_center_id: string;
    status: boolean;
}

export const changeBookingStatus = async ({ status, ...params }: BookingStatus) => {
    return await apiGatewayClient.patch(`/v1/user-center-services`, {
        ...params,
        can_booking: status ? '1' : '0'
    });
};

export const useChangeBookingStatus = () => useMutation(changeBookingStatus);
