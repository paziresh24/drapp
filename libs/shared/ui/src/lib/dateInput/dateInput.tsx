import { Stack } from '@mui/material';
import Button from '@mui/material/Button';
import Modal from '@paziresh24/shared/ui/modal';
import { memo, useEffect, useState } from 'react';
import { Calendar, DayValue, utils } from '@hassanmojab/react-modern-calendar-datepicker';
import moment from 'jalali-moment';
import TextField from '../textField';

interface Props {
    label: string;
    defaultValue?: string;
    onCahnge?: (value: string) => void;
    minimumDate?: any;
}

export const dateObjectToFormattedDate = (dateObject: DayValue): string => {
    return `${dateObject?.year}/${dateObject?.month}/${dateObject?.day}`;
};

export const formattedDateToDateObject = (formattedDate: string): DayValue => {
    if (!formattedDate) return null;
    const dateObject = moment(formattedDate);
    return {
        year: dateObject.year(),
        month: dateObject.month() + 1,
        day: dateObject.date()
    };
};

const DateInput = (props: Props) => {
    const { label, defaultValue = '', onCahnge, minimumDate } = props;
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

    const TextFieldWrapper = TextField as any;

    return (
        <>
            <TextFieldWrapper
                label={label}
                value={dateLabel}
                readOnly
                onClick={() => setOpenModal(true)}
                className="[&>input]:cursor-pointer"
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
                        minimumDate={minimumDate}
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
