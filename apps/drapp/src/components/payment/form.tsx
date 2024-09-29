import { Autocomplete, FormControl, TextField } from '@mui/material';
import BankNumberField from '@paziresh24/shared/ui/bankNumberField';
import { Dispatch, memo, SetStateAction, useEffect, useState } from 'react';
import { numberToWords } from '@persian-tools/persian-tools';
import PriceField from '@paziresh24/shared/ui/priceField';
import { ErrorBoundary } from 'react-error-boundary';
import { getSplunkInstance } from '@paziresh24/shared/ui/provider';

export interface PaymentFormProps {
    setPrice: Dispatch<SetStateAction<string>>;
    price: string;
    setCartNumber: Dispatch<SetStateAction<string>>;
    cartNumber: string;
    priceFieldError: boolean;
    setPriceFieldError: Dispatch<SetStateAction<boolean>>;
    cartNumberFieldError: boolean;
    setCartNumberFieldError: Dispatch<SetStateAction<boolean>>;
    selectBoxPrice?: boolean;
    clickPriceFiled?: () => void;
    clickCartNumberFiled?: () => void;
    priceLable: string;
    showBankNumberField?: boolean;
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
    },
    {
        label: 'قیمت دلخواه',
        value: 'custom'
    }
];

export const PaymentForm = memo((props: PaymentFormProps) => {
    const {
        setPrice,
        price,
        setCartNumber,
        cartNumber,
        cartNumberFieldError,
        setCartNumberFieldError,
        priceFieldError,
        setPriceFieldError,
        selectBoxPrice = true,
        clickPriceFiled,
        clickCartNumberFiled,
        showBankNumberField = true,
        priceLable
    } = props;
    const [customPrice, setCustomPrice] = useState(false);
    useEffect(() => {
        if (selectBoxPrice && price && !costsOffice.some(item => item.value === price)) {
            setCustomPrice(true);
        }
    }, [price]);

    return (
        <FormControl className="w-full space-y-4">
            <>
                <ErrorBoundary
                    FallbackComponent={props => {
                        setCustomPrice(true);
                        return <></>;
                    }}
                    onError={(error, errorInfo) => {
                        getSplunkInstance().sendEvent({
                            group: 'frontend_error_logging',
                            type: 'drapp-payment-page::unhandled_exceptions_with_error_boundary',
                            event: {
                                error: {
                                    message: error.message,
                                    stack: error.stack,
                                    name: error.name
                                },
                                errorInfo
                            }
                        });
                    }}
                >
                    {selectBoxPrice && !customPrice && (
                        <Autocomplete
                            disabledItemsFocusable
                            disablePortal
                            options={costsOffice}
                            fullWidth
                            onChange={(e, newValue) => {
                                setCustomPrice(newValue?.value === 'custom');
                                if (newValue?.value !== 'custom') setPrice(newValue?.value ?? '');
                            }}
                            value={
                                price
                                    ? {
                                          label: costsOffice.find(item => item.value === price)
                                              ?.label,
                                          value: price.toString()
                                      }
                                    : null
                            }
                            onFocus={() => setPriceFieldError(false)}
                            renderInput={params => (
                                <TextField
                                    {...params}
                                    error={priceFieldError}
                                    label={priceLable}
                                    helperText={priceFieldError ? 'لطفا مبلغ را وارد کنید.' : ''}
                                    onClick={clickPriceFiled}
                                />
                            )}
                        />
                    )}
                    {(!selectBoxPrice || customPrice) && (
                        <PriceField
                            label={priceLable + ' (تومان)'}
                            onChange={e => setPrice(e.target.value)}
                            value={price}
                            helperText={priceFieldError ? 'لطفا مبلغ را وارد کنید.' : ''}
                            onClick={clickPriceFiled}
                            onFocus={() => setPriceFieldError(false)}
                            error={priceFieldError}
                            autoFocus
                            limit={7}
                        />
                    )}
                </ErrorBoundary>
                {showBankNumberField && (
                    <BankNumberField
                        onChange={e => setCartNumber(e.target.value)}
                        value={cartNumber}
                        fullWidth
                        onClick={clickCartNumberFiled}
                        onFocus={() => setCartNumberFieldError(false)}
                        error={cartNumberFieldError}
                        helperText={
                            cartNumberFieldError
                                ? 'لطفا شماره کارت معتبر وارد کنید.'
                                : '.لطفا از درج شماره کارت بانک سامان(بلوبانک) خودداری کنید'
                        }
                    />
                )}
            </>
        </FormControl>
    );
});
