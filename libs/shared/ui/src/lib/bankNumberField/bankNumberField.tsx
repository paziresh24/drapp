import { InputAdornment, TextField, TextFieldProps } from '@mui/material';
import BankNumberFormatCustom from './BankNumberFormatCustom';
import { bankIcon } from './bankIcon';
import getBankNameFromCardNumber from './getBankNameFromCardNumber';
import './bankIcon.scss';
import { useEffect, useState } from 'react';

export const BankNumberField = (props: TextFieldProps) => {
    const [icon, setIcon] = useState<string | undefined>();
    useEffect(() => {
        if (props.value) {
            setIcon(
                bankIcon.find(bank =>
                    getBankNameFromCardNumber(props.value as string)?.includes(bank.name)
                )?.icon
            );
            return;
        }
        setIcon(undefined);
    }, [props.value]);

    return (
        <TextField
            label="شماره کارت"
            variant="outlined"
            {...props}
            inputProps={{
                inputMode: 'tel',
                style: { textAlign: 'left', direction: 'ltr' }
            }}
            placeholder="1234-1234-1234-1234"
            InputProps={{
                inputComponent: BankNumberFormatCustom as any,
                startAdornment: icon && (
                    <InputAdornment position="start">
                        <i className={`ibl32 ibl-${icon}`} />
                    </InputAdornment>
                )
            }}
        />
    );
};

export default BankNumberField;
