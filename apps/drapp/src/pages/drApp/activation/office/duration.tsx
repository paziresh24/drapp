import { ChangeEvent, useCallback, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import FixedWrapBottom from '@paziresh24/shared/ui/fixedWrapBottom';
import RadioQuestionBox from '@paziresh24/shared/ui/radioQuestionBox';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import SelectTime from '../../../../components/molecules/setting/duration/selectTime';
import { useWorkHoursStore } from '../../../../store/workhours.store';
import { getSplunkInstance } from '@paziresh24/shared/ui/provider';
import { useGetWorkHours } from '@paziresh24/hooks/drapp/fillInfo';
import { range } from 'lodash';
import { useDrApp } from '@paziresh24/context/drapp';
import AlertForDuration from 'apps/drapp/src/components/molecules/setting/duration/alertForDuration';

const durationList = range(5, 61, 5).filter(number => ![25, 35, 40, 45, 50, 55].includes(number));

const DurationOfficeActivation = () => {
    const [doctorInfo] = useDrApp();
    const router = useHistory();
    const duration = useWorkHoursStore(state => state.duration);
    const setDuration = useWorkHoursStore(state => state.setDuration);
    const getWorkHoursRequest = useGetWorkHours({ center_id: doctorInfo.center.id });
    const [isAnotherProvider, setIsAnotherProvider] = useWorkHoursStore(state => [
        state.isAnotherProvider,
        state.setIsAnotherProvider
    ]);

    useEffect(() => {
        getWorkHoursRequest.remove();
        getWorkHoursRequest.refetch();
    }, []);

    useEffect(() => {
        if (getWorkHoursRequest.isSuccess) {
            setDuration(getWorkHoursRequest.data.data.duration);
        }
    }, [getWorkHoursRequest.status]);

    const handleQuestion = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setIsAnotherProvider(value === 'true');
    }, []);

    const handleNext = useCallback(() => {
        getSplunkInstance().sendEvent({
            group: 'activation-office-duration',
            type: isAnotherProvider ? 'other-booking-channel' : 'only-p24'
        });
        getSplunkInstance().sendEvent({
            group: 'activation-office-duration',
            type: 'time-of-visit',
            event: {
                action: duration
            }
        });

        router.push(`/activation/office/workhours${window.location.search}`);
    }, [duration, isAnotherProvider]);

    const questionProps = {
        title: 'آیا با سایت های دیگر نوبت دهی اینترنتی همکاری دارید؟',
        required: true,
        options: [
            {
                label: 'بله، و میخواهم زمان نوبت های پذیرش24 با آنها تداخل نداشته باشد.',
                value: true,
                defaultChecked: isAnotherProvider
            },
            {
                label: 'نه، فقط از طریق پذیرش24 نوبت دهی را انجام می دهیم.',
                value: false,
                defaultChecked: !isAnotherProvider
            }
        ]
    };

    return (
        <Container
            maxWidth="sm"
            className="bg-white h-full md:h-auto md:p-5 rounded-md pt-4 md:mt-8 md:shadow-2xl md:shadow-slate-300"
        >
            <Stack className="space-y-5">
                <SelectTime
                    items={durationList}
                    value={duration}
                    onChange={setDuration}
                    label="مدت زمان هر ویزیت بیمار در مطب شما چقدر است؟"
                    isLoading={getWorkHoursRequest.isLoading}
                    prefix="دقیقه"
                />
                <AlertForDuration />

                <RadioQuestionBox onChange={handleQuestion} {...questionProps} />

                <FixedWrapBottom className="border-t border-solid !bottom-0 border-[#e8ecf0]">
                    <Button fullWidth variant="contained" size="large" onClick={handleNext}>
                        ثبت ساعت کاری
                    </Button>
                </FixedWrapBottom>
            </Stack>
        </Container>
    );
};

export default DurationOfficeActivation;
