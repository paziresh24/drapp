import { OutlinedTextFieldProps, TextField, TextFieldProps } from '@mui/material';
import { addCommas, numberToWords, removeCommas } from '@persian-tools/persian-tools';
import { useRef } from 'react';

interface PriceFieldProps extends Omit<TextFieldProps, 'onChange'> {
    onChange: (value: string) => void;
    value: string;
    limit?: number;
}

export const PriceField = (props: PriceFieldProps) => {
    const { onChange, value, label, limit, helperText, ...rest } = props;
    const ref = useRef<HTMLInputElement>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/[^0-9,]/g, '');
        onChange(value);
        if (ref.current?.value) {
            ref.current.value = addCommas(removeCommas(value));
        }
    };

    return (
        <TextField
            inputRef={ref}
            label={label}
            onChange={handleChange}
            defaultValue={value ? addCommas(removeCommas(value)) : ''}
            inputProps={{
                inputMode: 'tel',
                maxLength: limit,
                style: { textAlign: 'left', direction: 'ltr' }
            }}
            helperText={helperText ? helperText : +value ? `${numberToWords(value)} تومان` : ''}
            {...rest}
        />
    );
};

export default PriceField;
