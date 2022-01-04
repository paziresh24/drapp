import { useEffect, useRef, useState } from 'react';
import styles from 'assets/styles/pages/drApp/workDays.module.scss';
import Modal from '../../../core/modal';
import Button from '../../../core/button';
import { useWorkDays } from '@paziresh24/context/drapp/workDays';
import classNames from 'classnames';
import { Timeit } from 'react-timeit';
import 'react-timeit/dist/index.css';
import { CloseIcon } from '../../../icons';
import isEmpty from 'lodash/isEmpty';
import range from 'lodash/range';

const DateInput = ({ placeholder, onBlur, value, type, defaultValue, error, duration }) => {
    const [openModal, setOpenModal] = useState(false);
    const timeField = useRef();
    const [time, setTime] = useState(null);

    const modalOpener = () => setOpenModal(true);

    const timeSelect = action => {
        timeField.current.value = action === 'reset' ? null : time;
        value(action === 'reset' ? null : time, type);
        setOpenModal(false);
    };

    useEffect(() => {
        if (defaultValue) value(defaultValue, type);
    }, [defaultValue]);

    return (
        <>
            <div className={styles['time-input-wrapper']}>
                {timeField.current?.value && (
                    <CloseIcon
                        className={styles['removeTime']}
                        onClick={() => timeSelect('reset')}
                    />
                )}
                <input
                    className={classNames({ [styles['input']]: true, [styles['error']]: error })}
                    type="text"
                    onChange={onBlur}
                    placeholder={placeholder}
                    defaultValue={defaultValue}
                    ref={timeField}
                    readOnly
                    onClick={modalOpener}
                />
            </div>

            <Modal title="انتخاب زمان" isOpen={openModal} onClose={setOpenModal}>
                <div className={styles['time-picker-wrapper']}>
                    <Timeit
                        onChange={value => setTime(value)}
                        notShowExclude
                        defualtValue={
                            isEmpty(timeField.current?.value)
                                ? type.name === 'from'
                                    ? '15:00'
                                    : '21:00'
                                : timeField.current?.value
                        }
                        minuteExclude={range(0, 60, 1).filter(
                            o => !range(0, 60, duration ?? 5).includes(o)
                        )}
                    />
                    <Button block onClick={timeSelect}>
                        تایید
                    </Button>
                </div>
            </Modal>
        </>
    );
};

export const TimeRow = ({ day, data, duration }) => {
    const [moreRow, setMoreRow] = useState(!isEmpty(data[1]));
    const [workDays, setWorkDays] = useWorkDays();
    const [workHours, setWorkHours] = useState(data);

    useEffect(() => {
        if (!moreRow) {
            times(null, { name: 'from', index: 2 });
            times(null, { name: 'to', index: 2 });
        }
    }, [moreRow]);

    const times = (time, type) => {
        setWorkDays(prev => {
            return {
                ...prev,
                [day.id]: {
                    ...prev[day.id],
                    [type.index]: {
                        ...prev[day.id]?.[type.index],
                        [type.name]: time
                    }
                }
            };
        });
    };

    return (
        <div className={styles['time-row']} aria-hidden>
            <div className={styles['day']}>{day.day}</div>
            <div className={styles['input-row']}>
                <div className={styles['inner']}>
                    <div className={styles['wrap']}>
                        <DateInput
                            defaultValue={workHours[0]?.from}
                            type={{ name: 'from', index: 1 }}
                            value={times}
                            error={workDays[day.id]?.[1]?.from > workDays[day.id]?.[1]?.to}
                            placeholder="زمان شروع"
                            duration={duration}
                        />
                        <DateInput
                            defaultValue={workHours[0]?.to}
                            type={{ name: 'to', index: 1 }}
                            value={times}
                            error={workDays[day.id]?.[1]?.to < workDays[day.id]?.[1]?.from}
                            placeholder="زمان پایان"
                            duration={duration}
                        />
                        <svg
                            width="18"
                            height="18"
                            viewBox="0 0 18 18"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            onClick={() => setMoreRow(true)}
                        >
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M9 3.75C9.41421 3.75 9.75 4.08579 9.75 4.5V8.25H13.5C13.9142 8.25 14.25 8.58579 14.25 9C14.25 9.41421 13.9142 9.75 13.5 9.75H9.75V13.5C9.75 13.9142 9.41421 14.25 9 14.25C8.58579 14.25 8.25 13.9142 8.25 13.5V9.75H4.5C4.08579 9.75 3.75 9.41421 3.75 9C3.75 8.58579 4.08579 8.25 4.5 8.25H8.25V4.5C8.25 4.08579 8.58579 3.75 9 3.75Z"
                                fill="#3F3F79"
                            />
                        </svg>
                    </div>
                    {moreRow && (
                        <div className={styles['wrap']}>
                            <DateInput
                                defaultValue={workHours[1]?.from}
                                type={{ name: 'from', index: 2 }}
                                value={times}
                                error={workDays[day.id]?.[2]?.from > workDays[day.id]?.[2]?.to}
                                placeholder="زمان شروع"
                                duration={duration}
                            />
                            <DateInput
                                defaultValue={workHours[1]?.to}
                                type={{ name: 'to', index: 2 }}
                                value={times}
                                error={workDays[day.id]?.[2]?.to < workDays[day.id]?.[2]?.from}
                                placeholder="زمان پایان"
                                duration={duration}
                            />
                            <svg
                                width="14"
                                height="14"
                                viewBox="0 0 14 14"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                onClick={() => setMoreRow(false)}
                            >
                                <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M2.96967 2.96967C3.26256 2.67678 3.73744 2.67678 4.03033 2.96967L7 5.93934L9.96967 2.96967C10.2626 2.67678 10.7374 2.67678 11.0303 2.96967C11.3232 3.26256 11.3232 3.73744 11.0303 4.03033L8.06066 7L11.0303 9.96967C11.3232 10.2626 11.3232 10.7374 11.0303 11.0303C10.7374 11.3232 10.2626 11.3232 9.96967 11.0303L7 8.06066L4.03033 11.0303C3.73744 11.3232 3.26256 11.3232 2.96967 11.0303C2.67678 10.7374 2.67678 10.2626 2.96967 9.96967L5.93934 7L2.96967 4.03033C2.67678 3.73744 2.67678 3.26256 2.96967 2.96967Z"
                                    fill="#22282F"
                                />
                            </svg>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
