import { Stack } from '@mui/material';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Modal from '@paziresh24/shared/ui/modal';
import { memo, useEffect, useState } from 'react';
import { Timeit } from 'react-timeit';

interface Props {
    label: string;
    defaultValue?: string;
    onCahnge?: (value: string) => void;
    minuteExclude?: number[];
    hourExclude?: number[];
}

const TimeInput = (props: Props) => {
    const { label, defaultValue = '', onCahnge, minuteExclude, hourExclude } = props;
    const [timeLabel, setTimeLabel] = useState(defaultValue);
    const [openModal, setOpenModal] = useState(false);

    const handleSubmit = () => {
        onCahnge && onCahnge(timeLabel);
        setOpenModal(false);
    };

    useEffect(() => {
        if (defaultValue !== timeLabel) {
            setTimeLabel(defaultValue);
        }
    }, [defaultValue]);

    return (
        <>
            <TextField
                label={label}
                value={timeLabel}
                fullWidth
                inputProps={{ readOnly: true }}
                onClick={() => setOpenModal(true)}
                InputLabelProps={{
                    shrink: true
                }}
            />
            <Modal
                title="انتخاب زمان"
                isOpen={openModal}
                onClose={() => {
                    setOpenModal(false);
                    handleSubmit();
                }}
            >
                <Stack alignItems="center" spacing="1rem">
                    <Timeit
                        onChange={value => setTimeLabel(value)}
                        defualtValue={timeLabel}
                        notShowExclude
                        minuteExclude={minuteExclude}
                        hourExclude={hourExclude}
                    />
                    <Button fullWidth variant="contained" size="large" onClick={handleSubmit}>
                        تایید
                    </Button>
                </Stack>
            </Modal>
        </>
    );
};

export default memo(TimeInput);
