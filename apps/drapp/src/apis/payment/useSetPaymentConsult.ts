import { setPaymentConsult } from './setPaymentConsult';
import { useMutation } from 'react-query';

export const useSetPaymentConsult = () => {
    return useMutation(setPaymentConsult);
};
