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
import moment from 'jalali-moment';
import { getSplunkInstance } from '@paziresh24/shared/ui/provider';
import ActivationModal from 'apps/drapp/src/components/molecules/activation/activationModal';

const initialHours = {
    from: '09:00',
    to: '21:00'
};

const convertTimeToTimeStamp = (time: string) => {
    const [hour, minute] = time.split(':');
    return +moment()
        .hour(+hour)
        .minute(+minute)
        .unix();
};

const workHoursValidation = (workHours: Day[]) => {
    const isValidTime = workHours.every(workHour => {
        const { from, to } = workHour;
        return convertTimeToTimeStamp(from) < convertTimeToTimeStamp(to);
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
        const fromTime = convertTimeToTimeStamp(from);
        const toTime = convertTimeToTimeStamp(to);
        prevWorkHours.forEach(prevWorkHour => {
            const { from: prevFrom, to: prevTo } = prevWorkHour;
            const prevFromTime = convertTimeToTimeStamp(prevFrom);
            const prevToTime = convertTimeToTimeStamp(prevTo);
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
    const [questionActivation, setQuestionActivation] = useState(false);

    const workHoursMutateRequest = useWorkHours();
    const getWorkHoursRequest = useGetWorkHours({ center_id: docotorInfo.center.id });

    const isRegisterFunnel = window.location.search.includes('action=enable-booking');

    useEffect(() => {
        getWorkHoursRequest.refetch();
    }, []);

    useEffect(() => {
        if (getWorkHoursRequest.isSuccess) {
            setWorkHours(getWorkHoursRequest.data.data.workhours);
        }
    }, [getWorkHoursRequest.status]);

    const handleAdd = useCallback(() => {
        if (!days.length) return toast.error('لطفا روز های کاری خود را انتخاب کنید.');

        const workDays = days.map(day => ({
            day,
            ...hours
        }));

        if (!workHoursValidation(workDays)) {
            return toast.error('زمان های کاری باید به صورت صحیح وارد شود.');
        }

        const confilitedDays = oldAndNewWorkHours({
            workHours: workDays,
            prevWorkHours: workHours
        });

        if (confilitedDays.length > 0) {
            return confilitedDays.forEach(dayId => {
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
                    getSplunkInstance().sendEvent({
                        group: 'workdays_active_booking',
                        type: 'unsuccessful',
                        event: {
                            error: error.response.data
                        }
                    });
                    Object.values(error.response.data.errors).forEach((messages: any) => {
                        messages.forEach((message: string) => {
                            toast.error(message);
                        });
                    });
                },
                onSuccess: () => {
                    getSplunkInstance().sendEvent({
                        group: 'workdays_active_booking',
                        type: 'successful'
                    });

                    toast.success('ساعت کاری شما ذخیره شد.');
                    if (isRegisterFunnel) return setQuestionActivation(true);

                    handleClose();
                }
            }
        );
    }, [duration, workHours]);

    const handleClose = useCallback(() => {
        if (isRegisterFunnel) return window.location.assign('/');
        router.push('/');
    }, []);

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
            <Stack className="space-y-5 pb-32 md:pb-0">
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
                <ActivationModal
                    isOpen={questionActivation}
                    onClose={() => {
                        setQuestionActivation(false);
                        handleClose();
                    }}
                    currentType="office"
                />
            </Stack>
        </Container>
    );
};

export default WorkHours;
