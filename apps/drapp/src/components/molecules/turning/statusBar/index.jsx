import classNames from 'classnames';
import styles from './statusBar.module.scss';
import { useState, useRef } from 'react';
import Button from '@paziresh24/shared/ui/button';
import { ClockIcon } from '@paziresh24/shared/icon';
import Modal from '@paziresh24/shared/ui/modal';
import { SelectDate } from '../../turning/selectDate';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useEffect } from 'react';
import moment from 'jalali-moment';
import { useDeleteTurns, useMoveTurns, useVacation } from '@paziresh24/hooks/drapp/turning';
import { useDrApp } from '@paziresh24/context/drapp';
import { Timeit } from 'react-timeit';
import { sendEvent } from '@paziresh24/utils';
import { useHistory, useLocation } from 'react-router';
import queryString from 'query-string';
import { useLearnTour } from '@paziresh24/hooks/learn';
import range from 'lodash/range';
import { useSettingTurns } from './settingTurns.context';

const TimeInput = ({ placeholder, onBlur, value }) => {
    const [openModal, setOpenModal] = useState(false);
    const timeField = useRef();

    const modalOpener = () => setOpenModal(true);

    const timeSelect = selectedTime => {
        timeField.current.value = selectedTime;
        value(selectedTime);
    };

    return (
        <>
            <input
                className={styles['input']}
                type="text"
                onChange={onBlur}
                placeholder={placeholder}
                ref={timeField}
                readOnly
                onClick={modalOpener}
            />

            <Modal title="انتخاب زمان" isOpen={openModal} onClose={setOpenModal}>
                <div className={styles['time-picker-wrapper']}>
                    <Timeit
                        onChange={value => timeSelect(value)}
                        defualtValue={timeField.current?.value}
                    />
                    <Button block onClick={() => setOpenModal(false)}>
                        تایید
                    </Button>
                </div>
            </Modal>
        </>
    );
};

const Select = ({ id, group, value, selected, icon, title, onChange }) => {
    return (
        <div className={styles['wrapper']}>
            <input
                id={id}
                name={group}
                className={styles['input']}
                type="radio"
                value={value}
                defaultChecked={selected}
                onChange={onChange}
            />
            <label className={`${styles['label']} ${styles['circle']}`} htmlFor={id}>
                {icon}
                <span>{title}</span>
            </label>
        </div>
    );
};

