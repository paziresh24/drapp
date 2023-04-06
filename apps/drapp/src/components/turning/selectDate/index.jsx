import styles from './selectDate.module.scss';
import classNames from 'classnames';
import { useEffect, useState } from 'react';
import '@hassanmojab/react-modern-calendar-datepicker/lib/DatePicker.css';
import { Calendar, utils } from '@hassanmojab/react-modern-calendar-datepicker';
import { CalendarIcon, ChevronIcon } from '@paziresh24/shared/icon';
import Modal from '@paziresh24/shared/ui/modal';
import moment from 'jalali-moment';
import isEmpty from 'lodash/isEmpty';

const returnDate = selectedDay => {
    return `${selectedDay?.year}/${selectedDay?.month}/${selectedDay?.day}`;
};

const dateToJson = value => {
    const date = moment(value).locale('fa');
    return {
        year: date.year(),
        month: date.month() + 1,
        day: date.date()
    };
};

const dateToUnix = date => {
    return +moment.from(returnDate(date), 'fa', 'YYYY-MM-DD').format('X');
};

const SelectDate = props => {
    const [isOpen, setIsOpen] = useState(false);

    const [selectedDay, setSelectedDay] = useState();

    useEffect(() => {
        setSelectedDay(
            props.defaultValue
                ? dateToJson(props.defaultValue)
                : props.today
                ? utils('fa').getToday()
                : ''
        );
    }, []);

    useEffect(() => {
        setIsOpen(false);
        if (selectedDay) {
            if (props.unix) {
                if (props.value) {
                    props.value(dateToUnix(selectedDay));
                }
            } else {
                props.value &&
                    props.value(
                        moment.from(returnDate(selectedDay), 'fa').locale('en').format('YYYY-MM-DD')
                    );
            }
        }
    }, [selectedDay]);

    return (
        <>
            <button
                className={classNames(styles['datepicker'], {
                    [styles['border']]: props.border
                })}
                onClick={() => setIsOpen(true)}
            >
                {props.nagivateDate && <ChevronIcon dir="right" />}
                <span>
                    {!isEmpty(selectedDay) ? (
                        selectedDay &&
                        returnDate(selectedDay) === returnDate(utils('fa').getToday()) ? (
                            `امروز ${returnDate(selectedDay)}`
                        ) : (
                            returnDate(selectedDay)
                        )
                    ) : (
                        <span
                            style={{
                                color: '#a5b2bd'
                            }}
                        >
                            --/--/----
                        </span>
                    )}
                </span>
                {!props.nagivateDate && <CalendarIcon color="#000" />}
                {props.nagivateDate && <ChevronIcon dir="left" />}
            </button>
            <Modal title="انتخاب تاریخ" isOpen={isOpen} onClose={setIsOpen}>
                <Calendar
                    value={selectedDay}
                    onChange={setSelectedDay}
                    inputPlaceholder="یک روز انتخاب کنید"
                    shouldHighlightWeekends
                    colorPrimary="#0070f3"
                    locale="fa"
                    calendarClassName={styles['calendarWrap']}
                />
            </Modal>
        </>
    );
};

export { SelectDate };
