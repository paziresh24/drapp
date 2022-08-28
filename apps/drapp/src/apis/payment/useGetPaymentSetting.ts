import { getPaymentSetting, Params } from '@paziresh24/apis/drApp/payment/getPaymentSetting';
import { useQuery } from 'react-query';
import { usePaymentSettingStore } from '../../store/paymentSetting.store';

export const useGetPaymentSetting = (params: Params) => {
    const setPaymentSetting = usePaymentSettingStore(state => state.setSetting);
    return useQuery(['getPaymentSetting', params], () => getPaymentSetting(params), {
        enabled: false,
        onSuccess: (data: any) => {
            setPaymentSetting(data);
        }
    });
};
