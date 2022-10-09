import { TextField, TextFieldProps } from '@mui/material';
import { addCommas, numberToWords, removeCommas } from '@persian-tools/persian-tools';
import { useRef } from 'react';
import PriceFieldFormatCustom from './priceFieldFormatCustom';

interface PriceFieldProps extends Omit<TextFieldProps, 'helperText'> {
    limit?: number;
    helperText?: string;
}

export const PriceField = (props: PriceFieldProps) => {
    const { limit, helperText, value, inputProps, InputProps, ...rest } = props;

    return (
        <TextField
            value={value}
            defaultValue={value ? value : ''}
            inputProps={{
                ...inputProps,
                maxLength: limit,
                inputMode: 'tel',
                style: { textAlign: 'left', direction: 'ltr' }
            }}
            InputProps={{
                ...InputProps,
                inputComponent: PriceFieldFormatCustom as any
            }}
            helperText={helperText ? helperText : value ? `${numberToWords(+value)} تومان` : ''}
            {...rest}
        />
    );
};

export default PriceField;
