import { useQuery } from 'react-query';
import { apiGatewayClient } from '../apiGatewayClient';

interface Params {
    user_center_id: string;
    from_less_than?:number | string;
    from_greather_than?:number | string;
    payment_status_in?: number;
}

const getDeletedTurnsCount = async ({ user_center_id, from_greather_than,from_less_than,payment_status_in }: Params) => {
    return await apiGatewayClient.get(
        `/v1/appointments/count?user_center_id=${user_center_id}&from_less_than=${from_less_than}&from_greather_than=${from_greather_than}&payment_status_in=${payment_status_in}&deleted_at_greater_than=from`
    );
};

export const useGetDeletedTurnsCount = (params: Params, option?: Record<string, any>) => {
    return useQuery(['getDeletedTurnsCount', params], () => getDeletedTurnsCount(params), { ...option });
};