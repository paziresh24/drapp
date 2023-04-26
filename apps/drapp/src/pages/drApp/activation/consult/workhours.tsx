import Stack from '@mui/material/Stack';
import Button from '@mui/lab/LoadingButton';
import Divider from '@mui/material/Divider';
import Container from '@mui/material/Container';
import FixedWrapBottom from '@paziresh24/shared/ui/fixedWrapBottom';

import SelectDay from '../../../../components/setting/workDays/selectDay';
import SelectHours from '../../../../components/setting/workDays/selectHours';
import Result from '../../../../components/setting/workDays/result';

import { useState } from 'react';
import { useGetWorkHours } from '@paziresh24/hooks/drapp/fillInfo';
import { ChevronIcon } from '@paziresh24/shared/icon';
import { isDesktop } from 'react-device-detect';
import { useHistory } from 'react-router-dom';
import { useWorkHoursValidation } from 'apps/drapp/src/hooks/useWorkHoursValidation';
import { getSplunkInstance } from '@paziresh24/shared/ui/provider';
import axios from 'axios';
import SelectTime from 'apps/drapp/src/components/setting/duration/selectTime';
import { useConsultActivationStore } from 'apps/drapp/src/store/consultActivation.store';
import { range } from 'lodash';
import { useActiveConsult } from '@paziresh24/hooks/drapp/consultFillInfo';
import { digitsFaToEn } from '@persian-tools/persian-tools';
import { setCookie } from '@paziresh24/utils/cookie';
import moment from 'jalali-moment';
import { toast } from 'react-toastify';
import { useActivationStore } from '../activation.store';
import ActivationModal from 'apps/drapp/src/components/activation/activationModal';
import { useGetCentersDoctor } from 'apps/drapp/src/hooks/useGetCentersDoctor';
import { weekDays } from 'apps/drapp/src/constants/weekDays';
import uniq from 'lodash/uniq';

const durationList = range(1, 4);

const ConsultOfficeActivation = () => {
    const { validationWorkHour, setDays, setHours, days, hours } = useWorkHoursValidation();
    const activeConsult = useActiveConsult();

    const router = useHistory();
    const getWorkHoursRequest = useGetWorkHours({ center_id: 5532 });
    const addWorkHours = useConsultActivationStore(state => state.addWorkHours);
    const workHours = useConsultActivationStore(state => state.workHours);
    const removeWorkHours = useConsultActivationStore(state => state.removeWorkHours);
    // const duration = useConsultActivationStore(state => state.duration);
    // const setDuration = useConsultActivationStore(state => state.setDuration);
    const visitChannel = useConsultActivationStore(state => state.visitChannel);
    const price = useConsultActivationStore(state => state.price);
    const [questionActivation, setQuestionActivation] = useState(false);
    const selectedService = useActivationStore(state => state.selectedService);
    const getCentersDoctor = useGetCentersDoctor();

    const handleAdd = () => {
        if (
            validationWorkHour({
                currentWorkHours: workHours
            })
        ) {
            getSplunkInstance().sendEvent({
                group: 'activation-consult-workhours',
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
            await activeConsult.mutateAsync({
                workHours,
                service_length: 3,
                online_channels: visitChannel,
                price: price * 10
            });
            getSplunkInstance().sendEvent({
                group: 'activation-consult-workhours',
                type: 'visit-days',
                event: {
                    action: 3
                }
            });
            uniq(workHours.map(({ day }) => weekDays.find(({ id }) => day === id)?.nameEn)).forEach(
                day => {
                    getSplunkInstance().sendEvent({
                        group: 'activation-consult-workhours',
                        type: 'days',
                        event: {
                            action: day
                        }
                    });
                }
            );
            getSplunkInstance().sendEvent({
                group: 'activation-consult-workhours',
                type: 'done'
            });
            await getCentersDoctor.refetch();
            setCookie(
                'CONSULT_ACTIVATION_PENDING',
                true,
                moment().add(1, 'days').startOf('day').toDate()
            );
            getSplunkInstance().sendEvent({
                group: 'activation',
                type: `click-cosnult`,
                event: {
                    action: 'done'
                }
            });

            if (selectedService.length > 0) {
                setQuestionActivation(true);
                return;
            }
            router.push('/');
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.warning(error.response?.data?.message);
                getSplunkInstance().sendEvent({
                    group: 'activation-consult',
                    type: 'unsuccessful',
                    event: {
                        error: error.response?.data?.message
                    }
                });
            }
            if (selectedService.length > 0) {
                setQuestionActivation(true);
                return;
            }
        }
    };

    return (
        <Container
            maxWidth="sm"
            className="h-full pt-4 bg-white rounded-md md:h-auto md:p-5 md:mt-8 md:shadow-2xl md:shadow-slate-300"
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
            <Stack className="pb-32 space-y-5 md:pb-0">
                {/* <SelectTime
                    items={durationList}
                    label="مدت پاسخگویی پزشک"
                    value={duration}
                    onChange={setDuration}
                    isLoading={getWorkHoursRequest.isLoading}
                    prefix="روز"
                /> */}

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
                        loading={activeConsult.isLoading || getCentersDoctor.status.loading}
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
                currentType="consult"
            />
        </Container>
    );
};

export default ConsultOfficeActivation;
