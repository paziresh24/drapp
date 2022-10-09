import { setPaymentSetting } from './setPaymentSetting';
import { useMutation } from 'react-query';

export const useSetPaymentSetting = () => {
    return useMutation(setPaymentSetting);
};
