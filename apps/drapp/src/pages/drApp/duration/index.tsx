import { ChangeEvent, useCallback, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import FixedWrapBottom from '@paziresh24/shared/ui/fixedWrapBottom';
import RadioQuestionBox from '@paziresh24/shared/ui/radioQuestionBox';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import SelectTime from '../../../components/molecules/setting/duration/selectTime';
import { useWorkHoursStore } from '../../../store/workhours.store';

const Duration = () => {
    const router = useHistory();
    const isAnotherProvider = useWorkHoursStore(state => state.isAnotherProvider);
    const setIsAnotherProvider = useWorkHoursStore(state => state.setIsAnotherProvider);

    const handleQuestion = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setIsAnotherProvider(value === 'true');
    }, []);

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
                    <Button
                        fullWidth
                        variant="contained"
                        size="large"
                        onClick={() => router.push('/setting/workhours')}
                    >
                        ثبت ساعت کاری
                    </Button>
                </FixedWrapBottom>
            </Stack>
        </Container>
    );
};

export default Duration;
