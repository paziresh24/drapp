import { usePaymentActive } from '@paziresh24/hooks/drapp/payment';
import axios from 'axios';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { verifyCardNumber } from '@persian-tools/persian-tools';

export const usePaymentForm = () => {
    const [cartNumber, setCartNumber] = useState('');
    const [isActivePayment, setIsActivePayment] = useState(true);
    const [price, setPrice] = useState('');
    const paymentActive = usePaymentActive();
    const [priceFieldError, setPriceFieldError] = useState(false);
    const [cartNumberFieldError, setCartNumberFieldError] = useState(false);

    const validate = () => {
        if (isActivePayment) {
            if (!+price) {
                setPriceFieldError(true);
                return false;
            }
            if (!cartNumber || !verifyCardNumber(+cartNumber)) {
                setCartNumberFieldError(true);
                return false;
            }
        }
        return true;
    };

    const submit = async ({ centerId }: { centerId: string }) => {
        try {
            const data = await paymentActive.mutateAsync({
                active: isActivePayment ? 1 : 0,
                ...(isActivePayment && { depositAmount: +price * 10 }),
                ...(isActivePayment && { cardNumber: cartNumber }),
                centerId: centerId
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
        isLoading: paymentActive.isLoading,
        price,
        setPrice,
        cartNumber,
        setCartNumber,
        setIsActivePayment,
        isActivePayment,
        priceFieldError,
        setPriceFieldError,
        cartNumberFieldError,
        setCartNumberFieldError
    };
};
