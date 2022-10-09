import { memo } from 'react';

import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import { CheckIcon } from '@paziresh24/shared/icon';
import Skeleton from '@mui/material/Skeleton';

interface SelectTimeProps {
    label: string;
    items: number[];
    value: number;
    onChange: (value: number) => void;
    isLoading: boolean;
    prefix?: string;
}

const SelectTime = (props: SelectTimeProps) => {
    const { label, items, onChange, value, isLoading, prefix } = props;

    const handleChange = (value: number) => {
        onChange(value);
    };

    return (
        <FormControl className="space-y-4">
            <FormLabel focused={false}>{label}</FormLabel>
            <Stack direction="row-reverse" gap={1.5} className="flex-wrap mt-5">
                {isLoading && <DurationLoading />}
                {!isLoading &&
                    items.map(item => (
                        <Chip
                            key={item}
                            label={`${item}${prefix ? ` ${prefix}` : ''}`}
                            variant="outlined"
                            icon={
                                value === item ? (
                                    <CheckIcon className="!mr-2 fill-primary" />
                                ) : undefined
                            }
                            color={value === item ? 'primary' : 'default'}
                            onClick={() => handleChange(item)}
                        />
                    ))}
            </Stack>
        </FormControl>
    );
};

const DurationLoading = () => {
    return (
        <>
            <Skeleton variant="circular" width="4rem" height="2rem" className="!rounded-full" />
            <Skeleton variant="circular" width="4rem" height="2rem" className="!rounded-full" />
            <Skeleton variant="circular" width="4rem" height="2rem" className="!rounded-full" />
            <Skeleton variant="circular" width="4rem" height="2rem" className="!rounded-full" />
            <Skeleton variant="circular" width="4rem" height="2rem" className="!rounded-full" />
            <Skeleton variant="circular" width="4rem" height="2rem" className="!rounded-full" />
            <Skeleton variant="circular" width="4rem" height="2rem" className="!rounded-full" />
        </>
    );
};

export default memo(SelectTime);
