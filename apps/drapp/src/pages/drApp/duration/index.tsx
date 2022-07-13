import { ChangeEvent, useCallback } from 'react';
import { useHistory } from 'react-router-dom';

import FixedWrapBottom from '@paziresh24/shared/ui/fixedWrapBottom';
import RadioQuestionBox from '@paziresh24/shared/ui/radioQuestionBox';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import SelectTime from '../../../components/setting/duration/selectTime';
import { useWorkHoursStore } from '../../../store/workhours.store';
import { getSplunkInstance } from '@paziresh24/shared/ui/provider';

const Duration = () => {
    const router = useHistory();
    const durationValue = useWorkHoursStore(state => state.duration);
    const [isAnotherProvider, setIsAnotherProvider] = useWorkHoursStore(state => [
        state.isAnotherProvider,
        state.setIsAnotherProvider
    ]);

    const handleQuestion = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setIsAnotherProvider(value === 'true');
    }, []);

    const handleNext = useCallback(() => {
        getSplunkInstance().sendEvent({
            group: 'duration',
            type: isAnotherProvider ? 'other-booking-channel' : 'only-p24'
        });
        getSplunkInstance().sendEvent({
            group: 'duration',
            type: 'time-of-visit',
            event: {
                value: durationValue
            }
        });
        getSplunkInstance().sendEvent({
            group: 'workdays_active_booking-duration',
            type: 'successful'
        });
        router.push(`/setting/workhours${window.location.search}`);
    }, [durationValue, isAnotherProvider]);

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
            className="bg-white h-full md:h-auto md:p-5 rounded-md pt-4 md:mt-8 md:shadow-md"
        >
            <Stack className="space-y-5">
                <SelectTime />

                <RadioQuestionBox onChange={handleQuestion} {...questionProps} />

                <FixedWrapBottom className="border-t border-solid border-[#e8ecf0]">
                    <Button fullWidth variant="contained" size="large" onClick={handleNext}>
                        ثبت ساعت کاری
                    </Button>
                </FixedWrapBottom>
            </Stack>
        </Container>
    );
};

export default Duration;
