import { ChangeEvent, memo } from 'react';

import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';

interface Props {
    title: string;
    required?: boolean;
    options: option[];
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

type option = {
    label: string;
    value: unknown;
    defaultChecked?: boolean;
};

export const RadioQuestionBox = ({ title, required, options, onChange }: Props) => {
    return (
        <FormControl className="space-y-4">
            <FormLabel required={required} focused={false}>
                {title}
            </FormLabel>
            <RadioGroup className="space-y-2" name="question" onChange={onChange}>
                {options.map(({ label, value, defaultChecked }) => (
                    <FormControlLabel
                        checked={defaultChecked}
                        key={label}
                        value={value}
                        control={<Radio />}
                        label={label}
                    />
                ))}
            </RadioGroup>
        </FormControl>
    );
};

export default memo(RadioQuestionBox);
