import { useQuery } from 'react-query';
import { apiGatewayClient } from '../apiGatewayClient';

interface Params {
    user_center_id: string;
}

const getDeletedTurnsCount = async ({ user_center_id }: Params) => {
    return await apiGatewayClient.get(
        `/v1/appointments/count?user_center_id=${user_center_id}&delete=1`
    );
};

export const useGetDeletedTurnsCount = (params: Params, option?: Record<string, any>) => {
    return useQuery(['getDeletedTurnsCount', params], () => getDeletedTurnsCount(params), { ...option });
};