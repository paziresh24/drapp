import Stack from '@mui/material/Stack';
import Button from '@mui/lab/LoadingButton';
import Divider from '@mui/material/Divider';
import Container from '@mui/material/Container';
import FixedWrapBottom from '@paziresh24/shared/ui/fixedWrapBottom';

import SelectDay from '../../../../components/setting/workDays/selectDay';
import SelectHours from '../../../../components/setting/workDays/selectHours';
import Result from '../../../../components/setting/workDays/result';

import { useEffect } from 'react';
import { useWorkHoursStore } from 'apps/drapp/src/store/workhours.store';
import { useGetWorkHours } from '@paziresh24/hooks/drapp/fillInfo';
import { useDrApp } from '@paziresh24/context/drapp';
import { ChevronIcon } from '@paziresh24/shared/icon';
import { isDesktop } from 'react-device-detect';
import { useHistory, useLocation } from 'react-router-dom';
import { getSplunkInstance } from '@paziresh24/shared/ui/provider';
import { useWorkHoursValidation } from 'apps/drapp/src/hooks/useWorkHoursValidation';
import { useSubmitWorkHour } from 'apps/drapp/src/hooks/useSubmitWorkHour';
import axios from 'axios';
import SelectTime from 'apps/drapp/src/components/setting/duration/selectTime';
import { range } from 'lodash';
import { getCenterType } from 'apps/drapp/src/functions/getCenterType';
import queryString from 'query-string';
import classNames from 'classnames';
import { CenterList } from 'apps/drapp/src/components/centerList';
import { isEmbed } from '@paziresh24/shared/utils';

const durationList = range(5, 61, 5).filter(number => ![25, 35, 40, 45, 50, 55].includes(number));

const WorkHours = () => {
    const { validationWorkHour, setDays, setHours, days, hours } = useWorkHoursValidation();
    const { submitWorkHour, isLoading } = useSubmitWorkHour();
    const router = useHistory();
    const [doctorInfo] = useDrApp();
    const setWorkHours = useWorkHoursStore(state => state.setWorkHours);
    const workHours = useWorkHoursStore(state => state.workHours);
    const addWorkHours = useWorkHoursStore(state => state.addWorkHours);
    const getWorkHoursRequest = useGetWorkHours({ center_id: doctorInfo.center.id });
    const removeWorkHours = useWorkHoursStore(state => state.removeWorkHours);
    const duration = useWorkHoursStore(state => state.duration);
    const setDuration = useWorkHoursStore(state => state.setDuration);

    useEffect(() => {
        getWorkHoursRequest.remove();
        getWorkHoursRequest.refetch();
    }, [doctorInfo.center]);

    useEffect(() => {
        if (getWorkHoursRequest.isSuccess) {
            setWorkHours(getWorkHoursRequest.data.data.workhours);
            setDuration(getWorkHoursRequest.data.data.duration);
        }
    }, [getWorkHoursRequest.status]);

    const handleAdd = () => {
        if (
            validationWorkHour({
                currentWorkHours: workHours
            })
        ) {
            handleSubmit({
                duration,
                workHours: [
                    ...workHours,
                    ...days.map(day => ({
                        day,
                        ...hours
                    }))
                ]
            });
            addWorkHours(
                days.map(day => ({
                    day,
                    ...hours
                }))
            );
        }
    };

    const handleRemoveWorkHours = ({ days, from, to }: DaysInSameTime) => {
        const workHourClone = [...workHours];
        days.forEach(day => {
            const index = workHourClone.findIndex(
                workHour => workHour.day === day && workHour.from === from && workHour.to === to
            );
            workHourClone.splice(index, 1);
        });
        removeWorkHours({ days, from, to });
        handleSubmit({ workHours: workHourClone, duration });
    };

    const handleSetDuration = (duration: number) => {
        setDuration(duration);
        handleSubmit({ workHours, duration });
    };

    const handleSubmit = async ({
        workHours,
        duration
    }: {
        workHours: Day[];
        duration: number;
    }) => {
        try {
            await submitWorkHour({
                centerId: doctorInfo.center.id,
                workHours,
                duration
            });
            getSplunkInstance().sendEvent({
                group: 'workdays_active_booking',
                type: 'successful'
            });
        } catch (error) {
            if (axios.isAxiosError(error)) {
                getSplunkInstance().sendEvent({
                    group: 'workdays_active_booking',
                    type: 'unsuccessful',
                    event: {
                        error: error.response?.data
                    }
                });
            }
        }
    };

    return (
        <Container
            maxWidth="sm"
            className="h-full pt-4 bg-white rounded-md md:h-auto md:p-5 md:mt-8 md:shadow-md"
        >
            <Stack className="pb-32 space-y-5 md:pb-0">
                {getCenterType(doctorInfo.center) !== 'consult' && (
                    <SelectTime
                        items={durationList}
                        value={duration}
                        onChange={handleSetDuration}
                        label="مدت زمان هر ویزیت بیمار در مطب شما چقدر است؟"
                        isLoading={getWorkHoursRequest.isLoading}
                        prefix="دقیقه"
                    />
                )}
                <SelectDay selectedDays={days} onChange={setDays} />
                <SelectHours defaultHours={hours} onChange={setHours} />
                <Button
                    loading={isLoading}
                    onClick={handleAdd}
                    variant="contained"
                    className="self-end"
                >
                    افزودن
                </Button>
                <Divider />
                <Result
                    isLoading={getWorkHoursRequest.isLoading}
                    values={workHours}
                    removeAction={handleRemoveWorkHours}
                />
            </Stack>
        </Container>
    );
};

export default WorkHours;
