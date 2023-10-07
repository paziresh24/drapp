import { useMutation, useQuery } from 'react-query';
import { apiGatewayClient } from '../apiGatewayClient';

export interface Params {
    provider_id: string;
}

export const getSpecialities = async (params: Params) => {
    return await apiGatewayClient.get(`/v1/providers-specialities`, { params});
};

export const useGetSpecialities = (params: Params) =>
    useQuery(['getSpecialities', params], () => getSpecialities(params), { enabled: false });
