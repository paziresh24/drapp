import { useMutation } from 'react-query';
import { apiGatewayClient } from '../apiGatewayClient';

interface Params {
    alias: string;
    academic_degree_id: number;
    speciality_id: number;
    id: number;
}

export const updateSpecialities = async ({ id, ...params }: Params) => {
    return await apiGatewayClient.patch(`/v1/providers-specialities/${id}`, { ...params });
};

export const useUpdateSpecialities = () => useMutation(updateSpecialities);
