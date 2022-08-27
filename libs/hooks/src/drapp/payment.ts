import { paymentActive } from '@paziresh24/apis/drApp/payment/activate';
import { useMutation } from 'react-query';

export const usePaymentActive = () => {
    return useMutation(paymentActive);
};
