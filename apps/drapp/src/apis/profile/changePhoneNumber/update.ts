import { client } from '@paziresh24/apis/client';
import { useMutation, useQuery } from 'react-query';

export interface Params {
    username: string;
    password: string;
}

export const updatePhoneNumber = async (params: Params) => {
    return await client.put(`/doctor/profile/change-mobile`, params);
};

export const useUpdatePhoneNumber = () => {
    return useMutation(updatePhoneNumber);
};
