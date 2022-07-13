import range from 'lodash/range';
import { memo, useEffect } from 'react';

import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import { CheckIcon } from '@paziresh24/shared/icon';
import { useWorkHoursStore } from '../../../store/workhours.store';
import AlertForDuration from './alertForDuration';
import { useDrApp } from '@paziresh24/context/drapp';
import { useGetWorkHours } from '@paziresh24/hooks/drapp/fillInfo';
import Skeleton from '@mui/material/Skeleton';

const SelectTime = () => {
    const [docotorInfo] = useDrApp();
    const duration = useWorkHoursStore(state => state.duration);
    const setDuration = useWorkHoursStore(state => state.setDuration);
    const getWorkHoursRequest = useGetWorkHours({ center_id: docotorInfo.center.id });

    useEffect(() => {
        getWorkHoursRequest.remove();
        getWorkHoursRequest.refetch();
    }, []);

    useEffect(() => {
        if (getWorkHoursRequest.isSuccess) {
            setDuration(getWorkHoursRequest.data.data.duration);
        }
    }, [getWorkHoursRequest.status]);

    const handleSelctedDuration = (duration: number) => {
        setDuration(duration);
    };

    const durationList = range(5, 61, 5).filter(
        number => ![25, 35, 40, 45, 50, 55].includes(number)
    );

    return (
        <FormControl className="space-y-4">
            <FormLabel focused={false}>مدت زمان هر ویزیت بیمار در مطب شما چقدر است؟</FormLabel>
            <Stack direction="row-reverse" gap={1.5} className="mt-5 flex-wrap">
                {getWorkHoursRequest.isLoading && <DurationLoading />}
                {getWorkHoursRequest.isSuccess &&
                    durationList.map((number: number) => (
                        <Chip
                            key={number}
                            label={`${number} دقیقه`}
                            variant="outlined"
                            icon={
                                duration === number ? (
                                    <CheckIcon className="!mr-2 fill-primary" />
                                ) : undefined
                            }
                            color={duration === number ? 'primary' : 'default'}
                            onClick={() => handleSelctedDuration(number)}
                        />
                    ))}
            </Stack>
            <AlertForDuration />
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
