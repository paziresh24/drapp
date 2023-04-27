import { useSetPaymentSetting } from '../../apis/payment/setPaymentSetting';
import axios from 'axios';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { verifyCardNumber } from '@persian-tools/persian-tools';

export const usePaymentForm = () => {
    const [cartNumber, setCartNumber] = useState('');
    const [price, setPrice] = useState('');
    const setPaymentSetting = useSetPaymentSetting();
    const [priceFieldError, setPriceFieldError] = useState(false);
    const [cartNumberFieldError, setCartNumberFieldError] = useState(false);

    const validate = ({ cardNumberValidate = true }: { cardNumberValidate?: boolean }) => {
        if (!+price || +price < 10000) {
            setPriceFieldError(true);
            +price < 10000 && toast.error('مقدار مبلغ مورد نظر باید بیشتر از 10 هزارتومان باشد');
            return;
        }
        if (cardNumberValidate && (!cartNumber || !verifyCardNumber(+cartNumber))) {
            setCartNumberFieldError(true);
            return false;
        }
        return true;
    };

    const submit = async ({
        centerId,
        bankName,
        IBAN,
        depositOwners,
        isActivePayment = true
    }: {
        centerId: string;
        bankName?: string;
        IBAN?: string;
        depositOwners?: string;
        isActivePayment?: boolean;
    }) => {
        try {
            const data = await setPaymentSetting.mutateAsync({
                active: isActivePayment ? 1 : 0,
                ...(isActivePayment && {
                    deposit_amount: +price * 10,
                    ...(cartNumber && { card_number: cartNumber })
                }),
                center_id: centerId,
                ...(bankName && { bank_name: bankName }),
                ...(IBAN && { IBAN: IBAN }),
                ...(depositOwners && { deposit_owners: depositOwners })
            });
            return Promise.resolve(data);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response?.data?.errors) {
                    Object.values(error.response?.data?.errors).forEach((messages: any) => {
                        messages.forEach((message: string) => {
                            toast.error(message);
                        });
                    });
                } else {
                    toast.error(error.response?.data?.message);
                }
                return Promise.reject(error);
            }
        }
    };

    return {
        submit,
        validate,
        isLoading: setPaymentSetting.isLoading,
        price,
        setPrice,
        cartNumber,
        setCartNumber,
        priceFieldError,
        setPriceFieldError,
        cartNumberFieldError,
        setCartNumberFieldError
    };
};
