/* eslint-disable @typescript-eslint/no-explicit-any */

import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Stack from '@mui/material/Stack';
import { memo } from 'react';
import TimeInput from './timeInput';

interface Props {
    onChange: (hours: any) => void;
    defaultHours: Hours;
}

type Action = 'from' | 'to';

type Hours = {
    from: string;
    to: string;
};

const SelectHours = ({ onChange, defaultHours }: Props) => {
    const handleChange = (action: Action, time: string) => {
        onChange &&
            onChange((prev: any) => ({
                ...prev,
                [action]: time
            }));
    };

    return (
        <FormControl className="space-y-5">
            <FormLabel focused={false}>ساعت کاری</FormLabel>
            <Stack direction="row" className="space-s-4">
                <TimeInput
                    label="ساعت شروع"
                    defaultValue={defaultHours.from}
                    onCahnge={value => handleChange('from', value)}
                />
                <TimeInput
                    label="ساعت پایان"
                    defaultValue={defaultHours.to}
                    onCahnge={value => handleChange('to', value)}
                />
            </Stack>
        </FormControl>
    );
};

export default memo(SelectHours);
