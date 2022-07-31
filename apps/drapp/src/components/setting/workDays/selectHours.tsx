/* eslint-disable @typescript-eslint/no-explicit-any */

import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Stack from '@mui/material/Stack';
import { memo } from 'react';
import TimeInput from '@paziresh24/shared/ui/timeInput';
import range from 'lodash/range';
import { useWorkHoursStore } from 'apps/drapp/src/store/workhours.store';

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
    const { duration } = useWorkHoursStore();

    const handleChange = (action: Action, time: string) => {
        onChange &&
            onChange((prev: any) => ({
                ...prev,
                [action]: time
            }));
    };

    const minuteExclude: number[] = range(0, 60, 1).filter(
        o => !range(0, 60, duration ?? 5).includes(o)
    );

    return (
        <FormControl className="space-y-5">
            <FormLabel focused={false}>ساعت کاری</FormLabel>
            <Stack direction="row" className="space-s-4">
                <TimeInput
                    label="ساعت شروع"
                    defaultValue={defaultHours.from}
                    onCahnge={value => handleChange('from', value)}
                    minuteExclude={minuteExclude}
                />
                <TimeInput
                    label="ساعت پایان"
                    defaultValue={defaultHours.to}
                    onCahnge={value => handleChange('to', value)}
                    minuteExclude={minuteExclude}
                />
            </Stack>
        </FormControl>
    );
};

export default memo(SelectHours);
