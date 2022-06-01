import Stack from '@mui/material/Stack';
import Button from '@mui/lab/LoadingButton';
import Divider from '@mui/material/Divider';
import Container from '@mui/material/Container';
import FixedWrapBottom from '@paziresh24/shared/ui/fixedWrapBottom';

import SelectDay from '../../../components/molecules/setting/workDays/selectDay';
import SelectHours from '../../../components/molecules/setting/workDays/selectHours';
import Result from '../../../components/molecules/setting/workDays/result';

import { useCallback, useEffect, useState } from 'react';
import { useWorkHoursStore } from 'apps/drapp/src/store/workhours.store';
import { useGetWorkHours, useWorkHours } from '@paziresh24/hooks/drapp/fillInfo';
import { useDrApp } from '@paziresh24/context/drapp';
import { toast } from 'react-toastify';
import { weekDays } from 'apps/drapp/src/constants/weekDays';
import { ChevronIcon } from '@paziresh24/shared/icon';
import { isDesktop } from 'react-device-detect';
import { useHistory } from 'react-router-dom';
import uniq from 'lodash/uniq';

const initialHours = {
    from: '09:00',
    to: '21:00'
};

const workHoursValidation = (workHours: Day[]) => {
    const isValidTime = workHours.every(workHour => {
        const { from, to } = workHour;
        const fromTime = new Date(`1970-01-01 ${from}`);
        const toTime = new Date(`1970-01-01 ${to}`);
        return fromTime < toTime;
    });

    return isValidTime;
};

const oldAndNewWorkHours = ({
    workHours,
    prevWorkHours
}: {
    workHours: Day[];
    prevWorkHours: Day[];
}) => {
    const confilitedDays: DayIds[] = [];
    workHours.forEach(workHour => {
        const { from, to } = workHour;
        const fromTime = new Date(`1970-01-01 ${from}`).getTime();
        const toTime = new Date(`1970-01-01 ${to}`).getTime();
        prevWorkHours.forEach(prevWorkHour => {
            const { from: prevFrom, to: prevTo } = prevWorkHour;
            const prevFromTime = new Date(`1970-01-01 ${prevFrom}`).getTime();
            const prevToTime = new Date(`1970-01-01 ${prevTo}`).getTime();
            if (workHour.day === prevWorkHour.day) {
                if (
                    (fromTime < prevFromTime && toTime <= prevFromTime) ||
                    (fromTime >= prevToTime && toTime > prevToTime)
                ) {
                    return;
                }
                confilitedDays.push(workHour.day);
            }
        });
    });
    return uniq(confilitedDays);
};

const WorkHours = () => {
    const router = useHistory();
    const [docotorInfo] = useDrApp();
    const [days, setDays] = useState<DayIds[]>([]);
    const [hours, setHours] = useState(initialHours);
    const setWorkHours = useWorkHoursStore(state => state.setWorkHours);
    const addWorkHours = useWorkHoursStore(state => state.addWorkHours);
    const workHours = useWorkHoursStore(state => state.workHours);
    const duration = useWorkHoursStore(state => state.duration);

    const workHoursMutateRequest = useWorkHours();
    const getWorkHoursRequest = useGetWorkHours({ center_id: docotorInfo.center.id });

    useEffect(() => {
        if (getWorkHoursRequest.isSuccess) {
            setWorkHours(getWorkHoursRequest.data.data.workhours);
        }
    }, [getWorkHoursRequest.status]);

    const handleAdd = useCallback(() => {
        if (!days.length) return;

        const getNotSelectDaysInTime = (day: DayIds) =>
            !workHours.some(
                workHour =>
                    workHour.day === day && workHour.from === hours.from && workHour.to === hours.to
            );

        const workDays = days.filter(getNotSelectDaysInTime).map(day => ({
            day,
            ...hours
        }));

        if (!workHoursValidation(workDays))
            return toast.error('زمان های کاری باید به صورت صحیح وارد شود.');

        if (oldAndNewWorkHours({ workHours: workDays, prevWorkHours: workHours }).length > 0) {
            return oldAndNewWorkHours({
                workHours: workDays,
                prevWorkHours: workHours
            }).forEach(dayId => {
                toast.error(
                    `روز ${
                        weekDays.find(day => day.id === dayId)?.name
                    } با زمان های دیگر تداخل دارد.`
                );
            });
        }

        addWorkHours(workDays);

        setDays([]);
        setHours(initialHours);
    }, [days, hours]);

    const handleSubmit = useCallback(() => {
        workHoursMutateRequest.mutate(
            {
                center_id: docotorInfo.center.id,
                cost: 0,
                duration,
                workHours
            },

            {
                onError: (error: any) => {
                    Object.values(error.response.data.errors).forEach((messages: any) => {
                        messages.forEach((message: string) => {
                            toast.error(message);
                        });
                    });
                },
                onSuccess: () => {
                    toast.success('ساعت کاری شما ذخیره شد.');
                    router.push('/');
                }
            }
        );
    }, [duration, workHours]);

    return (
        <Container
            maxWidth="sm"
            className="h-full md:h-auto md:p-5 rounded-md pt-4 bg-white md:mt-8 md:shadow-md"
        >
            {isDesktop && (
                <Button
                    className="!mb-3"
                    startIcon={<ChevronIcon style={{}} dir="right" color="#0070f3" />}
                    onClick={() => router.goBack()}
                >
                    بازگشت
                </Button>
            )}
            <Stack className="space-y-5 overflow-auto pb-32 md:pb-0">
                <SelectDay selectedDays={days} onChange={setDays} />
                <SelectHours defaultHours={hours} onChange={setHours} />
                <Button onClick={handleAdd} variant="contained" className="self-end">
                    افزودن
                </Button>
                <Divider />
                <Result isLoading={getWorkHoursRequest.isLoading} />
                <FixedWrapBottom className="border-t border-solid border-[#e8ecf0]">
                    <Button
                        fullWidth
                        variant="outlined"
                        size="large"
                        onClick={handleSubmit}
                        loading={workHoursMutateRequest.isLoading}
                    >
                        ذخیره
                    </Button>
                </FixedWrapBottom>
            </Stack>
        </Container>
    );
};

export default WorkHours;
