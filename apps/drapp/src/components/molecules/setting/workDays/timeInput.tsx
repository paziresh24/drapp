import { Stack } from '@mui/material';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Modal from '@paziresh24/shared/ui/modal';
import { useWorkHoursStore } from 'apps/drapp/src/store/workhours.store';
import range from 'lodash/range';
import { memo, useEffect, useState } from 'react';
import { Timeit } from 'react-timeit';

interface Props {
    label: string;
    defaultValue?: string;
    onCahnge?: (value: string) => void;
}

const TimeInput = (props: Props) => {
    const { label, defaultValue = '', onCahnge } = props;
    const { duration } = useWorkHoursStore();
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
                onClick={e => {
                    e.preventDefault();
                    setOpenModal(true);
                }}
                InputLabelProps={{
                    shrink: true
                }}
            />
            <Modal title="انتخاب زمان" isOpen={openModal} onClose={setOpenModal}>
                <Stack alignItems="center" spacing="1rem">
                    <Timeit
                        onChange={value => setTimeLabel(value)}
                        defualtValue={timeLabel}
                        notShowExclude
                        minuteExclude={range(0, 60, 1).filter(
                            o => !range(0, 60, duration ?? 5).includes(o)
                        )}
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
