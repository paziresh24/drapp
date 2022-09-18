import Stack from '@mui/material/Stack';
import Button from '@mui/lab/LoadingButton';
import Divider from '@mui/material/Divider';
import Container from '@mui/material/Container';
import FixedWrapBottom from '@paziresh24/shared/ui/fixedWrapBottom';

import SelectDay from '../../../../components/molecules/setting/workDays/selectDay';
import SelectHours from '../../../../components/molecules/setting/workDays/selectHours';
import Result from '../../../../components/molecules/setting/workDays/result';

import { useEffect, useState } from 'react';
import { useWorkHoursStore } from 'apps/drapp/src/store/workhours.store';
import { useGetWorkHours } from '@paziresh24/hooks/drapp/fillInfo';
import { useDrApp } from '@paziresh24/context/drapp';
import { ChevronIcon } from '@paziresh24/shared/icon';
import { isDesktop } from 'react-device-detect';
import { useHistory } from 'react-router-dom';
import { useWorkHoursValidation } from 'apps/drapp/src/hooks/useWorkHoursValidation';
import { useSubmitWorkHour } from 'apps/drapp/src/hooks/useSubmitWorkHour';
import { getSplunkInstance } from '@paziresh24/shared/ui/provider';
import axios from 'axios';
import ActivationModal from 'apps/drapp/src/components/molecules/activation/activationModal';
import { useActivationStore } from '../activation.store';
import { useGetCentersDoctor } from 'apps/drapp/src/hooks/useGetCentersDoctor';
import { weekDays } from 'apps/drapp/src/constants/weekDays';
import uniq from 'lodash/uniq';

const WorkHoursOfficeActivation = () => {
    const { validationWorkHour, setDays, setHours, days, hours } = useWorkHoursValidation();
    const { submitWorkHour, isLoading } = useSubmitWorkHour();
    const router = useHistory();
    const [doctorInfo]: [
        {
            centers: any[];
            center: any;
        },
        any
    ] = useDrApp();
    const officeCenter = doctorInfo?.centers.find(center => center.type_id === 1);
    const selectedService = useActivationStore(state => state.selectedService);
    const setWorkHours = useWorkHoursStore(state => state.setWorkHours);
    const workHours = useWorkHoursStore(state => state.workHours);
    const addWorkHours = useWorkHoursStore(state => state.addWorkHours);
    const getWorkHoursRequest = useGetWorkHours({ center_id: officeCenter.id });
    const removeWorkHours = useWorkHoursStore(state => state.removeWorkHours);
    const [questionActivation, setQuestionActivation] = useState(false);
    const getCentersDoctor = useGetCentersDoctor();

    useEffect(() => {
        getWorkHoursRequest.refetch();
    }, []);

    useEffect(() => {
        if (getWorkHoursRequest.isSuccess) {
            setWorkHours(getWorkHoursRequest.data.data.workhours);
        }
    }, [getWorkHoursRequest.status]);

    const handleAdd = () => {
        if (
            validationWorkHour({
                currentWorkHours: workHours
            })
        ) {
            getSplunkInstance().sendEvent({
                group: 'activation-office-workhours',
                type: 'add'
            });
            addWorkHours(
                days.map(day => ({
                    day,
                    ...hours
                }))
            );
        }
    };

    const handleSubmit = async () => {
        try {
            await submitWorkHour({
                centerId: officeCenter.id
            });
            uniq(workHours.map(({ day }) => weekDays.find(({ id }) => day === id)?.nameEn)).forEach(
                day => {
                    getSplunkInstance().sendEvent({
                        group: 'activation-office-workhours',
                        type: 'days',
                        event: {
                            action: day
                        }
                    });
                }
            );
            getSplunkInstance().sendEvent({
                group: 'activation-office-workhours',
                type: 'done'
            });
            getSplunkInstance().sendEvent({
                group: 'activation',
                type: `click-office`,
                event: {
                    action: 'done'
                }
            });
            await getCentersDoctor.refetch();
            if (selectedService.length > 0) {
                setQuestionActivation(true);
                return;
            }
            router.push('/');
        } catch (error) {
            if (axios.isAxiosError(error)) {
                getSplunkInstance().sendEvent({
                    group: 'activation-office-workhours',
                    type: 'unsuccessful',
                    event: {
                        error: error.response?.data
                    }
                });
                getSplunkInstance().sendEvent({
                    group: 'activation-office',
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
            className="h-full md:h-auto md:p-5 rounded-md pt-4 bg-white md:mt-8 md:shadow-2xl md:shadow-slate-300"
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
                <Result
                    isLoading={getWorkHoursRequest.isLoading}
                    values={workHours}
                    removeAction={removeWorkHours}
                />
                <FixedWrapBottom className="border-t border-solid !bottom-0 border-[#e8ecf0]">
                    <Button
                        fullWidth
                        variant="outlined"
                        size="large"
                        onClick={handleSubmit}
                        loading={isLoading || getCentersDoctor.status.loading}
                    >
                        ذخیره
                    </Button>
                </FixedWrapBottom>
            </Stack>
            <ActivationModal
                isOpen={questionActivation}
                onClose={() => {
                    setQuestionActivation(false);
                    router.push('/');
                }}
                currentType="office"
            />
        </Container>
    );
};

export default WorkHoursOfficeActivation;
