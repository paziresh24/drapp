import { useQuery } from 'react-query';
import { apiGatewayClient } from '../apiGatewayClient';

interface Params {
    user_center_id: string;
    from_less_than?: number | string;
    from_greather_than?: number | string;
    payment_status_in?: number;
}

const getDeletedTurnsCount = async (params: Params) => {
    return await apiGatewayClient.get(`/v1/appointments/count`, { params });
};

export const useGetDeletedTurnsCount = (params: Params, option?: Record<string, any>) => {
    return useQuery(['getDeletedTurnsCount', params], () => getDeletedTurnsCount(params), {
        ...option
    });
};
