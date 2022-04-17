import styles from './selectDate.module.scss';
import { useEffect, useState } from 'react';
import { Calendar, utils } from '@hassanmojab/react-modern-calendar-datepicker';
import '@hassanmojab/react-modern-calendar-datepicker/lib/DatePicker.css';
import moment from 'jalali-moment';
import Modal from '@paziresh24/shared/ui/modal';
import { CalendarIcon } from '@paziresh24/shared/icon';

const SelectDate = props => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedDay, setSelectedDay] = useState(() => {
        if (props['default-value']) {
            const dateDefault = moment
                .from(props['default-value'], 'YYYY-MM-DD')
                .locale('fa')
                .format('YYYY-MM-DD')
                .split('-');
            return {
                day: +dateDefault[2],
                month: +dateDefault[1],
                year: +dateDefault[0]
            };
        } else {
            // return utils('fa').getToday();
        }
    });

    useEffect(() => {
        props.today && setSelectedDay(utils('fa').getToday());
    }, []);

    useEffect(() => {
        if (props['default-value']) {
            const dateDefault = moment
                .from(props['default-value'], 'YYYY-MM-DD')
                .locale('fa')
                .format('YYYY-MM-DD')
                .split('-');
            setSelectedDay({
                day: +dateDefault[2],
                month: +dateDefault[1],
                year: +dateDefault[0]
            });
        } else {
            if (!props.today) {
                setSelectedDay(null);
            }
        }
    }, [props['default-value']]);

    useEffect(() => {
        setIsOpen(false);
        props.value && props.value(selectedDay);
        props.onChange && props.onChange(selectedDay);
    }, [selectedDay]);

    return (
        <>
            <div className={`${styles['wrapper']} ${props.simple ? styles.simple : ''}`}>
                {/* <label aria-hidden>{props.label}</label> */}
                <div
                    className={styles['input']}
                    onClick={() => setIsOpen(true)}
                    type={props.type}
                    value={props.value}
                    name={props.name}
                    placeholder=" "
                    onFocus={props.onFocus}
                    aria-hidden
                >
                    {!props.simple && <CalendarIcon />}
                    {/* {selectedDay
                        ? !props.simple && <CloseIcon onClick={() => setSelectedDay('')} />
                        : !props.simple && <CalendarIcon />} */}
                    {selectedDay ? (
                        <span>
                            {selectedDay.year}/{selectedDay.month}/{selectedDay.day}
                        </span>
                    ) : (
                        <span className={styles.label}>{props.label}</span>
                    )}
                </div>
            </div>

            <Modal title={props.label} isOpen={isOpen} onClose={setIsOpen}>
                <Calendar
                    value={selectedDay}
                    onChange={setSelectedDay}
                    inputPlaceholder="Select a day"
                    minimumDate={props.minimumDate}
                    shouldHighlightWeekends
                    colorPrimary="#27bda0"
                    locale="fa"
                    calendarClassName={styles['calendarWrap']}
                />
            </Modal>
        </>
    );
};

export default SelectDate;
