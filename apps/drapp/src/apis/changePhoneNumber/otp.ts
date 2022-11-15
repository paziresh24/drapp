import { client } from '@paziresh24/apis/client';
import { useMutation, useQuery } from 'react-query';

export interface Params {
    username: string;
}

export const changePhoneNumberOtp = async (params: Params) => {
    return await client.post(`/doctor/profile/change-mobile-otp`, params);
};

export const useChangePhoneNumber = () => {
    return useMutation(changePhoneNumberOtp);
};
