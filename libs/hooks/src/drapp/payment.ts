import { setPaymentSetting } from '@paziresh24/apis/drApp/payment/setPaymentSetting';
import { getPaymentSetting, Params } from '@paziresh24/apis/drApp/payment/getPaymentSetting';
import { useMutation, useQuery } from 'react-query';

export const useSetPaymentSetting = () => {
    return useMutation(setPaymentSetting);
};

export const useGetPaymentSetting = (params: Params) => {
    return useQuery(['getPaymentSetting', params], () => getPaymentSetting(params), {
        enabled: false
    });
};
