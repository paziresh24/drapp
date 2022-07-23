import TextField from '@paziresh24/shared/ui/textField';
import { addCommas, numberToWords, removeCommas } from '@persian-tools/persian-tools';
import { useRef } from 'react';

interface PriceFieldProps {
    onChange: (e: string) => void;
    value: string;
    label: string;
    limit?: number;
}

export const PriceField = (props: PriceFieldProps) => {
    const { onChange, value, limit, ...rest } = props;
    const ref = useRef<HTMLInputElement>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/[^0-9,]/g, '');
        onChange(value);
        if (ref.current?.value) {
            ref.current.value = addCommas(removeCommas(value));
        }
    };
    return (
        <div className="flex flex-col w-full space-y-3" {...rest}>
            <span className="inline text-sm">مبلغ هر ویزیت (تومان)</span>
            <TextField ref={ref} onChange={handleChange} maxLength={limit} />
            {value && <span className="text-xs">{numberToWords(value)} تومان</span>}
        </div>
    );
};

export default PriceField;
