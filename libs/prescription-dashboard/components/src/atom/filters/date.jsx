import styles from './date.module.scss';
import Modal from '@paziresh24/components/core/modal';
import { Calendar, utils } from '@hassanmojab/react-modern-calendar-datepicker';
import '@hassanmojab/react-modern-calendar-datepicker/lib/DatePicker.css';
import { useState, useEffect } from 'react';

const Date = ({ label, onChange }) => {
    const [selectedDate, setSelectedDate] = useState(utils('fa').getToday());
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        onChange && onChange(selectedDate);
    }, [selectedDate]);

    return (
        <>
            <div className={styles.wrapper} onClick={() => setIsOpen(true)} aria-hidden>
                <span>
                    {label}
                    {selectedDate &&
                        `: ${selectedDate.year}/${selectedDate.month}/${selectedDate.day}`}
                </span>
            </div>
            <Modal title={label} isOpen={isOpen} onClose={setIsOpen}>
                <Calendar
                    value={selectedDate}
                    onChange={value => {
                        setSelectedDate(value);
                        setIsOpen(false);
                    }}
                    inputPlaceholder="Select a day"
                    maximumDate={utils('fa').getToday()}
                    shouldHighlightWeekends
                    colorPrimary="#27bda0"
                    locale="fa"
                    calendarClassName={styles['calendarWrap']}
                />
            </Modal>
        </>
    );
};

export default Date;
