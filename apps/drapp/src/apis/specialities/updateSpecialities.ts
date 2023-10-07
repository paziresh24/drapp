import { useMutation } from 'react-query';
import { apiGatewayClient } from '../apiGatewayClient';

export interface Params {
    alias: string;
    academic_degree_id:number
    speciality_id:number,
    id:number
}

export const updateSpecialities = async ({academic_degree_id,alias,id,speciality_id}: Params) => {
    return await apiGatewayClient.patch(`/v1/providers-specialities/${id}`, {academic_degree_id,alias,speciality_id} );
};

export const useUpdateSpecialities =  () => useMutation(updateSpecialities)
