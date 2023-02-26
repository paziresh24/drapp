import { client } from '@paziresh24/apis/client';
import { useQuery } from 'react-query';
import { usePaymentSettingStore } from '../../store/paymentSetting.store';

export interface Params {
    center_id: string;
}

export const getPaymentSetting = async (params: Params) => {
    return await client.get(`/doctor/payments/settings/`, { params });
};

export const useGetPaymentSetting = (params: Params) => {
    const setPaymentSetting = usePaymentSettingStore(state => state.setSetting);
    return useQuery(['getPaymentSetting', params], () => getPaymentSetting(params), {
        enabled: false,
        onSuccess: (data: any) => {
            setPaymentSetting(data);
        }
    });
};
