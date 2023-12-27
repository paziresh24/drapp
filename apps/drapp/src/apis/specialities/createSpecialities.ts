import { useMutation } from 'react-query';
import { apiGatewayClient } from '../apiGatewayClient';

interface Params {
    alias: string;
    academic_degree_id: number;
    speciality_id: number;
    achieved_at: string;
}

export const createSpecialities = async (params: Params) => {
    return await apiGatewayClient.post(`/v1/providers-specialities`, { ...params });
};

export const useCreateSpecialities = () => useMutation(createSpecialities);
