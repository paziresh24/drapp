import { useSetPaymentSetting } from '@paziresh24/hooks/drapp/payment';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { verifyCardNumber } from '@persian-tools/persian-tools';
import { usePaymentSettingStore } from 'apps/drapp/src/store/paymentSetting.store';

export const usePaymentForm = () => {
    const [cartNumber, setCartNumber] = useState('');
    const [isActivePayment, setIsActivePayment] = useState(true);
    const [price, setPrice] = useState('');
    const setPaymentSetting = useSetPaymentSetting();
    const [priceFieldError, setPriceFieldError] = useState(false);
    const [cartNumberFieldError, setCartNumberFieldError] = useState(false);
    const getSetting = usePaymentSettingStore(state => state.setting);

    useEffect(() => {
        if (getSetting?.active) {
            setCartNumber(getSetting?.card_number);
            setPrice(
                getSetting?.deposit_amount ? (+getSetting?.deposit_amount / 10)?.toString() : ''
            );
            return;
        }
        setCartNumber('');
        setPrice('');
    }, [getSetting]);

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
            const data = await setPaymentSetting.mutateAsync({
                active: isActivePayment ? 1 : 0,
                ...(isActivePayment && { deposit_amount: +price * 10 }),
                ...(isActivePayment && { card_number: cartNumber }),
                center_id: centerId
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
        setIsActivePayment,
        isActivePayment,
        priceFieldError,
        setPriceFieldError,
        cartNumberFieldError,
        setCartNumberFieldError
    };
};
