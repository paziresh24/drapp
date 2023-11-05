import { useMutation } from 'react-query';
import { apiGatewayClient } from '../apiGatewayClient';

interface Params {
    id:number
}

export const removeSpecialities = async ({id}: Params) => {
    return await apiGatewayClient.delete(`/v1/providers-specialities/${id}` );
};

export const useRemoveSpecialities = () => useMutation(removeSpecialities)
