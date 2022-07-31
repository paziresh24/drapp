import { Stack } from '@mui/material';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Modal from '@paziresh24/shared/ui/modal';
import { memo, useEffect, useState } from 'react';
import { Calendar, DayValue, utils } from '@hassanmojab/react-modern-calendar-datepicker';
import moment from 'jalali-moment';

interface Props {
    label: string;
    defaultValue?: string;
    onCahnge?: (value: string) => void;
}

const dateObjectToFormattedDate = (dateObject: DayValue): string => {
    return `${dateObject?.year}/${dateObject?.month}/${dateObject?.day}`;
};

const formattedDateToDateObject = (formattedDate: string): DayValue => {
    if (!formattedDate) return null;
    const dateObject = moment(formattedDate);
    return {
        year: dateObject.year(),
        month: dateObject.month() + 1,
        day: dateObject.date()
    };
};

const DateInput = (props: Props) => {
    const { label, defaultValue = '', onCahnge } = props;
    const [dateLabel, setDateLabel] = useState(defaultValue);
    const [openModal, setOpenModal] = useState(false);

    const handleSubmit = () => {
        onCahnge && onCahnge(dateLabel);
        setOpenModal(false);
    };

    useEffect(() => {
        if (defaultValue !== dateLabel) {
            setDateLabel(defaultValue);
        }
    }, [defaultValue]);

    return (
        <>
            <TextField
                label={label}
                value={dateLabel}
                fullWidth
                inputProps={{ readOnly: true }}
                onClick={() => setOpenModal(true)}
                InputLabelProps={{
                    shrink: true
                }}
            />
            <Modal
                title="انتخاب تاریخ"
                isOpen={openModal}
                onClose={() => {
                    setOpenModal(false);
                    handleSubmit();
                }}
            >
                <Stack alignItems="center" spacing="1rem">
                    <Calendar
                        value={formattedDateToDateObject(dateLabel)}
                        onChange={date => setDateLabel(dateObjectToFormattedDate(date))}
                        shouldHighlightWeekends
                        colorPrimary="#0070f3"
                        locale="fa"
                        calendarClassName="!shadow-none"
                    />
                    <Button fullWidth variant="contained" size="large" onClick={handleSubmit}>
                        تایید
                    </Button>
                </Stack>
            </Modal>
        </>
    );
};

export default memo(DateInput);
