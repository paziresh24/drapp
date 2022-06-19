import { ChangeEvent, useState } from 'react';

import Container from '@mui/material/Container';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/lab/LoadingButton';
import FixedWrapBottom from '@paziresh24/shared/ui/fixedWrapBottom';
import RadioQuestionBox from '@paziresh24/shared/ui/radioQuestionBox';

import { optionsDelay } from './optionsDelay';
import { useDelay } from './useDelay';

const questionProps = {
    title: 'چند دقیقه دیر می رسید؟',
    options: [...optionsDelay]
};

const Delay = () => {
    const [delay, setDelay] = useState<DelayType | null>();
    const { mutate, isLoading } = useDelay();

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const type = optionsDelay.find(({ value }) => value === e.target.value)?.type;
        setDelay({ value: e.target.value, type } as DelayType);
    };

    const handleSubmit = () => {
        if (!delay) return;
        mutate({
            ...delay
        });
    };

    return (
        <Container
            maxWidth="sm"
            className="h-full md:h-auto md:p-5 rounded-md pt-4 bg-white md:mt-8 md:shadow-md space-y-5"
        >
            <RadioQuestionBox onChange={handleChange} {...questionProps} />

            <FixedWrapBottom className="border-t border-solid border-[#e8ecf0]">
                <Stack spacing={1} width="100%">
                    <Alert icon={false} className="!bg-[#F3F6F9]">
                        <Typography fontSize="0.9rem" fontWeight="medium">
                            برای همه بیماران پیامک اطلاع رسانی ارسال خواهد شد.
                        </Typography>
                    </Alert>
                    <Button
                        fullWidth
                        variant="contained"
                        onClick={handleSubmit}
                        loading={isLoading}
                        disabled={!delay}
                    >
                        ثبت و ارسال پیام
                    </Button>
                </Stack>
            </FixedWrapBottom>
        </Container>
    );
};

export default Delay;
