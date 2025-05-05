import { client } from '@paziresh24/apis/client';
import { formData } from '@paziresh24/shared/utils';
import { useMutation } from 'react-query';
import { apiGatewayClient } from '../apiGatewayClient';

export interface Params {
    mobile: string;
    nationalCode: string;
    nationalCard: File;
}

export const createCenterIntelligence = async (params: Params) => {
    return await apiGatewayClient.post(`/V1/doctor/center/intelligence`, formData(params));
};

export const useCreateCenterIntelligence = () => {
    return useMutation(createCenterIntelligence);
};
