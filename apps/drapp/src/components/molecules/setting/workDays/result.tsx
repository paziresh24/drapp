import { useWorkHoursStore } from 'apps/drapp/src/store/workhours.store';
import { memo, useEffect, useState } from 'react';
import groupBy from 'lodash/groupBy';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';
import IconButton from '@mui/material/IconButton';
import { CloseIcon } from '@paziresh24/shared/icon';
import { weekDays } from '../../../../constants/weekDays';

interface Props {
    isLoading: boolean;
}

const Result = (props: Props) => {
    const { isLoading } = props;
    const workHours = useWorkHoursStore(state => state.workHours);
    const removeWorkHours = useWorkHoursStore(state => state.removeWorkHours);
    const [formattedWorkHours, setFormattedWorkHours] = useState<DaysInSameTime[]>([]);

    useEffect(() => {
        const grp = groupBy(workHours, workDay => workDay.from + '-' + workDay.to);

        const formattedWorkHours = Object.values(grp).map(workDays => ({
            days: workDays.map(workDay => workDay.day),
            from: workDays[0].from,
            to: workDays[0].to
        }));

        setFormattedWorkHours(formattedWorkHours);
    }, [workHours]);

    if (isLoading)
        return (
            <Stack>
                <Skeleton animation="wave" height={50} />
                <Skeleton animation="wave" height={50} />
                <Skeleton animation="wave" height={50} />
                <Skeleton animation="wave" height={50} />
            </Stack>
        );

    return (
        <Stack spacing="1rem">
            {formattedWorkHours.map((workDay, index: number) => (
                <Card
                    elevation={0}
                    key={index}
                    className="flex justify-between items-center space-s-3"
                >
                    <Stack direction="row" spacing={0.5} alignItems="center">
                        <IconButton onClick={() => removeWorkHours({ ...workDay })}>
                            <CloseIcon className="w-4 h-4" />
                        </IconButton>
                        <Typography variant="body2" component="span">
                            {workDay.days
                                .map(day => weekDays.find(weekDay => weekDay.id === day)?.name)
                                .join(' و ')}
                        </Typography>
                    </Stack>
                    <Typography
                        fontWeight="medium"
                        variant="body2"
                        component="span"
                        className="min-w-fit"
                    >
                        از ساعت {workDay.from} الی {workDay.to}
                    </Typography>
                </Card>
            ))}
        </Stack>
    );
};

export default memo(Result);
