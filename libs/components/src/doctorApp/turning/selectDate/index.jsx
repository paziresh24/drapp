import styles from './selectDate.module.scss';
import classNames from 'classnames';
import { useEffect, useState } from 'react';
import '@hassanmojab/react-modern-calendar-datepicker/lib/DatePicker.css';
import { Calendar, utils } from '@hassanmojab/react-modern-calendar-datepicker';
import { CalendarIcon, ChevronIcon } from '../../../icons';
import Modal from '../../../core/modal';
import moment from 'jalali-moment';
import isEmpty from 'lodash/isEmpty';

const SelectDate = props => {
    const [isOpen, setIsOpen] = useState(false);

    const [selectedDay, setSelectedDay] = useState();

    useEffect(() => {
        setSelectedDay(
            props.defaultValue
                ? JSON.parse(props.defaultValue)
                : props.today
                ? utils('fa').getToday()
                : ''
        );
    }, []);

    useEffect(() => {
        setIsOpen(false);

        if (props.unix) {
            props.value &&
                props.value(
                    moment(
                        `${selectedDay.year}/${selectedDay.month}/${selectedDay.day}`,
                        'jYYYY/jMM/jDD'
                    )
                        .locale('fa')
                        .format('x') ?? utils('fa').getToday()
                );
        } else {
            props.value && props.value(selectedDay);
        }
    }, [selectedDay]);

    const returnDate = selectedDay => {
        return `${selectedDay?.year}/${selectedDay?.month}/${selectedDay?.day}`;
    };

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
                {!props.nagivateDate && <CalendarIcon />}
                {props.nagivateDate && <ChevronIcon dir="left" />}
            </button>
            <Modal title="انتخاب تاریخ" isOpen={isOpen} onClose={setIsOpen}>
                <Calendar
                    value={selectedDay}
                    onChange={setSelectedDay}
                    inputPlaceholder="یک روز انتخاب کنید"
                    shouldHighlightWeekends
                    colorPrimary="#27bda0"
                    locale="fa"
                    calendarClassName={styles['calendarWrap']}
                />
            </Modal>
        </>
    );
};

export { SelectDate };