const StatusBar = () => {
    const history = useHistory();
    const [isOpen, setIsOpen] = useSettingTurns();
    const [moveDeleteModal, setMoveDeleteModal] = useState(false);
    const [tabName, setTabName] = useState('');
    const [info] = useDrApp();

    const { search } = useLocation();
    const urlParams = queryString.parse(search);
    const [selectDate, setSelectDate] = useState();
    const [selectFromTime, setSelectFromTime] = useState();
    const [selectToTime, setSelectToTime] = useState();
    const deleteTurns = useDeleteTurns();
    const [deleteTurnsConfirmModal, setDeleteTurnsConfirmModal] = useState(false);

    const [moveFromDate, setMoveFromDate] = useState();
    const [moveFromTime, setMoveFromTime] = useState();
    const [moveToTime, setMoveToTime] = useState();
    const [moveTargetFromDate, setMoveTargetFromDate] = useState();
    const [moveTargetFromTime, setMoveTargetFromTime] = useState();
    const moveTurns = useMoveTurns();
    const [moveTurnsConfirmModal, setMoveTurnsConfirmModal] = useState();

    const [vacationFromDate, setVacationFromDate] = useState();
    const [vacationFromTime, setVacationFromTime] = useState();
    const [vacationToTime, setVacationToTime] = useState();
    const [vacationToDate, setVacationToDate] = useState();
    const [vacationConfirm, setVacationConfirm] = useState(false);
    const vacation = useVacation();

    const [vacationDeleteConfirm, setVacationDeleteConfirm] = useState(false);
    const [vacationMoveModal, setVacationMoveModal] = useState();

    const [vacationMoveTargetDate, setVacationMoveTargetDate] = useState();
    const [vacationMoveTargetTime, setVacationMoveTargetTime] = useState();

    const [moveTurnsErrorConfirmModal, setMoveTurnsErrorConfirmModal] = useState(false);
    const [moveTurnsDetailsConfirmData, setMoveTurnsDetailsConfirmData] = useState();

    const [vacationMoveTurnsErrorConfirmModal, setVacationMoveTurnsErrorConfirmModal] =
        useState(false);

    const [modalTitle, setModalTitle] = useState('تنظیمات');

    useEffect(() => {
        setModalTitle('تنظیمات');

        if (moveDeleteModal) return setTabName('');
    }, [moveDeleteModal]);

    const { tourState, setSteps } = useLearnTour();

    useEffect(() => {
        if (urlParams?.learn) {
            tourState(true);
            setSteps(3);
        }
    }, []);

    const groupDeleteAction = () => {
        deleteTurns.mutate(
            {
                centerId: info.center.id,
                data: {
                    from:
                        moment
                            .from(
                                `${selectDate.year}/${selectDate.month}/${selectDate.day} ${selectFromTime}`,
                                'fa',
                                'JYYYY/JMM/JDD HH:mm'
                            )
                            .format('x') / 1000,
                    to:
                        moment
                            .from(
                                `${selectDate.year}/${selectDate.month}/${selectDate.day} ${selectToTime}`,
                                'fa',
                                'JYYYY/JMM/JDD HH:mm'
                            )
                            .format('x') / 1000
                }
            },
            {
                onSuccess: data => {
                    if (data?.status === 'NO_RECORD') {
                        return toast.error('نوبتی یافت نشد.');
                    }
                    sendEvent('move setting', 'booking', 'deletebook');
                    // props.refetchData();
                    setDeleteTurnsConfirmModal(false);
                    setMoveDeleteModal(false);
                    setVacationDeleteConfirm(false);
                    setVacationConfirm(false);
                    return toast.success('عملیات با موفقیت انجام شد.');
                }
            }
        );
    };

    const groupVacationDeleteAction = () => {
        deleteTurns.mutate(
            {
                centerId: info.center.id,
                data: {
                    from:
                        moment
                            .from(
                                `${vacationFromDate.year}/${vacationFromDate.month}/${vacationFromDate.day} ${vacationFromTime}`,
                                'fa',
                                'JYYYY/JMM/JDD HH:mm'
                            )
                            .format('x') / 1000,
                    to:
                        moment
                            .from(
                                `${vacationToDate.year}/${vacationToDate.month}/${vacationToDate.day} ${vacationToTime}`,
                                'fa',
                                'JYYYY/JMM/JDD HH:mm'
                            )
                            .format('x') / 1000
                }
            },
            {
                onSuccess: data => {
                    if (data?.status === 'NO_RECORD') {
                        return toast.error('نوبتی یافت نشد.');
                    }
                    sendEvent('move setting', 'booking', 'setvacation');
                    // props.refetchData();
                    setDeleteTurnsConfirmModal(false);
                    setMoveDeleteModal(false);
                    setVacationDeleteConfirm(false);
                    setVacationConfirm(false);
                    return toast.success('عملیات با موفقیت انجام شد.');
                }
            }
        );
    };

    const groupMoveAction = (confirm = false) => {
        moveTurns.mutate(
            {
                centerId: info.center.id,
                data: {
                    book_from:
                        moment
                            .from(
                                `${moveFromDate.year}/${moveFromDate.month}/${moveFromDate.day} ${moveFromTime}`,
                                'fa',
                                'JYYYY/JMM/JDD HH:mm'
                            )
                            .format('x') / 1000,
                    book_to:
                        moment
                            .from(
                                `${moveFromDate.year}/${moveFromDate.month}/${moveFromDate.day} ${moveToTime}`,
                                'fa',
                                'JYYYY/JMM/JDD HH:mm'
                            )
                            .format('x') / 1000,
                    target_from:
                        moment
                            .from(
                                `${moveTargetFromDate.year}/${moveTargetFromDate.month}/${moveTargetFromDate.day} ${moveTargetFromTime}`,
                                'fa',
                                'JYYYY/JMM/JDD HH:mm'
                            )
                            .format('x') / 1000,
                    confirmed: confirm
                }
            },
            {
                onSuccess: data => {
                    if (data?.status === 'NO_RECORD') {
                        return toast.error('نوبتی یافت نشد.');
                    }
                    if (data?.status === 'CONFIRMATION_NEED') {
                        setMoveTurnsConfirmModal(false);
                        setMoveTurnsDetailsConfirmData(data);
                        return setMoveTurnsErrorConfirmModal(true);
                    }
                    sendEvent('move setting', 'booking', 'movebook');
                    setMoveTurnsErrorConfirmModal(false);
                    setMoveDeleteModal(false);
                    setMoveTurnsConfirmModal(false);
                    // props.refetchData();
                    return toast.success('عملیات با موفقیت انجام شد.');
                }
            }
        );
    };

    const groupVacationMoveAction = (confirm = false) => {
        moveTurns.mutate(
            {
                centerId: info.center.id,
                data: {
                    book_from:
                        moment
                            .from(
                                `${vacationFromDate.year}/${vacationFromDate.month}/${vacationFromDate.day} ${vacationFromTime}`,
                                'fa',
                                'JYYYY/JMM/JDD HH:mm'
                            )
                            .format('x') / 1000,
                    book_to:
                        moment
                            .from(
                                `${vacationToDate.year}/${vacationToDate.month}/${vacationToDate.day} ${vacationToTime}`,
                                'fa',
                                'JYYYY/JMM/JDD HH:mm'
                            )
                            .format('x') / 1000,
                    target_from:
                        moment
                            .from(
                                `${vacationMoveTargetDate.year}/${vacationMoveTargetDate.month}/${vacationMoveTargetDate.day} ${vacationMoveTargetTime}`,
                                'fa',
                                'JYYYY/JMM/JDD HH:mm'
                            )
                            .format('x') / 1000,
                    confirmed: confirm
                }
            },
            {
                onSuccess: data => {
                    if (data?.status === 'NO_RECORD') {
                        return toast.error('نوبتی یافت نشد.');
                    }
                    if (data?.status === 'CONFIRMATION_NEED') {
                        setVacationConfirm(false);
                        setMoveTurnsDetailsConfirmData(data);
                        return setVacationMoveTurnsErrorConfirmModal(true);
                    }
                    sendEvent('move setting', 'booking', 'setvacation');
                    setVacationMoveTurnsErrorConfirmModal(false);
                    // props.refetchData();
                    setMoveTurnsConfirmModal(false);
                    setMoveDeleteModal(false);
                    setVacationMoveModal(false);
                    setVacationConfirm(false);
                    return toast.success('عملیات با موفقیت انجام شد.');
                }
            }
        );
    };

    const vacationAction = () => {
        vacation.mutate(
            {
                centerId: info.center.id,
                data: {
                    from:
                        moment
                            .from(
                                `${vacationFromDate.year}/${vacationFromDate.month}/${vacationFromDate.day} ${vacationFromTime}`,
                                'fa',
                                'JYYYY/JMM/JDD HH:mm'
                            )
                            .format('x') / 1000,
                    to:
                        moment
                            .from(
                                `${vacationToDate.year}/${vacationToDate.month}/${vacationToDate.day} ${vacationToTime}`,
                                'fa',
                                'JYYYY/JMM/JDD HH:mm'
                            )
                            .format('x') / 1000
                }
            },
            {
                onError: err => {
                    setVacationConfirm(true);
                },
                onSuccess: data => {
                    if (data?.status === 'NO_RECORD') {
                        return toast.error('نوبتی یافت نشد.');
                    }
                    sendEvent('move setting', 'booking', 'setvacation');
                    // props.refetchData();
                    setMoveDeleteModal(false);
                    return toast.success('عملیات با موفقیت انجام شد.');
                }
            }
        );
    };

    const {
        register: updateCenterInfo,
        handleSubmit: centerInfoSubmit,
        formState: { errors: centerInfoErrors }
    } = useForm();

    useEffect(() => {
        if (isOpen) setMoveDeleteModal(true);
    }, [isOpen]);

    useEffect(() => {
        if (!moveDeleteModal) setIsOpen(false);
    }, [moveDeleteModal]);

    return (
        <>
            <Modal
                title={modalTitle}
                isOpen={moveDeleteModal}
                onClose={setMoveDeleteModal}
                icon={<ClockIcon color="#C81818" />}
            >
                <div className={styles['change-turning-status']}>
                    {!tabName && (
                        <>
                            <p className={styles['description']}>
                                ﺑﺎ اﻧﺘﺨﺎب روز و ﺳﺎﻋﺖ ﻣﺪ ﻧﻈﺮ، ﻧﻮﺑﺖ ﻫﺎی آن ﺑﺎزه را ﺣﺬف و ﯾﺎ ﺑﻪ ﺑﺎزه
                                ﻣﺪﻧﻈﺮ ﻣﻨﺘﻘﻞ ﮐﻨﯿﺪ.و ﯾﺎ ﺑﺮای ﺧﻮد ﻣﺮﺧﺼﯽ رد ﮐﻨﯿﺪ. درﻧﻈﺮ داﺷﺘﻪ ﺑﺎﺷﯿﺪ ﮐﻪ
                                ﭘﺲ از ﺣﺬف ﯾﺎ ﺟﺎﺑﺠﺎﯾﯽ ﺑﺮای ﺑﯿﻤﺎران ﭘﯿﺎﻣﮏ ارﺳﺎل ﻣﯽ ﺷﻮد.
                            </p>
                            <div className={styles['action-type-select']}>
                                <Select
                                    id="delete"
                                    group="actionType"
                                    title="ﺣﺬف ﻧﻮﺑﺖ ﻫﺎ"
                                    onChange={() => {
                                        setTabName('delete');
                                        setModalTitle('حذف نوبت');
                                    }}
                                />
                                <Select
                                    id="movement"
                                    group="actionType"
                                    title="جابجایی نوبت ها"
                                    onChange={() => {
                                        setTabName('move');
                                        setModalTitle('جابجایی نوبت');
                                    }}
                                />
                                <Select
                                    id="vacation"
                                    group="actionType"
                                    title="اعلام مرخصی"
                                    onChange={() => {
                                        setTabName('vacation');
                                        setModalTitle('اعلام مرخصی');
                                    }}
                                />
                                <Select
                                    id="workHours"
                                    group="actionType"
                                    title="تغییر ساعت کاری"
                                    onChange={() => {
                                        history.push('/turning/setting');
                                        setMoveDeleteModal(false);
                                    }}
                                />
                            </div>
                        </>
                    )}
                    {tabName === 'delete' && (
                        <div className={classNames(styles['wrap'], styles['delete-wrapper'])}>
                            <p className={styles['description']}>
                                ﺑﺎ اﻧﺘﺨﺎب روز و ﺳﺎﻋﺖ ﻣﺪ ﻧﻈﺮ، ﻧﻮﺑﺖ ﻫﺎی آن ﺑﺎزه را ﺣﺬف می شوند. درﻧﻈﺮ
                                داﺷﺘﻪ ﺑﺎﺷﯿﺪ ﮐﻪ ﭘﺲ از ﺣﺬف ﺑﺮای ﺑﯿﻤﺎران ﭘﯿﺎﻣﮏ ارﺳﺎل ﻣﯽ ﺷﻮد.
                            </p>
                            <span className={styles['inner']}>
                                نوبت های تاریخ :
                                <SelectDate border value={setSelectDate} />
                            </span>
                            <span className={styles['inner']}>
                                از ساعت
                                <TimeInput placeholder="00:00" value={setSelectFromTime} />
                                تا
                                <TimeInput placeholder="00:00" value={setSelectToTime} />
                            </span>
                            <span className={styles['inner']}>
                                ﻣﺮﺧﺼﯽ ﻟﺤﺎظ ﺷﻮد و درﺻﻮرت وﺟﻮد ﻧﻮﺑﺖ، آﻧﻬﺎ ﺣﺬف ﺷﻮﻧﺪ.
                            </span>
                            <Button
                                block
                                onClick={() => setDeleteTurnsConfirmModal(true)}
                                disabled={!selectDate || !selectFromTime || !selectToTime}
                            >
                                حذف و ارسال پیام
                            </Button>
                        </div>
                    )}
                    {tabName === 'move' && (
                        <div className={classNames(styles['wrap'], styles['move-wrapper'])}>
                            <p className={styles['description']}>
                                ﺑﺎ اﻧﺘﺨﺎب روز و ﺳﺎﻋﺖ ﻣﺪ ﻧﻈﺮ، ﻧﻮﺑﺖ ﻫﺎی آن ﺑﺎزه را ﺑﻪ ﺑﺎزه دلخواه
                                ﻣﻨﺘﻘﻞ ﮐﻨﯿﺪ. درﻧﻈﺮ داﺷﺘﻪ ﺑﺎﺷﯿﺪ ﮐﻪ ﭘﺲ از ﺟﺎﺑﺠﺎﯾﯽ ﺑﺮای ﺑﯿﻤﺎران ﭘﯿﺎﻣﮏ
                                ارﺳﺎل ﻣﯽ ﺷﻮد.
                            </p>
                            <span className={styles['inner']}>
                                نوبت های تاریخ :
                                <SelectDate border value={setMoveFromDate} />
                            </span>
                            <span className={styles['inner']}>
                                از ساعت
                                <TimeInput placeholder="00:00" value={setMoveFromTime} />
                                تا
                                <TimeInput placeholder="00:00" value={setMoveToTime} />
                            </span>
                            <span className={styles['inner']}>
                                به تاریخ
                                <SelectDate border value={setMoveTargetFromDate} />
                            </span>
                            <span className={styles['inner']}>
                                از ساعت
                                <TimeInput placeholder="00:00" value={setMoveTargetFromTime} />
                                منتقل شود.
                            </span>

                            <Button
                                block
                                onClick={() => setMoveTurnsConfirmModal(true)}
                                loading={moveTurns.isLoading}
                                disabled={
                                    !moveFromDate ||
                                    !moveFromTime ||
                                    !moveToTime ||
                                    !moveTargetFromDate ||
                                    !moveTargetFromTime
                                }
                            >
                                جابجایی و ارسال پیام
                            </Button>
                        </div>
                    )}
                    {tabName === 'vacation' && (
                        <div className={classNames(styles['wrap'], styles['move-wrapper'])}>
                            <p className={styles['description']}>
                                ﺑﺎ اﻧﺘﺨﺎب بازه مدنظر، مرخصی اعمال می شود. درصورتی که در این بازه
                                نوبتی وجود داشته باشد، می توانید آن را حذف یا جابجا کنید.
                            </p>
                            <span className={styles['inner']}>
                                در تاریخ
                                <SelectDate border value={setVacationFromDate} />
                                از ساعت
                                <TimeInput placeholder="00:00" value={setVacationFromTime} />
                            </span>
                            <span className={styles['inner']}>
                                تا تاریخ
                                <SelectDate border value={setVacationToDate} />
                                ساعت
                                <TimeInput placeholder="00:00" value={setVacationToTime} />
                            </span>
                            <span className={styles['inner']}>مرخصی اعمال شود.</span>
                            <Button
                                block
                                onClick={vacationAction}
                                loading={vacation.isLoading}
                                disabled={
                                    !vacationFromDate ||
                                    !vacationFromTime ||
                                    !vacationToDate ||
                                    !vacationToTime
                                }
                            >
                                اعمال مرخصی
                            </Button>
                        </div>
                    )}
                </div>
            </Modal>
            <Modal
                title="حذف نوبت"
                isOpen={deleteTurnsConfirmModal}
                onClose={setDeleteTurnsConfirmModal}
            >
                <span>
                    ﻧﻮﺑﺖ ﻫﺎی تاریخ {selectDate?.year}/{selectDate?.month}/{selectDate?.day} از ﺳﺎﻋﺖ{' '}
                    {selectFromTime} ﺗﺎ {selectToTime} ﺣﺬف می شوند.
                </span>
                <div className={styles['confirm-row']}>
                    <Button block loading={deleteTurns.isLoading} onClick={groupDeleteAction}>
                        تایید
                    </Button>
                    <Button
                        block
                        variant="secondary"
                        onClick={() => setDeleteTurnsConfirmModal(false)}
                    >
                        انصراف
                    </Button>
                </div>
            </Modal>
            <Modal
                title="جابجایی نوبت"
                isOpen={moveTurnsConfirmModal}
                onClose={setMoveTurnsConfirmModal}
            >
                <span>
                    نوبت های تاریخ {moveFromDate?.year}/{moveFromDate?.month}/{moveFromDate?.day} از
                    ساعت {moveFromTime} تا {moveToTime} به تاریخ {moveTargetFromDate?.year}/
                    {moveTargetFromDate?.month}/{moveTargetFromDate?.day} از ساعت{' '}
                    {moveTargetFromTime} جابجا شود.
                </span>
                <div className={styles['confirm-row']}>
                    <Button block loading={moveTurns.isLoading} onClick={() => groupMoveAction()}>
                        تایید
                    </Button>
                    <Button
                        block
                        variant="secondary"
                        onClick={() => setMoveTurnsConfirmModal(false)}
                    >
                        انصراف
                    </Button>
                </div>
            </Modal>
            <Modal title="مرخصی" isOpen={vacationConfirm} onClose={setVacationConfirm}>
                <span>
                    در این بازه {vacation.isError && vacation.error.response.data.data.books_count}{' '}
                    نوبت وجود دارد، چگونه آنها را مدیریت می کنید؟
                </span>
                <div className={styles['confirm-row']}>
                    <Select
                        id="delete"
                        group="actionType"
                        title="ﺣﺬف"
                        onChange={() => setTabName('delete')}
                    />
                    <Select
                        id="movement"
                        group="actionType"
                        title="جابجایی"
                        onChange={() => setTabName('move')}
                    />
                </div>
            </Modal>
            <Modal title="مرخصی" isOpen={vacationConfirm} onClose={setVacationConfirm}>
                <span>
                    در این بازه {vacation.isError && vacation.error.response.data.data.books_count}{' '}
                    نوبت وجود دارد، چگونه آنها را مدیریت می کنید؟
                </span>
                <div className={styles['confirm-row']}>
                    <Select
                        id="v_delete"
                        group="actionType"
                        title="ﺣﺬف"
                        onChange={() => {
                            setVacationConfirm(false);
                            setVacationDeleteConfirm(true);
                        }}
                    />
                    <Select
                        id="v_movement"
                        group="actionType"
                        title="جابجایی"
                        onChange={() => {
                            setMoveFromDate(vacationFromDate);
                            setMoveFromTime(vacationFromTime);
                            setVacationConfirm(false);
                            setVacationMoveModal(true);
                        }}
                    />
                </div>
            </Modal>
            <Modal
                title="حذف نوبت"
                isOpen={vacationDeleteConfirm}
                onClose={setVacationDeleteConfirm}
            >
                <span>
                    {vacation.isError && vacation.error.response.data.data.books_count} نوبت موجود
                    در این بازه حذف می شوند.
                </span>
                <div className={styles['confirm-row']}>
                    <Button
                        block
                        loading={deleteTurns.isLoading}
                        onClick={groupVacationDeleteAction}
                    >
                        تایید
                    </Button>
                    <Button
                        block
                        variant="secondary"
                        onClick={() => setVacationDeleteConfirm(false)}
                    >
                        انصراف
                    </Button>
                </div>
            </Modal>
            <Modal title="جابجایی نوبت" isOpen={vacationMoveModal} onClose={setVacationMoveModal}>
                <div className={classNames(styles['wrap'], styles['move-wrapper'])}>
                    <p className={styles['description']}>
                        درﻧﻈﺮ داﺷﺘﻪ ﺑﺎﺷﯿﺪ ﮐﻪ ﭘﺲ از ﺟﺎﺑﺠﺎﯾﯽ ﺑﺮای ﺑﯿﻤﺎران ﭘﯿﺎﻣﮏ ارﺳﺎل ﻣﯽ ﺷﻮد.
                    </p>
                    <span className={styles['inner']}>
                        نوبت ها به تاریخ
                        <SelectDate border value={setVacationMoveTargetDate} />
                    </span>
                    <span className={styles['inner']}>
                        از ساعت
                        <TimeInput placeholder="00:00" value={setVacationMoveTargetTime} />
                        منتقل شود.
                    </span>

                    <Button
                        block
                        onClick={() => groupVacationMoveAction(false)}
                        loading={moveTurns.isLoading}
                        disabled={!vacationMoveTargetDate || !vacationMoveTargetTime}
                    >
                        جابجایی و ارسال پیام
                    </Button>
                </div>
            </Modal>
            <Modal
                title="تایید جابجایی"
                isOpen={vacationMoveTurnsErrorConfirmModal}
                onClose={setVacationMoveTurnsErrorConfirmModal}
            >
                {moveTurnsDetailsConfirmData?.result?.books_count > 0 && (
                    <div className={styles['moveTurn-row-details']}>
                        در بازه انتخابی {moveTurnsDetailsConfirmData?.result?.books_count} نوبت وجود
                        دارد.
                    </div>
                )}
                {moveTurnsDetailsConfirmData?.result?.target_vacations_count > 0 && (
                    <div className={styles['moveTurn-row-details']}>
                        در زمان انتخابی مرخصی ثبت شده است.
                    </div>
                )}
                {moveTurnsDetailsConfirmData?.result?.target_workhour_exists === false && (
                    <div className={styles['moveTurn-row-details']}>
                        ساعت انتخاب شده جزو ساعات کاری شما نیست.
                    </div>
                )}

                <span>با این حال، مایل به جابجایی نوبت ها هستید؟</span>

                <div className={styles['confirm-row']}>
                    <Button
                        block
                        loading={moveTurns.isLoading}
                        onClick={() => groupVacationMoveAction(true)}
                    >
                        تایید و جابجایی
                    </Button>
                    <Button
                        block
                        variant="secondary"
                        onClick={() => {
                            vacationMoveTurnsErrorConfirmModal(false);
                            setMoveDeleteModal(false);
                            setMoveTurnsConfirmModal(false);
                        }}
                    >
                        لغو
                    </Button>
                </div>
            </Modal>
            <Modal
                title="تایید جابجایی"
                isOpen={moveTurnsErrorConfirmModal}
                onClose={setMoveTurnsErrorConfirmModal}
            >
                {moveTurnsDetailsConfirmData?.result?.books_count > 0 && (
                    <div className={styles['moveTurn-row-details']}>
                        در این بازه {moveTurnsDetailsConfirmData?.result?.books_count} نوبت وجود
                        دارد.
                    </div>
                )}
                {moveTurnsDetailsConfirmData?.result?.target_vacations_count > 0 && (
                    <div className={styles['moveTurn-row-details']}>
                        در زمان انتخابی مرخصی ثبت شده است.
                    </div>
                )}
                {moveTurnsDetailsConfirmData?.result?.target_workhour_exists === false && (
                    <div className={styles['moveTurn-row-details']}>مغایرت با ساعت کاری.</div>
                )}

                <span>با این حال، مایل به جابجایی نوبت ها هستید؟</span>

                <div className={styles['confirm-row']}>
                    <Button
                        block
                        loading={moveTurns.isLoading}
                        onClick={() => groupMoveAction(true)}
                    >
                        تایید و جابجایی
                    </Button>
                    <Button
                        block
                        variant="secondary"
                        onClick={() => {
                            setMoveTurnsErrorConfirmModal(false);
                            setMoveDeleteModal(false);
                            setMoveTurnsConfirmModal(false);
                        }}
                    >
                        لغو
                    </Button>
                </div>
            </Modal>
        </>
    );
};

export { StatusBar };
