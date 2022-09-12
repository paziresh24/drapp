import {
    Autocomplete,
    Checkbox,
    FormControl,
    FormControlLabel,
    TextField,
    Typography
} from '@mui/material';
import { useDrApp } from '@paziresh24/context/drapp';
import BankNumberField from '@paziresh24/shared/ui/bankNumberField';
import { Dispatch, memo, SetStateAction, useEffect, useState } from 'react';
import { costs } from 'apps/drapp/src/pages/drApp/activation/consult/costAvg';
import { round } from 'lodash';
import { addCommas } from '@persian-tools/persian-tools';
import PriceField from '@paziresh24/shared/ui/priceField';
import { numberToWords } from '@persian-tools/persian-tools';

export interface PaymentFormProps {
    setPrice: Dispatch<SetStateAction<string>>;
    price: string;
    setCartNumber: Dispatch<SetStateAction<string>>;
    cartNumber: string;
    setIsActivePayment: Dispatch<SetStateAction<boolean>>;
    isActivePayment: boolean;
    priceFieldError: boolean;
    setPriceFieldError: Dispatch<SetStateAction<boolean>>;
    cartNumberFieldError: boolean;
    setCartNumberFieldError: Dispatch<SetStateAction<boolean>>;
    toggleable?: boolean;
    clickPriceFiled?: () => void;
    clickCartNumberFiled?: () => void;
}
const costsOffice = [
    {
        label: '10,000 تومان',
        value: '10000'
    },
    {
        label: '20,000 تومان',
        value: '20000'
    },
    {
        label: '30,000 تومان',
        value: '30000'
    },
    {
        label: '40,000 تومان',
        value: '40000'
    },
    {
        label: '50,000 تومان',
        value: '50000'
    },
    {
        label: '100,000 تومان',
        value: '100000'
    }
];

export const PaymentForm = memo((props: PaymentFormProps) => {
    const [{ doctor, center }] = useDrApp();

    const isConsultCenter = center.id === '5532';

    const priceExpertise = costs.find(
        cost => +cost.expertiseId === +doctor.expertises[0].expertise.id
    )?.avg;
    const priceAvarage = priceExpertise ? round(Math.floor(+priceExpertise), -3) / 10 : 0;
    const {
        setPrice,
        price,
        setCartNumber,
        cartNumber,
        setIsActivePayment,
        isActivePayment,
        cartNumberFieldError,
        setCartNumberFieldError,
        priceFieldError,
        setPriceFieldError,
        toggleable = true,
        clickPriceFiled,
        clickCartNumberFiled
    } = props;
    useEffect(() => {
        if (!isConsultCenter) {
            if (!costsOffice.some(item => item.value === price)) {
                setPrice('');
            }
        }
    }, [price]);
    return (
        <FormControl className="space-y-4 w-full">
            {isActivePayment && (
                <>
                    {isConsultCenter ? (
                        priceAvarage ? (
                            <Typography>
                                همکاران شما بصورت میانگین مبلغ{' '}
                                <span className="font-medium">{addCommas(priceAvarage)}</span> تومان
                                را در نظر گرفته اند.
                            </Typography>
                        ) : null
                    ) : (
                        ''
                    )}

                    {isConsultCenter ? (
                        <PriceField
                            label="مبلغ هر ویزیت (تومان)"
                            onChange={e => setPrice(e.target.value)}
                            value={price ? price.toString() : ''}
                            limit={7}
                            error={priceFieldError}
                            helperText={priceFieldError ? 'لطفا مبلغ را وارد کنید.' : ''}
                            onFocus={() => setPriceFieldError(false)}
                            fullWidth
                            onClick={clickPriceFiled}
                        />
                    ) : (
                        <Autocomplete
                            disablePortal
                            options={costsOffice}
                            fullWidth
                            onChange={(e, newValue) => {
                                setPrice(newValue?.value ?? '');
                            }}
                            value={
                                price
                                    ? {
                                          label: costsOffice.find(item => item.value === price)
                                              ?.label,
                                          value: price
                                      }
                                    : null
                            }
                            onFocus={() => setPriceFieldError(false)}
                            renderInput={params => (
                                <TextField
                                    {...params}
                                    error={priceFieldError}
                                    label="مبلغ بیعانه"
                                    helperText={
                                        priceFieldError
                                            ? 'لطفا مبلغ را وارد کنید.'
                                            : price
                                            ? `${numberToWords(+price)} تومان`
                                            : ''
                                    }
                                    onClick={clickPriceFiled}
                                />
                            )}
                        />
                    )}

                    <BankNumberField
                        onChange={e => setCartNumber(e.target.value)}
                        value={cartNumber}
                        fullWidth
                        onClick={clickCartNumberFiled}
                        onFocus={() => setCartNumberFieldError(false)}
                        error={cartNumberFieldError}
                        helperText={cartNumberFieldError ? 'لطفا شماره کارت معتبر وارد کنید.' : ''}
                    />
                </>
            )}
            {toggleable && (
                <FormControlLabel
                    control={
                        <Checkbox
                            onChange={e => setIsActivePayment(e.target.checked ? false : true)}
                            checked={isActivePayment ? false : true}
                        />
                    }
                    label="تمایل به فعالسازی بیعانه ندارم."
                />
            )}
        </FormControl>
    );
});
