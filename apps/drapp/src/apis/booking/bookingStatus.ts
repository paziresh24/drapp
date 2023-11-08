import { useQuery } from 'react-query';
import { apiGatewayClient } from '../apiGatewayClient';

interface BookingStatus {
    user_center_id: string;
}

export const bookingStatus = async (params: BookingStatus) => {
    return await apiGatewayClient.get(`/v1/user-center-services`, {
        params: { ...params, server_id: 1 }
    });
};

export const useBookingStatus = (params: BookingStatus) =>
    useQuery(['getBookingStatus', params], () => bookingStatus(params));
